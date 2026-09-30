"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/showcase";

// Order book: --book-{bid,ask}-fill is the cumulative depth bar, --book-{bid,ask}-text the price drawn
// over it (tuned to pass 4.5:1 on its own fill). Size / total use the regular text tokens.
type Level = { price: number; size: number };
const LEVELS = 8, TICK = 0.5, MID = 64215.25;

// Deterministic seed so server and client render the same first frame.
function seeded(n: number) { const x = Math.sin(n * 9301 + 49297) * 233280; return x - Math.floor(x); }
const initial = (side: "bid" | "ask"): Level[] => Array.from({ length: LEVELS }, (_, i) => ({
  price: side === "ask" ? MID + TICK / 2 + i * TICK : MID - TICK / 2 - i * TICK,
  size: +(0.05 + seeded(i + (side === "ask" ? 100 : 0)) * 2.4).toFixed(4),
}));

const fmtPrice = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtSize = (n: number) => n.toFixed(4);
const cumulative = (levels: Level[]) => { let t = 0; return levels.map((l) => (t += l.size)); };

function Row({ side, level, total, max }: { side: "bid" | "ask"; level: Level; total: number; max: number }) {
  const bid = side === "bid";
  return <div className="relative grid h-6 grid-cols-3 items-center px-3 text-xs tabular-nums hover:bg-hover-bg">
    <span aria-hidden className={`absolute inset-y-0 right-0 transition-[width] duration-300 ${bid ? "bg-book-bid-fill" : "bg-book-ask-fill"}`} style={{ width: `${(total / max) * 100}%` }} />
    <span className={`relative font-medium ${bid ? "text-book-bid-text" : "text-book-ask-text"}`}>{fmtPrice(level.price)}</span>
    <span className="relative text-right text-text-default">{fmtSize(level.size)}</span>
    <span className="relative text-right text-text-secondary">{fmtSize(total)}</span>
  </div>;
}

export function OrderBookCard() {
  const [bids, setBids] = useState(() => initial("bid"));
  const [asks, setAsks] = useState(() => initial("ask"));
  const [last, setLast] = useState({ price: MID + TICK / 2, up: true });
  const [live, setLive] = useState(true);
  const tick = useRef(0);

  useEffect(() => {
    if (!live || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      const n = ++tick.current;
      const nudge = (side: "bid" | "ask") => (levels: Level[]) => levels.map((l, i) => {
        if (seeded(n * 31 + i + (side === "ask" ? 7 : 0)) > 0.3) return l;
        return { ...l, size: +Math.max(0.01, l.size * (0.6 + seeded(n * 17 + i) * 0.8)).toFixed(4) };
      });
      setBids(nudge("bid")); setAsks(nudge("ask"));
      if (seeded(n * 5) > 0.55) { const up = seeded(n * 11) > 0.5; setLast({ price: up ? MID + TICK / 2 : MID - TICK / 2, up }); }
    }, 1400);
    return () => clearInterval(id);
  }, [live]);

  const bidTotals = cumulative(bids), askTotals = cumulative(asks);
  const max = Math.max(bidTotals.at(-1)!, askTotals.at(-1)!);
  const spread = asks[0].price - bids[0].price;
  const bidShare = Math.round((bidTotals.at(-1)! / (bidTotals.at(-1)! + askTotals.at(-1)!)) * 100);

  return <Card><CardHeader className="pb-4"><div className="flex items-start justify-between gap-3"><div><CardTitle className="text-base">Order book</CardTitle><CardDescription className="mt-1.5">Depth fills with the price text drawn over them.</CardDescription></div>
    <button type="button" aria-pressed={live} onClick={() => setLive((v) => !v)} className="inline-flex h-6 shrink-0 items-center gap-1.5 rounded-button border px-2 text-xs font-medium text-text-default hover:border-transparent hover:bg-hover-bg active:bg-active-bg"><span className={`size-1.5 rounded-full ${live ? "bg-positive" : "bg-text-muted"}`} />{live ? "Live" : "Paused"}</button></div></CardHeader>
    <CardContent className="grid gap-3">
      <div className="overflow-hidden rounded-default border">
        <div className="grid h-7 grid-cols-3 items-center border-b px-3 text-[11px] font-medium text-text-secondary"><span>Price (USDT)</span><span className="text-right">Size (BTC)</span><span className="text-right">Total</span></div>
        <div className="flex flex-col-reverse py-1">{asks.map((l, i) => <Row key={i} side="ask" level={l} total={askTotals[i]} max={max} />)}</div>
        <div className="flex h-9 items-center justify-between border-y px-3">
          <span className={`text-base font-semibold tabular-nums ${last.up ? "text-book-bid-text" : "text-book-ask-text"}`}>{fmtPrice(last.price)} <span aria-hidden className="text-xs">{last.up ? "▲" : "▼"}</span></span>
          <span className="text-xs tabular-nums text-text-secondary">Spread {fmtPrice(spread)} · {((spread / last.price) * 100).toFixed(3)}%</span>
        </div>
        <div className="py-1">{bids.map((l, i) => <Row key={i} side="bid" level={l} total={bidTotals[i]} max={max} />)}</div>
      </div>
      {/* Bid / ask ratio: same fill + text pairs, side by side */}
      <div className="flex h-6 overflow-hidden rounded-button text-[11px] font-semibold tabular-nums">
        <div className="flex items-center bg-book-bid-fill px-2 text-book-bid-text transition-[width] duration-300" style={{ width: `${bidShare}%` }}>B {bidShare}%</div>
        <div className="flex flex-1 items-center justify-end bg-book-ask-fill px-2 text-book-ask-text">{100 - bidShare}% S</div>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-text-secondary">
        {["book-bid-fill", "book-bid-text", "book-ask-fill", "book-ask-text"].map((t) => <span key={t} className="inline-flex items-center gap-1.5 font-mono"><span className="size-2.5 rounded-small border" style={{ background: `var(--${t})` }} />--{t}</span>)}
      </div>
    </CardContent></Card>;
}
