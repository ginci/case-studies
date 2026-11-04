// Status cards for projects without screens: "coming soon" and "locked". node cards.cjs → out/*.png
const fs = require("fs"), path = require("path"), { chromium } = require("playwright")
const FONTS = `<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600&family=Geist+Mono:wght@400;500&display=block" rel="stylesheet">`
const css = (a, b, c) => `
*{box-sizing:border-box;margin:0}
.stage{position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;
  background:radial-gradient(70% 80% at 20% 0%, ${a} 0%, transparent 62%),radial-gradient(70% 80% at 100% 100%, ${b} 0%, transparent 60%),linear-gradient(160deg,${c} 0%,#0c0d0c 70%);
  font-family:Outfit,sans-serif;color:#F4F3EE}
.stage:before{content:"";position:absolute;inset:0;opacity:.55;background-image:radial-gradient(rgba(255,255,255,.07) 1px,transparent 1.2px);background-size:22px 22px;
  mask-image:radial-gradient(75% 75% at 50% 45%,#000 25%,transparent 80%)}
.badge{position:relative;display:grid;place-items:center;border-radius:50%;border:1px solid rgba(244,243,238,.18);background:rgba(244,243,238,.06);
  box-shadow:0 0 0 10px rgba(244,243,238,.03),0 20px 60px rgba(0,0,0,.35)}
.eyebrow{position:relative;font:500 var(--e)/1 "Geist Mono",monospace;letter-spacing:.14em;text-transform:uppercase;color:rgba(244,243,238,.6)}
.title{position:relative;font-weight:500;letter-spacing:-.02em;line-height:1.05}
.sub{position:relative;font-family:"Geist Mono",monospace;color:rgba(244,243,238,.62)}
.pill{position:relative;display:inline-flex;align-items:center;gap:.5em;border-radius:999px;background:#F4F3EE;color:#121211;font-weight:500}
.bars{position:relative;display:flex;flex-direction:column;gap:var(--g);width:var(--w)}
.bars i{display:block;height:var(--h);border-radius:99px;background:rgba(244,243,238,.10);overflow:hidden;position:relative}
.bars i:after{content:"";position:absolute;inset:0;width:var(--p);border-radius:99px;background:var(--acc);opacity:.9}
`
const LOCK = s => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#F4F3EE" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4.5" y="10.5" width="15" height="10" rx="2.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/><circle cx="12" cy="15.5" r="1.3" fill="#F4F3EE"/></svg>`
const CLOCK = s => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#F4F3EE" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>`
const soon = (u, acc, name) => `
  <div class="eyebrow" style="--e:${11 * u}px;margin-bottom:${18 * u}px">${name}</div>
  <div class="badge" style="width:${64 * u}px;height:${64 * u}px;margin-bottom:${20 * u}px">${CLOCK(26 * u)}</div>
  <div class="title" style="font-size:${30 * u}px;margin-bottom:${10 * u}px">Case study coming soon</div>
  <div class="sub" style="font-size:${11 * u}px;margin-bottom:${22 * u}px">Being written up now</div>
  <div class="bars" style="--g:${7 * u}px;--w:${150 * u}px;--h:${5 * u}px;--acc:${acc}"><i style="--p:78%"></i><i style="--p:52%"></i><i style="--p:30%"></i></div>`
const locked = u => `
  <div class="eyebrow" style="--e:${11 * u}px;margin-bottom:${18 * u}px">Under NDA</div>
  <div class="badge" style="width:${64 * u}px;height:${64 * u}px;margin-bottom:${20 * u}px">${LOCK(26 * u)}</div>
  <div class="title" style="font-size:${30 * u}px;margin-bottom:${10 * u}px">Project locked</div>
  <div class="sub" style="font-size:${11 * u}px;margin-bottom:${20 * u}px">Password required to view</div>
  <div class="pill" style="font-size:${12.5 * u}px;padding:${9 * u}px ${16 * u}px">Request access →</div>`
const cards = {
  "mygreenblock-preview": { w: 380, h: 285, dpr: 3, bg: ["rgba(78,138,46,.55)", "rgba(78,138,46,.28)", "#16240f"], html: soon(1, "#7FC458", "MyGreenBlock") },
  "mygreenblock-cover": { w: 1120, h: 760, dpr: 2, bg: ["rgba(78,138,46,.5)", "rgba(78,138,46,.25)", "#16240f"], html: soon(2.1, "#7FC458", "MyGreenBlock") },
  "locked-preview": { w: 380, h: 285, dpr: 3, bg: ["rgba(154,152,144,.35)", "rgba(154,152,144,.18)", "#1b1b19"], html: locked(1) },
  "locked-cover": { w: 1120, h: 760, dpr: 2, bg: ["rgba(154,152,144,.3)", "rgba(154,152,144,.15)", "#1b1b19"], html: locked(2.1) },
}
;(async () => {
  const b = await chromium.launch()
  for (const [name, c] of Object.entries(cards)) {
    const p = await b.newPage({ viewport: { width: c.w, height: c.h }, deviceScaleFactor: c.dpr })
    await p.setContent(`<!doctype html>${FONTS}<style>${css(...c.bg)}</style><div class="stage" style="width:${c.w}px;height:${c.h}px">${c.html}</div>`)
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400)
    await p.locator(".stage").screenshot({ path: path.join(__dirname, "out", name + ".png") })
    console.log(name)
  }
  await b.close()
})()
