import { go } from "./fx.mjs"
await go(async f => {
  const n = await f.getNode("d0D1RTQxD")
  console.log(n?.__class, n?.name)
  const walk = async (node, d=0) => {
    const kids = await node.getChildren?.() ?? []
    for (const k of kids) {
      const keys = ["name","width","height","left","top","position","aspectRatio","rotation","visible"]
      console.log("  ".repeat(d)+k.__class+" "+k.id+" "+JSON.stringify(Object.fromEntries(keys.map(x=>[x,k[x]]).filter(([,v])=>v!==undefined))))
      if (k.__class?.includes("SVG")) console.log((k.svg||"").slice(0,4000))
      await walk(k, d+1)
    }
  }
  await walk(n)
})
