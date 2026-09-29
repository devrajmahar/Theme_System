import type { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/showcase";
import { FormatChecks, SearchPreview } from "@/components/brand-checks";

// Brand assets shown in context. Preview stages use fixed light/dark backdrops (not theme tokens)
// so both variants of every asset are always visible, whatever theme the playground is in.
const ICONS = "/brand-assets/icons";
const LIGHT = "#ffffff";
const DARK = "#1f1f1f";
// Tab-icon rasters: dark logomark for light chrome, white logomark for dark chrome.
const fav = (tone: "light" | "dark") => (tone === "light" ? "favicon" : "favicon-white");
// Pixel-exact source for each screen scale (100 / 125 / 150 / 200 %), so nothing is stretched.
const DPR = [1, 1.25, 1.5, 2];
const favSrc = (tone: "light" | "dark", css: number) => ({ src: `${ICONS}/favicon/${fav(tone)}-${css}.png`, srcSet: DPR.map((d) => `${ICONS}/favicon/${fav(tone)}-${css * d}.png ${d}x`).join(", ") });

function Stage({ tone, className = "", children }: { tone: "light" | "dark"; className?: string; children: ReactNode }) {
  return <div className={`flex items-center justify-center rounded-default border ${className}`} style={{ background: tone === "light" ? LIGHT : DARK, borderColor: tone === "light" ? "#e5e5e5" : "#333333" }}>{children}</div>;
}

function Caption({ children }: { children: ReactNode }) {
  return <p className="mt-2 text-xs text-text-secondary">{children}</p>;
}

function BrowserTab({ tone }: { tone: "light" | "dark" }) {
  const bar = tone === "light" ? "#dee1e6" : "#202124";
  const tab = tone === "light" ? "#ffffff" : "#35363a";
  const text = tone === "light" ? "#1f1f1f" : "#e8eaed";
  return <div className="overflow-hidden rounded-default border" style={{ background: bar, borderColor: tone === "light" ? "#e5e5e5" : "#333333" }}>
    <div className="flex items-end gap-1 px-2 pt-2">
      <div className="flex h-8 w-52 items-center gap-2 rounded-t-lg px-3" style={{ background: tab }}>
        <img {...favSrc(tone, 16)} alt="" width={16} height={16} />
        <span className="truncate text-xs" style={{ color: text }}>Aeris — Theme Studio</span>
      </div>
      <div className="flex h-8 w-40 items-center gap-2 px-3 opacity-60">
        <span className="size-4 rounded-full" style={{ background: tone === "light" ? "#9aa0a6" : "#5f6368" }} />
        <span className="truncate text-xs" style={{ color: text }}>Another tab</span>
      </div>
    </div>
    <div className="h-3" style={{ background: tab }} />
  </div>;
}

const DOWNLOADS: { group: string; files: { name: string; path: string; note: string }[] }[] = [
  { group: "Source", files: [
    { name: "usage.md", path: "/brand-assets/usage.md", note: "Which logo goes where — read first" },
    { name: "logo.svg", path: "/brand-assets/logo.svg", note: "Primary logo" },
    { name: "logomark-dark.svg", path: "/brand-assets/logomark-dark.svg", note: "Mark for light backgrounds" },
    { name: "logomark-white.svg", path: "/brand-assets/logomark-white.svg", note: "Mark for dark backgrounds" },
  ] },
  { group: "Web", files: [
    { name: "favicon.ico", path: `${ICONS}/favicon.ico`, note: "Dark + white arrow · 16–64" },
    { name: "favicon.svg", path: `${ICONS}/favicon.svg`, note: "Dark / white by browser theme" },
    { name: "favicon/favicon-white-32.png", path: `${ICONS}/favicon/favicon-white-32.png`, note: "White mark · 16–128 in favicon/" },
    { name: "apple-touch-icon.png", path: `${ICONS}/apple-touch-icon.png`, note: "Logo · 180 × 180" },
    { name: "icon-192.png", path: `${ICONS}/icon-192.png`, note: "Logo · PWA" },
    { name: "icon-512.png", path: `${ICONS}/icon-512.png`, note: "Logo · PWA" },
    { name: "icon-maskable-512.png", path: `${ICONS}/icon-maskable-512.png`, note: "Logo · PWA maskable" },
    { name: "site.webmanifest", path: `${ICONS}/site.webmanifest`, note: "Manifest" },
  ] },
  { group: "Desktop", files: [
    { name: "windows/aeris.ico", path: `${ICONS}/desktop/windows/aeris.ico`, note: "Logo · Windows · 15 sizes, 16–256" },
    { name: "windows/store/square-150x150-logo.png", path: `${ICONS}/desktop/windows/store/square-150x150-logo.png`, note: "Logo · Store / MSIX tiles · 10 files in store/" },
    { name: "macos/aeris.icns", path: `${ICONS}/desktop/macos/aeris.icns`, note: "Logo · macOS · Apple 824/1024 grid" },
    { name: "macos/aeris-1024.png", path: `${ICONS}/desktop/macos/aeris-1024.png`, note: "Logo · macOS master · aeris.iconset/ alongside" },
    { name: "linux/hicolor/scalable/apps/aeris.svg", path: `${ICONS}/desktop/linux/hicolor/scalable/apps/aeris.svg`, note: "Logo · Linux hicolor · 16–512 + SVG" },
    { name: "png/1024x1024.png", path: `${ICONS}/desktop/png/1024x1024.png`, note: "Logo · generic PNGs 16–1024 in png/" },
  ] },
];

export function BrandPreview() {
  return <div className="grid gap-4">
    <div className="grid gap-4 lg:grid-cols-2">
      <Card><CardHeader><CardTitle>Primary logo</CardTitle><CardDescription>logo.svg — the full app-icon lockup with depth and highlight.</CardDescription></CardHeader><CardContent>
        <div className="grid grid-cols-2 gap-3">
          {(["light", "dark"] as const).map((tone) => <div key={tone}><Stage tone={tone} className="h-40 gap-6">{[32, 54, 96].map((s) => <img key={s} src="/brand-assets/logo.svg" alt="Logo" width={s} height={s} />)}</Stage><Caption>On {tone} · 32 / 54 / 96 px</Caption></div>)}
        </div>
      </CardContent></Card>
      <Card><CardHeader><CardTitle>Logomark</CardTitle><CardDescription>Dark mark on light surfaces, white mark on dark surfaces.</CardDescription></CardHeader><CardContent>
        <div className="grid grid-cols-2 gap-3">
          <div><Stage tone="light" className="h-40 gap-6">{[20, 32, 64].map((s) => <img key={s} src="/brand-assets/logomark-dark.svg" alt="Logomark" height={s} style={{ height: s, width: "auto" }} />)}</Stage><Caption>logomark-dark.svg</Caption></div>
          <div><Stage tone="dark" className="h-40 gap-6">{[20, 32, 64].map((s) => <img key={s} src="/brand-assets/logomark-white.svg" alt="Logomark" height={s} style={{ height: s, width: "auto" }} />)}</Stage><Caption>logomark-white.svg</Caption></div>
        </div>
      </CardContent></Card>
    </div>

    <Card><CardHeader><CardTitle>Favicon</CardTitle><CardDescription>favicon.ico and the PNGs: dark square with a solid white arrow, readable on any background. favicon.svg switches to the white logomark on dark browser chrome.</CardDescription></CardHeader><CardContent className="grid gap-4 lg:grid-cols-[1fr_auto]">
      <div className="grid gap-3"><BrowserTab tone="light" /><BrowserTab tone="dark" /></div>
      <div className="grid grid-cols-2 gap-3">
        {(["light", "dark"] as const).map((tone) => <div key={tone}><Stage tone={tone} className="h-full min-h-32 items-end gap-4 px-5 pb-5">{[16, 32, 48].map((s) => <div key={s} className="flex flex-col items-center gap-2"><img {...favSrc(tone, s)} alt="" width={s} height={s} /><span className="font-mono text-[10px]" style={{ color: tone === "light" ? "#646465" : "#a3a3a3" }}>{s}</span></div>)}</Stage></div>)}
      </div>
    </CardContent></Card>

    <SearchPreview />

    <div className="grid gap-4 lg:grid-cols-2">
      <Card><CardHeader><CardTitle>Home screen</CardTitle><CardDescription>logo.svg — apple-touch-icon.png and icon-maskable-512.png under the masks iOS and Android apply.</CardDescription></CardHeader><CardContent>
        <div className="grid grid-cols-2 gap-3">
          <div><Stage tone="light" className="h-44 gap-5" ><div className="flex flex-col items-center gap-1.5"><img src={`${ICONS}/apple-touch-icon.png`} alt="" width={60} height={60} className="rounded-[22.5%]" /><span className="text-[11px]" style={{ color: "#1f1f1f" }}>Aeris</span></div></Stage><Caption>iOS · rounded by the system</Caption></div>
          <div><Stage tone="dark" className="h-44 gap-4">{["rounded-full", "rounded-[30%]", "rounded-[12%]"].map((mask) => <img key={mask} src={`${ICONS}/icon-maskable-512.png`} alt="" width={48} height={48} className={mask} />)}</Stage><Caption>Android · circle, squircle, rounded square</Caption></div>
        </div>
      </CardContent></Card>
      <Card><CardHeader><CardTitle>Desktop</CardTitle><CardDescription>logo.svg — macOS icon (Apple 824/1024 grid) in the Dock, Windows aeris.ico in the taskbar.</CardDescription></CardHeader><CardContent>
        <div className="grid gap-3">
          <Stage tone="light" className="h-20" ><div className="flex items-end gap-3 rounded-2xl border px-3 py-2" style={{ background: "rgba(245,245,245,0.9)", borderColor: "#e5e5e5" }}>{[0, 1].map((i) => <span key={i} className="size-11 rounded-[22%]" style={{ background: "#d4d4d4" }} />)}<div className="flex flex-col items-center"><img src={`${ICONS}/desktop/macos/aeris.iconset/icon_32x32@2x.png`} srcSet={`${ICONS}/desktop/macos/aeris.iconset/icon_32x32@2x.png 1x, ${ICONS}/desktop/macos/aeris.iconset/icon_128x128.png 2x`} alt="" width={44} height={44} /><span className="mt-1 size-1 rounded-full" style={{ background: "#404040" }} /></div>{[0].map((i) => <span key={i} className="size-11 rounded-[22%]" style={{ background: "#d4d4d4" }} />)}</div></Stage>
          <Stage tone="dark" className="h-20 items-end p-0"><div className="flex h-12 w-full items-center justify-center gap-1" style={{ background: "#2b2b2b" }}>{[0, 1].map((i) => <span key={i} className="grid size-10 place-items-center"><span className="size-6 rounded" style={{ background: "#525252" }} /></span>)}<span className="grid size-10 place-items-center rounded" style={{ background: "#3a3a3a" }}><img src={`${ICONS}/desktop/png/24x24.png`} srcSet={`${ICONS}/desktop/png/24x24.png 1x, ${ICONS}/desktop/png/30x30.png 1.25x, ${ICONS}/desktop/png/36x36.png 1.5x, ${ICONS}/desktop/png/48x48.png 2x`} alt="" width={24} height={24} /></span><span className="grid size-10 place-items-center"><span className="size-6 rounded" style={{ background: "#525252" }} /></span></div></Stage>
        </div>
      </CardContent></Card>
    </div>

    <FormatChecks />

    <Card><CardHeader><CardTitle>Downloads</CardTitle><CardDescription>Every generated file, ready to drop into a website or desktop app.</CardDescription></CardHeader><CardContent className="grid gap-4 md:grid-cols-3">
      {DOWNLOADS.map(({ group, files }) => <div key={group}><p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">{group}</p><ul className="divide-y rounded-default border">{files.map((f) => <li key={f.path}><a href={f.path} download className="flex flex-col gap-0.5 px-3 py-2 hover:bg-hover-bg active:bg-active-bg"><span className="break-all font-mono text-xs">{f.name}</span><span className="text-xs text-text-secondary">{f.note}</span></a></li>)}</ul></div>)}
    </CardContent></Card>
  </div>;
}
