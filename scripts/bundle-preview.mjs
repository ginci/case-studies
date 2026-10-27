// Bundles the preview into one self-contained file: preview/index.html
// The Framer components are imported as-is; "framer" is aliased to a tiny shim.
import { build } from "esbuild";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = await build({
  entryPoints: [join(root, "preview/src/main.tsx")],
  bundle: true,
  minify: true,
  write: false,
  format: "iife",
  jsx: "automatic",
  alias: { framer: join(root, "preview/src/framer-shim.ts") },
  define: { "process.env.NODE_ENV": '"production"' },
});
const js = out.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");
const css = readFileSync(join(root, "preview/src/styles.css"), "utf8");

writeFileSync(
  join(root, "preview/index.html"),
  `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Case studies — Ginci Designs</title>
<style>${css}</style>
</head>
<body>
<div id="root"></div>
<script>${js}</script>
</body>
</html>
`
);
console.log("Wrote preview/index.html");
