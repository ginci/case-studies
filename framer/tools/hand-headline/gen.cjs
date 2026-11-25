const fs = require("fs")
;(async () => {
  const hb = await require("harfbuzzjs")
  const buf = fs.readFileSync("font/PlaywriteAR.ttf")
  const face = hb.createFace(hb.createBlob(buf), 0), font = hb.createFont(face), upem = face.upem
  const lines = ["Product designer.", "Design that ships.", "Idea to prototype."]
  const out = []
  for (const text of lines) {
    const b = hb.createBuffer(); b.addText(text); b.guessSegmentProperties(); hb.shape(font, b); const gl = b.json(); b.destroy()
    // The cursive capitals (A.cur, I.cur) look like a lowercase "a" and "l": for the acronym "AI" use the font's
    // plain print capitals A (gid 5, advance 877) and I (gid 11, advance 394) so it reads as AI.
    const ai = text.indexOf("AI")
    if (ai >= 0) for (const g of gl) { if (g.cl === ai) { g.g = 5; g.ax = 877; g.dx = 0 } else if (g.cl === ai + 1) { g.g = 11; g.ax = 394; g.dx = 0 } }
    let x = 0; const glyphs = []
    for (const g of gl) {
      const d = font.glyphToPath(g.g)
      const ch = text[g.cl]
      if (d && d.length) glyphs.push({ d, x: x + g.dx, y: g.dy, ch, cl: g.cl, adv: g.ax })
      x += g.ax
    }
    out.push({ text, width: x, glyphs })
  }
  const ext = font.hExtents ? font.hExtents() : null
  console.log(JSON.stringify({ upem, ext, widths: out.map(l => [l.text, l.width, l.glyphs.length]), sample: out[0].glyphs[0].d.slice(0, 200) }, null, 1))
  fs.writeFileSync("glyphs.json", JSON.stringify({ upem, lines: out }))
})()
