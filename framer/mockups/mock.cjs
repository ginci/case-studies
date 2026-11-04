// Renders portfolio mockups from Figma exports. node mock.cjs → out/*.png
const fs = require("fs"), path = require("path"), { chromium } = require("playwright")
const img = f => "data:image/png;base64," + fs.readFileSync(path.join(__dirname, f)).toString("base64")
const css = `
*{box-sizing:border-box;margin:0}
body{background:#0a0f0c}
.stage{position:relative;overflow:hidden;
  background:
    radial-gradient(60% 70% at 18% 8%, rgba(111,208,140,.32) 0%, rgba(111,208,140,0) 60%),
    radial-gradient(70% 80% at 95% 100%, rgba(1,132,58,.35) 0%, rgba(1,132,58,0) 60%),
    linear-gradient(160deg,#10301f 0%,#0b1a12 55%,#080d0a 100%);}
.stage:before{content:"";position:absolute;inset:0;opacity:.5;
  background-image:radial-gradient(rgba(255,255,255,.07) 1px,transparent 1.2px);background-size:22px 22px;
  mask-image:radial-gradient(80% 80% at 50% 40%,#000 30%,transparent 80%)}
.win{position:absolute;border-radius:14px;overflow:hidden;background:#fff;
  box-shadow:0 50px 100px -20px rgba(0,0,0,.6),0 30px 60px -30px rgba(0,0,0,.5),0 0 0 1px rgba(255,255,255,.08)}
.bar{height:34px;background:#F3F4F2;border-bottom:1px solid rgba(17,19,18,.08);display:flex;align-items:center;padding:0 14px;gap:7px}
.dot{width:10px;height:10px;border-radius:50%;background:#D9DBD8}
.url{margin:0 auto;height:20px;min-width:38%;border-radius:6px;background:#fff;border:1px solid rgba(17,19,18,.08);
  font:500 10.5px/20px -apple-system,"Segoe UI",Helvetica,Arial,sans-serif;color:#5C6360;text-align:center;padding:0 12px}
.url b{color:#046A38;font-weight:600}
.scr{display:block;width:100%}
.phone{position:absolute;border-radius:46px;background:#0b0c0c;padding:9px;
  box-shadow:0 50px 90px -20px rgba(0,0,0,.65),0 0 0 1px rgba(255,255,255,.10),inset 0 0 0 1.5px #2b2d2c}
.phone .in{position:relative;border-radius:38px;overflow:hidden;background:#fff;height:100%}
.phone .in img{display:block;width:100%}
.phone .in{padding-top:var(--pt,0px)}
.phone .island{position:absolute;top:9px;left:50%;transform:translateX(-50%);width:31%;height:24px;border-radius:14px;background:#0b0c0c;z-index:2}
`
const win = ({ x, y, w, h, src, url, crop = 0, zoom = 1, left = 0 }) => `
<div class="win" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px">
  <div class="bar"><i class="dot"></i><i class="dot"></i><i class="dot"></i><div class="url">${url}</div><span style="width:44px"></span></div>
  <div style="height:${h - 34}px;overflow:hidden"><img class="scr" src="${src}" style="margin-top:-${crop}px;width:${zoom * 100}%;max-width:none;margin-left:-${left}px"></div>
</div>`
const phone = ({ x, y, w, src, crop = 0, island = true, pt = 0 }) => {
  const h = Math.round(w * 844 / 390)
  return `<div class="phone" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"><div class="in" style="--pt:${pt}px">${island ? `<span class="island" style="height:${Math.round(w * 0.082)}px;top:${Math.round(w * 0.035)}px;width:${Math.round(w * 0.29)}px"></span>` : ""}
    <img src="${src}" style="margin-top:-${crop}px"></div></div>`
}
const card = ({ x, y, h, src }) => `<img src="${src}" style="position:absolute;left:${x}px;top:${y}px;height:${h}px;border-radius:18px;box-shadow:0 50px 100px -20px rgba(0,0,0,.6),0 0 0 1px rgba(255,255,255,.08)">`
const PW = img("pg-modal@1x.png"), PT = img("pg-tip-crop@1x.png"), PX = img("pg-transfer-crop@1x.png")
const T = img("treasury-fixed@1x.png"), M = img("merchant@1x.png"), K = img("kychub@1x.png"), MR = img("m-review@1x.png"), MI = img("m-info@1x.png")
const scenes = {
  cover: { w: 1120, h: 760, dpr: 2, html:
    win({ x: 64, y: 70, w: 860, h: 640, src: T, url: "app.tranzakt.finance/<b>overview</b>" }) +
    phone({ x: 826, y: 168, w: 248, src: MR }) },
  treasury: { w: 880, h: 460, dpr: 2, html:
    win({ x: 70, y: 46, w: 740, h: 460, src: T, url: "app.tranzakt.finance/<b>overview</b>" }) },
  kyc: { w: 880, h: 460, dpr: 2, html:
    win({ x: 48, y: 46, w: 610, h: 440, src: K, url: "merchant.tranzakt.finance/<b>activate</b>" }) +
    phone({ x: 646, y: 52, w: 188, src: MI }) },
  merchant: { w: 880, h: 460, dpr: 2, html:
    win({ x: 70, y: 46, w: 740, h: 460, src: M, url: "merchant.tranzakt.finance/<b>dashboard</b>" }) },
  checkout: { w: 880, h: 460, dpr: 2, html:
    card({ x: 64, y: 40, h: 380, src: PW }) +
    phone({ x: 470, y: 58, w: 170, src: PT, pt: 30 }) +
    phone({ x: 664, y: 34, w: 170, src: PX, pt: 30 }) },
  preview: { w: 380, h: 285, dpr: 3, html:
    win({ x: 30, y: 30, w: 420, h: 300, src: T, url: "app.tranzakt.finance/<b>overview</b>", zoom: 1.45, crop: 44, left: 96 }) },
}
;(async () => {
  fs.mkdirSync(path.join(__dirname, "out"), { recursive: true })
  const b = await chromium.launch()
  for (const [name, s] of Object.entries(scenes)) {
    const p = await b.newPage({ viewport: { width: s.w, height: s.h }, deviceScaleFactor: s.dpr })
    await p.setContent(`<!doctype html><style>${css}</style><div class="stage" style="width:${s.w}px;height:${s.h}px">${s.html}</div>`)
    await p.waitForTimeout(300)
    await p.locator(".stage").screenshot({ path: path.join(__dirname, "out", `tranzakt-${name}.png`) })
    console.log(name, s.w * s.dpr + "x" + s.h * s.dpr)
  }
  await b.close()
})()
