// Minimal stand-in for Framer's runtime so the same .tsx components render in the local preview.
export const ControlType = new Proxy({}, { get: (_t, k) => String(k) }) as any
export function addPropertyControls(_component: unknown, _controls: unknown) {}
