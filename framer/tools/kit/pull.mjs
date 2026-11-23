// Download the live code files so local edits start from what's in Framer.
import fs from "node:fs"; import { go } from "./fx.mjs"
await go(async f => { for (const [id, file] of [["n7KaFrj", "/tmp/claude-0/ThemeToggle.framer.tsx"], ["Gj3I0QJ", "/tmp/claude-0/Folders.framer.tsx"]]) { const c = await f.getCodeFile(id); fs.writeFileSync(file, c.content); console.log(c.name, c.content.length) } })
