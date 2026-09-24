export const DEFAULT_THEME_CSS = `:root {
  /* Surfaces */
  --surface: #ffffff;
  --surface-secondary: #fafafa;

  /* Borders */
  --border: #1414140f;
  --border-secondary: var(--border);
  --border-width: 0.5px;
  --input-fill: var(--surface-secondary);
  --input-border: var(--border-secondary);

  /* Text */
  --text-primary: #333333;
  --text-secondary: #7B7B7B;
  --text-muted: #D1D1D1;

  /* Interaction states */
  --hover-bg: #14141409;
  --active-bg: #1414140d;

  /* Icons */
  --icon: #14141480;
  --icon-active: #141414;

  /* Actions */
  --primary: #168ef7;
  --primary-foreground: #fff;
  --danger: #fb3748;
  --danger-foreground: #ffffff;

  /* Buttons */
  --button-fill: #333333;

  /* Focus */
  --ring: #14141433;

  /* Radius */
  --radius-default: 8px;
  --radius-medium: 12px;
  --radius-small: 4px;
  --radius-large: 999px;

  /* Chart */
  --bullish: #089981;
  --bearish: #f7525f;

  /* FancyButton shadows (additive) */
  --fancy-shadow-neutral: 0 1px 2px 0 #1b1c1d7a, 0 0 0 1px #242628;
  --fancy-shadow-primary: 0 1px 2px 0 #0e121b3d, 0 0 0 1px var(--primary);
  --fancy-shadow-destructive: 0 1px 2px 0 #0e121b3d, 0 0 0 1px var(--danger);
  --fancy-shadow-basic: 0 1px 3px 0 #0e121b1f, 0 0 0 1px #ebebeb;
}

.dark {
  /* Surfaces */
  --surface: #141414;
  --surface-secondary: #181818;

  /* Borders */
  --border: #f0f0f014;
  --border-secondary: var(--border);
  --border-width: 0.5px;
  --input-fill: var(--surface-secondary);
  --input-border: var(--border-secondary);

  /* Text */
  --text-primary: #f0f0f0;
  --text-secondary: #AEAEB2;
  --text-muted: #f0f0f05c;

  /* Interaction states */
  --hover-bg: #f0f0f014;
  --active-bg: #f0f0f024;

  /* Icons */
  --icon: #f0f0f0a8;
  --icon-active: #f0f0f0;

  /* Actions */
  --primary: #168ef7;
  --primary-foreground: #fff;
  --danger: #fb3748;
  --danger-foreground: #ffffff;

  /* Buttons */
  --button-fill: #EBEBEB;

  /* Focus */
  --ring: #f0f0f026;

  /* Chart */
  --bullish: #7c8db0;
  --bearish: #98615c;

  /* FancyButton shadows (additive) */
  --fancy-shadow-neutral: 0 1px 2px 0 #00000066, 0 0 0 1px #242628;
  --fancy-shadow-primary: 0 1px 2px 0 #00000066, 0 0 0 1px var(--primary);
  --fancy-shadow-destructive: 0 1px 2px 0 #00000066, 0 0 0 1px var(--danger);
  --fancy-shadow-basic: 0 1px 3px 0 #00000055, 0 0 0 1px #262626;
}`;

export const TOKEN_GROUPS = [
  { label: "Surfaces", tokens: ["surface", "surface-secondary"] },
  { label: "Inputs", tokens: ["input-fill", "input-border"] },
  { label: "Text", tokens: ["text-primary", "text-secondary", "text-muted"] },
  { label: "States", tokens: ["hover-bg", "active-bg"] },
  { label: "Icons", tokens: ["icon", "icon-active"] },
  { label: "Actions", tokens: ["primary", "primary-foreground", "danger", "danger-foreground", "button-fill"] },
  { label: "Fancy", tokens: ["fancy-shadow-neutral", "fancy-shadow-primary", "fancy-shadow-destructive", "fancy-shadow-basic"] },
  { label: "Chart", tokens: ["bullish", "bearish"] },
  { label: "Radius", tokens: ["radius-default", "radius-medium", "radius-small", "radius-large"] },
] as const;
