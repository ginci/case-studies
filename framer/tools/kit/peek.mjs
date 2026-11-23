import { go } from "./fx.mjs"
await go(async f => {
  for (const id of process.argv.slice(2)) {
    const n = await f.getNode(id); console.log(n?.__class, n?.id, n?.name, n?.width, n?.height)
    for (const k of (await n.getChildren())) console.log("  ", k.__class, k.id, k.name, k.width, k.height, k.position, k.left, k.top, k.visible)
  }
  const s = await f.getNodesWithType("SVGNode"); console.log("svgnodes", s.map(x=>x.id+":"+x.name).slice(-5))
  const sc = await f.getNodesWithType("ShapeContainerNode"); console.log("shapecontainers", sc.length, sc.map(x=>x.id+":"+x.name).slice(-4))
})
