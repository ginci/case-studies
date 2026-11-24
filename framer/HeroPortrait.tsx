import { useEffect, useRef, type CSSProperties } from "react"
import { addPropertyControls, ControlType } from "framer"

// Gift's photo, hidden until asked for. Hovering the word "Gift" in the hero text makes the photo pixelate in: it
// appears as big coarse blocks that step down to smaller and smaller pixels until the photo is sharp. Moving off "Gift"
// runs it backwards: the photo breaks back into blocks and dissolves into the page. No frame, no mask: just the photo.
// Touch screens: plays on its own while on screen (reveal, hold, hide, rest, repeat); a tap restarts it; it stops
// when scrolled away.

const DEFAULT_IMG = "https://framerusercontent.com/images/WdZdO386BLTzVBtQgoYDpSSrZ2s.jpg"
// pixel sizes the photo steps through, coarse to sharp
const LEVELS = [72, 56, 44, 34, 26, 20, 15, 11, 8, 6, 4, 3, 2, 1]

export default function HeroPortrait(props: {
    image?: { src: string; alt?: string } | string
    speed: number
    position: string
    trigger: string
    style?: CSSProperties
}) {
    const { speed = 1, position = "50% 30%", trigger = "[data-g-photo]" } = props
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
        img.decoding = "async"
        img.src = src
        const small = document.createElement("canvas")
        const sctx = small.getContext("2d")!
        let W = 0, H = 0, dpr = 1, ready = false
        let sx = 0, sy = 0, sw = 0, sh = 0
        let P = 0, from = 0, to = 0, t0 = 0, dur = 1, raf = 0

        const layout = () => {
            const b = el.getBoundingClientRect()
            dpr = Math.min(2, window.devicePixelRatio || 1)
            W = Math.max(1, Math.round(b.width)); H = Math.max(1, Math.round(b.height))
            canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr)
            if (img.naturalWidth) {
                const s = Math.max(W / img.naturalWidth, H / img.naturalHeight)
                sw = W / s; sh = H / s
                sx = (img.naturalWidth - sw) * px; sy = (img.naturalHeight - sh) * py
            }
            draw()
        }
        const draw = () => {
            ctx.setTransform(1, 0, 0, 1, 0, 0)
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            if (!ready || P <= 0.001) return
            // opacity comes in during the first, coarsest steps; then the pixels shrink until the photo is sharp
            ctx.globalAlpha = Math.min(1, P / 0.3)
            const q = Math.max(0, Math.min(1, (P - 0.08) / 0.92))
            const level = LEVELS[Math.min(LEVELS.length - 1, Math.floor(q * LEVELS.length))]
            const block = Math.max(1, (W < 500 ? 0.75 : 1) * level) * dpr
            if (block <= 1.01 * dpr) {
                ctx.imageSmoothingEnabled = true
                ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height)
            } else {
                const cw = Math.max(1, Math.ceil(canvas.width / block)), ch = Math.max(1, Math.ceil(canvas.height / block))
                small.width = cw; small.height = ch
                sctx.imageSmoothingEnabled = true
                sctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch)
                ctx.imageSmoothingEnabled = false
                ctx.drawImage(small, 0, 0, cw, ch, 0, 0, cw * block, ch * block)
            }
            ctx.globalAlpha = 1
        }
        const frame = (now: number) => {
            const k = Math.min(1, (now - t0) / dur)
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
        if (img.complete && img.naturalWidth) ready = true
        const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => layout()) : null
        ro?.observe(el)
        layout()

        const cleanups: (() => void)[] = []
        const onTrigger = (t: EventTarget | null) => !!(t && (t as Element).closest && (t as Element).closest(trigger))
        if (fine) {
            // Delegated, so it works whenever the "Gift" word is (re)rendered.
            const over = (e: Event) => { if (onTrigger(e.target)) animate(1, 1000) }
            const out = (e: PointerEvent | FocusEvent) => {
                if (onTrigger(e.target) && !onTrigger((e as any).relatedTarget)) animate(0, 800)
            }
            document.addEventListener("pointerover", over, { passive: true })
            document.addEventListener("pointerout", out as any, { passive: true })
            document.addEventListener("focusin", over)
            document.addEventListener("focusout", out as any)
            cleanups.push(() => {
                document.removeEventListener("pointerover", over); document.removeEventListener("pointerout", out as any)
                document.removeEventListener("focusin", over); document.removeEventListener("focusout", out as any)
            })
        } else {
            // Touch: loop while on screen. Reveal 1.2s, hold 1.8s, hide 1s, rest 1.4s.
            let timers: any[] = [], visible = false
            const clear = () => { timers.forEach(clearTimeout); timers = [] }
            const cycle = () => {
                clear()
                if (!visible) return
                animate(1, 1200)
                timers.push(setTimeout(() => animate(0, 1000), 1200 + 1800))
                timers.push(setTimeout(cycle, 1200 + 1800 + 1000 + 1400))
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
    }, [src, speed, position, trigger])

    return (
        <div ref={box} aria-hidden="true" style={{ ...props.style, position: "relative", width: "100%", height: "100%", overflow: "hidden", pointerEvents: "none" }}>
            <canvas ref={cvs} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} />
        </div>
    )
}

HeroPortrait.defaultProps = { speed: 1, position: "50% 30%", trigger: "[data-g-photo]" }

addPropertyControls(HeroPortrait, {
    image: { type: ControlType.ResponsiveImage, title: "Photo" },
    speed: { type: ControlType.Number, title: "Speed", min: 0.4, max: 2.5, step: 0.1 },
    position: { type: ControlType.String, title: "Focus (x y)" },
    trigger: { type: ControlType.String, title: "Hover trigger (CSS)" },
})
