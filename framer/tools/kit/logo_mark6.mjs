// Step 6: in the nav "Logo" component, hide the old vector and drop in a "Logo mark" instance (New variant = primary).
import { go } from "./fx.mjs"
async function index(root) { const m = new Map(); const w = async n => { m.set(n.id, n); for (const k of (await n.getChildren?.() ?? [])) await w(k) }; await w(root); return m }
await go(async f => { try {
  await f.navigateTo("d0D1RTQxD").catch(e=>console.log("nav",e.message))
  const mark = await f.getNode("A898H4rvE")
  const logo = await f.getNode("d0D1RTQxD")
  let m = await index(logo)
  const container = m.get("Zh_8hF2RN")
  let inst = (await container.getChildren()).find(k => k.__class === "ComponentInstanceNode")
  if (!inst) inst = await f.addComponentInstance({ url: mark.insertURL, parentId: container.id })
  console.log("inst", inst.id)
  await inst.setAttributes({ name: "Logo mark", width: "fit-content", height: "fit-content", position: "relative" })
  for (const id of ["NIdziMpRg", "Vq3QnNVJ9NIdziMpRg"]) await m.get(id).setAttributes({ visible: false })
  m = await index(logo)
  for (const id of ["Zh_8hF2RN", "Vq3QnNVJ9Zh_8hF2RN"]) {
    const c = m.get(id); console.log(id, c.width, c.height, c.layout)
    for (const k of await c.getChildren()) console.log("  ", k.__class, k.id, k.name, k.visible, k.width, k.height, k.position)
  }
} catch (e) { console.error("ERR", e) } })
