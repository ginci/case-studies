const fs = require("fs")
;(async () => {
  const hb = await require("harfbuzzjs")
  const buf = fs.readFileSync("font/PlaywriteAR.ttf")
  const face = hb.createFace(hb.createBlob(buf), 0), font = hb.createFont(face), upem = face.upem
  const lines = ["Product designer.", "Builder.", "Vibe coder."]
  const out = []
  for (const text of lines) {
    const b = hb.createBuffer(); b.addText(text); b.guessSegmentProperties(); hb.shape(font, b); const gl = b.json(); b.destroy()
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
