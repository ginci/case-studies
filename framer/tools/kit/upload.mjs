// Upload ThemeToggle.tsx + Folders.tsx to Framer, refresh the head-code copy of the site CSS, and optionally publish.
// Run from this folder with FRAMER_API_KEY set (cloud env my-project-env):  node upload.mjs [publish]
// Note: publish() goes straight to the live domain (gincidesign.framer.website) as well as the framer.app hosts.
import fs from "node:fs"; import { go } from "./fx.mjs"; import { siteCSS } from "./css.mjs"
const css = siteCSS("../../ThemeToggle.tsx")
if (!css || css.length < 1000 || css.includes("</style>")) throw new Error("bad css")
await go(async f => {
  for (const [id, file] of [["n7KaFrj", "../../ThemeToggle.tsx"], ["Gj3I0QJ", "../../Folders.tsx"]]) {
    const c = await f.getCodeFile(id); await c.setFileContent(fs.readFileSync(file, "utf8")); console.log("uploaded", c.name)
  }
  const head = (await f.getCustomCode()).headEnd.html || ""
  const html = head.replace(/<style id="ginci-site-css">[\s\S]*<\/style>/, () => `<style id="ginci-site-css">${css}</style>`)
  await f.setCustomCode({ html, location: "headEnd" }); console.log("head css", css.length)
  if (process.argv[2] === "publish") { const r = await f.publish(); console.log("published", r.deployment.id, r.hostnames.map(h => h.hostname).join(" ")) }
})
