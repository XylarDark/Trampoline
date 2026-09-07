/**
 * WCAG 2.0 contrast ratios for the palette in app/globals.css.
 *
 * Run with: npm run check:contrast
 *
 * This is the only automated guard on the WCAG 2.0 AA contrast claim in
 * README.md. Our axe-core pass runs against server-rendered HTML in jsdom,
 * which does no layout and never applies the Tailwind stylesheet, so axe
 * returns `incomplete` for `color-contrast` and never evaluates a single
 * ratio. Nothing else in CI would notice a palette edit that drops a badge
 * below 4.5:1 — this script would.
 *
 * It therefore computes the ratios from the token values instead of from
 * rendered pixels: oklch -> oklab -> linear sRGB -> sRGB, then WCAG relative
 * luminance, compositing the translucent tints the way a browser would. The
 * cost of that independence is that the palette below is a transcription. If
 * a token in app/globals.css changes, it has to change here too, or this
 * check goes on passing against colours the app no longer uses.
 *
 * Exits non-zero if any pair falls short, so it can gate a change.
 */

/** oklch() to sRGB, as three 0-255 channels. Matches the CSS Color 4 formulas. */
function oklchToRgb(L, C, hDeg) {
  const h = (hDeg * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;

  const lr = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const lb = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  const gamma = (v) => {
    const clamped = Math.max(0, Math.min(1, v));
    return clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * clamped ** (1 / 2.4) - 0.055;
  };

  return [gamma(lr) * 255, gamma(lg) * 255, gamma(lb) * 255];
}

/** WCAG 2.0 relative luminance from 0-255 sRGB channels. */
function luminance([r, g, b]) {
  const channel = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrast(fg, bg) {
  const a = luminance(fg);
  const b = luminance(bg);
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

/** Composite a translucent foreground colour over an opaque backdrop, as the compositor does. */
function over(color, alpha, backdrop) {
  return color.map((c, i) => c * alpha + backdrop[i] * (1 - alpha));
}

const hex = ([r, g, b]) =>
  "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");

// ---------------------------------------------------------------------------
// Palette, transcribed from the :root and .dark blocks of app/globals.css.
// ---------------------------------------------------------------------------
const LIGHT = {
  background: oklchToRgb(1, 0, 0),
  foreground: oklchToRgb(0.145, 0, 0),
  card: oklchToRgb(1, 0, 0),
  primary: oklchToRgb(0.205, 0, 0),
  primaryForeground: oklchToRgb(0.985, 0, 0),
  secondary: oklchToRgb(0.97, 0, 0),
  secondaryForeground: oklchToRgb(0.205, 0, 0),
  muted: oklchToRgb(0.97, 0, 0),
  mutedForeground: oklchToRgb(0.535, 0, 0),
  destructive: oklchToRgb(0.577, 0.245, 27.325),
  destructiveStrong: oklchToRgb(0.48, 0.22, 27.325),
  border: oklchToRgb(0.922, 0, 0),
};

const DARK = {
  background: oklchToRgb(0.145, 0, 0),
  foreground: oklchToRgb(0.985, 0, 0),
  card: oklchToRgb(0.205, 0, 0),
  primary: oklchToRgb(0.922, 0, 0),
  primaryForeground: oklchToRgb(0.205, 0, 0),
  secondary: oklchToRgb(0.269, 0, 0),
  secondaryForeground: oklchToRgb(0.985, 0, 0),
  muted: oklchToRgb(0.269, 0, 0),
  mutedForeground: oklchToRgb(0.708, 0, 0),
  destructive: oklchToRgb(0.704, 0.191, 22.216),
  destructiveStrong: oklchToRgb(0.704, 0.191, 22.216),
  border: oklchToRgb(1, 0, 0),
};

const PRINT = {
  background: [255, 255, 255],
  foreground: [0, 0, 0],
  mutedForeground: [0x33, 0x33, 0x33],
};

function report(title, cases) {
  console.log("\n" + "=".repeat(96));
  console.log(title);
  console.log("=".repeat(96));
  console.log(
    "  " +
      "what".padEnd(40) +
      "fg".padEnd(10) +
      "bg".padEnd(10) +
      "ratio".padEnd(9) +
      "need".padEnd(7) +
      "verdict",
  );
  let failures = 0;
  for (const { what, fg, bg, need = 4.5 } of cases) {
    const ratio = contrast(fg, bg);
    const pass = ratio >= need;
    if (!pass) failures += 1;
    console.log(
      "  " +
        what.padEnd(40) +
        hex(fg).padEnd(10) +
        hex(bg).padEnd(10) +
        ratio.toFixed(2).padEnd(9) +
        `${need}:1`.padEnd(7) +
        (pass ? "PASS" : "*** FAIL ***"),
    );
  }
  return failures;
}

let failures = 0;

// StatusBadge uses exactly four variants: default, secondary, destructive, outline.
// All badge text is text-xs (12px) and font-medium, so the 4.5:1 normal-text
// threshold applies to every one of them; none reaches the 18.66px-bold or
// 24px large-text exemption.
failures += report("StatusBadge variants, LIGHT theme (badge text is 12px => 4.5:1 required)", [
  {
    what: "default: primary-fg on primary",
    fg: LIGHT.primaryForeground,
    bg: LIGHT.primary,
  },
  {
    what: "secondary: secondary-fg on secondary",
    fg: LIGHT.secondaryForeground,
    bg: LIGHT.secondary,
  },
  {
    what: "destructive: destructive-strong on dest/10",
    fg: LIGHT.destructiveStrong,
    bg: over(LIGHT.destructive, 0.1, LIGHT.background),
  },
  {
    what: "destructive, hovered: on dest/20",
    fg: LIGHT.destructiveStrong,
    bg: over(LIGHT.destructive, 0.2, LIGHT.background),
  },
  { what: "outline: foreground on background", fg: LIGHT.foreground, bg: LIGHT.background },
  // Every badge sits inside a table row, which tints to bg-muted/50 on hover.
  {
    what: "default badge text, row hovered",
    fg: LIGHT.primaryForeground,
    bg: LIGHT.primary,
  },
  {
    what: "outline badge text, row hovered",
    fg: LIGHT.foreground,
    bg: over(LIGHT.muted, 0.5, LIGHT.background),
  },
]);

failures += report("StatusBadge variants, DARK theme (reachable only via a .dark ancestor)", [
  { what: "default: primary-fg on primary", fg: DARK.primaryForeground, bg: DARK.primary },
  {
    what: "secondary: secondary-fg on secondary",
    fg: DARK.secondaryForeground,
    bg: DARK.secondary,
  },
  {
    what: "destructive: dest-strong on dest/20",
    fg: DARK.destructiveStrong,
    bg: over(DARK.destructive, 0.2, DARK.background),
  },
  { what: "outline: foreground on background", fg: DARK.foreground, bg: DARK.background },
]);

failures += report("Body and supporting text", [
  { what: "text-muted-foreground on background", fg: LIGHT.mutedForeground, bg: LIGHT.background },
  { what: "text-muted-foreground on card", fg: LIGHT.mutedForeground, bg: LIGHT.card },
  {
    what: "text-muted-foreground on muted/50 (row hover)",
    fg: LIGHT.mutedForeground,
    bg: over(LIGHT.muted, 0.5, LIGHT.background),
  },
  { what: "text-muted-foreground on muted (full)", fg: LIGHT.mutedForeground, bg: LIGHT.muted },
  { what: "foreground on background", fg: LIGHT.foreground, bg: LIGHT.background },
  { what: "dark: muted-foreground on background", fg: DARK.mutedForeground, bg: DARK.background },
  { what: "dark: muted-foreground on card", fg: DARK.mutedForeground, bg: DARK.card },
]);

// components/database-banner.tsx, which renders only when DATABASE_URL is
// unset. It cannot be reached in this environment, so its colours are checked
// from the Tailwind palette rather than from a rendered page.
failures += report("DatabaseBanner (unreachable while DATABASE_URL is set)", [
  {
    what: "light: amber-900 on amber-50",
    fg: oklchToRgb(0.414, 0.112, 45.904),
    bg: oklchToRgb(0.987, 0.022, 95.277),
  },
  {
    what: "dark: amber-100 on amber-950",
    fg: oklchToRgb(0.962, 0.059, 95.617),
    bg: oklchToRgb(0.279, 0.077, 45.635),
  },
]);

failures += report("Print palette (@media print overrides)", [
  { what: "print foreground on white", fg: PRINT.foreground, bg: PRINT.background },
  { what: "print muted-foreground on white", fg: PRINT.mutedForeground, bg: PRINT.background },
]);

console.log(`\nFAILURES: ${failures}`);

process.exit(failures > 0 ? 1 : 0);
