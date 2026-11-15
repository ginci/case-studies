// Puts the site stylesheet + theme bootstrap into the page <head> so pages arrive styled (no flash while scripts load).
// Run after uploading ThemeToggle.tsx. Source of truth stays ThemeToggle.tsx (its CSS constant).
import fs from "node:fs"
import { execSync } from "node:child_process"
import { createRequire } from "node:module"
import { go } from "./safe.mjs"
const S = "/tmp/claude-0/-home-user-case-studies/bc382d11-d2a0-59a5-ab7c-63d0c8ecdde2/scratchpad"
fs.copyFileSync(`${S}/seed/code/ThemeToggle.new.tsx`, `${S}/hw/cssx_tt.tsx`)
fs.appendFileSync(`${S}/hw/cssx_tt.tsx`, "\nexport const __SITE_CSS = CSS\n")
execSync(`npx esbuild cssx_tt.tsx --bundle --platform=node --format=cjs --outfile=../cssx/tt.cjs --jsx=automatic --alias:framer=./t/framer.ts --log-level=error`, { cwd: `${S}/hw` })
const css = createRequire(import.meta.url)(`${S}/cssx/tt.cjs`).__SITE_CSS
if (!css || css.length < 1000 || css.includes("</style>")) throw new Error("bad css")
const boot = `(function(){var d=document.documentElement;try{if(localStorage.getItem("ginci-theme")==="light")d.dataset.ginciTheme="light"}catch(e){}var m=document.querySelector('meta[name="theme-color"]')||document.head.appendChild(document.createElement("meta"));m.name="theme-color";m.content=d.dataset.ginciTheme==="light"?"#EDEDEE":"#121211"})();`
const html = `<script>${boot}</script>\n<style id="ginci-site-css">${css}</style>`
fs.writeFileSync(`${S}/cssx/head.html`, html)
await go(async f => { await f.setCustomCode({ html, location: "headEnd" }); const c = await f.getCustomCode(); console.log("head code set:", (c.headEnd.html || "").length, "chars; css", css.length) })
