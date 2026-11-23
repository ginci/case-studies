// Step 5: "Original" variant shows the existing artwork (exported from the live site) as an SVG image fill.
import { go } from "./fx.mjs"
import fs from "node:fs"
const svg = fs.readFileSync(process.argv[2])
await go(async f => { try {
  const asset = await f.uploadImage({ image: { bytes: new Uint8Array(svg), mimeType: "image/svg+xml" }, name: "ginci-logo-original.svg", altText: "ginci designs" })
  const v = await f.getNode("zjr2jfo8G")
  await v.setAttributes({ backgroundImage: asset, backgroundColor: null })
  console.log("ok", asset.url)
} catch (e) { console.error("ERR", e) } })
