import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

/**
 * ComponentExplorer — Tranzakt design-system demo.
 * Toggle size / hierarchy / state / icon slot and watch the 8pt tokens update.
 * Also shows why building-block slots beat a full variant matrix.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
const SIZES = { sm: { h: 32, px: 16, fs: 13, gap: 8 }, md: { h: 40, px: 16, fs: 14, gap: 8 }, lg: { h: 48, px: 24, fs: 16, gap: 8 } }
const HIER = ["primary", "secondary", "ghost"]
const STATES = ["default", "hover", "focus", "disabled"]
const ICONS = ["none", "leading", "trailing"]

export default function ComponentExplorer(props) {
    const { accent, font, labelFont } = props
    const [size, setSize] = React.useState("md")
    const [hier, setHier] = React.useState("primary")
    const [state, setState] = React.useState("default")
    const [icon, setIcon] = React.useState("leading")
    const t = SIZES[size]

    const palette = {
        primary: { bg: accent, fg: "#FFF", bd: accent },
        secondary: { bg: "#FFF", fg: "#0A0A0A", bd: "#D4D4D4" },
        ghost: { bg: "transparent", fg: "#0A0A0A", bd: "transparent" },
    }[hier]
    const disabled = state === "disabled"
    const btn = {
        height: t.h, padding: `0 ${t.px}px`, gap: t.gap, borderRadius: 8,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        fontFamily: labelFont, fontWeight: 500, fontSize: t.fs,
        background: disabled ? "#F0F0F0" : state === "hover" ? (hier === "primary" ? shade(accent) : "#F5F5F5") : palette.bg,
        color: disabled ? "#A3A3A3" : palette.fg,
        border: `1px solid ${disabled ? "#F0F0F0" : palette.bd}`,
        boxShadow: state === "focus" ? `0 0 0 3px #FFF, 0 0 0 5px ${accent}` : "none",
        transition: "all .15s",
    }
    const glyph = <span aria-hidden style={{ width: t.fs, height: t.fs, borderRadius: 3, border: "1.5px solid currentColor", boxSizing: "border-box" }} />

    const matrix = Object.keys(SIZES).length * HIER.length * STATES.length * ICONS.length
    const slotted = Object.keys(SIZES).length * HIER.length * STATES.length

    const label = { fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#737373" }

    return (
        <div style={{ width: "100%", fontFamily: font, color: "#0A0A0A", border: "1px solid #E5E5E5", borderRadius: 16, overflow: "hidden", background: "#FFF" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 200, background: "repeating-linear-gradient(0deg, transparent 0 7px, #F3F3F3 7px 8px), repeating-linear-gradient(90deg, transparent 0 7px, #F3F3F3 7px 8px)", borderBottom: "1px solid #E5E5E5", padding: 24 }}>
                <button style={btn} disabled={disabled} tabIndex={-1}>
                    {icon === "leading" && glyph}
                    <span>Send payout</span>
                    {icon === "trailing" && glyph}
                </button>
            </div>

            <div style={{ padding: 20, display: "grid", gap: 16 }}>
                <Group name="Size" options={Object.keys(SIZES)} value={size} onChange={setSize} accent={accent} />
                <Group name="Hierarchy" options={HIER} value={hier} onChange={setHier} accent={accent} />
                <Group name="State" options={STATES} value={state} onChange={setState} accent={accent} />
                <Group name="Icon slot" options={ICONS} value={icon} onChange={setIcon} accent={accent} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", borderTop: "1px solid #E5E5E5" }}>
                {[["Height", t.h + "px"], ["Padding-x", t.px + "px"], ["Gap", t.gap + "px"], ["Radius", "8px"], ["Label", `Outfit ${t.fs}`]].map(([k, v]) => (
                    <div key={k} style={{ padding: "14px 16px", borderRight: "1px solid #F0F0F0" }}>
                        <div style={label}>{k}</div>
                        <div style={{ fontSize: 15, marginTop: 4, fontVariantNumeric: "tabular-nums" }}>{v}</div>
                    </div>
                ))}
            </div>

            <div style={{ padding: "16px 20px", borderTop: "1px solid #E5E5E5", background: "#FAFAFA", display: "flex", flexWrap: "wrap", gap: "8px 24px", alignItems: "baseline" }}>
                <div style={label}>This button, two ways</div>
                <div style={{ fontSize: 14 }}><s style={{ color: "#A3A3A3" }}>{matrix} matrix variants</s></div>
                <div style={{ fontSize: 14 }}><b style={{ color: accent }}>{slotted} variants</b> + 1 icon slot</div>
            </div>
        </div>
    )
}

function Group({ name, options, value, onChange, accent }) {
    return (
        <div role="radiogroup" aria-label={name} style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div style={{ width: 76, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#737373" }}>{name}</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {options.map((o) => {
                    const on = o === value
                    return (
                        <button key={o} role="radio" aria-checked={on} onClick={() => onChange(o)}
                            style={{ height: 28, padding: "0 12px", borderRadius: 999, fontFamily: "inherit", fontSize: 12, cursor: "pointer", border: `1px solid ${on ? "#0A0A0A" : "#E5E5E5"}`, background: on ? "#0A0A0A" : "#FFF", color: on ? "#FFF" : "#404040", textTransform: "capitalize" }}>
                            {o}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

function shade(hex) {
    const n = parseInt(hex.replace("#", ""), 16)
    const f = (v) => Math.max(0, Math.round(v * 0.85))
    return "#" + [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(f).map((v) => v.toString(16).padStart(2, "0")).join("")
}

ComponentExplorer.defaultProps = { accent: "#059669", font: '"Geist", "Helvetica Neue", Arial, sans-serif', labelFont: '"Outfit", "Geist", sans-serif' }

addPropertyControls(ComponentExplorer, {
    accent: { type: ControlType.Color, defaultValue: "#059669" },
    font: { type: ControlType.String, title: "UI font", defaultValue: '"Geist", "Helvetica Neue", Arial, sans-serif' },
    labelFont: { type: ControlType.String, title: "Button font", defaultValue: '"Outfit", "Geist", sans-serif' },
})
