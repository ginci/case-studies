import { go } from "./fx.mjs"
async function index(root) { const m = new Map(); const w = async n => { m.set(n.id, n); for (const k of (await n.getChildren?.() ?? [])) await w(k) }; await w(root); return m }
await go(async f => {
  const logo = await f.getNode("d0D1RTQxD"); const m = await index(logo)
  for (const id of ["Zh_8hF2RN","sdupZ7n76"]) { try { console.log(id, (await f.getNode(id))?.id, (await f.getParent?.(id))?.id) } catch(e){console.log(id,"err",e.message)} }
  const mark = await f.getNode("A898H4rvE")
  try { const i = await f.addComponentInstance({ url: mark.insertURL, parentId: "sdupZ7n76" }); console.log("into variant ok", i.id) } catch(e) { console.log("variant fail", e.message) }
  try { const i = await f.addComponentInstance({ url: mark.insertURL }); console.log("canvas ok", i.id); await f.setParent(i.id, "Zh_8hF2RN"); console.log("moved") } catch(e) { console.log("canvas/move fail", e.message) }
})
