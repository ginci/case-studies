import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

/**
 * SupplyChainFlow — NSIA concept demo.
 * Development → Sourcing → Supply → Distribution. Pick a stage to see what that team needs on screen.
 * Every figure is a SAMPLE / placeholder for the demo.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
const STAGES = [
    {
        key: "Development",
        who: "[Programme / product team]",
        question: "Which fertiliser blends are we producing, and for which regions?",
        rows: [["Active blends", "[4]"], ["Regions covered", "[6]"], ["Next review", "[Q1]"]],
    },
    {
        key: "Sourcing",
        who: "[Procurement]",
        question: "Do we have enough raw input, and from whom?",
        rows: [["Open purchase orders", "[12]"], ["Suppliers", "[8]"], ["Input cover", "[45 days]"]],
    },
    {
        key: "Supply",
        who: "[Warehouse & logistics]",
        question: "Where is stock sitting right now?",
        rows: [["Warehouses", "[5]"], ["Stock on hand", "[18,400 bags]"], ["In transit", "[3 trucks]"]],
    },
    {
        key: "Distribution",
        who: "[Distributors & field agents]",
        question: "Did the fertiliser reach the farmers who need it?",
        rows: [["Distributors", "[24]"], ["Delivered this season", "[72%]"], ["Pending confirmations", "[9]"]],
    },
]

export default function SupplyChainFlow(props) {
    const { accent, font } = props
    const [i, setI] = React.useState(0)
    const s = STAGES[i]
    const label = { fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#737373" }

    return (
        <div style={{ width: "100%", fontFamily: font, color: "#0A0A0A", border: "1px solid #E5E5E5", borderRadius: 16, overflow: "hidden", background: "#FFF" }}>
            <div role="tablist" aria-label="Supply-chain stage" style={{ display: "grid", gridTemplateColumns: `repeat(${STAGES.length}, 1fr)`, borderBottom: "1px solid #E5E5E5" }}>
                {STAGES.map((x, j) => (
                    <button key={x.key} role="tab" aria-selected={j === i} onClick={() => setI(j)}
                        style={{ position: "relative", background: j === i ? "#FAFAFA" : "#FFF", border: "none", borderLeft: j ? "1px solid #F0F0F0" : "none", padding: "16px 8px 14px", fontFamily: "inherit", cursor: "pointer", textAlign: "left" }}>
                        <div style={{ ...label, color: j <= i ? accent : "#A3A3A3" }}>0{j + 1}</div>
                        <div style={{ fontSize: 13, marginTop: 4, fontWeight: j === i ? 600 : 400, color: j === i ? "#0A0A0A" : "#525252" }}>{x.key}</div>
                        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 2, background: j <= i ? accent : "transparent", transition: "background .25s" }} />
                    </button>
                ))}
            </div>

            <div style={{ padding: 22 }}>
                <div style={label}>For {s.who}</div>
                <p style={{ fontSize: 19, lineHeight: 1.4, letterSpacing: "-0.01em", margin: "10px 0 0" }}>{s.question}</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 1, background: "#EDEDED", border: "1px solid #EDEDED", borderRadius: 10, overflow: "hidden", marginTop: 18 }}>
                    {s.rows.map(([k, v]) => (
                        <div key={k} style={{ background: "#FFF", padding: "14px 14px" }}>
                            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{v}</div>
                            <div style={{ fontSize: 12, color: "#737373", marginTop: 2 }}>{k}</div>
                        </div>
                    ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18 }}>
                    <button disabled={i === 0} onClick={() => setI(i - 1)} style={nav(i === 0)}>← Back</button>
                    <button disabled={i === STAGES.length - 1} onClick={() => setI(i + 1)} style={{ ...nav(i === STAGES.length - 1), background: i === STAGES.length - 1 ? "#F0F0F0" : accent, color: i === STAGES.length - 1 ? "#A3A3A3" : "#FFF", borderColor: "transparent" }}>Next stage →</button>
                </div>
            </div>
            <div style={{ ...label, fontSize: 9, textAlign: "center", padding: "0 0 14px" }}>Concept demo · placeholder figures</div>
        </div>
    )
}

const nav = (off) => ({ height: 38, padding: "0 14px", borderRadius: 8, border: "1px solid #E5E5E5", background: "#FFF", color: off ? "#A3A3A3" : "#0A0A0A", fontFamily: "inherit", fontSize: 13, fontWeight: 500, cursor: off ? "default" : "pointer" })

SupplyChainFlow.defaultProps = { accent: "#4D7C0F", font: '"Geist", "Helvetica Neue", Arial, sans-serif' }

addPropertyControls(SupplyChainFlow, {
    accent: { type: ControlType.Color, defaultValue: "#4D7C0F" },
    font: { type: ControlType.String, title: "Font stack", defaultValue: '"Geist", "Helvetica Neue", Arial, sans-serif' },
})
