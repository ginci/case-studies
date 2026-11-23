// Step 3: "New" variant shows the reworked artwork as an SVG image fill; "Original" holds a clone of the existing vector.
import { go } from "./fx.mjs"
import fs from "node:fs"
const svg = fs.readFileSync(process.argv[2])
await go(async f => {
  const asset = await f.uploadImage({ image: { bytes: new Uint8Array(svg), mimeType: "image/svg+xml" }, name: "ginci-logo-new.svg", altText: "ginci designs" })
  console.log("asset", asset.id, asset.url)
  const v = await f.getNode("rwLDqtBGo")
  await v.setAttributes({ backgroundImage: asset, backgroundColor: null })
  const v2 = await f.getNode("rwLDqtBGo"); console.log("bgimg", JSON.stringify(v2.backgroundImage)?.slice(0,200))
})
