import { useEffect, useRef, type CSSProperties } from "react"
import { addPropertyControls, ControlType } from "framer"

// Gift's photo, woven into the hero background. At rest it is a faint duotone in the shader's colours, a soft square
// whose edges break up into pixels, so it reads as part of the page's fabric. Hovering the word "Gift" tears that fabric
// into coarse pixels and resolves them into the real photo; moving off "Gift" runs it backwards, so the photo pixelates
// back into the background. Touch screens: plays on its own while on screen (reveal, hold, hide, rest, repeat); a tap
// restarts it; it stops when scrolled away.

const DEFAULT_IMG = "https://framerusercontent.com/images/WdZdO386BLTzVBtQgoYDpSSrZ2s.jpg"
// pixel sizes (css px) the picture passes through on its way from fabric to photo
const LEVELS = [1, 3, 6, 10, 16, 24, 34, 46, 58]

export default function HeroPortrait(props: {
    image?: { src: string; alt?: string } | string
    rest: number
    edge: number
    speed: number
    position: string
    trigger: string
    style?: CSSProperties
}) {
    const { rest = 0.32, edge = 16, speed = 1, position = "50% 30%", trigger = "[data-g-photo]" } = props
    const src = typeof props.image === "string" ? props.image : props.image?.src || DEFAULT_IMG
    const box = useRef<HTMLDivElement | null>(null)
    const cvs = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {
        const el = box.current, canvas = cvs.current
        if (!el || !canvas || typeof window === "undefined") return
        const ctx = canvas.getContext("2d")
        if (!ctx) return
        document.documentElement.setAttribute("data-g-portrait", "")
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches
        const [px, py] = position.split(/\s+/).map((v) => (parseFloat(v) || 50) / 100)
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.decoding = "async"
        img.src = src
        const mk = () => document.createElement("canvas")
        const real = mk(), duo = mk(), mix = mk(), small = mk(), mask = mk(), maskBig = mk()
        let W = 0, H = 0, dpr = 1, cols = 0, rows = 0, ready = false, seed = 1
        let P = 0, from = 0, to = 0, t0 = 0, dur = 1, raf = 0, lastLevel = -1

        const rand = (a: number) => () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
        // Square with a pixel-torn border: full inside, then cells thin out (with some random drop-outs) towards the edge.
        const buildMask = (s: number, tear: number) => {
            const cell = Math.max(6, edge * (W < 500 ? 0.75 : 1))
            cols = Math.ceil(W / cell); rows = Math.ceil(H / cell)
            mask.width = cols; mask.height = rows
            const m = mask.getContext("2d")!
            const id = m.createImageData(cols, rows)
            const r = rand(s)
            const band = Math.max(2.5, Math.min(cols, rows) * 0.2)
            for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
                const d = Math.min(x + 0.5, cols - x - 0.5, (y + 0.5) * 1.15, (rows - y - 0.5) * 0.8) / band
                let a = Math.min(1, d) ** 1.4
                if (a < 1) a = a + (r() - 0.5) * (0.55 + tear)
                a = a < 0.12 ? 0 : Math.min(1, Math.round(a * 4) / 4)
                id.data[(y * cols + x) * 4 + 3] = Math.round(a * 255)
            }
            m.putImageData(id, 0, 0)
            maskBig.width = canvas.width; maskBig.height = canvas.height
            const mb = maskBig.getContext("2d")!
            mb.imageSmoothingEnabled = false
            mb.drawImage(mask, 0, 0, cols, rows, 0, 0, cols * cell * dpr, rows * cell * dpr)
        }
        const layout = () => {
            const b = el.getBoundingClientRect()
            dpr = Math.min(2, window.devicePixelRatio || 1)
            W = Math.max(1, Math.round(b.width)); H = Math.max(1, Math.round(b.height))
            const cw = Math.round(W * dpr), ch = Math.round(H * dpr)
            for (const c of [canvas, real, duo, mix]) { c.width = cw; c.height = ch }
            buildMask(seed, 0)
            if (!ready || !img.naturalWidth) return draw()
            const s = Math.max(W / img.naturalWidth, H / img.naturalHeight)
            const sw = W / s, sh = H / s
            const rc = real.getContext("2d")!
            rc.drawImage(img, (img.naturalWidth - sw) * px, (img.naturalHeight - sh) * py, sw, sh, 0, 0, cw, ch)
            // the real photo, kept in the page's light: a touch darker, a faint teal-to-blue wash, darker at the bottom
            const dc = duo.getContext("2d")!
            try {
                const src = rc.getImageData(0, 0, cw, ch), out = dc.createImageData(cw, ch)
                const a = src.data, o = out.data
                for (let y = 0; y < ch; y++) {
                    const fy = y / ch, shade = fy < 0.35 ? 1 : 1 - 0.85 * ((fy - 0.35) / 0.65)
                    for (let x = 0; x < cw; x++) {
                        const i = (y * cw + x) * 4
                        let l = (0.299 * a[i] + 0.587 * a[i + 1] + 0.114 * a[i + 2]) / 255
                        l = Math.max(0, Math.min(1, (l - 0.5) * 1.15 + 0.5)) * 0.85
                        // shader colours: teal near the upper right, deep blue further out
                        const t = Math.min(1, Math.hypot(x / cw - 0.7, fy - 0.3) / 0.75)
                        const hr = 0 * (1 - t) + 0 * t, hg = 191 * (1 - t) + 39 * t, hb = 188 * (1 - t) + 130 * t
                        o[i] = (8 + (hr - 8) * l + 140 * l * l) * shade
                        o[i + 1] = (12 + (hg - 12) * l + 60 * l * l) * shade
                        o[i + 2] = (18 + (hb - 18) * l + 60 * l * l) * shade
                        o[i + 3] = 255
                    }
                }
                dc.putImageData(out, 0, 0)
                rc.fillStyle = "rgba(0, 0, 0, 0.12)"; rc.fillRect(0, 0, cw, ch)
                const g = rc.createLinearGradient(0, ch * 0.35, 0, ch)
                g.addColorStop(0, "rgba(18,18,17,0)"); g.addColorStop(1, "rgba(18,18,17,0.65)")
                rc.fillStyle = g; rc.fillRect(0, 0, cw, ch)
            } catch {
                // image not readable (no CORS): fall back to a dimmed copy for the resting state
                dc.globalAlpha = 0.6; dc.drawImage(real, 0, 0); dc.globalAlpha = 1
            }
            draw()
        }
        const ease = (k: number) => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2)
        const draw = () => {
            const cw = canvas.width, ch = canvas.height
            ctx.setTransform(1, 0, 0, 1, 0, 0)
            ctx.globalCompositeOperation = "source-over"
            ctx.clearRect(0, 0, cw, ch)
            if (!ready) return
            // P: 0 = fabric (duotone), 0.5 = coarsest pixels, 1 = photo. Colour swaps while the pixels are big.
            const swap = Math.max(0, Math.min(1, (P - 0.38) / 0.24))
            const mc = mix.getContext("2d")!
            mc.globalAlpha = 1; mc.drawImage(duo, 0, 0)
            if (swap > 0) { mc.globalAlpha = swap; mc.drawImage(real, 0, 0); mc.globalAlpha = 1 }
            P = Math.max(0, Math.min(1, P))
            const k = 1 - Math.abs(P - 0.5) * 2 // 0 at the ends, 1 in the middle
            const li = Math.max(0, Math.min(LEVELS.length - 1, Math.floor(k * LEVELS.length)))
            if (li !== lastLevel) { // re-tear the border at each step while it moves
                lastLevel = li
                buildMask(li === 0 ? seed : seed + li * 7919 + (P > 0.5 ? 1 : 0), li / LEVELS.length)
            }
            const block = LEVELS[li] * dpr
            ctx.globalAlpha = rest + (0.96 - rest) * ease(Math.min(1, P / 0.7))
            if (block <= dpr * 1.01) {
                ctx.imageSmoothingEnabled = true
                ctx.drawImage(mix, 0, 0)
            } else {
                const sw = Math.max(1, Math.ceil(cw / block)), sh = Math.max(1, Math.ceil(ch / block))
                small.width = sw; small.height = sh
                const sc = small.getContext("2d")!
                sc.imageSmoothingEnabled = true
                sc.drawImage(mix, 0, 0, sw, sh)
                ctx.imageSmoothingEnabled = false
                ctx.drawImage(small, 0, 0, sw, sh, 0, 0, sw * block, sh * block)
            }
            ctx.globalAlpha = 1
            ctx.globalCompositeOperation = "destination-in"
            ctx.drawImage(maskBig, 0, 0)
            ctx.globalCompositeOperation = "source-over"
        }
        const frame = (now: number) => {
            const k = Math.max(0, Math.min(1, (now - t0) / dur)) // rAF time can be a hair earlier than t0
            P = from + (to - from) * k
            draw()
            raf = k < 1 ? requestAnimationFrame(frame) : 0
        }
        const animate = (target: number, ms: number) => {
            if (to === target && (raf || P === target)) return
            cancelAnimationFrame(raf)
            from = P; to = target; t0 = performance.now()
            dur = reduce ? 1 : (ms / Math.max(0.2, speed)) * Math.max(0.2, Math.abs(target - P))
            raf = requestAnimationFrame(frame)
        }
        img.onload = () => { ready = true; layout() }
        img.onerror = () => { if (img.crossOrigin) { img.crossOrigin = null as any; img.src = src + (src.includes("?") ? "&" : "?") + "nc=1" } }
        if (img.complete && img.naturalWidth) ready = true
        const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => layout()) : null
        ro?.observe(el)
        layout()

        const cleanups: (() => void)[] = []
        // Make sure the trigger word exists. The site script usually wraps "Gift" in the hero text; where it hasn't
        // run (Framer preview, or before it loads), this component wraps the first "Gift" in the hero itself.
        const ensureTrigger = () => {
            if (document.querySelector(trigger)) return true
            const scope = el.closest('[data-framer-name="01 Hero"]') || document.body
            const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT)
            let n: Node | null
            while ((n = walker.nextNode())) {
                const t = n as Text, i = t.data.search(/\bGift\b/)
                if (i < 0 || (t.parentElement && t.parentElement.closest("[data-g-photo]"))) continue
                const word = t.splitText(i); word.splitText(4)
                const span = document.createElement("span")
                span.setAttribute("data-g-photo", ""); span.style.cursor = "default"
                word.parentNode!.replaceChild(span, word); span.appendChild(word)
                return true
            }
            return false
        }
        if (!ensureTrigger()) {
            let tries = 0
            const iv = setInterval(() => { if (ensureTrigger() || ++tries > 20) clearInterval(iv) }, 500)
            cleanups.push(() => clearInterval(iv))
        }
        const onTrigger = (t: EventTarget | null) => !!(t && (t as Element).closest && (t as Element).closest(trigger))
        if (fine) {
            const over = (e: Event) => { if (onTrigger(e.target)) animate(1, 1300) }
            const out = (e: Event) => { if (onTrigger(e.target) && !onTrigger((e as any).relatedTarget)) animate(0, 1100) }
            document.addEventListener("pointerover", over, { passive: true })
            document.addEventListener("pointerout", out, { passive: true })
            document.addEventListener("focusin", over)
            document.addEventListener("focusout", out)
            cleanups.push(() => {
                document.removeEventListener("pointerover", over); document.removeEventListener("pointerout", out)
                document.removeEventListener("focusin", over); document.removeEventListener("focusout", out)
            })
        } else {
            // Touch: loop while on screen. Reveal 1.4s, hold 1.8s, hide 1.2s, rest 1.6s.
            let timers: any[] = [], visible = false
            const clear = () => { timers.forEach(clearTimeout); timers = [] }
            const cycle = () => {
                clear()
                if (!visible) return
                animate(1, 1400)
                timers.push(setTimeout(() => animate(0, 1200), 1400 + 1800))
                timers.push(setTimeout(cycle, 1400 + 1800 + 1200 + 1600))
            }
            const io = new IntersectionObserver((es) => es.forEach((e) => {
                visible = e.isIntersecting
                if (visible) cycle()
                else { clear(); cancelAnimationFrame(raf); raf = 0; P = 0; to = 0; draw() }
            }), { threshold: 0.35 })
            io.observe(el)
            const tap = (e: PointerEvent) => {
                const b = el.getBoundingClientRect()
                const inBox = e.clientX >= b.left && e.clientX <= b.right && e.clientY >= b.top && e.clientY <= b.bottom
                if (visible && (inBox || onTrigger(e.target))) { cancelAnimationFrame(raf); raf = 0; P = 0; to = 0; draw(); cycle() }
            }
            window.addEventListener("pointerdown", tap, { passive: true })
            cleanups.push(() => { io.disconnect(); clear(); window.removeEventListener("pointerdown", tap) })
        }
        return () => {
            cancelAnimationFrame(raf); ro?.disconnect(); cleanups.forEach((c) => c())
            document.documentElement.removeAttribute("data-g-portrait")
        }
    }, [src, rest, edge, speed, position, trigger])

    return (
        <div ref={box} aria-hidden="true" style={{ ...props.style, position: "relative", width: "100%", height: "100%", overflow: "hidden", pointerEvents: "none" }}>
            <canvas ref={cvs} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} />
        </div>
    )
}

HeroPortrait.defaultProps = { rest: 0.32, edge: 16, speed: 1, position: "50% 30%", trigger: "[data-g-photo]" }

addPropertyControls(HeroPortrait, {
    image: { type: ControlType.ResponsiveImage, title: "Photo" },
    rest: { type: ControlType.Number, title: "Resting opacity", min: 0, max: 1, step: 0.02 },
    edge: { type: ControlType.Number, title: "Edge pixel", min: 6, max: 40, step: 1, unit: "px" },
    speed: { type: ControlType.Number, title: "Speed", min: 0.4, max: 2.5, step: 0.1 },
    position: { type: ControlType.String, title: "Focus (x y)" },
    trigger: { type: ControlType.String, title: "Hover trigger (CSS)" },
})
