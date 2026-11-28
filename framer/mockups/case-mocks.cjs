// Case study mockups (9mobile, NSIA) in the Tranzakt style: browser windows on a branded backdrop, 2x.
// Exports come from Figma at 2x (Figma connector download_assets, defaultScale 2), cropped to the top.
// SRC=<folder with *-top.png> node case-mocks.cjs  → out/<name>.png
const fs = require("fs"), path = require("path"), { chromium } = require("playwright")
const SRC = process.env.SRC || path.join(__dirname, "src")
const img = f => "data:image/png;base64," + fs.readFileSync(path.join(SRC, f)).toString("base64")
const stage = ({ a, b, base }) => `
*{box-sizing:border-box;margin:0}
.stage{position:relative;overflow:hidden;
  background:
    radial-gradient(60% 70% at 18% 8%, ${a} 0%, transparent 60%),
    radial-gradient(70% 80% at 95% 100%, ${b} 0%, transparent 60%),
    linear-gradient(160deg, ${base[0]} 0%, ${base[1]} 55%, ${base[2]} 100%);}
.stage:before{content:"";position:absolute;inset:0;opacity:.5;
  background-image:radial-gradient(rgba(255,255,255,.07) 1px,transparent 1.2px);background-size:22px 22px;
  mask-image:radial-gradient(80% 80% at 50% 40%,#000 30%,transparent 80%)}
.win{position:absolute;border-radius:14px;overflow:hidden;background:#fff;
  box-shadow:0 50px 100px -20px rgba(0,0,0,.6),0 30px 60px -30px rgba(0,0,0,.5),0 0 0 1px rgba(255,255,255,.08)}
.bar{height:34px;background:#F3F4F2;border-bottom:1px solid rgba(17,19,18,.08);display:flex;align-items:center;padding:0 14px;gap:7px}
.dot{width:10px;height:10px;border-radius:50%;background:#D9DBD8}
.url{margin:0 auto;height:20px;min-width:38%;border-radius:6px;background:#fff;border:1px solid rgba(17,19,18,.08);
  font:500 10.5px/20px -apple-system,"Segoe UI",Helvetica,Arial,sans-serif;color:#5C6360;text-align:center;padding:0 12px}
.url b{color:${b.replace(/[\d.]+\)$/, "1)")};font-weight:600}
.scr{display:block;width:100%}`
const win = ({ x, y, w, h, src, url }) => `
<div class="win" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px">
  <div class="bar"><i class="dot"></i><i class="dot"></i><i class="dot"></i><div class="url">${url}</div><span style="width:44px"></span></div>
  <div style="height:${h - 34}px;overflow:hidden"><img class="scr" src="${src}"></div></div>`

const NINE = { a: "rgba(176,210,52,.30)", b: "rgba(0,110,80,.45)", base: ["#0f2a1c", "#0a1811", "#070c09"] }
const NSIA = { a: "rgba(95,190,120,.30)", b: "rgba(30,130,70,.40)", base: ["#123020", "#0b1a12", "#080d0a"] }
const H = img("nine__home-top.png"), E = img("nine__eshop-top.png"), C = img("nine__cms-top.png")
const D = img("nsia__cover-top.png"), P = img("nsia__prod-top.png")
const scenes = {
  "9mobile-cover": { t: NINE, w: 1120, h: 760, html:
    win({ x: 470, y: 60, w: 600, h: 420, src: C, url: "9mobile <b>CMS</b>" }) +
    win({ x: 56, y: 150, w: 760, h: 560, src: H, url: "9mobile <b>website</b>" }) },
  "9mobile-web": { t: NINE, w: 880, h: 460, html: win({ x: 70, y: 46, w: 740, h: 460, src: H, url: "9mobile <b>website</b>" }) },
  "9mobile-eshop": { t: NINE, w: 880, h: 460, html: win({ x: 70, y: 46, w: 740, h: 460, src: E, url: "9mobile <b>eShop</b>" }) },
  "9mobile-cms": { t: NINE, w: 880, h: 460, html: win({ x: 70, y: 46, w: 740, h: 460, src: C, url: "9mobile <b>CMS</b>" }) },
  "nsia-cover": { t: NSIA, w: 1120, h: 760, html:
    win({ x: 470, y: 60, w: 600, h: 430, src: P, url: "NSIA · <b>Daily production</b>" }) +
    win({ x: 56, y: 150, w: 760, h: 560, src: D, url: "NSIA · <b>Dashboard</b>" }) },
  "nsia-prod": { t: NSIA, w: 880, h: 460, html: win({ x: 70, y: 46, w: 740, h: 460, src: P, url: "NSIA · <b>Daily production</b>" }) },
}
;(async () => {
  fs.mkdirSync(path.join(__dirname, "out"), { recursive: true })
  const b = await chromium.launch()
  for (const [name, s] of Object.entries(scenes)) {
    const p = await b.newPage({ viewport: { width: s.w, height: s.h }, deviceScaleFactor: 2 })
    await p.setContent(`<!doctype html><style>${stage(s.t)}</style><div class="stage" style="width:${s.w}px;height:${s.h}px">${s.html}</div>`)
    await p.waitForTimeout(400)
    await p.locator(".stage").screenshot({ path: path.join(__dirname, "out", `${name}.png`) })
    console.log(name, s.w * 2 + "x" + s.h * 2)
  }
  await b.close()
})()
