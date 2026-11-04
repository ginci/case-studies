// Seed the "Projects" CMS collection in "Ginci Portfolio — Iteration 3". Never publishes.
// Usage:
//   node seed.mjs check  → read-only: connect, print project name + collections (run this first)
//   node seed.mjs dump   → read-only: every text node → texts.json, /dado text → dado-texts.json
//   node seed.mjs seed   → create collection + fields + items (refuses if "Projects" exists)
//   node seed.mjs sync   → update "Projects" in place from content.mjs: adds missing fields and items,
//                          rewrites text fields, labels, Next links and order. Leaves images alone.
// Key: FRAMER_API_KEY environment variable, set in the cloud environment settings.
// framer-api talks to Framer over a WebSocket, and the agent proxy can't add a saved network
// secret to a WebSocket handshake (2026-11-04), so the key has to come from the environment variable.
import { connect } from "framer-api"
import fs from "node:fs"
import { PROJECTS, SECTION_NAMES, sectionLabels } from "./content.mjs"

const URL = "https://framer.com/projects/Ginci-Portfolio-Iteration-3--vQYX53a0u7he9Kdenr94-7S9HO"
const mode = process.argv[2] ?? "check"
if (!["check", "dump", "seed", "sync"].includes(mode)) { console.error(`Unknown mode "${mode}". Use check, dump, seed or sync.`); process.exit(1) }

const key = process.env.FRAMER_API_KEY
if (!key) {
  console.error("FRAMER_API_KEY is not set in this session.\n" +
    "Add it as an environment variable in the cloud environment settings, then start a new session.")
  process.exit(1)
}

let framer
try {
  framer = await connect(URL, key)
} catch (e) {
  console.error(`Connect failed: ${e.code ?? ""} ${e.message}`)
  if (e.code === "UNAUTHORIZED")
    console.error("The key reached Framer but isn't valid for Iteration 3. Generate one inside\n" +
      "Iteration 3 (Site Settings → General), update FRAMER_API_KEY, start a new session.")
  process.exit(1)
}

try {
  if (mode === "check" || mode === "dump") {
    console.log("project:", JSON.stringify(await framer.getProjectInfo()))
    for (const c of await framer.getCollections()) console.log("collection:", c.name, c.id)
  }

  if (mode === "dump") {
    const texts = await framer.getNodesWithType("TextNode")
    const out = []
    for (const t of texts) {
      let text = null
      try { text = await t.getText() } catch (e) { text = "ERR " + e.message }
      let ancestors = []
      try { let n = await t.getParent(); while (n) { ancestors.unshift(n.name ?? n.id); n = await n.getParent() } } catch {}
      out.push({ id: t.id, name: t.name, path: ancestors.join(" › "), text })
    }
    fs.writeFileSync("texts.json", JSON.stringify(out, null, 1))
    console.log("text nodes:", out.length, "→ texts.json")
    const dado = out.filter(t => /dado/i.test(t.path))
    fs.writeFileSync("dado-texts.json", JSON.stringify(dado, null, 1))
    console.log("/dado text nodes:", dado.length, "→ dado-texts.json")
  }

  const str = name => ({ type: "string", name })
  const rich = name => ({ type: "formattedText", name })
  const nn = i => String(i + 1).padStart(2, "0")
  const fieldDefs = () => [
    str("Title"), { type: "number", name: "Order" }, str("Index line"), { type: "color", name: "Accent" },
    str("Case study label"), str("Read time"), str("Kicker"), str("Lede"), str("Result"),
    str("Client"), str("Role"), str("Timeline"), str("Team"), str("Platforms"), rich("Stats"),
    { type: "image", name: "Cover" }, { type: "image", name: "Preview" },
    ...SECTION_NAMES.flatMap((_, i) => [str(`S${nn(i)} label`), str(`S${nn(i)} title`), rich(`S${nn(i)} body`)]),
    ...[5, 6, 7, 8].map(i => ({ type: "image", name: `S${nn(i)} image` })),
    ...[1, 2, 3, 4].flatMap(i => [str(`Step ${i} label`), str(`Step ${i} title`), str(`Step ${i} line`)]),
  ]
  const v = (type, value) => ({ type, value })
  const itemData = (pr, id) => {
    const fd = {}
    for (const k of ["Title", "Index line", "Case study label", "Read time", "Kicker", "Lede", "Result", "Client", "Role", "Timeline", "Team", "Platforms"])
      fd[id[k]] = v("string", pr[k])
    fd[id.Order] = v("number", pr.Order)
    fd[id.Accent] = v("color", pr.Accent)
    fd[id.Stats] = v("formattedText", pr.Stats)
    const labels = sectionLabels(pr)
    pr.sections.forEach(([t, b], i) => {
      fd[id[`S${nn(i)} label`]] = v("string", labels[i])
      fd[id[`S${nn(i)} title`]] = v("string", t)
      fd[id[`S${nn(i)} body`]] = v("formattedText", b)
    })
    pr.process.forEach(([l, t, line], i) => {
      fd[id[`Step ${i + 1} label`]] = v("string", l)
      fd[id[`Step ${i + 1} title`]] = v("string", t)
      fd[id[`Step ${i + 1} line`]] = v("string", line)
    })
    return fd
  }
  const linkAndOrder = async (col, id) => {
    const items = await col.getItems()
    const bySlug = Object.fromEntries(items.map(it => [it.slug, it]))
    for (const pr of PROJECTS)
      await bySlug[pr.slug].setAttributes({ fieldData: { [id["Next project"]]: v("collectionReference", bySlug[pr.next].id) } })
    const ordered = [...PROJECTS].sort((a, b) => a.Order - b.Order)
    await col.setItemOrder(ordered.map(pr => bySlug[pr.slug].id))
    console.log("items:", ordered.map(p => p.slug).join(" → "))
  }

  if (mode === "seed") {
    const existing = (await framer.getCollections()).find(c => c.name === "Projects")
    if (existing) throw new Error(`"Projects" already exists (${existing.id}); use sync`)
    const col = await framer.createCollection("Projects")
    const fields = await col.addFields(fieldDefs())
    const [next] = await col.addFields([{ type: "collectionReference", name: "Next project", collectionId: col.id }])
    const id = Object.fromEntries([...fields, next].map(f => [f.name, f.id]))
    await col.addItems(PROJECTS.map(pr => ({ slug: pr.slug, fieldData: itemData(pr, id) })))
    await linkAndOrder(col, id)
  }

  if (mode === "sync") {
    const col = (await framer.getCollections()).find(c => c.name === "Projects")
    if (!col) throw new Error(`"Projects" doesn't exist yet; run seed`)
    let fields = await col.getFields()
    const have = new Set(fields.map(f => f.name))
    const missing = fieldDefs().filter(d => !have.has(d.name))
    if (missing.length) { await col.addFields(missing); console.log("added fields:", missing.map(d => d.name).join(", ")) }
    fields = await col.getFields()
    const id = Object.fromEntries(fields.map(f => [f.name, f.id]))
    // Keep the field list in the same order as fieldDefs (Next project last).
    const want = [...fieldDefs().map(d => id[d.name]), id["Next project"]].filter(Boolean)
    if (col.setFieldOrder) await col.setFieldOrder(want)
    const items = await col.getItems()
    const bySlug = Object.fromEntries(items.map(it => [it.slug, it]))
    const add = PROJECTS.filter(pr => !bySlug[pr.slug])
    for (const pr of PROJECTS) if (bySlug[pr.slug]) await bySlug[pr.slug].setAttributes({ fieldData: itemData(pr, id) })
    if (add.length) { await col.addItems(add.map(pr => ({ slug: pr.slug, fieldData: itemData(pr, id) }))); console.log("added items:", add.map(p => p.slug).join(", ")) }
    const stray = items.filter(it => !PROJECTS.some(pr => pr.slug === it.slug))
    if (stray.length) console.log("not in content.mjs (left alone):", stray.map(i => i.slug).join(", "))
    await linkAndOrder(col, id)
  }
} finally {
  await framer.disconnect()
}
