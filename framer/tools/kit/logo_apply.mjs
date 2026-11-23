// Put the reworked logo in the nav: the Logo component's "Container" (renamed "Logo art") shows the new SVG at +4%,
// and the old vector inside it is hidden (kept). The "Logo mark" component (A898H4rvE) holds both versions side by side.
import { go } from "./fx.mjs"
async function index(root) { const m = new Map(); const w = async n => { m.set(n.id, n); for (const k of (await n.getChildren?.() ?? [])) await w(k) }; await w(root); return m }
await go(async f => { try {
  const mark = await f.getNode("A898H4rvE")
  const kids = await mark.getChildren()
  const asset = kids.find(k => k.name === "New").backgroundImage
  await f.getNode("zjr2jfo8G").then(o => o.setAttributes({ left: "100px", top: "0px" }))
  const m = await index(await f.getNode("d0D1RTQxD"))
  const sizes = { "Zh_8hF2RN": ["60.32px", "30.16px"], "Vq3QnNVJ9Zh_8hF2RN": ["84.5px", "42.25px"] }
  for (const [id, [w, h]] of Object.entries(sizes)) await m.get(id).setAttributes({ name: "Logo art", backgroundImage: asset, width: w, height: h })
  for (const id of ["NIdziMpRg", "Vq3QnNVJ9NIdziMpRg"]) await m.get(id).setAttributes({ visible: false, name: "Old vector (kept)" })
  const m2 = await index(await f.getNode("d0D1RTQxD"))
  for (const id of Object.keys(sizes)) { const c = m2.get(id); console.log(id, c.name, c.width, c.height, c.backgroundImage?.url) }
  for (const id of ["NIdziMpRg", "Vq3QnNVJ9NIdziMpRg"]) console.log(id, m2.get(id).visible, m2.get(id).name)
} catch (e) { console.error("ERR", e) } })
