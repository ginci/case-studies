import { useEffect, useState, type CSSProperties } from "react"
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
    const Tag: any = href ? "a" : "span"
    return (
        <Tag className={"g-np" + (open ? " g-np-open" : "")} href={href} target={href ? "_blank" : undefined} rel={href ? "noopener noreferrer" : undefined}
            aria-label={track ? `${label}: ${text}` : text} aria-expanded={open}
            onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}
            onClick={(e: any) => { if (!open && window.matchMedia("(hover: none)").matches) { e.preventDefault(); setOpen(true) } }}
            style={{ ...rest }}>
            <style>{`
.g-np { display: inline-flex; align-items: center; gap: 8px; height: 28px; box-sizing: border-box; padding: 0 9px;
  border-radius: 999px; border: 1px solid rgba(244,243,238,.16); background: rgba(244,243,238,.04); color: #F4F3EE; text-decoration: none;
  font: 400 12px/1.3 "Geist Mono", ui-monospace, monospace; letter-spacing: .02em; white-space: nowrap; overflow: hidden;
  max-width: 28px; transition: max-width .45s cubic-bezier(.22,1,.36,1), border-color .25s ease, background-color .25s ease, padding .3s ease; }
.g-np.g-np-open { max-width: 360px; padding: 0 12px 0 9px; }
.g-np-more { display: inline-flex; gap: 8px; opacity: 0; transition: opacity .2s ease; }
.g-np-open .g-np-more { opacity: 1; transition-delay: .12s; }
a.g-np:hover, a.g-np:focus-visible { border-color: rgba(244,243,238,.36); background: rgba(244,243,238,.08); outline: none; }
.g-np-bars { display: inline-flex; gap: 2px; align-items: flex-end; justify-content: center; width: 8px; height: 10px; flex: 0 0 8px; }
.g-np-bars i { width: 2px; height: 40%; border-radius: 2px; background: #6FD08C; }
@media (prefers-reduced-motion: no-preference) {
  .g-np-bars i { animation: g-np-bar 1s ease-in-out infinite; }
  .g-np-bars i:nth-child(2) { animation-delay: -.3s; } .g-np-bars i:nth-child(3) { animation-delay: -.6s; }
}
@keyframes g-np-bar { 0%,100% { height: 30%; } 50% { height: 100%; } }
.g-np-label { color: #85847E; }
.g-np-text { overflow: hidden; text-overflow: ellipsis; max-width: 240px; }
@media (max-width: 809px) { .g-np-text { max-width: 170px; } .g-np.g-np-open { max-width: calc(100vw - 40px); } }
@media (prefers-reduced-motion: reduce) { .g-np, .g-np-more { transition: none; } }
`}</style>
            <span className="g-np-bars" aria-hidden="true"><i /><i /><i /></span>
            <span className="g-np-more">
                {label ? <span className="g-np-label">{label}</span> : null}
                <span className="g-np-text">{text}</span>
            </span>
        </Tag>
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
