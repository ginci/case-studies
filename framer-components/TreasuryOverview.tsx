import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

/**
 * TreasuryOverview — "one screen, all accounts, one login".
 * Toggle banks in and out of the consolidated view; KPIs and distribution update together.
 * All balances are SAMPLE data for the demo.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
const BANKS = [
    { id: "GTB", name: "GTBank", bal: 48250000, inflow: 6200000, outflow: 4100000 },
    { id: "ZEN", name: "Zenith", bal: 31800000, inflow: 3900000, outflow: 5200000 },
    { id: "ACC", name: "Access", bal: 22400000, inflow: 2750000, outflow: 1900000 },
    { id: "UBA", name: "UBA", bal: 15100000, inflow: 1800000, outflow: 2300000 },
    { id: "FCMB", name: "FCMB", bal: 9600000, inflow: 1100000, outflow: 650000 },
]
const naira = (n) => "₦" + Math.round(n).toLocaleString("en-NG")
const compact = (n) => "₦" + (Math.abs(n) >= 1e6 ? (n / 1e6).toFixed(1) + "M" : Math.round(n / 1e3) + "K")

export default function TreasuryOverview(props) {
    const { accent, font } = props
    const [on, setOn] = React.useState(BANKS.map(() => true))
    const active = BANKS.filter((_, i) => on[i])
    const sum = (k) => active.reduce((a, b) => a + b[k], 0)
    const total = sum("bal"), inflow = sum("inflow"), outflow = sum("outflow"), net = inflow - outflow
    const label = { fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#737373" }
    const tints = [accent, mix(accent, 0.75), mix(accent, 0.55), mix(accent, 0.38), mix(accent, 0.22)]

    return (
        <div style={{ width: "100%", fontFamily: font, color: "#0A0A0A", border: "1px solid #E5E5E5", borderRadius: 16, overflow: "hidden", background: "#FFF" }}>
            <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #E5E5E5" }}>
                <div style={label}>Total balance · {active.length} of {BANKS.length} accounts</div>
                <div style={{ fontSize: 34, fontWeight: 600, letterSpacing: "-0.02em", marginTop: 6, fontVariantNumeric: "tabular-nums" }}>{naira(total)}</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderBottom: "1px solid #E5E5E5" }}>
                {[["Inflows (24h)", compact(inflow), "#0A0A0A"], ["Outflows (24h)", compact(outflow), "#0A0A0A"], ["Net position", (net >= 0 ? "+" : "−") + compact(Math.abs(net)), net >= 0 ? "#047857" : "#B91C1C"]].map(([k, v, c], i) => (
                    <div key={k} style={{ padding: "14px 16px", borderLeft: i ? "1px solid #F0F0F0" : "none" }}>
                        <div style={label}>{k}</div>
                        <div style={{ fontSize: 17, marginTop: 4, color: c, fontVariantNumeric: "tabular-nums" }}>{v}</div>
                    </div>
                ))}
            </div>

            <div style={{ padding: 20 }}>
                <div style={label}>Distribution</div>
                <div style={{ display: "flex", height: 10, borderRadius: 10, overflow: "hidden", background: "#F0F0F0", marginTop: 10 }}>
                    {BANKS.map((b, i) => (
                        <div key={b.id} style={{ width: on[i] && total ? (b.bal / total) * 100 + "%" : 0, background: tints[i], transition: "width .3s ease" }} />
                    ))}
                </div>

                <div role="group" aria-label="Accounts in view" style={{ marginTop: 16 }}>
                    {BANKS.map((b, i) => (
                        <label key={b.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #F0F0F0", cursor: "pointer", opacity: on[i] ? 1 : 0.45, transition: "opacity .2s" }}>
                            <input type="checkbox" checked={on[i]} onChange={() => setOn(on.map((x, j) => (j === i ? !x : x)))} style={{ accentColor: accent, width: 16, height: 16 }} />
                            <span style={{ width: 10, height: 10, borderRadius: 3, background: tints[i] }} />
                            <span style={{ flex: 1, fontSize: 14 }}>{b.name}</span>
                            <span style={{ fontSize: 14, fontVariantNumeric: "tabular-nums" }}>{naira(b.bal)}</span>
                        </label>
                    ))}
                </div>
            </div>
            <div style={{ ...label, fontSize: 9, textAlign: "center", padding: "0 0 14px" }}>Sample balances · demo only</div>
        </div>
    )
}

function mix(hex, t) {
    const n = parseInt(hex.replace("#", ""), 16)
    const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.round(v * t + 255 * (1 - t)))
    return "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("")
}

TreasuryOverview.defaultProps = { accent: "#059669", font: '"Geist", "Helvetica Neue", Arial, sans-serif' }

addPropertyControls(TreasuryOverview, {
    accent: { type: ControlType.Color, defaultValue: "#059669" },
    font: { type: ControlType.String, title: "Font stack", defaultValue: '"Geist", "Helvetica Neue", Arial, sans-serif' },
})
