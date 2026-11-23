// Step 2: put the new artwork into the primary variant ("New").
import { go } from "./fx.mjs"
import fs from "node:fs"
const svg = fs.readFileSync(process.argv[2], "utf8")
await go(async f => {
  const v = await f.getNode("rwLDqtBGo")
  console.log("bg", JSON.stringify(v.backgroundColor), v.layout)
  await v.setAttributes({ name: "New", width: "60.32px", height: "30.16px", backgroundColor: null })
  await f.setSelection([v.id])
  await f.addSVG({ svg, name: "Logo / new" })
  const svgs = (await f.getNodesWithType("SVGNode")).filter(n => n.name === "Logo / new")
  for (const s of svgs) { const p = await s.getParent(); console.log("svg", s.id, "parent", p?.id, p?.name, s.width, s.height, s.position) }
})
