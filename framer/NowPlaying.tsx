import { useEffect, useState, type CSSProperties } from "react"
import { addPropertyControls, ControlType } from "framer"

// "Listening to" pill. Sits beside the "Available for work" pill and matches its size and type.
// Animated bars + the current track; click opens it. Live data comes from Last.fm (connect Spotify to Last.fm,
// then set the username and a read-only API key). Until then it shows the fallback track, or "Not playing right now".

type Track = { title: string; artist: string; url?: string; live: boolean }
type Props = { lastfmUser: string; lastfmKey: string; title: string; artist: string; link: string; style?: CSSProperties }

export default function NowPlaying(props: Props) {
    const { lastfmUser = "", lastfmKey = "", title = "", artist = "", link = "" } = props
    const fallback: Track | null = title ? { title, artist, url: link, live: false } : null
    const [track, setTrack] = useState<Track | null>(fallback)
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

    const label = track?.live ? "Listening to" : track ? "Last played" : ""
    const text = track ? `${track.title}${track.artist ? " · " + track.artist : ""}` : "Not playing right now"
    const href = track?.url || link || undefined
    const Tag: any = href ? "a" : "span"
    return (
        <Tag className={"g-np" + (track?.live ? " g-np-live" : "")} href={href} target={href ? "_blank" : undefined} rel={href ? "noopener noreferrer" : undefined}
            title={track ? `${label}: ${text}` : text} style={{ ...props.style }}>
            <style>{`
.g-np { display: inline-flex; align-items: center; gap: 8px; height: 100%; min-height: 28px; box-sizing: border-box; padding: 6px 12px 6px 10px;
  border-radius: 999px; border: 1px solid rgba(244,243,238,.16); background: rgba(244,243,238,.04); color: #F4F3EE; text-decoration: none;
  font: 400 12px/1.3 "Geist Mono", ui-monospace, monospace; letter-spacing: .02em; white-space: nowrap; max-width: 100%;
  transition: border-color .25s ease, background-color .25s ease; }
a.g-np:hover, a.g-np:focus-visible { border-color: rgba(244,243,238,.36); background: rgba(244,243,238,.08); outline: none; }
.g-np-bars { display: inline-flex; gap: 2px; align-items: flex-end; height: 10px; flex: 0 0 auto; }
.g-np-bars i { width: 2px; height: 40%; border-radius: 2px; background: #6FD08C; }
@media (prefers-reduced-motion: no-preference) {
  .g-np-live .g-np-bars i { animation: g-np-bar 1s ease-in-out infinite; }
  .g-np-live .g-np-bars i:nth-child(2) { animation-delay: -.3s; } .g-np-live .g-np-bars i:nth-child(3) { animation-delay: -.6s; }
}
@keyframes g-np-bar { 0%,100% { height: 30%; } 50% { height: 100%; } }
.g-np-label { color: #85847E; }
.g-np-text { overflow: hidden; text-overflow: ellipsis; max-width: 240px; }
@media (max-width: 809px) { .g-np-text { max-width: 170px; } }
`}</style>
            <span className="g-np-bars" aria-hidden="true"><i /><i /><i /></span>
            {label ? <span className="g-np-label">{label}</span> : null}
            <span className="g-np-text">{text}</span>
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
