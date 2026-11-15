import { useEffect, useRef, useState, type CSSProperties } from "react"
import { addPropertyControls, ControlType } from "framer"

// "Listening to" pill. Sits beside the "Available" pill at the same height. Folded, it is a round button with
// music bars moving up and down; hover, focus or tap unfolds it to show the track; leaving folds it back. Click opens the track. Live data comes from Last.fm (connect Spotify to Last.fm,
// then set the username and a read-only API key). Until then it shows the fallback track, or "Not playing right now".

type Track = { title: string; artist: string; url?: string; live: boolean }
type Props = { lastfmUser: string; lastfmKey: string; title: string; artist: string; link: string; style?: CSSProperties }

export default function NowPlaying(props: Props) {
    const { lastfmUser = "", lastfmKey = "", title = "", artist = "", link = "" } = props
    const fallback: Track | null = title ? { title, artist, url: link, live: false } : null
    const [track, setTrack] = useState<Track | null>(fallback)
    const [open, setOpen] = useState(false)
    const root = useRef<HTMLSpanElement | null>(null)
    // Never unfold past the screen edge: measure the room to the right when it opens (20px gutter).
    const [room, setRoom] = useState(360)
    useEffect(() => {
        if (!open || !root.current) return
        const left = root.current.getBoundingClientRect().left
        setRoom(Math.max(28, Math.min(360, Math.floor(window.innerWidth - left - 20))))
    }, [open])
    // Touch: tapping anywhere else folds it again.
    useEffect(() => {
        if (!open) return
        const away = (e: PointerEvent) => { if (root.current && !root.current.contains(e.target as Node)) setOpen(false) }
        document.addEventListener("pointerdown", away)
        return () => document.removeEventListener("pointerdown", away)
    }, [open])
    useEffect(() => {
        if (!lastfmUser || !lastfmKey) { setTrack(fallback); return }
        let stop = false
        const load = async () => {
            try {
                const u = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${encodeURIComponent(lastfmUser)}&api_key=${encodeURIComponent(lastfmKey)}&format=json&limit=1`
                const j = await (await fetch(u)).json()
                const t = j?.recenttracks?.track?.[0]
                if (!t || stop) return
                setTrack({ title: t.name, artist: t.artist?.["#text"] || "", url: t.url, live: t["@attr"]?.nowplaying === "true" })
            } catch { if (!stop) setTrack(fallback) }
        }
        load()
        const id = window.setInterval(load, 45000)
        return () => { stop = true; window.clearInterval(id) }
    }, [lastfmUser, lastfmKey, title, artist, link])

    // Framer passes the measured (folded, 28px) width/height in style; drop them so the pill can unfold.
    const { width: _w, height: _h, ...rest } = (props.style || {}) as any
    const label = track?.live ? "Listening to" : track ? "Last played" : ""
    const text = track ? `${track.title}${track.artist ? " · " + track.artist : ""}` : "Not playing right now"
    const href = track?.url || link || undefined
    // Desktop (mouse): hover opens, leaving closes. Touch: tap toggles; while open, tapping the track opens it.
    return (
        <span ref={root} className={"g-np" + (open ? " g-np-open" : "")} role="button" tabIndex={0}
            aria-label={track ? `${label}: ${text}` : text} aria-expanded={open}
            onPointerEnter={(e) => { if (e.pointerType === "mouse") setOpen(true) }}
            onPointerLeave={(e) => { if (e.pointerType === "mouse") setOpen(false) }}
            onClick={(e: any) => {
                const onLink = (e.target as Element).closest && (e.target as Element).closest("a")
                if (onLink && open) return // follow the track link
                if (onLink) e.preventDefault()
                if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) setOpen((o) => !o)
            }}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen((o) => !o) } if (e.key === "Escape") setOpen(false) }}
            onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false) }}
            style={{ ...rest, ...(open ? { maxWidth: room } : null) }}>
            <style>{`
.g-np { display: inline-flex; align-items: center; gap: 8px; height: 28px; min-height: 28px; max-height: 28px; box-sizing: border-box; padding: 0 9px; flex: 0 1 auto; min-width: 28px;
  border-radius: 999px; border: 1px solid rgba(244,243,238,.16); background: rgba(244,243,238,.04); color: #F4F3EE; text-decoration: none;
  font: 400 12px/1.3 "Geist Mono", ui-monospace, monospace; letter-spacing: .02em; white-space: nowrap; overflow: hidden;
  max-width: 28px; transition: max-width .45s cubic-bezier(.22,1,.36,1), border-color .25s ease, background-color .25s ease, padding .3s ease; }
.g-np.g-np-open { max-width: 360px; padding: 0 12px 0 9px; }
.g-np-more { display: inline-flex; gap: 8px; min-width: 0; overflow: hidden; opacity: 0; transition: opacity .2s ease; }
.g-np-open .g-np-more { opacity: 1; transition-delay: .12s; }
.g-np { cursor: pointer; -webkit-tap-highlight-color: transparent; }
.g-np:hover, .g-np:focus-visible { border-color: rgba(244,243,238,.36); background: rgba(244,243,238,.08); outline: none; }
a.g-np-text { color: inherit; text-decoration: none; } a.g-np-text:hover { text-decoration: underline; text-underline-offset: 3px; }
.g-np-bars { display: inline-flex; gap: 2px; align-items: flex-end; justify-content: center; width: 8px; height: 10px; flex: 0 0 8px; }
.g-np-bars i { width: 2px; height: 40%; border-radius: 2px; background: #6FD08C; }
@media (prefers-reduced-motion: no-preference) {
  .g-np-bars i { animation: g-np-bar 1s ease-in-out infinite; }
  .g-np-bars i:nth-child(2) { animation-delay: -.3s; } .g-np-bars i:nth-child(3) { animation-delay: -.6s; }
}
@keyframes g-np-bar { 0%,100% { height: 30%; } 50% { height: 100%; } }
.g-np-label { color: #85847E; }
.g-np-text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; flex: 1 1 auto; max-width: 240px; }
.g-np-label { flex: 0 0 auto; }
@media (max-width: 809px) { .g-np-text { max-width: none; } }
@media (prefers-reduced-motion: reduce) { .g-np, .g-np-more { transition: none; } }
`}</style>
            <span className="g-np-bars" aria-hidden="true"><i /><i /><i /></span>
            <span className="g-np-more">
                {label ? <span className="g-np-label">{label}</span> : null}
                {href ? <a className="g-np-text" href={href} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1}>{text}</a> : <span className="g-np-text">{text}</span>}
            </span>
        </span>
    )
}

NowPlaying.defaultProps = { lastfmUser: "", lastfmKey: "", title: "", artist: "", link: "" }
addPropertyControls(NowPlaying, {
    lastfmUser: { type: ControlType.String, title: "Last.fm user", description: "Connect Spotify to Last.fm, then add your username." },
    lastfmKey: { type: ControlType.String, title: "Last.fm key", description: "A read-only API key from last.fm/api." },
    title: { type: ControlType.String, title: "Track", description: "Shown until Last.fm is set up." },
    artist: { type: ControlType.String, title: "Artist" },
    link: { type: ControlType.Link, title: "Link" },
})
