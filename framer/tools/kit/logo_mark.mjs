// Step 1: create the "Logo mark" component and show what Framer gives us.
import { go } from "./fx.mjs"
await go(async f => {
  const existing = (await f.getNodesWithType("ComponentNode")).filter(c => c.name === "Logo mark")
  console.log("existing Logo mark:", existing.map(c => c.id))
  const comp = existing[0] ?? await f.createComponentNode("Logo mark")
  console.log("comp", comp.id, comp.insertURL)
  const kids = await comp.getChildren()
  for (const k of kids) console.log(" ", k.__class, k.id, k.name, k.width, k.height, k.isVariant)
})
