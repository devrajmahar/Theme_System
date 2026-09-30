"use client";

import { useMemo, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Copy01Icon, RefreshIcon, Tick02Icon } from "@hugeicons/core-free-icons";
import { DEFAULT_THEME_CSS } from "@/lib/theme-tokens";
import { Button } from "@/components/ui/showcase";

export function PalettePlayground() {
  const [css, setCss] = useState(DEFAULT_THEME_CSS);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const resetCss = () => setCss(DEFAULT_THEME_CSS);
  const lineCount = useMemo(() => Math.max(1, css.split("\n").length), [css]);
  const declarations = useMemo(() => (css.match(/--[\w-]+\s*:/g) ?? []).length, [css]);
  const copyCss = async () => { await navigator.clipboard.writeText(css); setCopied(true); window.setTimeout(() => setCopied(false), 1400); };
  const syncGutterScroll = () => {
    if (textareaRef.current && gutterRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  return <section id="editor" className="section-enter overflow-hidden rounded-medium border bg-surface">
    <style>{css}</style>
    <div className="flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
      <div><div className="flex items-center gap-2"><span className="size-2 rounded-large bg-primary" /><h2 className="font-semibold tracking-tight">Live CSS editor</h2></div><p className="mt-1 text-sm text-text-secondary">Edit any token below. The entire preview updates as you type.</p></div>
      <div className="flex items-center gap-2"><span className="mr-1 hidden text-xs text-text-secondary sm:inline">{declarations} declarations</span><Button variant="outline" size="sm" onClick={resetCss}><HugeiconsIcon icon={RefreshIcon} size={15} /> Reset</Button><Button variant="outline" size="sm" onClick={copyCss}><HugeiconsIcon icon={copied ? Tick02Icon : Copy01Icon} size={15} /> {copied ? "Copied" : "Copy CSS"}</Button></div>
    </div>
    <div className="grid lg:grid-cols-[minmax(0,1fr)_250px]">
      <div className="relative min-h-[540px] bg-surface-secondary/30"><div ref={gutterRef} className="absolute bottom-0 left-0 top-0 w-12 select-none overflow-hidden border-r bg-surface-secondary/60 py-4 pr-3 text-right font-mono text-[12px] leading-6 text-text-secondary/60" aria-hidden><div className="flex flex-col items-end">{Array.from({ length: lineCount }, (_, i) => <span key={i} className="block h-6 leading-6">{i + 1}</span>)}</div></div><textarea ref={textareaRef} aria-label="Theme CSS" spellCheck={false} autoComplete="off" autoCorrect="off" autoCapitalize="off" wrap="off" value={css} onChange={(e) => setCss(e.target.value)} onScroll={syncGutterScroll} className="theme-scrollbar block h-full min-h-[540px] w-full resize-y overflow-auto whitespace-pre bg-transparent py-4 pl-16 pr-4 font-mono text-[12px] leading-6 text-text-primary outline-none selection:bg-primary/20" /></div>
      <aside className="border-t bg-surface p-5 lg:border-l lg:border-t-0"><p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Clean token map</p><div className="mt-4 space-y-5"><TokenFamily title="Surfaces" tokens={["surface","surface-secondary","surface-subtle","surface-raised","surface-overlay","surface-inverse"]} /><TokenFamily title="Borders" tokens={["border","border-secondary","border-subtle","border-softer","border-strong","border-inverse"]} /><TokenFamily title="Text" tokens={["text-primary","text-default","text-secondary","text-muted","text-positive","text-negative","text-danger","text-warning","text-interactive","text-hover","text-active"]} /><TokenFamily title="States" tokens={["hover-bg","active-bg","disabled-bg"]} /><TokenFamily title="Icons" tokens={["icon","icon-active"]} /><TokenFamily title="Status" tokens={["positive","positive-subtle","negative","negative-subtle","warning","warning-subtle","indigo","indigo-subtle","purple","purple-subtle"]} /><TokenFamily title="Actions" tokens={["primary","primary-subtle","danger","button-fill"]} /><TokenFamily title="Trade" tokens={["buy","buy-hover","buy-active","sell","sell-hover","sell-active"]} /><TokenFamily title="Order book" tokens={["book-bid-fill","book-bid-text","book-ask-fill","book-ask-text"]} /><TokenFamily title="Shadows" tokens={["shadow-1","shadow-2","shadow-3","shadow-dialog"]} /><TokenFamily title="Chart" tokens={["bullish","bearish"]} /><TokenFamily title="Radius" tokens={["radius-small","radius-default","radius-medium","radius-large"]} /></div><div className="mt-6 rounded-default border bg-surface-secondary/40 p-3 text-xs leading-5 text-text-secondary">Inputs have no token of their own: a <code className="text-text-primary">--surface</code> field with <code className="text-text-primary">--border</code>, placed on <code className="text-text-primary">--surface-secondary</code>.</div></aside>
    </div>
  </section>;
}

function TokenFamily({ title, tokens }: { title: string; tokens: string[] }) { return <div><p className="mb-2 text-xs font-medium">{title}</p><div className="flex flex-wrap gap-1.5">{tokens.map((token) => <span key={token} className="rounded-default border bg-surface px-2 py-1 font-mono text-[10px] text-text-secondary">{token}</span>)}</div></div>; }
