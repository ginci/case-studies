import { go } from "./fx.mjs"
async function index(root) { const m = new Map(); const w = async n => { m.set(n.id, n); for (const k of (await n.getChildren?.() ?? [])) await w(k) }; await w(root); return m }
await go(async f => {
  const m = await index(await f.getNode("d0D1RTQxD"))
  for (const id of ["Zh_8hF2RN", "Vq3QnNVJ9Zh_8hF2RN"]) { const c = m.get(id); console.log(id, c.width, c.height)
    for (const k of await c.getChildren()) console.log("  ", k.__class, k.id, k.name, k.visible, k.width, k.height, k.position) }
  const insts = (await f.getNodesWithType("ComponentInstanceNode")).filter(i => i.componentIdentifier?.includes("X3hLhp1HVYTj") || i.name === "Logo mark")
  for (const i of insts) console.log("inst", i.id, i.name, (await i.getParent())?.id)
})
