# Hand-written headline generator

`HandHeadline.tsx` draws the hero headline as SVG outlines of Playwrite AR, traced like a pen and then filled.

To change the words or timing:

1. Download the font TTF to `font/PlaywriteAR.ttf` (Google Fonts CSS with a plain curl user agent returns a .ttf URL).
2. `npm i harfbuzzjs@0.4.5`
3. Edit the `lines` array in `gen.cjs`, then run `node gen.cjs` (writes glyphs.json).
4. Tune timing in `build.cjs` (per-piece duration, step between pieces, word and line pauses), then run `node build.cjs`.
5. Upload the new `HandHeadline.tsx` to the Framer code file of the same name.
