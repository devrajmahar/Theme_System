// Generates every icon in public/brand-assets/icons/ from the source SVGs in public/brand-assets/.
// Run: npm run icons  (uses sharp, which ships with Next.js). See public/brand-assets/usage.md.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const brand = path.join(root, "public/brand-assets");
const out = path.join(brand, "icons");
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

// ── Tab icons: pixel-hinted logomark ────────────────────────────────────────────────────────────
// The source mark lives on a 40-unit square; at small sizes its edges land between pixels (e.g. 4.4px)
// and anti-alias into grey. This rebuilds the same shape for an S-px grid: square edges and arrow bars
// snap to whole pixels, bar thickness stays a whole number of pixels, and only the 45° diagonal is
// anti-aliased. Geometry (40-unit space, y from the square's top — matches logomark-*.svg):
// top bar x 11–29.5, y 10.5–15.5; vertical bar x 24.5–29.5, y 10.5–29; diagonal centred on x+y=40,
// width 5, capped at x−y=−18; top-right outer corner radius 2.5; square corner radius 8.
// The favicon's square uses the dark-theme --surface from globals.css (not the source mark's near-black),
// so the icon matches the product's dark UI. Read at build time to stay in sync.
const css = fs.readFileSync(path.join(root, "src/app/globals.css"), "utf8");
const TILE = css.match(/\.dark\s*\{[^}]*?--surface:\s*(#[0-9a-fA-F]{3,8})\s*;/)?.[1];
if (!TILE) throw new Error("Couldn't read .dark --surface from src/app/globals.css");
const hintedParts = (S) => {
  const k = S / 40, R = (v) => Math.round(v * k), f = (n) => +n.toFixed(3);
  const t = Math.max(2, R(5)), xL = R(11), xR = R(29.5), yT = R(10.5), yB = R(29), c = R(40), e = Math.round(-18 * k), d = t / Math.SQRT2;
  const r = f(Math.min(2.5 * k, t / 2)), q = f(S * 0.2);
  const P1 = [f(c - d - (yT + t)), yT + t], P2 = [f((c - d + e) / 2), f((c - d - e) / 2)], P3 = [f((c + d + e) / 2), f((c + d - e) / 2)], P4y = f(c + d - (xR - t));
  const square = `M${q} 0H${f(S - q)}A${q} ${q} 0 0 1 ${S} ${q}V${f(S - q)}A${q} ${q} 0 0 1 ${f(S - q)} ${S}H${q}A${q} ${q} 0 0 1 0 ${f(S - q)}V${q}A${q} ${q} 0 0 1 ${q} 0Z`;
  const arrow = `M${xL} ${yT}H${f(xR - r)}A${r} ${r} 0 0 1 ${xR} ${f(yT + r)}V${yB}H${xR - t}V${P4y}L${P3[0]} ${P3[1]}L${P2[0]} ${P2[1]}L${P1[0]} ${P1[1]}H${xL}Z`;
  return { square, arrow };
};
// Favicon (dark): square in the dark-theme surface colour (TILE) with the arrow filled solid white. The source mark's arrow is a hole;
// search engines (DuckDuckGo, Google/Bing dark) and dark browser tabs draw favicons with no backing, so a
// hole shows the dark page and the icon vanishes. Solid white keeps it readable on any background and is
// identical to the source mark on light backgrounds. Square drawn whole, arrow on top: no seam at the edges.
// White mark: as drawn (0.84 opacity, arrow cut out) — only for dark surfaces, where the hole reads as dark.
const hinted = (S, white) => {
  const { square, arrow } = hintedParts(S);
  const body = white
    ? `<path fill-rule="evenodd" d="${square}${arrow}" fill="#FFFFFF" fill-opacity="0.84"/>`
    : `<path d="${square}" fill="${TILE}"/><path d="${arrow}" fill="#FFFFFF"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">${body}</svg>`;
};
// Adaptive favicon.svg on the 16-px grid (whole pixels at 16 / 32 / 48 / 64). Light browser chrome and
// crawlers (no dark preference): dark square + white arrow. Dark chrome: white mark as drawn.
const P16 = hintedParts(16);
const adaptive = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
<style>.w{display:none}@media (prefers-color-scheme:dark){.d{display:none}.w{display:inline}}</style>
<g class="d"><path d="${P16.square}" fill="${TILE}"/><path d="${P16.arrow}" fill="#FFFFFF"/></g>
<path class="w" fill-rule="evenodd" d="${P16.square}${P16.arrow}" fill="#FFFFFF" fill-opacity="0.84"/>
</svg>
`;

// ── App icons: main logo ────────────────────────────────────────────────────────────────────────
const logo = fs.readFileSync(path.join(brand, "logo.svg"));
const APP_ID = "aeris", APP_NAME = "Aeris"; // file names and display name for app icons
const LOGO_BG = "#262626"; // Logo's tile colour — used where the OS needs an opaque, full-bleed square.
// Full-bleed home-screen icon: Logo's tile colour + highlight gradient fill the whole square (the OS
// applies its own corner mask), with Logo's inner arrow tile centred at `scale` of the square.
// Logo's inner tile spans 30/48 of its tile: 0.625 keeps Logo's proportions, smaller fits Android's safe zone.
const logoSrc = logo.toString("utf8");
const INNER = logoSrc.match(/<g filter="url\(#filter1_[^"]+\)">[\s\S]*?<\/g>/)[0];
const DEFS = logoSrc.match(/<defs>[\s\S]*<\/defs>/)[0];
const GRAD = logoSrc.match(/fill="url\(#(paint0_[^)]+)\)"/)[1];
const bleedSvg = (scale) => { const k = scale / 0.625; return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="3 0 48 48"><rect x="3" width="48" height="48" fill="${LOGO_BG}"/><rect x="3" width="48" height="48" fill="url(#${GRAD})"/><g transform="translate(27 24) scale(${k}) translate(-27 -24)">${INNER}</g>${DEFS}</svg>`; };

// ── Rendering + containers ──────────────────────────────────────────────────────────────────────
const render = (svg, size) => sharp(Buffer.isBuffer(svg) ? svg : Buffer.from(svg), { density: Math.max(72, size * 8) }).resize(size, size).png({ compressionLevel: 9 }).toBuffer();
const exact = (svg) => sharp(Buffer.from(svg), { density: 72 }).png({ compressionLevel: 9 }).toBuffer(); // 1 unit = 1 px, no resampling
const cache = { mark: {}, white: {}, logo: {} };
const m = async (s) => (cache.mark[s] ??= await exact(hinted(s, false)));
const mw = async (s) => (cache.white[s] ??= await exact(hinted(s, true)));
const l = async (s) => (cache.logo[s] ??= await render(logo, s));
const bleed = (size, scale) => render(bleedSvg(scale), size).then((b) => sharp(b).flatten({ background: LOGO_BG }).png({ compressionLevel: 9 }).toBuffer());

// ICO in the most compatible layout (what Windows, Visual Studio and ImageMagick write): sizes below 256
// as uncompressed 32-bit BGRA bitmaps (DIB + AND mask), 256 as PNG. PNG-only ICOs work in browsers but
// some installer and resource tools (e.g. NSIS) reject PNG entries at small sizes.
async function dib(pngBuf, size) {
  const rgba = await sharp(pngBuf).ensureAlpha().raw().toBuffer();
  const maskRow = Math.ceil(size / 32) * 4, pixels = Buffer.alloc(size * size * 4), mask = Buffer.alloc(maskRow * size);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) { // bottom-up rows, BGRA
    const i = (y * size + x) * 4, o = ((size - 1 - y) * size + x) * 4;
    pixels[o] = rgba[i + 2]; pixels[o + 1] = rgba[i + 1]; pixels[o + 2] = rgba[i]; pixels[o + 3] = rgba[i + 3];
  }
  const h = Buffer.alloc(40);
  h.writeUInt32LE(40, 0); h.writeInt32LE(size, 4); h.writeInt32LE(size * 2, 8); h.writeUInt16LE(1, 12); h.writeUInt16LE(32, 14); h.writeUInt32LE(pixels.length + mask.length, 20);
  return Buffer.concat([h, pixels, mask]);
}
async function ico(entries) {
  const images = await Promise.all(entries.map(({ size, buf }) => (size >= 256 ? buf : dib(buf, size))));
  const head = Buffer.alloc(6); head.writeUInt16LE(1, 2); head.writeUInt16LE(entries.length, 4);
  let offset = 6 + 16 * entries.length; const dirs = [];
  entries.forEach(({ size }, i) => { const d = Buffer.alloc(16); d.writeUInt8(size >= 256 ? 0 : size, 0); d.writeUInt8(size >= 256 ? 0 : size, 1); d.writeUInt16LE(1, 4); d.writeUInt16LE(32, 6); d.writeUInt32LE(images[i].length, 8); d.writeUInt32LE(offset, 12); offset += images[i].length; dirs.push(d); });
  return Buffer.concat([head, ...dirs, ...images]);
}
// PNG-based ICNS (macOS 10.7+) with the same chunk types Apple's iconutil writes (ic07–ic14). The
// small PNG types icp4/icp5/icp6 are left out: some macOS versions mis-render them; 16/32 px come from ic11/ic12.
function icns(chunks) {
  const parts = chunks.map(({ type, buf }) => { const h = Buffer.alloc(8); h.write(type, 0, "ascii"); h.writeUInt32BE(buf.length + 8, 4); return Buffer.concat([h, buf]); });
  const body = Buffer.concat(parts); const h = Buffer.alloc(8); h.write("icns", 0, "ascii"); h.writeUInt32BE(body.length + 8, 4); return Buffer.concat([h, body]);
}
const w = (p, b) => { fs.mkdirSync(path.dirname(path.join(out, p)), { recursive: true }); fs.writeFileSync(path.join(out, p), b); };
const each = (sizes, fn) => Promise.all(sizes.map(async (size) => ({ size, buf: await fn(size) })));

// ── Browser tab / search results — hinted logomark ──────────────────────────────────────────────
w("favicon.svg", adaptive);
// Every size Windows/Chrome pick at 100 / 125 / 150 / 200 % scaling (tabs: 16→20→24→32; up to 64).
w("favicon.ico", await ico(await each([16, 20, 24, 32, 40, 48, 64], m)));
w("favicon-16x16.png", await m(16));
w("favicon-32x32.png", await m(32));
for (const s of [16, 20, 24, 32, 40, 48, 60, 64, 72, 96, 128]) { w(`favicon/favicon-${s}.png`, await m(s)); w(`favicon/favicon-white-${s}.png`, await mw(s)); }

// ── Home screen / PWA — main logo ───────────────────────────────────────────────────────────────
w("apple-touch-icon.png", await bleed(180, 0.625));
w("icon-192.png", await l(192));
w("icon-512.png", await l(512));
w("icon-maskable-512.png", await bleed(512, 0.56));
w("site.webmanifest", JSON.stringify({ name: APP_NAME, short_name: APP_NAME, icons: [
  { src: "/brand-assets/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
  { src: "/brand-assets/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
  { src: "/brand-assets/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
], theme_color: LOGO_BG, background_color: LOGO_BG, display: "standalone" }, null, 2) + "\n");

// ── Desktop — main logo only (never the logomark) ───────────────────────────────────────────────
// Windows and Linux use logo.svg as drawn. macOS (Big Sur+) expects the tile at 824/1024 of the canvas,
// centred, with room for its shadow; Logo as drawn fills ~89% and would look oversized in the Dock.
const TILE_MAC = 824 / 1024;
const framed = (tileFraction) => { // Logo re-framed so its 48-unit tile (x 3–51, y 0–48) fills `tileFraction`, centred
  const u = 48 / tileFraction, x = 27 - u / 2, y = 24 - u / 2, f = (n) => +n.toFixed(4);
  const svg = logoSrc.replace('width="54" height="54" viewBox="0 0 54 54"', `viewBox="${f(x)} ${f(y)} ${f(u)} ${f(u)}"`);
  if (svg === logoSrc) throw new Error("logo.svg root attributes changed; update framed()");
  return svg;
};
const macSvg = framed(TILE_MAC);
cache.mac = {};
const mac = async (s) => (cache.mac[s] ??= await render(macSvg, s));

// Generic PNGs (Electron, Tauri, custom setups)
for (const s of [16, 20, 22, 24, 30, 32, 36, 40, 44, 48, 64, 96, 128, 256, 512, 1024]) w(`desktop/png/${s}x${s}.png`, await l(s));

// Windows: .ico with every size Explorer, taskbar, Start, Alt-Tab and title bars pick at 100–400 % scaling
w(`desktop/windows/${APP_ID}.ico`, await ico(await each([16, 20, 24, 30, 32, 36, 40, 48, 60, 64, 72, 80, 96, 128, 256], l)));
// Windows: Microsoft Store / MSIX / WinUI tile assets (names match Tauri and Visual Studio defaults)
for (const [name, s] of [["square-30x30-logo", 30], ["square-44x44-logo", 44], ["square-71x71-logo", 71], ["square-89x89-logo", 89], ["square-107x107-logo", 107], ["square-142x142-logo", 142], ["square-150x150-logo", 150], ["square-284x284-logo", 284], ["square-310x310-logo", 310], ["store-logo", 50]]) w(`desktop/windows/store/${name}.png`, await l(s));

// macOS: aeris.iconset (what Xcode and `iconutil -c icns` use) + .icns built from the same images
const ICONSET = [["icon_16x16", 16], ["icon_16x16@2x", 32], ["icon_32x32", 32], ["icon_32x32@2x", 64], ["icon_128x128", 128], ["icon_128x128@2x", 256], ["icon_256x256", 256], ["icon_256x256@2x", 512], ["icon_512x512", 512], ["icon_512x512@2x", 1024]];
for (const [name, s] of ICONSET) w(`desktop/macos/aeris.iconset/${name}.png`, await mac(s));
w(`desktop/macos/${APP_ID}.icns`, icns([["ic11", 32], ["ic12", 64], ["ic07", 128], ["ic08", 256], ["ic13", 256], ["ic09", 512], ["ic14", 512], ["ic10", 1024]].map(([type, s]) => ({ type, buf: cache.mac[s] }))));
w(`desktop/macos/${APP_ID}-1024.png`, await mac(1024));

// Linux: freedesktop hicolor theme layout → install to /usr/share/icons/hicolor/ (file name = app id)
for (const s of [16, 22, 24, 32, 48, 64, 96, 128, 256, 512]) w(`desktop/linux/hicolor/${s}x${s}/apps/${APP_ID}.png`, await l(s));
w(`desktop/linux/hicolor/scalable/apps/${APP_ID}.svg`, logo);
// Linux launcher entry: Icon= is the app id, resolved through the hicolor theme above. Adjust Exec= to your binary.
w(`desktop/linux/${APP_ID}.desktop`, `[Desktop Entry]\nType=Application\nName=${APP_NAME}\nExec=${APP_ID}\nIcon=${APP_ID}\nTerminal=false\nCategories=Utility;\n`);

// ── This site (Next.js file conventions: src/app/favicon.ico, icon.svg, apple-icon.png) ────────
fs.copyFileSync(path.join(out, "favicon.ico"), path.join(root, "src/app/favicon.ico"));
fs.writeFileSync(path.join(root, "src/app/icon.svg"), adaptive);
fs.copyFileSync(path.join(out, "apple-touch-icon.png"), path.join(root, "src/app/apple-icon.png"));

console.log("Icons written to public/brand-assets/icons/ and src/app/.");
