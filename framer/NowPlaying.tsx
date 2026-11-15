import { useEffect, useState, type CSSProperties } from "react"
import { createPortal } from "react-dom"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

// "Listening to" edge tab. Docked to the right edge of the screen: flat on the right, fully rounded on the left,
// showing animated music bars. Hover, focus or tap slides it out to show the track; it docks again when you leave.
// Live data comes from Last.fm (connect Spotify to Last.fm, then add the username and a read-only API key).
// Until then (or if Last.fm fails) it shows the fallback track. Rendered into <body> so it stays fixed while scrolling.

type Track = { title: string; artist: string; cover?: string; url?: string; live: boolean }
type Props = { lastfmUser: string; lastfmKey: string; title: string; artist: string; cover?: { src?: string } | string; link: string; bottom: number; style?: CSSProperties }

export default function NowPlaying(props: Props) {
    const { lastfmUser = "", lastfmKey = "", title = "", artist = "", link = "", bottom = 96 } = props
    const coverSrc = typeof props.cover === "string" ? props.cover : props.cover?.src
    const fallback: Track | null = title ? { title, artist, cover: coverSrc, url: link, live: false } : null
    const [track, setTrack] = useState<Track | null>(fallback)
    const [open, setOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])
    useEffect(() => {
        if (!lastfmUser || !lastfmKey) { setTrack(fallback); return }
        let stop = false
        const load = async () => {
            try {
                const u = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${encodeURIComponent(lastfmUser)}&api_key=${encodeURIComponent(lastfmKey)}&format=json&limit=1`
                const j = await (await fetch(u)).json()
                const t = j?.recenttracks?.track?.[0]
                if (!t || stop) return
                const img = (t.image || []).find((i: any) => i.size === "large")?.["#text"] || ""
                setTrack({ title: t.name, artist: t.artist?.["#text"] || "", cover: img || coverSrc, url: t.url, live: t["@attr"]?.nowplaying === "true" })
            } catch { if (!stop) setTrack(fallback) }
        }
        load()
        const id = window.setInterval(load, 45000)
        return () => { stop = true; window.clearInterval(id) }
    }, [lastfmUser, lastfmKey, title, artist, link, coverSrc])

    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const label = track?.live ? "Listening to" : track ? "Last played" : "Listening to"
    const ui = (
        <div className={"g-np" + (open ? " g-np-open" : "")} style={{ bottom, position: isCanvas ? "relative" : "fixed" }}
            onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
            <style>{`
.g-np { right: 0; z-index: 30; display: flex; align-items: center; gap: 12px; height: 56px; padding: 0 16px 0 14px;
  border-radius: 999px 0 0 999px; border: 1px solid rgba(244,243,238,.14); border-right: 0;
  background: rgba(18,18,17,.88); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 10px 30px rgba(0,0,0,.35); color: #F4F3EE; max-width: 56px; overflow: hidden; cursor: default;
  transition: max-width .45s cubic-bezier(.22,1,.36,1), background-color .3s ease; }
.g-np.g-np-open { max-width: 340px; }
.g-np-btn { all: unset; flex: 0 0 auto; width: 28px; height: 28px; display: grid; place-items: center; cursor: pointer; border-radius: 99px; }
.g-np-btn:focus-visible { outline: 2px solid #F4F3EE; outline-offset: 2px; }
.g-np-bars { display: flex; gap: 2px; align-items: flex-end; height: 14px; }
.g-np-bars i { width: 3px; background: #6FD08C; border-radius: 2px; height: 40%; }
@media (prefers-reduced-motion: no-preference) {
  .g-np-bars i { animation: g-np-bar 1s ease-in-out infinite; }
  .g-np-bars i:nth-child(2) { animation-delay: -.3s; } .g-np-bars i:nth-child(3) { animation-delay: -.6s; }
}
@keyframes g-np-bar { 0%,100% { height: 30%; } 50% { height: 100%; } }
.g-np-body { display: flex; align-items: center; gap: 10px; min-width: 0; opacity: 0; transition: opacity .25s ease .1s; text-decoration: none; color: inherit; }
.g-np-open .g-np-body { opacity: 1; }
.g-np-cover { width: 36px; height: 36px; border-radius: 6px; background: #2A2A27 center / cover no-repeat; flex: 0 0 36px; }
.g-np-text { display: flex; flex-direction: column; gap: 3px; min-width: 0; white-space: nowrap; }
.g-np-label { font: 400 10px/1 "Geist Mono", ui-monospace, monospace; letter-spacing: .08em; text-transform: uppercase; color: #85847E; }
.g-np-title { font: 500 14px/1.2 Outfit, sans-serif; overflow: hidden; text-overflow: ellipsis; max-width: 220px; }
.g-np-artist { font: 300 12px/1.2 "Nunito", sans-serif; color: #A3A29C; overflow: hidden; text-overflow: ellipsis; max-width: 220px; }
@media (prefers-reduced-motion: reduce) { .g-np { transition: none; } .g-np-body { transition: none; } }
@media (max-width: 809px) { .g-np { height: 48px; padding: 0 12px 0 10px; max-width: 48px; } .g-np.g-np-open { max-width: calc(100vw - 24px); } }
`}</style>
            <button className="g-np-btn" aria-label={track ? `${label}: ${track.title} by ${track.artist}` : "Listening to"} aria-expanded={open}
                onClick={() => setOpen((o) => !o)} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}>
                <span className="g-np-bars" aria-hidden="true"><i /><i /><i /></span>
            </button>
            <a className="g-np-body" href={track?.url || link || undefined} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1}>
                <span className="g-np-cover" style={track?.cover ? { backgroundImage: `url("${track.cover}")` } : undefined} />
                <span className="g-np-text">
                    <span className="g-np-label">{label}</span>
                    <span className="g-np-title">{track ? track.title : "Nothing right now"}</span>
                    {track?.artist ? <span className="g-np-artist">{track.artist}</span> : null}
                </span>
            </a>
        </div>
    )
    if (isCanvas) return <div style={{ ...props.style, display: "flex", justifyContent: "flex-end" }}>{ui}</div>
    return mounted ? createPortal(ui, document.body) : null
}

NowPlaying.defaultProps = { lastfmUser: "", lastfmKey: "", title: "", artist: "", link: "", bottom: 96 }
addPropertyControls(NowPlaying, {
    lastfmUser: { type: ControlType.String, title: "Last.fm user", description: "Connect Spotify to Last.fm, then add your username." },
    lastfmKey: { type: ControlType.String, title: "Last.fm key", description: "A read-only API key from last.fm/api." },
    title: { type: ControlType.String, title: "Track", description: "Shown until Last.fm is set up." },
    artist: { type: ControlType.String, title: "Artist" },
    cover: { type: ControlType.ResponsiveImage, title: "Cover" },
    link: { type: ControlType.Link, title: "Link" },
    bottom: { type: ControlType.Number, title: "From bottom", min: 16, max: 600, step: 4, unit: "px" },
})
