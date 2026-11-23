// Step 4: add the "Original" variant holding a copy of the existing vector logo.
import { go } from "./fx.mjs"
await go(async f => {
  const comp = await f.getNode("A898H4rvE")
  const kids = await comp.getChildren()
  let orig = kids.find(k => k.name === "Original")
  if (!orig) orig = await comp.addVariant("rwLDqtBGo", { name: "Original" })
  await orig.setAttributes({ name: "Original", backgroundImage: null, backgroundColor: null, width: "58px", height: "29px", left: "100px", top: "0px" })
  const src = await f.getNode("NIdziMpRg")
  const copy = await src.clone()
  console.log("clone", copy?.__class, copy?.id)
  await f.setParent(copy.id, orig.id)
  const c2 = await f.getNode(copy.id)
  console.log("pos", c2.position, c2.left, c2.top, c2.width, c2.height)
  for (const k of (await comp.getChildren())) console.log(k.id, k.name, k.width, k.height, k.left, k.top)
  console.log("insertURL", (await f.getNode("A898H4rvE")).insertURL)
})
