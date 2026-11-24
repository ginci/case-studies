import { useEffect, useRef, type CSSProperties } from "react"
import { addPropertyControls, ControlType } from "framer"

// Gift's photo, melted into the hero background. At rest it is a faint duotone in the shader's colours with soft,
// feathered edges, so it reads as part of the gradient. Hovering it reveals the real photo pixel by pixel: each square
// first appears as a solid block of its colour, then sharpens into the photo. Leaving runs the same steps backwards.
// Touch screens: the reveal plays on its own while the photo is on screen (reveal, hold, hide, rest, repeat), restarts
// when the photo is touched, and stops when it scrolls away.

const DEFAULT_IMG = "https://framerusercontent.com/images/WdZdO386BLTzVBtQgoYDpSSrZ2s.jpg"

export default function HeroPortrait(props: {
    image?: { src: string; alt?: string } | string
    pixel: number
    rest: number
    position: string
    style?: CSSProperties
}) {
    const { pixel = 16, rest = 0.3, position = "50% 30%" } = props
    const src = typeof props.image === "string" ? props.image : props.image?.src || DEFAULT_IMG
    const box = useRef<HTMLDivElement | null>(null)
    const cvs = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {
        const el = box.current, canvas = cvs.current
        if (!el || !canvas || typeof window === "undefined") return
        const ctx = canvas.getContext("2d")
        if (!ctx) return
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches
        const [px, py] = position.split(/\s+/).map((v) => (parseFloat(v) || 50) / 100)
        const img = new Image()
        img.decoding = "async"
        img.src = src
        const mosaic = document.createElement("canvas")
        let W = 0, H = 0, cols = 0, rows = 0, cell = pixel, dpr = 1
        let sx = 0, sy = 0, sw = 0, sh = 0 // the part of the photo that covers the box (object-fit: cover)
        let order = new Float32Array(0)
        let P = 0, from = 0, to = 0, t0 = 0, dur = 1, raf = 0, ready = false
        let origin: [number, number] = [0.5, 0.4]
        const SPREAD = 0.45 // how long each square takes, as a share of the whole reveal

        const layout = () => {
            const b = el.getBoundingClientRect()
            dpr = Math.min(2, window.devicePixelRatio || 1)
            W = Math.max(1, Math.round(b.width)); H = Math.max(1, Math.round(b.height))
            canvas.width = W * dpr; canvas.height = H * dpr
            cell = Math.max(8, W < 500 ? Math.round(pixel * 0.8) : pixel)
            cols = Math.ceil(W / cell); rows = Math.ceil(H / cell)
            if (img.naturalWidth) {
                const s = Math.max(W / img.naturalWidth, H / img.naturalHeight)
                sw = W / s; sh = H / s
                sx = (img.naturalWidth - sw) * px; sy = (img.naturalHeight - sh) * py
                mosaic.width = cols; mosaic.height = rows
                const m = mosaic.getContext("2d")!
                m.imageSmoothingEnabled = true
                m.drawImage(img, sx, sy, (cols * cell / W) * sw, (rows * cell / H) * sh, 0, 0, cols, rows)
            }
            shuffle()
            draw()
        }
        const shuffle = () => {
            order = new Float32Array(cols * rows)
            const [ox, oy] = origin
            for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
                const dx = (c + 0.5) / cols - ox, dy = ((r + 0.5) / rows - oy) * (H / Math.max(1, W))
                order[r * cols + c] = Math.min(1, 0.55 * Math.random() + 0.45 * Math.min(1, Math.hypot(dx, dy) * 1.6))
            }
        }
        const draw = () => {
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            ctx.clearRect(0, 0, W, H)
            if (!ready || P <= 0) return
            ctx.imageSmoothingEnabled = false
            const kx = sw / W, ky = sh / H
            for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
                const u = Math.max(0, Math.min(1, (P * (1 + SPREAD) - order[r * cols + c]) / SPREAD))
                if (u <= 0) continue
                const x = c * cell, y = r * cell
                if (u < 0.5) { // a solid block of this square's colour fades in
                    ctx.globalAlpha = u * 2
                    ctx.drawImage(mosaic, c, r, 1, 1, x, y, cell, cell)
                } else { // the block sharpens into the photo
                    ctx.globalAlpha = 1
                    ctx.drawImage(mosaic, c, r, 1, 1, x, y, cell, cell)
                    ctx.globalAlpha = (u - 0.5) * 2
                    ctx.drawImage(img, sx + x * kx, sy + y * ky, cell * kx, cell * ky, x, y, cell, cell)
                }
            }
            ctx.globalAlpha = 1
            // keep the revealed photo in the page's palette: a light teal-to-blue tint on the drawn squares only
            ctx.globalCompositeOperation = "source-atop"
            const g = ctx.createLinearGradient(0, 0, W, H)
            g.addColorStop(0, "rgba(0, 191, 188, 0.14)"); g.addColorStop(1, "rgba(0, 39, 130, 0.22)")
            ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)
            // and let the bright wall behind the face sink into the dark page towards the edges
            const v = ctx.createRadialGradient(W * 0.54, H * 0.4, Math.min(W, H) * 0.18, W * 0.54, H * 0.44, Math.max(W, H) * 0.55)
            v.addColorStop(0, "rgba(18, 18, 17, 0)"); v.addColorStop(1, "rgba(18, 18, 17, 0.75)")
            ctx.fillStyle = v; ctx.fillRect(0, 0, W, H)
            ctx.globalCompositeOperation = "source-over"
        }
        const frame = (now: number) => {
            const k = Math.min(1, (now - t0) / dur)
            const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2
            P = from + (to - from) * e
            draw()
            raf = k < 1 ? requestAnimationFrame(frame) : 0
        }
        const animate = (target: number, ms: number) => {
            if (to === target && raf) return
            cancelAnimationFrame(raf)
            from = P; to = target; t0 = performance.now()
            dur = reduce ? 1 : ms * Math.max(0.25, Math.abs(target - P))
            raf = requestAnimationFrame(frame)
        }
        img.onload = () => { ready = true; layout() }
        if (img.complete && img.naturalWidth) { ready = true }
        const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => layout()) : null
        ro?.observe(el)
        layout()

        const cleanups: (() => void)[] = []
        const inside = (x: number, y: number) => {
            const b = el.getBoundingClientRect()
            // the visible, feathered part of the photo: an ellipse inside the box
            const nx = (x - b.left) / b.width - 0.54, ny = (y - b.top) / b.height - 0.44
            return (nx * nx) / 0.16 + (ny * ny) / 0.16 < 1 ? [(x - b.left) / b.width, (y - b.top) / b.height] as [number, number] : null
        }
        if (fine) {
            // Listen on the window: the hero text sits above the photo and would otherwise swallow the pointer.
            let over = false
            const move = (e: PointerEvent) => {
                const hit = inside(e.clientX, e.clientY)
                if (hit && !over) { over = true; if (P < 0.05) { origin = hit; shuffle() } animate(1, 1100) }
                else if (!hit && over) { over = false; animate(0, 900) }
            }
            const leave = () => { if (over) { over = false; animate(0, 900) } }
            window.addEventListener("pointermove", move, { passive: true })
            document.documentElement.addEventListener("pointerleave", leave)
            cleanups.push(() => { window.removeEventListener("pointermove", move); document.documentElement.removeEventListener("pointerleave", leave) })
        } else {
            // Touch: loop while on screen. Reveal 1.3s, hold 1.8s, hide 1.1s, rest 1.4s.
            let timers: any[] = [], visible = false
            const clear = () => { timers.forEach(clearTimeout); timers = [] }
            const cycle = () => {
                clear()
                if (!visible) return
                origin = [0.3 + Math.random() * 0.4, 0.3 + Math.random() * 0.2]; shuffle()
                animate(1, 1300)
                timers.push(setTimeout(() => animate(0, 1100), 1300 + 1800))
                timers.push(setTimeout(cycle, 1300 + 1800 + 1100 + 1400))
            }
            const io = new IntersectionObserver((es) => es.forEach((e) => {
                visible = e.isIntersecting
                if (visible) cycle()
                else { clear(); cancelAnimationFrame(raf); raf = 0; P = 0; to = 0; draw() }
            }), { threshold: 0.35 })
            io.observe(el)
            const tap = (e: PointerEvent) => { if (visible && inside(e.clientX, e.clientY)) { P = 0; draw(); cycle() } }
            window.addEventListener("pointerdown", tap, { passive: true })
            cleanups.push(() => { io.disconnect(); clear(); window.removeEventListener("pointerdown", tap) })
        }
        return () => { cancelAnimationFrame(raf); ro?.disconnect(); cleanups.forEach((c) => c()) }
    }, [src, pixel, position])

    const edge = "radial-gradient(closest-side at 54% 44%, #000 25%, rgba(0,0,0,0.5) 62%, transparent 100%)"
    const softEdge = "radial-gradient(closest-side at 54% 44%, #000 18%, rgba(0,0,0,0.65) 48%, rgba(0,0,0,0.22) 72%, transparent 92%)"
    const img: CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: position, display: "block", pointerEvents: "none", userSelect: "none" }
    return (
        <div ref={box} aria-hidden="true" style={{ ...props.style, position: "relative", width: "100%", height: "100%", overflow: "hidden", pointerEvents: "none" }}>
            {/* resting layer: duotone in the shader colours, feathered into the background */}
            <div style={{ position: "absolute", inset: 0, isolation: "isolate", opacity: rest, WebkitMaskImage: edge, maskImage: edge }}>
                <img src={src} alt="" style={{ ...img, filter: "grayscale(1) contrast(1.15) brightness(0.85)" }} />
                <div style={{ position: "absolute", inset: 0, mixBlendMode: "color",
                    background: "radial-gradient(80% 70% at 70% 30%, #00BFBC, #0B3F6E 60%, #002782)" }} />
                <div style={{ position: "absolute", inset: 0, mixBlendMode: "multiply", background: "linear-gradient(to bottom, rgba(18,18,17,0) 35%, rgba(18,18,17,0.9))" }} />
            </div>
            {/* reveal layer: the real photo, drawn square by square */}
            <canvas ref={cvs} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block",
                WebkitMaskImage: softEdge, maskImage: softEdge, filter: "brightness(0.9)" }} />
        </div>
    )
}

HeroPortrait.defaultProps = { pixel: 16, rest: 0.3, position: "50% 30%" }

addPropertyControls(HeroPortrait, {
    image: { type: ControlType.ResponsiveImage, title: "Photo" },
    pixel: { type: ControlType.Number, title: "Pixel size", min: 6, max: 48, step: 1, unit: "px" },
    rest: { type: ControlType.Number, title: "Resting opacity", min: 0, max: 1, step: 0.02 },
    position: { type: ControlType.String, title: "Focus (x y)" },
})
