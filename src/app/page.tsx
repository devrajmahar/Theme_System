"use client";

import { useEffect, useState, type ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, AlertCircleIcon, ArrowRight01Icon, Calendar03Icon, CheckmarkCircle02Icon, CreditCardIcon, Delete02Icon, Folder01Icon, Home01Icon, Mail01Icon, Notification03Icon, Search01Icon, Settings01Icon, UserIcon } from "@hugeicons/core-free-icons";
import { BellIcon, CalendarIcon, ChatRoundDotsIcon, FolderIcon, HomeIcon, LetterIcon, MagnifierIcon, SettingsIcon, UserIcon as SolarUserIcon } from "@solar-icons/react/bold";
import { ThemeToggle } from "@/components/theme-toggle";
import { PalettePlayground } from "@/components/palette-playground";
import { BrandPreview } from "@/components/brand-preview";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, FieldError, Input, Label } from "@/components/ui/showcase";

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
    <header className="sticky top-0 z-40 border-b bg-surface/90 backdrop-blur-xl"><div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-4 sm:px-6"><div className="flex items-center gap-3"><img src="/brand-assets/Logomark-dark.svg" alt="" className="h-7 w-auto dark:hidden" /><img src="/brand-assets/Logomark-white.svg" alt="" className="hidden h-7 w-auto dark:block" /><span className="text-sm font-semibold">Theme Studio</span><Badge variant="secondary" className="hidden sm:inline-flex">shadcn/ui</Badge></div><div className="flex items-center gap-2"><a href="#editor" className="hidden text-sm text-text-secondary hover:text-text-primary sm:block">Edit CSS</a><ThemeToggle /></div></div></header>
    <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-10">
      <section className="section-enter mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div className="max-w-2xl"><Badge variant="outline">Clean state tokens</Badge><h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Test your theme on real UI.</h1><p className="mt-3 text-base leading-7 text-text-secondary">A focused theme playground with concise, purposeful tokens. Edit surfaces, type, states, icons, actions, and radius without shadcn implementation noise.</p></div><div className="flex gap-2"><Button variant="outline" onClick={() => document.querySelector("#editor")?.scrollIntoView()}><HugeiconsIcon icon={Search01Icon} size={17} /> Inspect tokens</Button><Button variant="secondary" onClick={() => document.querySelector("#editor")?.scrollIntoView()}><HugeiconsIcon icon={Add01Icon} size={17} /> Customize</Button></div></section>
      <div role="tablist" className="ui-tabs mb-6 flex h-7 w-fit max-w-full gap-0.5 overflow-x-auto rounded-large p-0.5">{["Components","States & Icons","Dashboard","Tokens","Brand"].map((item) => <button key={item} role="tab" aria-selected={tab === item} onClick={() => setTab(item)} className="ui-tab h-6 whitespace-nowrap rounded-large px-2 text-xs font-medium leading-[14px] outline-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-solid focus-visible:outline-border-strong">{item}</button>)}</div>
      {/* The Dashboard tab is a full app window (like Conduit): --surface-secondary is the outermost layer, not a ring inside --surface. */}
      <section className={`section-enter mb-10 rounded-medium border ${tab === "Dashboard" ? "overflow-hidden bg-surface-secondary" : "editor-grid bg-surface p-3 sm:p-5"}`} style={{ animationDelay: "80ms" }}>{tab === "Components" && <ComponentsPreview />}{tab === "States & Icons" && <StatesAndIconsPreview />}{tab === "Dashboard" && <DashboardPreview activeNav={activeNav} setActiveNav={setActiveNav} />}{tab === "Tokens" && <TokenPreview />}{tab === "Brand" && <BrandPreview />}</section>
      <PalettePlayground />
    </main>
    <footer className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-8 text-xs text-text-secondary"><span>Theme Studio · live local preview</span><span>Light + dark · responsive</span></footer>
  </div>;
}

function ComponentsPreview() { return <div className="grid gap-4 lg:grid-cols-2">
  <SignUpCard />
  <div className="grid gap-4"><Card><CardHeader className="pb-4"><CardTitle className="text-base">Button variants</CardTitle><CardDescription>Hover, focus, active, and disabled states.</CardDescription></CardHeader><CardContent className="flex flex-wrap gap-2"><Button>Default</Button><Button variant="secondary">Secondary</Button><Button variant="outline">Outline</Button><Button variant="ghost">Ghost</Button><Button variant="destructive"><HugeiconsIcon icon={Delete02Icon} size={16} /> Delete</Button><Button disabled>Disabled</Button></CardContent></Card><TradeButtonsCard /><Card><CardHeader className="pb-4"><CardTitle className="text-base">Badges & status</CardTitle></CardHeader><CardContent className="flex flex-wrap gap-2"><Badge>Default</Badge><Badge variant="secondary">In review</Badge><Badge variant="outline">Draft</Badge><Badge variant="destructive">Failed</Badge><span className="inline-flex items-center gap-1.5 text-sm text-text-secondary"><span className="size-2 rounded-large bg-primary" /> Operational</span></CardContent></Card></div>
  </div>; }

function StatesAndIconsPreview() {
  const [activeIcon, setActiveIcon] = useState("Hugeicons · Home");
  return <div className="grid gap-4 xl:grid-cols-2">
    <Card><CardHeader><CardTitle>Interactive states</CardTitle><CardDescription>Token-driven examples remain visible so every state can be compared without guessing.</CardDescription></CardHeader><CardContent><div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      <StateSample label="Default" className="bg-surface" />
      <StateSample label="Hover" className="bg-hover-bg" />
      <StateSample label="Active" className="bg-active-bg" />
      <StateSample label="Focus" className="border-ring bg-surface ring-[2px] ring-ring/50" />
      <StateSample label="Disabled" className="bg-surface text-text-muted" disabled />
    </div><div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-default border p-4"><p className="text-xs font-medium">Hover token</p><code className="mt-2 block text-[11px] text-text-secondary">--hover-bg</code><div className="mt-3 h-2 rounded-large bg-hover-bg" /></div><div className="rounded-default border p-4"><p className="text-xs font-medium">Active token</p><code className="mt-2 block text-[11px] text-text-secondary">--active-bg</code><div className="mt-3 h-2 rounded-large bg-active-bg" /></div></div></CardContent></Card>

    <Card><CardHeader><CardTitle>Interactive icons</CardTitle><CardDescription>Hugeicons stroke and Solar Bold are both wired to <code>--icon</code> and <code>--icon-active</code>.</CardDescription></CardHeader><CardContent><p className="mb-2 text-xs font-medium text-text-secondary">Hugeicons · stroke</p><div className="flex flex-wrap gap-2">{iconExamples.map(([label, icon]) => { const value = `Hugeicons · ${label}`; const active = activeIcon === value; return <button key={value} type="button" aria-label={`Hugeicons ${label}`} aria-pressed={active} onClick={() => setActiveIcon(value)} className={`group inline-flex size-10 items-center justify-center rounded-default border outline-none transition-colors focus-visible:border-ring focus-visible:ring-[2px] focus-visible:ring-ring/50 ${active ? "bg-active-bg" : "bg-surface hover:bg-hover-bg active:bg-active-bg"}`}><HugeiconsIcon icon={icon} size={19} className={active ? "text-icon-active" : "text-icon transition-colors group-hover:text-icon-active"} /></button>; })}<button type="button" disabled aria-label="Hugeicons disabled" className="inline-flex size-10 items-center justify-center rounded-default border text-text-muted"><HugeiconsIcon icon={Settings01Icon} size={19} /></button></div><p className="mb-2 mt-5 text-xs font-medium text-text-secondary">Solar · bold</p><div className="flex flex-wrap gap-2">{solarIconExamples.map(([label, SolarIcon]) => { const value = `Solar Bold · ${label}`; const active = activeIcon === value; return <button key={value} type="button" aria-label={`Solar Bold ${label}`} aria-pressed={active} onClick={() => setActiveIcon(value)} className={`group inline-flex size-10 items-center justify-center rounded-default border outline-none transition-colors focus-visible:border-ring focus-visible:ring-[2px] focus-visible:ring-ring/50 ${active ? "bg-active-bg text-icon-active" : "bg-surface text-icon hover:bg-hover-bg hover:text-icon-active active:bg-active-bg"}`}><SolarIcon color="currentColor" size={20} /></button>; })}<button type="button" disabled aria-label="Solar Bold disabled" className="inline-flex size-10 items-center justify-center rounded-default border text-text-muted"><SettingsIcon color="currentColor" size={20} /></button></div><div className="mt-5 flex items-center justify-between gap-3 rounded-default border border-border-secondary bg-surface-secondary p-3"><div><p className="text-sm font-medium">Selected icon</p><p className="text-xs text-text-secondary">Click either family to compare its active state.</p></div><Badge variant="secondary" className="shrink-0">{activeIcon}</Badge></div></CardContent></Card>

    <Card><CardHeader><CardTitle>Typography hierarchy</CardTitle><CardDescription>The original three-level text system.</CardDescription></CardHeader><CardContent className="space-y-4"><div><p className="text-xs text-text-secondary">Primary</p><p className="mt-1 text-lg font-medium text-text-primary">Clear, high-emphasis content</p></div><div><p className="text-xs text-text-secondary">Secondary</p><p className="mt-1 text-base text-text-secondary">Supporting descriptions and metadata</p></div><div><p className="text-xs text-text-secondary">Muted</p><p className="mt-1 text-base text-text-muted">Disabled and unavailable content</p></div></CardContent></Card>

    <Card><CardHeader><CardTitle>Surfaces & borders</CardTitle><CardDescription>Primary and secondary layers with their paired border tokens.</CardDescription></CardHeader><CardContent><div className="grid grid-cols-2 gap-3 sm:grid-cols-3"><SurfaceSample label="Surface" color="var(--surface)" /><SurfaceSample label="Secondary" color="var(--surface-secondary)" border="var(--border-secondary)" /><SurfaceSample label="Primary" color="var(--primary)" /><SurfaceSample label="Danger" color="var(--danger)" /><SurfaceSample label="Hover" color="var(--hover-bg)" /><SurfaceSample label="Active" color="var(--active-bg)" /></div></CardContent></Card>

    <Card className="xl:col-span-2"><CardHeader><CardTitle>Radius system</CardTitle><CardDescription>Small for compact controls, default for general UI, medium for cards, and large for pills and avatars.</CardDescription></CardHeader><CardContent><div className="flex flex-wrap items-end gap-8"><RadiusSample label="Small · 4px"><div className="h-10 w-20 rounded-small border bg-surface-secondary" /></RadiusSample><RadiusSample label="Default · 8px"><div className="h-12 w-28 rounded-default border bg-surface-secondary" /></RadiusSample><RadiusSample label="Medium · 12px"><div className="h-12 w-28 rounded-medium border bg-surface-secondary" /></RadiusSample><RadiusSample label="Large · pill"><div className="flex h-10 w-28 items-center justify-center rounded-large bg-primary text-xs font-medium text-primary-foreground">Pill</div></RadiusSample><RadiusSample label="Large · avatar"><div className="flex size-12 items-center justify-center rounded-large bg-active-bg text-icon-active"><HugeiconsIcon icon={UserIcon} size={21} /></div></RadiusSample></div></CardContent></Card>
  </div>;
}

function StateSample({ label, className, disabled = false }: { label: string; className: string; disabled?: boolean }) { return <div className="space-y-2"><div className={`flex h-16 items-center justify-center rounded-default border text-xs font-medium ${className}`}>{disabled ? <HugeiconsIcon icon={Settings01Icon} size={18} /> : label}</div><p className="text-center text-[11px] text-text-secondary">{label}</p></div>; }
function SurfaceSample({ label, color, border = "var(--border)" }: { label: string; color: string; border?: string }) { return <div><div className="h-16 rounded-default border" style={{ background: color, borderColor: border }} /><p className="mt-2 text-xs text-text-secondary">{label}</p></div>; }
function RadiusSample({ label, children }: { label: string; children: ReactNode }) { return <div className="flex flex-col items-center gap-2">{children}<span className="text-[11px] text-text-secondary">{label}</span></div>; }

function DashboardPreview({ activeNav, setActiveNav }: { activeNav: string; setActiveNav: (value: string) => void }) { return <div className="bg-surface-secondary"><div className="grid min-h-[520px] md:grid-cols-[210px_1fr]">
  <aside className="hidden p-3 text-text-primary md:flex md:flex-col"><div className="flex items-center gap-2 px-2 py-3"><div className="grid size-8 place-items-center rounded-default bg-primary text-primary-foreground"><HugeiconsIcon icon={CreditCardIcon} size={17} /></div><div><p className="text-sm font-semibold">Acme Studio</p><p className="text-[11px] text-text-secondary">Pro workspace</p></div></div><nav className="mt-4 space-y-1">{navItems.map(([name, icon]) => <button key={name} onClick={() => setActiveNav(name)} className={`group flex w-full items-center gap-2.5 rounded-default border border-transparent px-2.5 py-2 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-[2px] focus-visible:ring-ring/50 ${activeNav === name ? "bg-hover-bg font-medium text-text-primary" : "text-text-secondary hover:bg-hover-bg hover:text-text-primary"}`}><HugeiconsIcon icon={icon} size={17} className={activeNav === name ? "text-icon-active" : "text-icon transition-colors group-hover:text-icon-active"} />{name}</button>)}</nav><div className="mt-auto rounded-default border border-border-secondary p-3"><p className="text-xs font-medium">Storage</p><div className="mt-2 h-1.5 overflow-hidden rounded-large bg-hover-bg"><div className="h-full w-2/3 bg-primary" /></div><p className="mt-2 text-[11px] text-text-secondary">6.8 GB of 10 GB used</p></div></aside>
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
        <CardDescription>Candles and volume use --bullish and --bearish only.</CardDescription>
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
              </div>
            );
          })}
        </div>
        <div className="mt-1 flex h-12 items-end gap-px">
          {CANDLES.map((candle, index) => (
            <div key={index} className={`flex-1 rounded-small ${candle.c >= candle.o ? "bg-bullish/40" : "bg-bearish/40"}`} style={{ height: `${(candle.v / volMax) * 100}%` }} />
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-[11px] text-text-secondary">
          <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-small bg-bullish" /> Candle / volume up</span>
          <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-small bg-bearish" /> Candle / volume down</span>
        </div>
      </CardContent>
    </Card>
  );
}

function TokenPreview() { const colors = ["surface","surface-secondary","surface-subtle","surface-raised","surface-inverse","border","border-secondary","border-subtle","border-strong","text-primary","text-default","text-secondary","text-muted","text-positive","text-negative","text-danger","text-warning","text-interactive","text-hover","text-active","hover-bg","active-bg","disabled-bg","icon","icon-active","positive","positive-subtle","negative","negative-subtle","warning","warning-subtle","indigo","purple","primary","primary-subtle","primary-foreground","danger","danger-foreground","button-fill","buy","buy-hover","buy-active","sell","sell-hover","sell-active","bullish","bearish","ring"]; const values = useTokenValues(colors); return <div className="grid gap-4"><Card><CardHeader><CardTitle>Clean token inventory</CardTitle><CardDescription>Only purposeful design tokens are exposed; compatibility aliases are kept out of the theme.</CardDescription></CardHeader><CardContent><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{colors.map((token) => <div key={token} className="overflow-hidden rounded-default border bg-surface"><div className="h-16 border-b" style={{ background: `var(--${token})` }} /><div className="space-y-0.5 p-2"><p className="truncate font-mono text-[10px]">--{token}</p><p className="truncate font-mono text-[10px] text-text-secondary" title={values[token]}>{values[token] || " "}</p></div></div>)}</div></CardContent></Card></div>; }

// Auth form: light — card on --surface-secondary, inputs on --surface; dark — card on --surface, inputs on --surface-secondary.
// Submitting empty/invalid fields sets aria-invalid (danger border + 3px danger/20 ring) and shows a FieldError.
function SignUpCard() {
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const validate = (form: HTMLFormElement) => {
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const next: typeof errors = {};
    if (!email) next.email = "Please enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Please enter a valid email address.";
    if (!password) next.password = "Please choose a password.";
    else if (password.length < 8) next.password = "Password must be at least 8 characters.";
    setErrors(next);
  };
  return <Card className="bg-surface-secondary! dark:bg-surface!"><CardHeader><div className="flex items-start justify-between"><div><CardTitle>Create account</CardTitle><CardDescription className="mt-1.5">Enter your details to get started.</CardDescription></div><Badge>New</Badge></div></CardHeader><CardContent><form noValidate onSubmit={(e) => { e.preventDefault(); validate(e.currentTarget); }} onReset={() => setErrors({})} className="space-y-4">
    <div className="space-y-2"><Label>Email address</Label><Input name="email" type="email" placeholder="name@example.com" aria-invalid={errors.email ? true : undefined} onChange={() => errors.email && setErrors((prev) => ({ ...prev, email: undefined }))} />{errors.email && <FieldError>{errors.email}</FieldError>}</div>
    <div className="space-y-2"><Label>Password</Label><Input name="password" type="password" placeholder="At least 8 characters" aria-invalid={errors.password ? true : undefined} onChange={() => errors.password && setErrors((prev) => ({ ...prev, password: undefined }))} />{errors.password && <FieldError>{errors.password}</FieldError>}</div>
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

// Dedicated trade actions: --buy-* / --sell-* tokens. Hover and press change the fill only.
function TradeButtonsCard() {
  return <Card><CardHeader className="pb-4"><CardTitle className="text-base">Buy & sell</CardTitle><CardDescription>Dedicated trade actions with their own hover, press, focus, and disabled tokens.</CardDescription></CardHeader><CardContent className="grid gap-4">
    <div className="grid grid-cols-2 gap-2"><Button variant="buy" size="lg" className="flex-col gap-0 py-1.5 h-auto"><span>Buy</span><span className="text-xs font-normal opacity-90 tabular-nums">64,218.50</span></Button><Button variant="sell" size="lg" className="flex-col gap-0 py-1.5 h-auto"><span>Sell</span><span className="text-xs font-normal opacity-90 tabular-nums">64,212.00</span></Button></div>
    <div className="flex flex-wrap items-center gap-2"><Button variant="buy" size="sm">Buy</Button><Button variant="sell" size="sm">Sell</Button><Button variant="buy">Buy BTC</Button><Button variant="sell">Sell BTC</Button><Button variant="buy" disabled>Buy</Button><Button variant="sell" disabled>Sell</Button></div>
  </CardContent></Card>;
}
