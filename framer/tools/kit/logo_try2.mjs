import { go } from "./fx.mjs"
async function index(root) { const m = new Map(); const w = async n => { m.set(n.id, n); for (const k of (await n.getChildren?.() ?? [])) await w(k) }; await w(root); return m }
await go(async f => {
  try { await f.removeNodes(["NYd8fr5tc"]); console.log("removed stray") } catch (e) { console.log("rm fail", e.message) }
  const m = await index(await f.getNode("d0D1RTQxD"))
  try { const r = await m.get("Zh_8hF2RN").setAttributes({ name: "Container" }); console.log("setAttr ok", r?.id) } catch (e) { console.log("setAttr fail", e.message) }
  const mark = await f.getNode("A898H4rvE")
  // try creating the instance as a child of the variant via a frame-node parent that IS addressable
  const v = m.get("sdupZ7n76"); console.log(Object.keys(v), typeof v.addChild)
})
