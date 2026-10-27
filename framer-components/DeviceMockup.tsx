import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

/**
 * DeviceMockup — phone, laptop or browser frame.
 * Drop a screenshot into `image`; until then it renders a labelled placeholder screen.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function DeviceMockup(props) {
    const { device, image, label, accent, font } = props
    const isPhone = device === "phone"

    const screen = image?.src ? (
        <img
            src={image.src}
            alt={image.alt || label}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
    ) : (
        <Placeholder label={label} accent={accent} font={font} compact={isPhone} />
    )

    if (isPhone) {
        return (
            <div style={{ width: "100%", maxWidth: 320, margin: "0 auto", fontFamily: font }}>
                <div
                    style={{
                        background: "#0A0A0A",
                        borderRadius: 44,
                        padding: 10,
                        boxShadow: "0 30px 60px -30px rgba(0,0,0,0.35), inset 0 0 0 1px #2A2A2A",
                    }}
                >
                    <div style={{ position: "relative", borderRadius: 34, overflow: "hidden", aspectRatio: "9 / 19.5", background: "#FFF" }}>
                        <div
                            style={{
                                position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)",
                                width: 90, height: 26, borderRadius: 20, background: "#0A0A0A", zIndex: 2,
                            }}
                        />
                        {screen}
                    </div>
                </div>
            </div>
        )
    }

    if (device === "browser") {
        return (
            <div style={{ width: "100%", fontFamily: font, borderRadius: 12, overflow: "hidden", boxShadow: "0 0 0 1px #E5E5E5, 0 30px 60px -30px rgba(0,0,0,0.25)" }}>
                <div style={{ height: 36, background: "#F5F5F5", display: "flex", alignItems: "center", gap: 6, padding: "0 14px", borderBottom: "1px solid #E5E5E5" }}>
                    {["#E5E5E5", "#E5E5E5", "#E5E5E5"].map((c, i) => (
                        <span key={i} style={{ width: 10, height: 10, borderRadius: 10, background: c }} />
                    ))}
                </div>
                <div style={{ aspectRatio: "16 / 10", background: "#FFF" }}>{screen}</div>
            </div>
        )
    }

    // laptop
    return (
        <div style={{ width: "100%", fontFamily: font }}>
            <div style={{ background: "#0A0A0A", borderRadius: "16px 16px 0 0", padding: "12px 12px 14px", boxShadow: "inset 0 0 0 1px #2A2A2A" }}>
                <div style={{ aspectRatio: "16 / 10", borderRadius: 4, overflow: "hidden", background: "#FFF" }}>{screen}</div>
            </div>
            <div style={{ height: 14, margin: "0 -4%", background: "linear-gradient(#D4D4D4, #A3A3A3)", borderRadius: "0 0 14px 14px" }} />
        </div>
    )
}

function Placeholder({ label, accent, font, compact }) {
    const bar = (w, h = 8, c = "#EDEDED") => (
        <div style={{ width: w, height: h, borderRadius: 4, background: c }} />
    )
    return (
        <div style={{ width: "100%", height: "100%", background: "#FAFAFA", display: "flex", flexDirection: compact ? "column" : "row", fontFamily: font }}>
            {!compact && (
                <div style={{ width: "18%", borderRight: "1px solid #EDEDED", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                    {bar("60%", 10, accent)}
                    {bar("80%")}{bar("70%")}{bar("75%")}{bar("55%")}
                </div>
            )}
            <div style={{ flex: 1, padding: compact ? "48px 16px 16px" : 18, display: "flex", flexDirection: "column", gap: 12 }}>
                {bar("40%", 12, "#D4D4D4")}
                <div style={{ display: "flex", gap: 8 }}>
                    {[0, 1, 2].slice(0, compact ? 2 : 3).map((i) => (
                        <div key={i} style={{ flex: 1, height: compact ? 54 : 64, borderRadius: 8, border: "1px solid #EDEDED", background: "#FFF" }} />
                    ))}
                </div>
                <div style={{ flex: 1, borderRadius: 8, border: "1px dashed #D4D4D4", display: "flex", alignItems: "center", justifyContent: "center", padding: 12, textAlign: "center" }}>
                    <span style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#737373" }}>{label}</span>
                </div>
            </div>
        </div>
    )
}

DeviceMockup.defaultProps = {
    device: "laptop",
    label: "[Screen — add Figma export]",
    accent: "#059669",
    font: '"Geist", "Helvetica Neue", Arial, sans-serif',
}

addPropertyControls(DeviceMockup, {
    device: { type: ControlType.Enum, options: ["laptop", "phone", "browser"], optionTitles: ["Laptop", "Phone", "Browser"], defaultValue: "laptop" },
    image: { type: ControlType.ResponsiveImage, title: "Screenshot" },
    label: { type: ControlType.String, title: "Placeholder", defaultValue: "[Screen — add Figma export]" },
    accent: { type: ControlType.Color, defaultValue: "#059669" },
    font: { type: ControlType.String, title: "Font stack", defaultValue: '"Geist", "Helvetica Neue", Arial, sans-serif' },
})
