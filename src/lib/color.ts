export interface Oklch {
  /** Lightness, 0–1. */
  l: number;
  /** Chroma, roughly 0–0.37. */
  c: number;
  /** Hue angle in degrees, 0–360. */
  h: number;
}

/** Parses `#rgb` / `#rrggbb` (leading `#` optional) into 0–255 channels. */
export function parseHex(hex: string): [number, number, number] | null {
  const m = hex.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(m)) {
    const [r, g, b] = m.split("").map((ch) => parseInt(ch + ch, 16));
    return [r, g, b];
  }
  if (/^[0-9a-fA-F]{6}$/.test(m)) {
    return [
      parseInt(m.slice(0, 2), 16),
      parseInt(m.slice(2, 4), 16),
      parseInt(m.slice(4, 6), 16),
    ];
  }
  return null;
}

function srgbToLinear(channel: number): number {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/** Converts a hex color to OKLCH (D65, Björn Ottosson's OKLab matrices). */
export function hexToOklch(hex: string): Oklch | null {
  const rgb = parseHex(hex);
  if (!rgb) return null;
  const [r, g, b] = rgb.map(srgbToLinear);

  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const b_ = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

  const C = Math.sqrt(a * a + b_ * b_);
  let H = (Math.atan2(b_, a) * 180) / Math.PI;
  if (H < 0) H += 360;

  return { l: L, c: C, h: C < 0.0001 ? 0 : H };
}

/** Formats as CSS, e.g. `oklch(0.628 0.258 29.2)`. */
export function formatOklch({ l, c, h }: Oklch): string {
  return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(1)})`;
}

export interface OklchAlpha extends Oklch {
  /** Opacity, 0–1. */
  alpha: number;
}

/** Parses `#rgb` / `#rgba` / `#rrggbb` / `#rrggbbaa` (leading `#` optional). */
export function parseHexToRgba(
  hex: string,
): { r: number; g: number; b: number; alpha: number } | null {
  const m = hex.trim().replace(/^#/, "");
  const expand = (ch: string) => parseInt(ch + ch, 16);
  if (/^[0-9a-fA-F]{3}$/.test(m)) {
    const [r, g, b] = m.split("").map(expand);
    return { r, g, b, alpha: 1 };
  }
  if (/^[0-9a-fA-F]{4}$/.test(m)) {
    const [r, g, b, a] = m.split("").map(expand);
    return { r, g, b, alpha: a / 255 };
  }
  if (/^[0-9a-fA-F]{6}$/.test(m)) {
    return {
      r: parseInt(m.slice(0, 2), 16),
      g: parseInt(m.slice(2, 4), 16),
      b: parseInt(m.slice(4, 6), 16),
      alpha: 1,
    };
  }
  if (/^[0-9a-fA-F]{8}$/.test(m)) {
    return {
      r: parseInt(m.slice(0, 2), 16),
      g: parseInt(m.slice(2, 4), 16),
      b: parseInt(m.slice(4, 6), 16),
      alpha: parseInt(m.slice(6, 8), 16) / 255,
    };
  }
  return null;
}

/** Hex (with optional alpha) → OKLCH. */
export function hexToOklchAlpha(hex: string): OklchAlpha | null {
  const rgba = parseHexToRgba(hex);
  if (!rgba) return null;
  const result = hexToOklch(
    `#${[rgba.r, rgba.g, rgba.b].map((v) => v.toString(16).padStart(2, "0")).join("")}`,
  );
  if (!result) return null;
  return { ...result, alpha: rgba.alpha };
}

function trimNumber(value: number, digits: number): string {
  return String(parseFloat(value.toFixed(digits)));
}

/** Formats as CSS, appending `/ <alpha>%` when translucent. */
export function formatOklchCss({ l, c, h, alpha }: OklchAlpha): string {
  const base = `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(1)}`;
  if (alpha >= 0.999) return `${base})`;
  return `${base} / ${trimNumber(alpha * 100, 2)}%)`;
}

/** Parses `oklch(L C H)` / `oklch(L C H / A)` (alpha as number or %). */
export function parseOklch(value: string): OklchAlpha | null {
  const match = value.trim().match(/^oklch\(\s*([^)]+)\)$/i);
  if (!match) return null;
  const [channels, alphaPart] = match[1].split("/");
  const nums = channels
    .trim()
    .split(/\s+/)
    .map((part) => parseFloat(part));
  if (nums.length !== 3 || nums.some((n) => Number.isNaN(n))) return null;
  const [lRaw, c, hRaw] = nums;
  let l = lRaw;
  let h = hRaw;
  if (/%$/.test(channels.trim().split(/\s+/)[0])) l /= 100;
  let alpha = 1;
  if (alphaPart !== undefined) {
    const raw = alphaPart.trim();
    alpha = raw.endsWith("%") ? parseFloat(raw) / 100 : parseFloat(raw);
    if (Number.isNaN(alpha)) return null;
  }
  if (l < 0 || l > 1 || c < 0 || alpha < 0 || alpha > 1) return null;
  h = ((h % 360) + 360) % 360;
  return { l, c, h: c < 0.0001 ? 0 : h, alpha };
}

function linearToSrgb(value: number): number {
  const clamped = Math.min(1, Math.max(0, value));
  return clamped <= 0.0031308
    ? 12.92 * clamped
    : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
}

/** OKLCH (+ optional alpha) → `#rrggbb` / `#rrggbbaa`. */
export function oklchToHex({ l, c, h, alpha = 1 }: OklchAlpha): string {
  const rad = (h * Math.PI) / 180;
  const a = c * Math.cos(rad);
  const b = c * Math.sin(rad);

  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;

  const lms: [number, number, number] = [l_ ** 3, m_ ** 3, s_ ** 3];
  const [lc, mc, sc] = lms;
  const channels = [
    4.0767416621 * lc - 3.3077115913 * mc + 0.2309699292 * sc,
    -1.2684380046 * lc + 2.6097574011 * mc - 0.3413193965 * sc,
    -0.0041960863 * lc - 0.7034186147 * mc + 1.707614701 * sc,
  ].map((v) => Math.round(linearToSrgb(v) * 255));

  const hex = channels.map((v) => v.toString(16).padStart(2, "0")).join("");
  if (alpha >= 0.999) return `#${hex}`;
  return `#${hex}${Math.round(alpha * 255)
    .toString(16)
    .padStart(2, "0")}`;
}

const HEX_TOKEN = /#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})(?![0-9a-fA-F])/g;
const OKLCH_TOKEN = /oklch\([^)]*\)/gi;

/** Applies `convert` to code segments only, leaving block comments intact. */
function convertCssSegments(
  css: string,
  convert: (segment: string) => string,
): string {
  return css
    .split(/(\/\*[\s\S]*?\*\/)/g)
    .map((segment, index) =>
      index % 2 === 1 ? segment : convert(segment),
    )
    .join("");
}

/** Rewrites every hex color in the CSS as its OKLCH equivalent. */
export function convertCssHexToOklch(css: string): string {
  return convertCssSegments(css, (segment) =>
    segment.replace(HEX_TOKEN, (token) => {
      const oklch = hexToOklchAlpha(token);
      return oklch ? formatOklchCss(oklch) : token;
    }),
  );
}

/** Rewrites every `oklch()` color in the CSS as its hex equivalent. */
export function convertCssOklchToHex(css: string): string {
  return convertCssSegments(css, (segment) =>
    segment.replace(OKLCH_TOKEN, (token) => {
      const oklch = parseOklch(token);
      return oklch ? oklchToHex(oklch) : token;
    }),
  );
}
