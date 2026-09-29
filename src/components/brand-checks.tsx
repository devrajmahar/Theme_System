"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/showcase";

const ICONS = "/brand-assets/icons";

// ─── Search-engine previews ─────────────────────────────────────────────────────────────────────
// Approximations of each engine's current result layout in light and dark, drawn with each engine's
// own colours (fixed, not theme tokens). The icon is the file engines read from <link rel="icon">,
// cropped to the engine's container. The mark's arrow is a hole, so `backing` is what shows through it.
const FAVICON = `${ICONS}/favicon/favicon-96.png`; // same art as favicon.ico / favicon.svg (light)
const OLD = "/brand-assets/Logo.svg";
type Tone = "light" | "dark";

const ENGINES = {
  google: {
    light: { bg: "#ffffff", border: "#ecedef", name: "#202124", url: "#4d5156", title: "#1a0dab", text: "#4d5156", ring: "#dadce0", backing: "#ffffff" },
    dark: { bg: "#1f1f1f", border: "#303134", name: "#dadce0", url: "#bdc1c6", title: "#99c3ff", text: "#bdc1c6", ring: "#3c4043", backing: "#ffffff" },
  },
  bing: {
    light: { bg: "#ffffff", border: "#ecedef", name: "#111111", url: "#006621", title: "#4007a2", text: "#444444", ring: "#e5e5e5", backing: "#ffffff" },
    dark: { bg: "#161616", border: "#303030", name: "#e6e6e6", url: "#9ac78a", title: "#b58cff", text: "#bdbdbd", ring: "#3a3a3a", backing: "#ffffff" },
  },
  duck: {
    light: { bg: "#ffffff", border: "#ecedef", name: "#333333", url: "#666666", title: "#1a0dab", text: "#505050", ring: "#e5e5e5", backing: "#ffffff" },
    dark: { bg: "#1c1c1c", border: "#333333", name: "#d0d0d0", url: "#a0a0a0", title: "#8ab4f8", text: "#b0b0b0", ring: "#333333", backing: "#ffffff" },
  },
} as const;

// Circle-cropped favicon (Google, Bing). The icon fills the circle; `backing` shows through the arrow.
function CircleIcon({ icon, size, ring, backing }: { icon: string; size: number; ring: string; backing: string }) {
  return <span className="shrink-0 overflow-hidden rounded-full border" style={{ width: size, height: size, borderColor: ring, background: backing }}><img src={icon} alt="" className="size-full object-cover" /></span>;
}

function Result({ engine, tone, icon = FAVICON, compact, backing }: { engine: keyof typeof ENGINES; tone: Tone; icon?: string; compact?: boolean; backing?: string }) {
  const c = ENGINES[engine][tone], back = backing ?? c.backing;
  const font = engine === "bing" ? "Segoe UI, Arial, sans-serif" : engine === "duck" ? "-apple-system, Segoe UI, Arial, sans-serif" : "Arial, sans-serif";
  return <div className={`border p-3 sm:p-4 ${compact ? "rounded-medium" : "rounded-default"}`} style={{ background: c.bg, borderColor: c.border, fontFamily: font }}>
    <div className="flex items-center gap-2.5">
      {engine === "duck"
        ? <img src={icon} alt="" width={20} height={20} className="shrink-0" /> /* DuckDuckGo draws the favicon as-is: no container, no backing */
        : <CircleIcon icon={icon} size={engine === "google" ? (compact ? 28 : 26) : 28} ring={c.ring} backing={back} />}
      <div className="min-w-0 leading-tight">{engine !== "duck" && <p className="truncate text-sm" style={{ color: c.name }}>Aeris</p>}<p className="truncate text-xs" style={{ color: c.url }}>{engine === "google" && !compact ? "https://yourdomain.com" : "yourdomain.com"}</p></div>
    </div>
    <p className={`mt-2 leading-snug ${compact ? "text-base" : "text-lg"}`} style={{ color: c.title }}>Aeris — Theme Studio</p>
    {!compact && <p className="mt-1 text-sm leading-snug" style={{ color: c.text }}>Live hex theme editor and shadcn component preview.</p>}
  </div>;
}

function Labeled({ label, bad, children }: { label: string; bad?: boolean; children: ReactNode }) {
  return <div>{children}<p className="mt-2 text-xs" style={{ color: bad ? "var(--text-danger)" : "var(--text-secondary)" }}>{label}</p></div>;
}

export function SearchPreview() {
  return <Card><CardHeader><CardTitle>Search results</CardTitle><CardDescription>Search engines show the icon from the page&apos;s &lt;link rel=&quot;icon&quot;&gt; (favicon.svg / favicon.ico here: dark square, solid white arrow) in light and dark themes. Layouts approximate each engine&apos;s current design.</CardDescription></CardHeader><CardContent className="grid gap-5">
    {([["google", "Google · desktop"], ["bing", "Bing"], ["duck", "DuckDuckGo"]] as const).map(([engine, name]) => <div key={engine} className="grid gap-3 lg:grid-cols-2">
      <Labeled label={`${name} · light`}><Result engine={engine} tone="light" /></Labeled>
      <Labeled label={`${name} · dark`}><Result engine={engine} tone="dark" /></Labeled>
    </div>)}
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Labeled label="Google · mobile · light"><Result engine="google" tone="light" compact /></Labeled>
      <Labeled label="Google · mobile · dark"><Result engine="google" tone="dark" compact /></Labeled>
      <Labeled label="Dark · no icon backing at all: arrow still reads"><Result engine="google" tone="dark" compact backing="transparent" /></Labeled>
      <Labeled label="Logo.svg (old) · padding and shadow get sliced" bad><Result engine="google" tone="light" compact icon={OLD} /></Labeled>
    </div>
  </CardContent></Card>;
}

// ─── Format checks ──────────────────────────────────────────────────────────────────────────────
// Fetches every icon the site serves and parses the real bytes: PNG headers, ICO directories,
// ICNS chunks, SVG markup, the manifest and the page's <head> links. Nothing here is hard-coded "pass".
type Check = { group: string; name: string; ok: boolean; detail: string };

const get = async (url: string) => { const r = await fetch(url, { cache: "no-store" }); return { status: r.status, buf: new Uint8Array(await r.arrayBuffer()) }; };
const u32be = (b: Uint8Array, o: number) => ((b[o] << 24) >>> 0) + (b[o + 1] << 16) + (b[o + 2] << 8) + b[o + 3];
const u32le = (b: Uint8Array, o: number) => b[o] + (b[o + 1] << 8) + (b[o + 2] << 16) + ((b[o + 3] << 24) >>> 0);
const u16le = (b: Uint8Array, o: number) => b[o] + (b[o + 1] << 8);
const ascii = (b: Uint8Array, o: number, n: number) => String.fromCharCode(...b.slice(o, o + n));
const isPng = (b: Uint8Array, o = 0) => b[o] === 0x89 && ascii(b, o + 1, 3) === "PNG";
const COLOR = { 0: "grey", 2: "RGB (opaque)", 3: "palette", 4: "grey+alpha", 6: "RGBA" } as Record<number, string>;
const png = (b: Uint8Array, o = 0) => ({ w: u32be(b, o + 16), h: u32be(b, o + 20), color: b[o + 25], alpha: b[o + 25] === 4 || b[o + 25] === 6 });
function ico(b: Uint8Array) {
  if (u16le(b, 0) !== 0 || u16le(b, 2) !== 1) throw new Error("not an ICO header");
  return Array.from({ length: u16le(b, 4) }, (_, i) => {
    const o = 6 + 16 * i, dirW = b[o] || 256, dirH = b[o + 1] || 256, off = u32le(b, o + 12);
    // Entry is either PNG or a BITMAPINFOHEADER DIB (height is doubled to include the AND mask).
    const img = isPng(b, off) ? { kind: "PNG", ...png(b, off) } : u32le(b, off) === 40 ? { kind: "BMP", w: u32le(b, off + 4), h: u32le(b, off + 8) / 2, bits: u16le(b, off + 14) } : null;
    return { dirW, dirH, bpp: u16le(b, o + 6), kind: img?.kind ?? "?", ok: !!img && img.w === dirW && img.h === dirH && dirW === dirH && (img.kind === "PNG" || ("bits" in img && img.bits === 32)) };
  });
}
const ICNS_SIZE: Record<string, number> = { ic07: 128, ic08: 256, ic09: 512, ic10: 1024, ic11: 32, ic12: 64, ic13: 256, ic14: 512 };
function icns(b: Uint8Array) {
  if (ascii(b, 0, 4) !== "icns") throw new Error("missing icns magic");
  if (u32be(b, 4) !== b.length) throw new Error(`length field ${u32be(b, 4)} ≠ file size ${b.length}`);
  const chunks: { type: string; ok: boolean; px: number }[] = [];
  for (let o = 8; o < b.length; o += u32be(b, o + 4)) {
    const type = ascii(b, o, 4), p = isPng(b, o + 8) ? png(b, o + 8) : null;
    chunks.push({ type, px: p?.w ?? 0, ok: !!p && ICNS_SIZE[type] === p.w && p.w === p.h });
  }
  return chunks;
}
function svg(text: string) {
  const doc = new DOMParser().parseFromString(text, "image/svg+xml");
  if (doc.querySelector("parsererror")) throw new Error("XML parse error");
  const root = doc.documentElement, vb = (root.getAttribute("viewBox") ?? "").split(/[\s,]+/).map(Number);
  const problems = [
    root.tagName !== "svg" && "root is not <svg>",
    !(vb.length === 4 && vb[2] === vb[3]) && "viewBox is not square",
    doc.querySelector("script") && "contains <script>",
    doc.querySelector("image, foreignObject") && "embeds <image>/<foreignObject>",
    /(href|src)="https?:/.test(text) && "references external URLs",
  ].filter(Boolean) as string[];
  return { vb, problems };
}

async function runChecks(): Promise<Check[]> {
  const out: Check[] = [];
  const timeout = (ms: number) => new Promise<never>((_, reject) => setTimeout(() => reject(new Error(`timed out after ${ms / 1000}s`)), ms));
  const add = (group: string, name: string, fn: () => Promise<string>) => Promise.race([fn(), timeout(15000)]).then((detail) => out.push({ group, name, ok: true, detail }), (e: Error) => out.push({ group, name, ok: false, detail: e.message }));
  const need = (cond: unknown, msg: string) => { if (!cond) throw new Error(msg); };
  const pngFile = (group: string, url: string, size: number, opaque: boolean) => add(group, url.replace(/\?.*/, "").replace(/^.*\/icons\/(desktop\/(windows|macos|linux|png)\/)?/, ""), async () => {
    const { status, buf } = await get(url); need(status === 200, `HTTP ${status}`); need(isPng(buf), "not a PNG");
    const p = png(buf); need(p.w === size && p.h === size, `${p.w}×${p.h}, expected ${size}×${size}`);
    if (opaque) need(!p.alpha, `has an alpha channel (${COLOR[p.color]}); iOS/Android masks need opaque`);
    return `PNG ${p.w}×${p.h} · ${COLOR[p.color]}`;
  });
  const icoFile = (group: string, url: string, sizes: number[]) => add(group, url.replace(/\?.*/, "").split("/").pop()!, async () => {
    const { status, buf } = await get(url); need(status === 200, `HTTP ${status}`);
    const e = ico(buf), bad = e.filter((x) => !x.ok), have = e.map((x) => x.dirW);
    need(!bad.length, `entry ${bad.map((x) => x.dirW).join(", ")} doesn't match its image`);
    const missing = sizes.filter((s) => !have.includes(s)); need(!missing.length, `missing ${missing.join(", ")}`);
    need(e.every((x) => x.bpp === 32), "not all entries are 32-bit");
    need(e.every((x) => x.kind === (x.dirW >= 256 ? "PNG" : "BMP")), "use BMP below 256 px and PNG at 256 for widest compatibility");
    return `ICO · ${have.join(", ")} px · 32-bit BMP${have.includes(256) ? " + PNG at 256" : ""}, square`;
  });

  // Page <head> — what browsers and search engines actually read
  const links = [...document.head.querySelectorAll<HTMLLinkElement>("link[rel~='icon'], link[rel='apple-touch-icon']")];
  const iconLinks = links.filter((l) => l.rel.split(" ").includes("icon"));
  const svgLink = iconLinks.find((l) => l.type === "image/svg+xml"), icoLink = iconLinks.find((l) => l.type === "image/x-icon"), appleLink = links.find((l) => l.rel === "apple-touch-icon");
  await Promise.all([
    add("Page <head>", "<link rel=\"icon\">", async () => { need(iconLinks.length, "no icon link in <head>"); return iconLinks.map((l) => `${l.type} ${l.sizes.value}`).join(" · "); }),
    add("Page <head>", "<link rel=\"apple-touch-icon\">", async () => { need(appleLink, "missing"); return `${appleLink!.sizes.value}`; }),
    icoLink ? icoFile("Page <head>", icoLink.href, [16, 32, 48]) : add("Page <head>", "favicon.ico link", async () => { throw new Error("missing"); }),
    add("Page <head>", "icon.svg", async () => {
      need(svgLink, "missing"); const r = await fetch(svgLink!.href, { cache: "no-store" }); need(r.status === 200, `HTTP ${r.status}`);
      const s = svg(await r.text()); need(!s.problems.length, s.problems.join("; "));
      return `valid SVG · square viewBox ${s.vb[2]}×${s.vb[3]} · no scripts or external refs`;
    }),
    appleLink ? pngFile("Page <head>", appleLink.href, 180, true) : Promise.resolve(),
  ]);

  // Google Search favicon rules (developers.google.com/search/docs/appearance/favicon-in-search)
  await Promise.all([
    add("Google Search", "Crawlable at /favicon.ico", async () => { const { status } = await get("/favicon.ico"); need(status === 200, `HTTP ${status}`); return "HTTP 200 at the site root"; }),
    add("Google Search", "Declared in <head>", async () => { need(iconLinks.length, "no <link rel=\"icon\">"); return `${iconLinks.length} icon link(s)`; }),
    add("Google Search", "Square, multiple of 48 px", async () => {
      const { buf } = await get("/favicon.ico"); const sizes = ico(buf).map((x) => x.dirW).filter((s) => s % 48 === 0);
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
      const m = JSON.parse(new TextDecoder().decode((await get(manifestUrl)).buf)) as { name?: string; icons: { src: string; sizes: string; purpose?: string }[] };
      need(m.name, "no name"); need(m.icons?.length, "no icons"); need(m.icons.some((i) => i.purpose === "maskable"), "no maskable icon");
      for (const i of m.icons) { const { status, buf } = await get(i.src); need(status === 200, `${i.src}: HTTP ${status}`); const p = png(buf); need(`${p.w}x${p.h}` === i.sizes, `${i.src} is ${p.w}×${p.h}, manifest says ${i.sizes}`); }
      return `valid JSON · name "${m.name}" · ${m.icons.length} icons, sizes match files · maskable present`;
    }),
    icoFile("Windows", `${ICONS}/desktop/windows/aeris.ico`, [16, 20, 24, 30, 32, 36, 40, 48, 60, 64, 72, 80, 96, 128, 256]),
    ...([["Square30x30Logo", 30], ["Square44x44Logo", 44], ["Square71x71Logo", 71], ["Square89x89Logo", 89], ["Square107x107Logo", 107], ["Square142x142Logo", 142], ["Square150x150Logo", 150], ["Square284x284Logo", 284], ["Square310x310Logo", 310], ["StoreLogo", 50]] as const).map(([n, s]) => pngFile("Windows", `${ICONS}/desktop/windows/store/${n}.png`, s, false)),
    add("macOS", "aeris.icns", async () => {
      const { buf } = await get(`${ICONS}/desktop/macos/aeris.icns`); const c = icns(buf), bad = c.filter((x) => !x.ok);
      need(!bad.length, `bad chunk ${bad.map((x) => `${x.type} (${x.px}px)`).join(", ")}`);
      const missing = Object.keys(ICNS_SIZE).filter((t) => !c.some((x) => x.type === t)); need(!missing.length, `missing ${missing.join(", ")}`);
      return `ICNS · ${c.map((x) => x.type).join(" ")} · iconutil chunk types, PNG, sizes match`;
    }),
    ...([["icon_16x16", 16], ["icon_16x16@2x", 32], ["icon_32x32", 32], ["icon_32x32@2x", 64], ["icon_128x128", 128], ["icon_128x128@2x", 256], ["icon_256x256", 256], ["icon_256x256@2x", 512], ["icon_512x512", 512], ["icon_512x512@2x", 1024]] as const).map(([n, s]) => pngFile("macOS", `${ICONS}/desktop/macos/AppIcon.iconset/${n}.png`, s, false)),
    add("macOS", "Apple icon grid (824 / 1024)", async () => {
      // Measure the opaque tile across the middle row of the 1024 master: ~824 px wide, centred.
      const bmp = await createImageBitmap(await (await fetch(`${ICONS}/desktop/macos/aeris-1024.png`, { cache: "no-store" })).blob());
      const cv = new OffscreenCanvas(1024, 1024); const cx = cv.getContext("2d")!; cx.drawImage(bmp, 0, 0);
      const row = cx.getImageData(0, 512, 1024, 1).data; let L = -1, R = -1;
      for (let x = 0; x < 1024; x++) if (row[x * 4 + 3] > 200) { if (L < 0) L = x; R = x; }
      const width = R - L + 1; need(Math.abs(width - 824) <= 6, `tile is ${width}px wide, expected ~824`); need(Math.abs(L - (1023 - R)) <= 4, `off-centre (${L}px vs ${1023 - R}px margins)`);
      return `tile ${width}px wide, margins ${L} / ${1023 - R} px`;
    }),
    ...[16, 22, 24, 32, 48, 64, 96, 128, 256, 512].map((s) => pngFile("Linux", `${ICONS}/desktop/linux/hicolor/${s}x${s}/apps/aeris.png`, s, false)),
    add("Linux", "hicolor/scalable/apps/aeris.svg", async () => { const r = await fetch(`${ICONS}/desktop/linux/hicolor/scalable/apps/aeris.svg`, { cache: "no-store" }); need(r.status === 200, `HTTP ${r.status}`); const s = svg(await r.text()); need(!s.problems.length, s.problems.join("; ")); return `valid SVG · square viewBox ${s.vb[2]}×${s.vb[3]}`; }),
    add("Linux", "aeris.desktop", async () => {
      const r = await fetch(`${ICONS}/desktop/linux/aeris.desktop`, { cache: "no-store" }); need(r.status === 200, `HTTP ${r.status}`); const txt = await r.text();
      need(txt.startsWith("[Desktop Entry]"), "missing [Desktop Entry] header"); need(/^Icon=aeris$/m.test(txt), "Icon= is not aeris"); need(/^Name=/m.test(txt) && /^Exec=/m.test(txt) && /^Type=Application$/m.test(txt), "missing Name / Exec / Type");
      return "valid entry · Icon=aeris → hicolor/*/apps/aeris.png";
    }),
    ...[16, 20, 22, 24, 30, 32, 36, 40, 44, 48, 64, 96, 128, 256, 512, 1024].map((s) => pngFile("Desktop PNGs", `${ICONS}/desktop/png/${s}x${s}.png`, s, false)),
  ]);
  const order = ["Page <head>", "Google Search", "Web kit", "Windows", "macOS", "Linux", "Desktop PNGs"];
  return out.sort((a, b) => order.indexOf(a.group) - order.indexOf(b.group));
}

function Status({ ok }: { ok: boolean }): ReactNode {
  return <span className={`inline-grid size-4 shrink-0 place-items-center rounded-full text-[10px] font-bold text-white ${ok ? "bg-positive" : "bg-danger"}`} aria-label={ok ? "pass" : "fail"}>{ok ? "✓" : "✕"}</span>;
}

export function FormatChecks() {
  const [checks, setChecks] = useState<Check[] | null>(null);
  const [run, setRun] = useState(0);
  useEffect(() => { let live = true; runChecks().then((c) => live && setChecks(c)); return () => { live = false; }; }, [run]);
  const failed = checks?.filter((c) => !c.ok).length ?? 0;
  const groups = checks ? [...new Set(checks.map((c) => c.group))] : [];
  return <Card><CardHeader><div className="flex items-start justify-between gap-3"><div><CardTitle>Format checks</CardTitle><CardDescription className="mt-1.5">Fetches every icon this site serves and parses the actual bytes: dimensions, transparency, ICO / ICNS internals, SVG safety, manifest, &lt;head&gt; links and Google&apos;s favicon rules.</CardDescription></div>
    <button type="button" onClick={() => { setChecks(null); setRun((n) => n + 1); }} className="h-7 shrink-0 rounded-button border px-2.5 text-sm font-medium text-text-default hover:border-transparent hover:bg-hover-bg active:bg-active-bg">Re-run</button></div></CardHeader>
    <CardContent>
      {!checks ? <p className="text-sm text-text-secondary">Checking…</p> : <>
        <p className={`mb-4 text-sm font-medium ${failed ? "text-text-danger" : "text-text-positive"}`}>{failed ? `${failed} of ${checks.length} checks failed` : `All ${checks.length} checks passed`}</p>
        <div className="grid gap-4 lg:grid-cols-2">{groups.map((g) => <div key={g}><p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">{g}</p>
          <ul className="divide-y rounded-default border">{checks.filter((c) => c.group === g).map((c) => <li key={c.name} className="flex gap-2.5 px-3 py-2"><Status ok={c.ok} /><div className="min-w-0"><p className="break-all font-mono text-xs">{c.name}</p><p className={`text-xs ${c.ok ? "text-text-secondary" : "text-text-danger"}`}>{c.detail}</p></div></li>)}</ul></div>)}
        </div>
      </>}
    </CardContent></Card>;
}
