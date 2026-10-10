"use client";

import { useEffect, useState, type ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, AlertCircleIcon, ArrowRight01Icon, Calendar03Icon, CheckmarkCircle02Icon, CreditCardIcon, Delete02Icon, Folder01Icon, Home01Icon, Mail01Icon, Notification03Icon, Search01Icon, Settings01Icon, Tick02Icon, UserIcon } from "@hugeicons/core-free-icons";
import { BellIcon, CalendarIcon, ChatRoundDotsIcon, FolderIcon, HomeIcon, LetterIcon, MagnifierIcon, SettingsIcon, UserIcon as SolarUserIcon } from "@solar-icons/react/bold";
import { ThemeToggle } from "@/components/theme-toggle";
import { PalettePlayground } from "@/components/palette-playground";
import { BrandPreview } from "@/components/brand-preview";
import { OrderBookCard } from "@/components/order-book";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, FieldError, Input, Label } from "@/components/ui/showcase";
import { TOKEN_GROUPS } from "@/lib/theme-tokens";

const navItems = [["Overview", Home01Icon], ["Projects", Folder01Icon], ["Messages", Mail01Icon], ["Calendar", Calendar03Icon], ["Settings", Settings01Icon]] as const;
const iconExamples = [["Home", Home01Icon], ["Search", Search01Icon], ["Projects", Folder01Icon], ["Messages", Mail01Icon], ["Calendar", Calendar03Icon], ["Alerts", Notification03Icon], ["Profile", UserIcon], ["Settings", Settings01Icon]] as const;
const solarIconExamples = [["Home", HomeIcon], ["Search", MagnifierIcon], ["Projects", FolderIcon], ["Messages", ChatRoundDotsIcon], ["Mail", LetterIcon], ["Calendar", CalendarIcon], ["Alerts", BellIcon], ["Profile", SolarUserIcon], ["Settings", SettingsIcon]] as const;

export default function Home() {
  const [activeNav, setActiveNav] = useState("Overview");
  const [tab, setTab] = useState("Components");
  return <div className="min-h-screen bg-surface text-text-primary">
    {/* Announcement banners: --negative-subtle fill, --text-negative text. Sits above the sticky header and scrolls away. */}
    <div role="status" className="flex min-h-9 items-center justify-center gap-2 bg-negative-subtle px-4 py-2 text-center text-[13px] font-medium leading-4 text-text-negative"><HugeiconsIcon icon={AlertCircleIcon} size={14} className="shrink-0" /><span>Scheduled maintenance on Sunday, 02:00–04:00 UTC — trading may be briefly unavailable.</span></div>
    {/* Positive counterpart: --positive-subtle fill, --text-positive text. */}
    <div role="status" className="flex min-h-9 items-center justify-center gap-2 bg-positive-subtle px-4 py-2 text-center text-[13px] font-medium leading-4 text-text-positive"><HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} className="shrink-0" /><span>All systems operational — deposits and withdrawals are processing normally.</span></div>
    <header className="sticky top-0 z-40 border-b bg-surface"><div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-4 sm:px-6"><div className="flex items-center gap-3"><img src="/brand-assets/logomark-dark.svg" alt="" className="h-7 w-auto dark:hidden" /><img src="/brand-assets/logomark-white.svg" alt="" className="hidden h-7 w-auto dark:block" /><span className="text-sm font-semibold">Theme Studio</span><Badge variant="secondary" className="hidden sm:inline-flex">shadcn/ui</Badge></div><div className="flex items-center gap-2"><a href="#editor" className="hidden text-sm text-text-secondary hover:text-text-primary sm:block">Edit CSS</a><ThemeToggle /></div></div></header>
    <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-10">
      <section className="section-enter mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div className="max-w-2xl"><Badge variant="outline">Clean state tokens</Badge><h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Test your theme on real UI.</h1><p className="mt-3 text-base leading-7 text-text-secondary">A focused theme playground with concise, purposeful tokens. Edit surfaces, type, states, icons, actions, and radius without shadcn implementation noise.</p></div><div className="flex gap-2"><Button variant="outline" onClick={() => document.querySelector("#editor")?.scrollIntoView()}><HugeiconsIcon icon={Search01Icon} size={17} /> Inspect tokens</Button><Button variant="secondary" onClick={() => document.querySelector("#editor")?.scrollIntoView()}><HugeiconsIcon icon={Add01Icon} size={17} /> Customize</Button></div></section>
      <div role="tablist" className="ui-tabs mb-6 flex h-7 w-fit max-w-full gap-0.5 overflow-x-auto rounded-large p-0.5">{["Components","Primary","States & Icons","Dashboard","Tokens","Brand"].map((item) => <button key={item} role="tab" aria-selected={tab === item} onClick={() => setTab(item)} className="ui-tab h-6 whitespace-nowrap rounded-large px-2 text-xs font-medium leading-[14px] outline-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-solid focus-visible:outline-ring-primary">{item}</button>)}</div>
      {/* The Dashboard tab is a full app window (like Conduit): --surface-secondary is the outermost layer, not a ring inside --surface. */}
      <section className={`section-enter mb-10 rounded-medium border ${tab === "Dashboard" ? "overflow-hidden bg-surface-secondary" : "editor-grid bg-surface p-3 sm:p-5"}`} style={{ animationDelay: "80ms" }}>{tab === "Components" && <ComponentsPreview />}{tab === "Primary" && <PrimaryPreview />}{tab === "States & Icons" && <StatesAndIconsPreview />}{tab === "Dashboard" && <DashboardPreview activeNav={activeNav} setActiveNav={setActiveNav} />}{tab === "Tokens" && <TokenPreview />}{tab === "Brand" && <BrandPreview />}</section>
      <PalettePlayground />
    </main>
    <footer className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-8 text-xs text-text-secondary"><span>Theme Studio · live local preview</span><span>Light + dark · responsive</span></footer>
  </div>;
}

function ComponentsPreview() { return <div className="grid gap-4 lg:grid-cols-2">
  <div className="grid content-start gap-4"><SignUpCard /><DangerActionsCard /><AlertsCard /></div>
  <div className="grid gap-4"><Card><CardHeader className="pb-4"><CardTitle className="text-base">Button variants</CardTitle><CardDescription>Hover, focus, active, and disabled states.</CardDescription></CardHeader><CardContent className="flex flex-wrap gap-2"><Button>Default</Button><Button variant="secondary">Secondary</Button><Button variant="outline">Outline</Button><Button variant="ghost">Ghost</Button><Button variant="destructive"><HugeiconsIcon icon={Delete02Icon} size={16} /> Delete</Button><Button disabled>Disabled</Button></CardContent></Card><TradeButtonsCard /><OrderBookCard /><Card><CardHeader className="pb-4"><CardTitle className="text-base">Badges & status</CardTitle></CardHeader><CardContent className="flex flex-wrap gap-2"><Badge>Default</Badge><Badge variant="secondary">In review</Badge><Badge variant="outline">Draft</Badge><Badge variant="destructive">Failed</Badge><span className="inline-flex items-center gap-1.5 text-sm text-text-secondary"><span className="size-2 rounded-large bg-primary" /> Operational</span></CardContent></Card></div>
  <ElevationCard />
  </div>; }

const primaryStates = [
  { label: "Default", fill: "primary", text: "primary-foreground" },
  { label: "Hover", fill: "primary-hover", text: "primary-foreground" },
  { label: "Active", fill: "primary-active", text: "primary-foreground" },
  { label: "Disabled", fill: "primary-disabled", text: "primary-disabled-foreground" },
] as const;
const primaryTokens = ["primary", "primary-hover", "primary-active", "primary-disabled", "primary-disabled-foreground", "primary-subtle", "primary-foreground", "ring-primary"];

function PrimaryPreview() {
  const values = useTokenValues(primaryTokens);
  return <div className="grid gap-4">
    <Card><CardHeader><CardTitle>Primary action states</CardTitle><CardDescription>Every fill is held in its state so you can compare them at once. The last button is genuinely disabled.</CardDescription></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{primaryStates.map(({ label, fill, text }) => <div key={label} className="rounded-default border bg-surface-secondary p-3"><button type="button" disabled={label === "Disabled"} className="flex h-9 w-full items-center justify-center rounded-compact border border-transparent text-sm font-medium" style={{ backgroundColor: `var(--${fill})`, color: `var(--${text})` }}>{label}</button><p className="mt-3 text-xs font-medium">{label}</p><p className="mt-1 break-all font-mono text-[10px] text-text-secondary">--{fill}</p></div>)}</CardContent></Card>
    <div className="grid gap-4 lg:grid-cols-2"><Card><CardHeader><CardTitle>Primary as text</CardTitle><CardDescription>The same colors used on type over the current surface.</CardDescription></CardHeader><CardContent className="grid gap-3">{["primary", "primary-hover", "primary-active", "primary-disabled-foreground"].map((token) => <div key={token} className="flex flex-wrap items-baseline justify-between gap-2 rounded-default border bg-surface-secondary px-3 py-2"><span className="text-base font-semibold" style={{ color: `var(--${token})` }}>The quick brown fox</span><code className="text-[10px] text-text-secondary">--{token}</code></div>)}</CardContent></Card><Card><CardHeader><CardTitle>Supporting states</CardTitle><CardDescription>Subtle fill, foreground contrast, focus ring, and an interactive button.</CardDescription></CardHeader><CardContent className="grid gap-3"><div className="rounded-default border p-3" style={{ background: "var(--primary-subtle)" }}><p className="text-sm font-medium">Subtle surface</p><code className="text-[10px] text-text-secondary">--primary-subtle</code></div><div className="flex flex-wrap items-center gap-3"><span className="rounded-default px-3 py-2 text-sm font-medium" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>Foreground on primary</span><span className="rounded-default border bg-surface px-3 py-2 text-sm font-medium outline-2 outline-solid outline-ring-primary">Focus ring</span></div><Button variant="secondary" className="w-fit">Hover, press, or focus me</Button></CardContent></Card></div>
    <Card><CardHeader><CardTitle>Primary tokens</CardTitle><CardDescription>These values follow the light or dark theme and changes in the live CSS editor.</CardDescription></CardHeader><CardContent className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{primaryTokens.map((token) => <div key={token} className="flex min-w-0 items-center gap-2 rounded-default border bg-surface-secondary p-2"><span className="size-7 shrink-0 rounded-small border" style={{ background: `var(--${token})` }} /><div className="min-w-0"><p className="truncate font-mono text-[11px]" title={`--${token}`}>--{token}</p><p className="truncate font-mono text-[10px] text-text-secondary" title={values[token]}>{values[token] || "\u00a0"}</p></div></div>)}</CardContent></Card>
  </div>;
}

// Status messages pair each subtle fill with its text token; tags add the indigo / purple accents.
const alerts = [
  ["Withdrawal completed", "0.25 BTC was sent to your external wallet.", "bg-positive-subtle text-text-positive", CheckmarkCircle02Icon],
  ["Margin level is low", "Add funds or reduce positions to avoid liquidation.", "bg-warning-subtle text-text-warning", AlertCircleIcon],
  ["Order rejected", "Insufficient balance to place this order.", "bg-negative-subtle text-text-negative", AlertCircleIcon],
] as const;
const tags = [
  ["Filled", "bg-positive-subtle text-text-positive", "bg-positive"],
  ["Pending", "bg-warning-subtle text-text-warning", "bg-warning"],
  ["Cancelled", "bg-negative-subtle text-text-negative", "bg-negative"],
  ["New listing", "bg-indigo-subtle text-indigo", "bg-indigo"],
  ["Beta", "bg-purple-subtle text-purple", "bg-purple"],
] as const;

function AlertsCard() {
  return <Card><CardHeader className="pb-4"><CardTitle className="text-base">Alerts & tags</CardTitle><CardDescription>Positive, warning, negative, indigo, and purple, each with its <code>-subtle</code> fill.</CardDescription></CardHeader><CardContent className="grid gap-4">
    <div className="grid gap-2">{alerts.map(([title, body, className, icon]) => <div key={title} role="status" className={`flex items-start gap-2.5 rounded-default px-3 py-2.5 ${className}`}><HugeiconsIcon icon={icon} size={16} className="mt-0.5 shrink-0" /><div><p className="text-sm font-medium leading-5">{title}</p><p className="text-xs leading-5 opacity-90">{body}</p></div></div>)}</div>
    <div><p className="mb-2 text-xs font-medium text-text-secondary">Tags</p><div className="flex flex-wrap gap-2">{tags.map(([label, className]) => <span key={label} className={`inline-flex h-5 items-center rounded-large px-2 text-xs font-medium leading-[14px] ${className}`}>{label}</span>)}</div></div>
    <div><p className="mb-2 text-xs font-medium text-text-secondary">Status dots</p><div className="flex flex-wrap gap-4">{tags.map(([label, , dot]) => <span key={label} className="inline-flex items-center gap-1.5 text-sm text-text-secondary"><span className={`size-2 rounded-large ${dot}`} />{label}</span>)}</div></div>
  </CardContent></Card>;
}

// Elevation, overlay and inverse surfaces, plus the border colours that only show up on controls and dividers.
function ElevationCard() {
  return <Card className="lg:col-span-2"><CardHeader className="pb-4"><CardTitle className="text-base">Elevation & overlays</CardTitle><CardDescription>Shadows, the dialog overlay, inverse tooltips, and the stronger border colours.</CardDescription></CardHeader><CardContent className="grid gap-5 lg:grid-cols-3">
    <div><p className="mb-2 text-xs font-medium text-text-secondary">Elevation</p><div className="grid grid-cols-2 gap-3 rounded-default bg-surface-secondary p-4">{[["shadow-1", "Card", "shadow-1"], ["shadow-2", "Dropdown", "shadow-2"], ["shadow-3", "Popover", "shadow-3"]].map(([token, label, className]) => <div key={token} className={`rounded-default bg-surface p-3 ${className}`}><p className="text-xs font-medium">{label}</p><code className="text-[10px] text-text-secondary">--{token}</code></div>)}<div className="rounded-default bg-surface-raised p-3"><p className="text-xs font-medium">Raised</p><code className="text-[10px] text-text-secondary">--surface-raised</code></div></div></div>
    <div><p className="mb-2 text-xs font-medium text-text-secondary">Dialog · <code>--surface-overlay</code> + <code>--shadow-dialog</code></p><div className="relative h-[184px] overflow-hidden rounded-default border bg-surface p-3"><div aria-hidden className="space-y-2"><div className="h-3 w-2/3 rounded-small bg-surface-raised" /><div className="h-3 w-1/2 rounded-small bg-surface-raised" /><div className="h-16 rounded-default bg-surface-secondary" /><div className="h-3 w-3/4 rounded-small bg-surface-raised" /></div><div className="absolute inset-0 grid place-items-center bg-surface-overlay p-3"><div role="dialog" aria-label="Close position" className="w-full max-w-[240px] rounded-medium bg-surface p-4 shadow-dialog"><p className="text-sm font-medium">Close position?</p><p className="mt-1 text-xs leading-5 text-text-secondary">Your BTC long will be closed at market price.</p><div className="mt-3 flex justify-end gap-2"><Button variant="outline" size="sm">Cancel</Button><Button variant="destructive" size="sm">Close</Button></div></div></div></div></div>
    <div className="grid content-start gap-4">
      <div><p className="mb-2 text-xs font-medium text-text-secondary">Tooltip · <code>--surface-inverse</code></p><div className="flex items-center gap-3 rounded-default border p-3"><Button variant="outline" size="icon" aria-label="Settings"><HugeiconsIcon icon={Settings01Icon} size={16} /></Button><span role="tooltip" className="relative rounded-small bg-surface-inverse px-2 py-1 text-xs font-medium text-surface shadow-2"><span aria-hidden className="absolute -left-1 top-1/2 size-2 -translate-y-1/2 rotate-45 bg-surface-inverse" />Account settings</span></div></div>
      <div><p className="mb-2 text-xs font-medium text-text-secondary">Controls · <code>--border-strong</code></p><div className="flex flex-wrap items-center gap-4 rounded-default border p-3 text-sm">{([["Unchecked", false], ["Checked", true]] as const).map(([label, checked]) => <span key={label} className="inline-flex items-center gap-2"><span aria-hidden className={`grid size-4 place-items-center rounded-small ${checked ? "bg-primary text-primary-foreground" : "border border-border-strong bg-surface"}`}>{checked && <HugeiconsIcon icon={Tick02Icon} size={12} />}</span>{label}</span>)}<span className="inline-flex items-center gap-2"><span aria-hidden className="size-4 rounded-large border border-border-strong bg-surface" />Radio</span></div></div>
      <div><p className="mb-2 text-xs font-medium text-text-secondary">Dividers</p><div className="grid gap-2 rounded-default border p-3">{["border", "border-subtle", "border-softer", "border-strong", "border-inverse"].map((token) => <div key={token} className="flex items-center gap-3"><code className="w-28 shrink-0 text-[10px] text-text-secondary">--{token}</code><div className="h-0 flex-1 border-t" style={{ borderColor: `var(--${token})` }} /></div>)}</div></div>
    </div>
  </CardContent></Card>;
}

function StatesAndIconsPreview() {
  const [activeIcon, setActiveIcon] = useState("Hugeicons · Home");
  return <div className="grid gap-4 xl:grid-cols-2">
    <Card><CardHeader><CardTitle>Interactive states</CardTitle><CardDescription>Token-driven examples remain visible so every state can be compared without guessing.</CardDescription></CardHeader><CardContent><div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      <StateSample label="Default" className="bg-surface" />
      <StateSample label="Hover" className="bg-hover-bg" />
      <StateSample label="Active" className="bg-active-bg" />
      <StateSample label="Focus" className="bg-surface outline-2 outline-offset-0 outline-solid outline-ring-primary" />
      <StateSample label="Disabled" className="bg-surface text-text-muted" disabled />
    </div><div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-default border p-4"><p className="text-xs font-medium">Hover token</p><code className="mt-2 block text-[11px] text-text-secondary">--hover-bg</code><div className="mt-3 h-2 rounded-large bg-hover-bg" /></div><div className="rounded-default border p-4"><p className="text-xs font-medium">Active token</p><code className="mt-2 block text-[11px] text-text-secondary">--active-bg</code><div className="mt-3 h-2 rounded-large bg-active-bg" /></div></div></CardContent></Card>

    <Card><CardHeader><CardTitle>Interactive icons</CardTitle><CardDescription>Hugeicons stroke and Solar Bold are both wired to <code>--icon</code> and <code>--icon-active</code>.</CardDescription></CardHeader><CardContent><p className="mb-2 text-xs font-medium text-text-secondary">Hugeicons · stroke</p><div className="flex flex-wrap gap-2">{iconExamples.map(([label, icon]) => { const value = `Hugeicons · ${label}`; const active = activeIcon === value; return <button key={value} type="button" aria-label={`Hugeicons ${label}`} aria-pressed={active} onClick={() => setActiveIcon(value)} className={`group inline-flex size-10 items-center justify-center rounded-default border outline-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-solid focus-visible:outline-ring-primary ${active ? "bg-active-bg" : "bg-surface hover:bg-hover-bg active:bg-active-bg"}`}><HugeiconsIcon icon={icon} size={19} className={active ? "text-icon-active" : "text-icon transition-colors group-hover:text-icon-active"} /></button>; })}<button type="button" disabled aria-label="Hugeicons disabled" className="inline-flex size-10 items-center justify-center rounded-default border text-text-muted"><HugeiconsIcon icon={Settings01Icon} size={19} /></button></div><p className="mb-2 mt-5 text-xs font-medium text-text-secondary">Solar · bold</p><div className="flex flex-wrap gap-2">{solarIconExamples.map(([label, SolarIcon]) => { const value = `Solar Bold · ${label}`; const active = activeIcon === value; return <button key={value} type="button" aria-label={`Solar Bold ${label}`} aria-pressed={active} onClick={() => setActiveIcon(value)} className={`group inline-flex size-10 items-center justify-center rounded-default border outline-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-solid focus-visible:outline-ring-primary ${active ? "bg-active-bg text-icon-active" : "bg-surface text-icon hover:bg-hover-bg hover:text-icon-active active:bg-active-bg"}`}><SolarIcon color="currentColor" size={20} /></button>; })}<button type="button" disabled aria-label="Solar Bold disabled" className="inline-flex size-10 items-center justify-center rounded-default border text-text-muted"><SettingsIcon color="currentColor" size={20} /></button></div><div className="mt-5 flex items-center justify-between gap-3 rounded-default border border-border-secondary bg-surface-secondary p-3"><div><p className="text-sm font-medium">Selected icon</p><p className="text-xs text-text-secondary">Click either family to compare its active state.</p></div><Badge variant="secondary" className="shrink-0">{activeIcon}</Badge></div></CardContent></Card>

    <Card><CardHeader><CardTitle>Typography hierarchy</CardTitle><CardDescription>The text hierarchy, plus the interactive text states that tabs use.</CardDescription></CardHeader><CardContent className="space-y-4"><div><p className="text-xs text-text-secondary">Primary</p><p className="mt-1 text-lg font-medium text-text-primary">Clear, high-emphasis content</p></div><div><p className="text-xs text-text-secondary">Default</p><p className="mt-1 text-base text-text-default">Body copy, inputs, and control labels</p></div><div><p className="text-xs text-text-secondary">Secondary</p><p className="mt-1 text-base text-text-secondary">Supporting descriptions and metadata</p></div><div><p className="text-xs text-text-secondary">Muted</p><p className="mt-1 text-base text-text-muted">Disabled and unavailable content</p></div><div><p className="text-xs text-text-secondary">Interactive · hover · active</p><div className="mt-1 flex flex-wrap gap-4 text-base font-medium"><span className="text-text-interactive">Orders</span><span className="text-text-hover">Positions</span><span className="text-text-active">History</span></div><p className="mt-1 text-[11px] text-text-muted">Same values as <code>--icon</code> / <code>--icon-active</code>. Hover the page tabs above to see them live.</p></div></CardContent></Card>

    <Card><CardHeader><CardTitle>Surfaces & borders</CardTitle><CardDescription>Every surface layer, with its paired border where it has one.</CardDescription></CardHeader><CardContent><div className="grid grid-cols-2 gap-3 sm:grid-cols-5"><SurfaceSample label="Surface" color="var(--surface)" /><SurfaceSample label="Secondary" color="var(--surface-secondary)" border="var(--border-secondary)" /><SurfaceSample label="Subtle" color="var(--surface-subtle)" border="var(--border-subtle)" /><SurfaceSample label="Raised" color="var(--surface-raised)" /><SurfaceSample label="Inverse" color="var(--surface-inverse)" border="var(--border-inverse)" /><SurfaceSample label="Overlay" color="var(--surface-overlay)" /><SurfaceSample label="Primary" color="var(--primary)" /><SurfaceSample label="Danger" color="var(--danger)" /><SurfaceSample label="Hover" color="var(--hover-bg)" /><SurfaceSample label="Active" color="var(--active-bg)" /></div></CardContent></Card>

    <Card className="xl:col-span-2"><CardHeader><CardTitle>Radius system</CardTitle><CardDescription>Small for compact controls, default for general UI, medium for cards, and large for pills and avatars.</CardDescription></CardHeader><CardContent><div className="flex flex-wrap items-end gap-8"><RadiusSample label="Small · 4px"><div className="h-10 w-20 rounded-small border bg-surface-secondary" /></RadiusSample><RadiusSample label="Compact · 6px · buttons"><Button variant="outline">Button</Button></RadiusSample><RadiusSample label="Default · 8px"><div className="h-12 w-28 rounded-default border bg-surface-secondary" /></RadiusSample><RadiusSample label="Medium · 12px"><div className="h-12 w-28 rounded-medium border bg-surface-secondary" /></RadiusSample><RadiusSample label="Large · pill"><div className="flex h-10 w-28 items-center justify-center rounded-large bg-primary text-xs font-medium text-primary-foreground">Pill</div></RadiusSample><RadiusSample label="Large · avatar"><div className="flex size-12 items-center justify-center rounded-large bg-active-bg text-icon-active"><HugeiconsIcon icon={UserIcon} size={21} /></div></RadiusSample></div></CardContent></Card>
  </div>;
}

function StateSample({ label, className, disabled = false }: { label: string; className: string; disabled?: boolean }) { return <div className="space-y-2"><div className={`flex h-16 items-center justify-center rounded-default border text-xs font-medium ${className}`}>{disabled ? <HugeiconsIcon icon={Settings01Icon} size={18} /> : label}</div><p className="text-center text-[11px] text-text-secondary">{label}</p></div>; }
function SurfaceSample({ label, color, border = "var(--border)" }: { label: string; color: string; border?: string }) { return <div><div className="h-16 rounded-default border" style={{ background: color, borderColor: border }} /><p className="mt-2 text-xs text-text-secondary">{label}</p></div>; }
function RadiusSample({ label, children }: { label: string; children: ReactNode }) { return <div className="flex flex-col items-center gap-2">{children}<span className="text-[11px] text-text-secondary">{label}</span></div>; }

function DashboardPreview({ activeNav, setActiveNav }: { activeNav: string; setActiveNav: (value: string) => void }) { return <div className="bg-surface-secondary"><div className="grid min-h-[520px] md:grid-cols-[210px_1fr]">
  <aside className="hidden p-3 text-text-primary md:flex md:flex-col"><div className="flex items-center gap-2 px-2 py-3"><div className="grid size-8 place-items-center rounded-default bg-primary text-primary-foreground"><HugeiconsIcon icon={CreditCardIcon} size={17} /></div><div><p className="text-sm font-semibold">Acme Studio</p><p className="text-[11px] text-text-secondary">Pro workspace</p></div></div><nav className="mt-4 space-y-1">{navItems.map(([name, icon]) => <button key={name} onClick={() => setActiveNav(name)} className={`group flex w-full items-center gap-2.5 rounded-default border border-transparent px-2.5 py-2 text-sm outline-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-solid focus-visible:outline-ring-primary ${activeNav === name ? "bg-hover-bg font-medium text-text-primary" : "text-text-secondary hover:bg-hover-bg hover:text-text-primary"}`}><HugeiconsIcon icon={icon} size={17} className={activeNav === name ? "text-icon-active" : "text-icon transition-colors group-hover:text-icon-active"} />{name}</button>)}</nav><div className="mt-auto rounded-default border border-border-secondary p-3"><p className="text-xs font-medium">Storage</p><div className="mt-2 h-1.5 overflow-hidden rounded-large bg-hover-bg"><div className="h-full w-2/3 bg-primary" /></div><p className="mt-2 text-[11px] text-text-secondary">6.8 GB of 10 GB used</p></div></aside>
  {/* Main area mirrors Conduit's <main>: a --surface panel inset in the --surface-secondary frame. */}
  <div className="m-2 min-w-0 overflow-hidden rounded-medium border bg-surface md:ml-0"><div className="flex h-11 items-center justify-between border-b border-border-subtle px-3"><p className="px-2.5 text-sm font-medium leading-4">{activeNav}</p><div className="flex items-center gap-2"><Button variant="ghost" size="icon"><HugeiconsIcon icon={Notification03Icon} size={18} /></Button><div className="grid size-8 place-items-center rounded-large bg-primary text-primary-foreground"><HugeiconsIcon icon={UserIcon} size={16} /></div></div></div><div className="p-5"><div className="grid gap-3 sm:grid-cols-3">{[["Total revenue","$48,295","+12.5%"],["Active users","2,420","+8.2%"],["Conversion","3.8%","−0.4%"]].map(([label,value,delta]) => <Card key={label}><CardContent className="p-4"><p className="text-xs text-text-secondary">{label}</p><div className="mt-2 flex items-end justify-between"><p className="text-xl font-semibold">{value}</p><Badge variant={delta.startsWith("+") ? "secondary" : "outline"}>{delta}</Badge></div></CardContent></Card>)}</div><div className="mt-4"><CandlestickPreview /></div></div></div>
  </div></div>; }

const CANDLES = [
  { o: 48, h: 62, l: 44, c: 58, v: 36 },
  { o: 58, h: 64, l: 50, c: 52, v: 54 },
  { o: 52, h: 55, l: 40, c: 42, v: 70 },
  { o: 42, h: 51, l: 38, c: 49, v: 48 },
  { o: 49, h: 68, l: 47, c: 65, v: 82 },
  { o: 65, h: 70, l: 56, c: 58, v: 60 },
  { o: 58, h: 61, l: 52, c: 54, v: 32 },
  { o: 54, h: 72, l: 53, c: 70, v: 90 },
  { o: 70, h: 74, l: 60, c: 62, v: 66 },
  { o: 62, h: 66, l: 48, c: 50, v: 78 },
  { o: 50, h: 58, l: 46, c: 56, v: 44 },
  { o: 56, h: 80, l: 55, c: 76, v: 95 },
] as const;
const BIG_TRADE_VOLUME = 70;

function CandlestickPreview() {
  const priceMin = Math.min(...CANDLES.map((c) => c.l)) - 4;
  const priceMax = Math.max(...CANDLES.map((c) => c.h)) + 4;
  const span = priceMax - priceMin;
  const y = (price: number) => `${((priceMax - price) / span) * 100}%`;
  const len = (a: number, b: number) => `${Math.max((Math.abs(a - b) / span) * 100, 1.2)}%`;
  const volMax = Math.max(...CANDLES.map((c) => c.v));
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">BTCUSDT · 1h</CardTitle>
        <CardDescription>Candles use --bullish / --bearish; big trades are --buy-bubble / --sell-bubble circles outlined in the same colours.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-44">
          {CANDLES.map((candle, index) => {
            const up = candle.c >= candle.o;
            const tone = up ? "bg-bullish" : "bg-bearish";
            return (
              <div key={index} className="absolute inset-y-0" style={{ left: `${(index / CANDLES.length) * 100}%`, width: `${100 / CANDLES.length}%` }}>
                <div className={`absolute left-1/2 w-px -translate-x-1/2 ${tone}`} style={{ top: y(candle.h), height: len(candle.h, candle.l) }} />
                <div className={`absolute left-1/2 w-2.5 -translate-x-1/2 rounded-[1px] ${tone}`} style={{ top: y(Math.max(candle.o, candle.c)), height: len(candle.o, candle.c) }} />
                {candle.v >= BIG_TRADE_VOLUME && <div aria-hidden className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] ${up ? "border-bullish bg-buy-bubble" : "border-bearish bg-sell-bubble"}`} style={{ top: y(candle.c), width: 12 + (candle.v - BIG_TRADE_VOLUME), height: 12 + (candle.v - BIG_TRADE_VOLUME) }} />}
              </div>
            );
          })}
        </div>
        <div className="mt-1 flex h-12 items-end gap-px">
          {CANDLES.map((candle, index) => (
            <div key={index} className={`flex-1 rounded-small ${candle.c >= candle.o ? "bg-positive-subtle" : "bg-negative-subtle"}`} style={{ height: `${(candle.v / volMax) * 100}%` }} />
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-[11px] text-text-secondary">
          <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-small bg-bullish" /> Candle / volume up</span>
          <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-small bg-bearish" /> Candle / volume down</span>
          <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-full border border-bullish bg-buy-bubble" /> Big buy</span>
          <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-full border border-bearish bg-sell-bubble" /> Big sell</span>
        </div>
      </CardContent>
    </Card>
  );
}

// Every token in TOKEN_GROUPS, grouped as in the theme. Each tile previews the token the way it is used.
const ALL_TOKENS = TOKEN_GROUPS.flatMap((group) => group.tokens);
function TokenPreview() { const values = useTokenValues(ALL_TOKENS); return <div className="grid gap-4"><div className="flex flex-wrap items-baseline justify-between gap-2 px-1"><p className="text-sm font-medium">Clean token inventory</p><p className="text-xs text-text-secondary">{ALL_TOKENS.length} tokens · values update with the theme and the live editor</p></div>{TOKEN_GROUPS.map((group) => <Card key={group.label}><CardHeader className="pb-4"><CardTitle className="text-base">{group.label}</CardTitle><CardDescription>{group.tokens.length} {group.tokens.length === 1 ? "token" : "tokens"}</CardDescription></CardHeader><CardContent><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{group.tokens.map((token) => <div key={token} className="overflow-hidden rounded-default border bg-surface"><TokenSwatch token={token} /><div className="space-y-0.5 p-2"><p className="truncate font-mono text-[10px]" title={`--${token}`}>--{token}</p><p className="truncate font-mono text-[10px] text-text-secondary" title={values[token]}>{values[token] || "\u00a0"}</p></div></div>)}</div></CardContent></Card>)}</div>; }

function TokenSwatch({ token }: { token: string }) {
  const value = `var(--${token})`;
  if (token.startsWith("shadow-")) return <div className="grid h-16 place-items-center border-b bg-surface-secondary"><div className="h-8 w-14 rounded-default bg-surface" style={{ boxShadow: value }} /></div>;
  if (token.startsWith("radius-")) return <div className="grid h-16 place-items-center border-b"><div className="h-9 w-14 border-2 border-border-strong bg-surface-secondary" style={{ borderRadius: value }} /></div>;
  if (token.startsWith("text-")) return <div className="grid h-16 place-items-center border-b bg-surface text-xl font-semibold" style={{ color: value }}>Aa</div>;
  if (token.startsWith("border")) return <div className="grid h-16 place-items-center border-b bg-surface"><div className="h-9 w-14 rounded-default" style={{ border: `2px solid ${value}` }} /></div>;
  return <div className="h-16 border-b" style={{ background: value }} />;
}


// Auth form: light — card on --surface-secondary, inputs on --surface; dark — card on --surface, inputs on --surface-secondary.
// Submitting empty/invalid fields sets aria-invalid (--danger border + 3px --danger-ring ring) and shows a FieldError.
// After that, an invalid field re-validates as the user types and only clears once its value is valid.
const emailError = (value: string) => { const email = value.trim(); return !email ? "Please enter your email address." : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "Please enter a valid email address." : undefined; };
const passwordError = (value: string) => !value ? "Please choose a password." : value.length < 8 ? "Password must be at least 8 characters." : undefined;

function SignUpCard() {
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const validate = (form: HTMLFormElement) => {
    const data = new FormData(form);
    setErrors({ email: emailError(String(data.get("email") ?? "")), password: passwordError(String(data.get("password") ?? "")) });
  };
  return <Card className="bg-surface-secondary! dark:bg-surface!"><CardHeader><div className="flex items-start justify-between"><div><CardTitle>Create account</CardTitle><CardDescription className="mt-1.5">Enter your details to get started.</CardDescription></div><Badge>New</Badge></div></CardHeader><CardContent><form noValidate onSubmit={(e) => { e.preventDefault(); validate(e.currentTarget); }} onReset={() => setErrors({})} className="space-y-4">
    <div className="space-y-2"><Label>Email address</Label><Input name="email" type="email" placeholder="name@example.com" aria-invalid={errors.email ? true : undefined} onChange={(e) => { if (!errors.email) return; const next = emailError(e.currentTarget.value); setErrors((prev) => ({ ...prev, email: next })); }} />{errors.email && <FieldError>{errors.email}</FieldError>}</div>
    <div className="space-y-2"><Label>Password</Label><Input name="password" type="password" placeholder="At least 8 characters" aria-invalid={errors.password ? true : undefined} onChange={(e) => { if (!errors.password) return; const next = passwordError(e.currentTarget.value); setErrors((prev) => ({ ...prev, password: next })); }} />{errors.password && <FieldError>{errors.password}</FieldError>}</div>
    <div className="flex gap-2"><Button type="submit" variant="secondary" className="flex-1">Create account <HugeiconsIcon icon={ArrowRight01Icon} size={16} /></Button><Button type="reset" variant="outline">Cancel</Button></div>
  </form></CardContent></Card>;
}

// Resolved value of each CSS custom property for the current theme. Re-reads when the theme
// class flips or the live CSS editor rewrites its <style>, so the tiles always show what renders.
function useTokenValues(tokens: string[]) {
  const [values, setValues] = useState<Record<string, string>>({});
  const key = tokens.join(",");
  useEffect(() => {
    const names = key.split(",");
    let timer: ReturnType<typeof setTimeout> | undefined;
    const read = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const styles = getComputedStyle(document.documentElement);
        setValues(Object.fromEntries(names.map((name) => [name, styles.getPropertyValue(`--${name}`).trim()])));
      }, 0);
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style"] });
    observer.observe(document.body, { subtree: true, childList: true, characterData: true });
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [key]);
  return values;
}

// The state row is pinned (not hover-driven) so all --danger-* fills can be compared side by side.
const dangerStates = [
  ["Default", "--danger", "--danger-foreground", "bg-danger text-danger-foreground"],
  ["Hover", "--danger-hover", "--danger-foreground", "bg-danger-hover text-danger-foreground"],
  ["Disabled", "--danger-disabled", "--danger-disabled-foreground", "bg-danger-disabled text-danger-disabled-foreground"],
] as const;
const dangerTextStates = [
  ["Default", "--text-danger", "text-text-danger"],
  ["Hover · pressed", "--danger-hover", "text-danger-hover"],
  ["Disabled", "--danger-disabled-foreground", "text-danger-disabled-foreground"],
] as const;

function DangerActionsCard() {
  return <Card><CardHeader className="pb-4"><CardTitle className="text-base">Danger actions</CardTitle><CardDescription>Every <code>--danger-*</code> token: button states, the invalid-field ring, and a confirm pattern.</CardDescription></CardHeader><CardContent className="grid gap-5">
    <div><p className="mb-2 text-xs font-medium text-text-secondary">States</p><div className="grid grid-cols-3 gap-3">{dangerStates.map(([label, fill, text, className]) => <div key={label} className="space-y-1.5"><div aria-hidden className={`flex h-7 items-center justify-center gap-1.5 rounded-compact text-sm font-medium leading-4 ${className}`}><HugeiconsIcon icon={Delete02Icon} size={14} /> Delete</div><p className="text-[11px] font-medium">{label}</p><div className="space-y-0.5 font-mono text-[10px] leading-[14px] text-text-secondary"><p className="truncate" title={fill}>{fill}</p><p className="truncate" title={text}>{text}</p></div></div>)}</div></div>
    <div><p className="mb-2 text-xs font-medium text-text-secondary">Live buttons</p><div className="flex flex-wrap items-center gap-2"><Button variant="destructive" size="sm">Remove</Button><Button variant="destructive"><HugeiconsIcon icon={Delete02Icon} size={16} /> Delete</Button><Button variant="destructive" size="lg">Delete account</Button><Button variant="destructive" size="icon" aria-label="Delete"><HugeiconsIcon icon={Delete02Icon} size={16} /></Button><Button variant="destructive" disabled>Delete</Button></div></div>
    <div><p className="mb-2 text-xs font-medium text-text-secondary">Text buttons · no fill</p><div className="grid grid-cols-3 gap-3">{dangerTextStates.map(([label, token, className]) => <div key={label} className="space-y-1.5"><div aria-hidden className={`flex h-7 items-center justify-center gap-1.5 text-sm font-medium leading-4 ${className}`}><HugeiconsIcon icon={Delete02Icon} size={14} /> Delete</div><p className="text-[11px] font-medium">{label}</p><p className="truncate font-mono text-[10px] leading-[14px] text-text-secondary" title={token}>{token}</p></div>)}</div><div className="mt-3 flex flex-wrap items-center gap-2"><Button variant="destructive-text" size="sm">Remove</Button><Button variant="destructive-text"><HugeiconsIcon icon={Delete02Icon} size={16} /> Delete</Button><Button variant="destructive-text" size="lg">Delete account</Button><Button variant="destructive-text" size="icon" aria-label="Delete"><HugeiconsIcon icon={Delete02Icon} size={16} /></Button><Button variant="destructive-text" disabled>Delete</Button></div></div>
    <div className="space-y-2"><p className="text-xs font-medium text-text-secondary">Invalid field · <code>--danger</code> border + <code>--danger-ring</code></p><Input aria-invalid defaultValue="name@example" aria-label="Email address (invalid example)" /><FieldError>Please enter a valid email address.</FieldError></div>
    <div className="rounded-default border p-4"><p className="text-sm font-medium">Delete workspace?</p><p className="mt-1 text-xs leading-5 text-text-secondary">This permanently removes Acme Studio and all of its projects. This can&apos;t be undone.</p><div className="mt-3 flex justify-end gap-2"><Button variant="outline" size="sm">Cancel</Button><Button variant="destructive" size="sm"><HugeiconsIcon icon={Delete02Icon} size={14} /> Delete workspace</Button></div></div>
  </CardContent></Card>;
}

// Dedicated trade actions: --buy-* / --sell-* tokens. Hover and press change the fill only.
function TradeButtonsCard() {
  return <Card><CardHeader className="pb-4"><CardTitle className="text-base">Buy & sell</CardTitle><CardDescription>Dedicated trade actions with their own hover, press, focus, and disabled tokens.</CardDescription></CardHeader><CardContent className="grid gap-4">
    <div className="grid grid-cols-2 gap-2"><Button variant="buy" size="lg" className="flex-col gap-0 py-1.5 h-auto"><span>Buy</span><span className="text-xs font-normal tabular-nums">64,218.50</span></Button><Button variant="sell" size="lg" className="flex-col gap-0 py-1.5 h-auto"><span>Sell</span><span className="text-xs font-normal tabular-nums">64,212.00</span></Button></div>
    <div className="flex flex-wrap items-center gap-2"><Button variant="buy" size="sm">Buy</Button><Button variant="sell" size="sm">Sell</Button><Button variant="buy">Buy BTC</Button><Button variant="sell">Sell BTC</Button><Button variant="buy" disabled>Buy</Button><Button variant="sell" disabled>Sell</Button></div>
  </CardContent></Card>;
}
