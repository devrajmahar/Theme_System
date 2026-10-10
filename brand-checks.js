const ICONS = "/brand-assets/icons";
const get = async (url) => { const r = await fetch(url, { cache: "no-store" }); return { status: r.status, buf: new Uint8Array(await r.arrayBuffer()) }; };
const u32be = (b, o) => ((b[o] << 24) >>> 0) + (b[o + 1] << 16) + (b[o + 2] << 8) + b[o + 3];
const u32le = (b, o) => b[o] + (b[o + 1] << 8) + (b[o + 2] << 16) + ((b[o + 3] << 24) >>> 0);
const u16le = (b, o) => b[o] + (b[o + 1] << 8);
const ascii = (b, o, n) => String.fromCharCode(...b.slice(o, o + n));
const isPng = (b, o = 0) => b[o] === 0x89 && ascii(b, o + 1, 3) === "PNG";
const COLOR = { 0: "grey", 2: "RGB (opaque)", 3: "palette", 4: "grey+alpha", 6: "RGBA" };
const png = (b, o = 0) => ({ w: u32be(b, o + 16), h: u32be(b, o + 20), color: b[o + 25], alpha: b[o + 25] === 4 || b[o + 25] === 6 });
function ico(b) {
    if (u16le(b, 0) !== 0 || u16le(b, 2) !== 1)
        throw new Error("not an ICO header");
    return Array.from({ length: u16le(b, 4) }, (_, i) => {
        const o = 6 + 16 * i, dirW = b[o] || 256, dirH = b[o + 1] || 256, off = u32le(b, o + 12);
        // Entry is either PNG or a BITMAPINFOHEADER DIB (height is doubled to include the AND mask).
        const img = isPng(b, off) ? { kind: "PNG", ...png(b, off) } : u32le(b, off) === 40 ? { kind: "BMP", w: u32le(b, off + 4), h: u32le(b, off + 8) / 2, bits: u16le(b, off + 14) } : null;
        return { dirW, dirH, bpp: u16le(b, o + 6), kind: img?.kind ?? "?", ok: !!img && img.w === dirW && img.h === dirH && dirW === dirH && (img.kind === "PNG" || ("bits" in img && img.bits === 32)) };
    });
}
const ICNS_SIZE = { ic07: 128, ic08: 256, ic09: 512, ic10: 1024, ic11: 32, ic12: 64, ic13: 256, ic14: 512 };
function icns(b) {
    if (ascii(b, 0, 4) !== "icns")
        throw new Error("missing icns magic");
    if (u32be(b, 4) !== b.length)
        throw new Error(`length field ${u32be(b, 4)} ≠ file size ${b.length}`);
    const chunks = [];
    for (let o = 8; o < b.length; o += u32be(b, o + 4)) {
        const type = ascii(b, o, 4), p = isPng(b, o + 8) ? png(b, o + 8) : null;
        chunks.push({ type, px: p?.w ?? 0, ok: !!p && ICNS_SIZE[type] === p.w && p.w === p.h });
    }
    return chunks;
}
function svg(text) {
    const doc = new DOMParser().parseFromString(text, "image/svg+xml");
    if (doc.querySelector("parsererror"))
        throw new Error("XML parse error");
    const root = doc.documentElement, vb = (root.getAttribute("viewBox") ?? "").split(/[\s,]+/).map(Number);
    const problems = [
        root.tagName !== "svg" && "root is not <svg>",
        !(vb.length === 4 && vb[2] === vb[3]) && "viewBox is not square",
        doc.querySelector("script") && "contains <script>",
        doc.querySelector("image, foreignObject") && "embeds <image>/<foreignObject>",
        /(href|src)="https?:/.test(text) && "references external URLs",
    ].filter(Boolean);
    return { vb, problems };
}
async function runChecks() {
    const out = [];
    const timeout = (ms) => new Promise((_, reject) => setTimeout(() => reject(new Error(`timed out after ${ms / 1000}s`)), ms));
    const add = (group, name, fn) => Promise.race([fn(), timeout(15000)]).then((detail) => out.push({ group, name, ok: true, detail }), (e) => out.push({ group, name, ok: false, detail: e.message }));
    const need = (cond, msg) => { if (!cond)
        throw new Error(msg); };
    const pngFile = (group, url, size, opaque) => add(group, url.replace(/\?.*/, "").replace(/^.*\/icons\/(desktop\/(windows|macos|linux|png)\/)?/, ""), async () => {
        const { status, buf } = await get(url);
        need(status === 200, `HTTP ${status}`);
        need(isPng(buf), "not a PNG");
        const p = png(buf);
        need(p.w === size && p.h === size, `${p.w}×${p.h}, expected ${size}×${size}`);
        if (opaque)
            need(!p.alpha, `has an alpha channel (${COLOR[p.color]}); iOS/Android masks need opaque`);
        return `PNG ${p.w}×${p.h} · ${COLOR[p.color]}`;
    });
    const icoFile = (group, url, sizes) => add(group, url.replace(/\?.*/, "").split("/").pop(), async () => {
        const { status, buf } = await get(url);
        need(status === 200, `HTTP ${status}`);
        const e = ico(buf), bad = e.filter((x) => !x.ok), have = e.map((x) => x.dirW);
        need(!bad.length, `entry ${bad.map((x) => x.dirW).join(", ")} doesn't match its image`);
        const missing = sizes.filter((s) => !have.includes(s));
        need(!missing.length, `missing ${missing.join(", ")}`);
        need(e.every((x) => x.bpp === 32), "not all entries are 32-bit");
        need(e.every((x) => x.kind === (x.dirW >= 256 ? "PNG" : "BMP")), "use BMP below 256 px and PNG at 256 for widest compatibility");
        return `ICO · ${have.join(", ")} px · 32-bit BMP${have.includes(256) ? " + PNG at 256" : ""}, square`;
    });
    // Page <head> — what browsers and search engines actually read
    const links = [...document.head.querySelectorAll("link[rel~='icon'], link[rel='apple-touch-icon']")];
    const iconLinks = links.filter((l) => l.rel.split(" ").includes("icon"));
    const svgLink = iconLinks.find((l) => l.type === "image/svg+xml"), icoLink = iconLinks.find((l) => l.type === "image/x-icon"), appleLink = links.find((l) => l.rel === "apple-touch-icon");
    await Promise.all([
        add("Page <head>", "<link rel=\"icon\">", async () => { need(iconLinks.length, "no icon link in <head>"); return iconLinks.map((l) => `${l.type} ${l.sizes.value}`).join(" · "); }),
        add("Page <head>", "<link rel=\"apple-touch-icon\">", async () => { need(appleLink, "missing"); return `${appleLink.sizes.value}`; }),
        icoLink ? icoFile("Page <head>", icoLink.href, [16, 32, 48]) : add("Page <head>", "favicon.ico link", async () => { throw new Error("missing"); }),
        add("Page <head>", "icon.svg", async () => {
            need(svgLink, "missing");
            const r = await fetch(svgLink.href, { cache: "no-store" });
            need(r.status === 200, `HTTP ${r.status}`);
            const s = svg(await r.text());
            need(!s.problems.length, s.problems.join("; "));
            return `valid SVG · square viewBox ${s.vb[2]}×${s.vb[3]} · no scripts or external refs`;
        }),
        appleLink ? pngFile("Page <head>", appleLink.href, 180, true) : Promise.resolve(),
    ]);
    // Google Search favicon rules (developers.google.com/search/docs/appearance/favicon-in-search)
    await Promise.all([
        add("Google Search", "Crawlable at /favicon.ico", async () => { const { status } = await get("/favicon.ico"); need(status === 200, `HTTP ${status}`); return "HTTP 200 at the site root"; }),
        add("Google Search", "Declared in <head>", async () => { need(iconLinks.length, "no <link rel=\"icon\">"); return `${iconLinks.length} icon link(s)`; }),
        add("Google Search", "Square, multiple of 48 px", async () => {
            const { buf } = await get("/favicon.ico");
            const sizes = ico(buf).map((x) => x.dirW).filter((s) => s % 48 === 0);
            need(sizes.length || svgLink, "no 48/96/144… px size and no SVG");
            return [sizes.length && `ICO has ${sizes.join(", ")} px`, svgLink && "SVG (any size)"].filter(Boolean).join(" · ");
        }),
    ]);
    // Kit files — what you copy into another site / desktop app
    const manifestUrl = `${ICONS}/site.webmanifest`;
    await Promise.all([
        icoFile("Web kit", `${ICONS}/favicon.ico`, [16, 20, 24, 32, 40, 48, 64]),
        add("Web kit", "favicon.svg", async () => { const r = await fetch(`${ICONS}/favicon.svg`, { cache: "no-store" }); const t = await r.text(); const s = svg(t); need(!s.problems.length, s.problems.join("; ")); need(t.includes("prefers-color-scheme"), "no dark-mode switch"); return "valid SVG · square · dark/white by browser theme"; }),
        pngFile("Web kit", `${ICONS}/favicon-16x16.png`, 16, false),
        pngFile("Web kit", `${ICONS}/favicon-32x32.png`, 32, false),
        pngFile("Web kit", `${ICONS}/apple-touch-icon.png`, 180, true),
        pngFile("Web kit", `${ICONS}/icon-192.png`, 192, false),
        pngFile("Web kit", `${ICONS}/icon-512.png`, 512, false),
        pngFile("Web kit", `${ICONS}/icon-maskable-512.png`, 512, true),
        add("Web kit", "site.webmanifest", async () => {
            const m = JSON.parse(new TextDecoder().decode((await get(manifestUrl)).buf));
            need(m.name, "no name");
            need(m.icons?.length, "no icons");
            need(m.icons.some((i) => i.purpose === "maskable"), "no maskable icon");
            for (const i of m.icons) {
                const { status, buf } = await get(i.src);
                need(status === 200, `${i.src}: HTTP ${status}`);
                const p = png(buf);
                need(`${p.w}x${p.h}` === i.sizes, `${i.src} is ${p.w}×${p.h}, manifest says ${i.sizes}`);
            }
            return `valid JSON · name "${m.name}" · ${m.icons.length} icons, sizes match files · maskable present`;
        }),
        icoFile("Windows", `${ICONS}/desktop/windows/aeris.ico`, [16, 20, 24, 30, 32, 36, 40, 48, 60, 64, 72, 80, 96, 128, 256]),
        ...[["square-30x30-logo", 30], ["square-44x44-logo", 44], ["square-71x71-logo", 71], ["square-89x89-logo", 89], ["square-107x107-logo", 107], ["square-142x142-logo", 142], ["square-150x150-logo", 150], ["square-284x284-logo", 284], ["square-310x310-logo", 310], ["store-logo", 50]].map(([n, s]) => pngFile("Windows", `${ICONS}/desktop/windows/store/${n}.png`, s, false)),
        add("macOS", "aeris.icns", async () => {
            const { buf } = await get(`${ICONS}/desktop/macos/aeris.icns`);
            const c = icns(buf), bad = c.filter((x) => !x.ok);
            need(!bad.length, `bad chunk ${bad.map((x) => `${x.type} (${x.px}px)`).join(", ")}`);
            const missing = Object.keys(ICNS_SIZE).filter((t) => !c.some((x) => x.type === t));
            need(!missing.length, `missing ${missing.join(", ")}`);
            return `ICNS · ${c.map((x) => x.type).join(" ")} · iconutil chunk types, PNG, sizes match`;
        }),
        ...[["icon_16x16", 16], ["icon_16x16@2x", 32], ["icon_32x32", 32], ["icon_32x32@2x", 64], ["icon_128x128", 128], ["icon_128x128@2x", 256], ["icon_256x256", 256], ["icon_256x256@2x", 512], ["icon_512x512", 512], ["icon_512x512@2x", 1024]].map(([n, s]) => pngFile("macOS", `${ICONS}/desktop/macos/aeris.iconset/${n}.png`, s, false)),
        add("macOS", "Apple icon grid (824 / 1024)", async () => {
            // Measure the opaque tile across the middle row of the 1024 master: ~824 px wide, centred.
            const bmp = await createImageBitmap(await (await fetch(`${ICONS}/desktop/macos/aeris-1024.png`, { cache: "no-store" })).blob());
            const cv = new OffscreenCanvas(1024, 1024);
            const cx = cv.getContext("2d");
            cx.drawImage(bmp, 0, 0);
            const row = cx.getImageData(0, 512, 1024, 1).data;
            let L = -1, R = -1;
            for (let x = 0; x < 1024; x++)
                if (row[x * 4 + 3] > 200) {
                    if (L < 0)
                        L = x;
                    R = x;
                }
            const width = R - L + 1;
            need(Math.abs(width - 824) <= 6, `tile is ${width}px wide, expected ~824`);
            need(Math.abs(L - (1023 - R)) <= 4, `off-centre (${L}px vs ${1023 - R}px margins)`);
            return `tile ${width}px wide, margins ${L} / ${1023 - R} px`;
        }),
        ...[16, 22, 24, 32, 48, 64, 96, 128, 256, 512].map((s) => pngFile("Linux", `${ICONS}/desktop/linux/hicolor/${s}x${s}/apps/aeris.png`, s, false)),
        add("Linux", "hicolor/scalable/apps/aeris.svg", async () => { const r = await fetch(`${ICONS}/desktop/linux/hicolor/scalable/apps/aeris.svg`, { cache: "no-store" }); need(r.status === 200, `HTTP ${r.status}`); const s = svg(await r.text()); need(!s.problems.length, s.problems.join("; ")); return `valid SVG · square viewBox ${s.vb[2]}×${s.vb[3]}`; }),
        add("Linux", "aeris.desktop", async () => {
            const r = await fetch(`${ICONS}/desktop/linux/aeris.desktop`, { cache: "no-store" });
            need(r.status === 200, `HTTP ${r.status}`);
            const txt = await r.text();
            need(txt.startsWith("[Desktop Entry]"), "missing [Desktop Entry] header");
            need(/^Icon=aeris$/m.test(txt), "Icon= is not aeris");
            need(/^Name=/m.test(txt) && /^Exec=/m.test(txt) && /^Type=Application$/m.test(txt), "missing Name / Exec / Type");
            return "valid entry · Icon=aeris → hicolor/*/apps/aeris.png";
        }),
        ...[16, 20, 22, 24, 30, 32, 36, 40, 44, 48, 64, 96, 128, 256, 512, 1024].map((s) => pngFile("Desktop PNGs", `${ICONS}/desktop/png/${s}x${s}.png`, s, false)),
    ]);
    const order = ["Page <head>", "Google Search", "Web kit", "Windows", "macOS", "Linux", "Desktop PNGs"];
    return out.sort((a, b) => order.indexOf(a.group) - order.indexOf(b.group));
}
window.runBrandChecks = runChecks;
