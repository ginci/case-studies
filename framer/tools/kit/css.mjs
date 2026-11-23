import fs from "node:fs"; import { transformSync } from "esbuild"
export function siteCSS(file) {
  const src = fs.readFileSync(file, "utf8")
  const start = src.indexOf("const KEY")
  const end = src.indexOf("function ensureStyle")
  const code = src.slice(start, end).replace(/^import .*$/mg, "")
  const js = transformSync(code + "\n;globalThis.__CSS = CSS", { loader: "tsx" }).code
  new Function(js)(); return globalThis.__CSS
}
if (import.meta.url === `file://${process.argv[1]}`) { const c = siteCSS(process.argv[2]); console.log(c.length); }
