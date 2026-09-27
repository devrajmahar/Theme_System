export const DEFAULT_THEME_CSS = `:root {
  /* Surfaces */
  --surface: #ffffff;
  --surface-secondary: #fafafa;

  /* Borders */
  --border: #e7e9e6;
  --border-secondary: var(--border);
  --border-width: 0.5px;
  --input-fill: var(--surface-secondary);
  --input-border: var(--border-secondary);

  /* Text */
  --text-primary: #333333;
  --text-secondary: #7B7B7B;
  --text-muted: #D1D1D1;
  --text-positive: var(--positive);
  --text-negative: var(--negative);
  /* Text on interactive items (buttons, tabs, links). Keep these values in
     step with --icon / --icon-active: normal text = normal icon colour,
     hover/active text = active icon colour. They are separate tokens on
     purpose, never point one at the other. */
  --text-interactive: #646465;
  --text-hover: #404040;
  --text-active: #404040;

  /* Interaction states — fills for hovered / pressed controls.
     Must stay visibly different from --border and --surface-secondary. */
  --hover-bg: #f0f0f0;
  --active-bg: #f0f0f0;

  /* Icons — normal and hovered/pressed/selected */
  --icon: #646465;
  --icon-active: #404040;

  /* Status — gains / losses, success / failure. Shared with the main platform. */
  --positive: #089981;
  --negative: #f7525f;

  /* Actions */
  --primary: #168ef7;
  --primary-foreground: #ffffff;
  --danger: #f7525f;
  --danger-foreground: #ffffff;

  /* Buttons */
  --button-fill: #333333;

  /* Focus */
  --ring: color-mix(in srgb, #141414 20%, transparent);

  /* Radius */
  --radius-default: 8px;
  --radius-medium: 12px;
  --radius-small: 4px;
  --radius-large: 999px;

  /* Chart */
  --bullish: #089981;
  --bearish: #f7525f;
}

.dark {
  /* Surfaces */
  --surface: #141414;
  --surface-secondary: #181818;

  /* Borders */
  --border: color-mix(in srgb, #f0f0f0 8%, transparent);
  --border-secondary: var(--border);
  --border-width: 0.5px;
  --input-fill: var(--surface-secondary);
  --input-border: var(--border-secondary);

  /* Text */
  --text-primary: #f0f0f0;
  --text-secondary: #AEAEB2;
  --text-muted: color-mix(in srgb, #f0f0f0 36%, transparent);
  --text-positive: var(--positive);
  --text-negative: var(--negative);
  --text-interactive: #c2c2c2;
  --text-hover: #f0f0f0;
  --text-active: #f0f0f0;

  /* Interaction states */
  --hover-bg: color-mix(in srgb, #f0f0f0 5%, transparent);
  --active-bg: color-mix(in srgb, #f0f0f0 14%, transparent);

  /* Icons */
  --icon: #c2c2c2;
  --icon-active: #f0f0f0;

  /* Status — gains / losses, success / failure. Shared with the main platform. */
  --positive: #089981;
  --negative: #f7525f;

  /* Actions */
  --primary: #168ef7;
  --primary-foreground: #ffffff;
  --danger: #f7525f;
  --danger-foreground: #ffffff;

  /* Buttons */
  --button-fill: #EBEBEB;

  /* Focus */
  --ring: color-mix(in srgb, #f0f0f0 15%, transparent);

  /* Chart */
  --bullish: #089981;
  --bearish: #f7525f;
}`;

export const TOKEN_GROUPS = [
  { label: "Surfaces", tokens: ["surface", "surface-secondary"] },
  { label: "Inputs", tokens: ["input-fill", "input-border"] },
  { label: "Text", tokens: ["text-primary", "text-secondary", "text-muted", "text-positive", "text-negative", "text-interactive", "text-hover", "text-active"] },
  { label: "States", tokens: ["hover-bg", "active-bg"] },
  { label: "Icons", tokens: ["icon", "icon-active"] },
  { label: "Status", tokens: ["positive", "negative"] },
  { label: "Actions", tokens: ["primary", "primary-foreground", "danger", "danger-foreground", "button-fill"] },
  { label: "Chart", tokens: ["bullish", "bearish"] },
  { label: "Radius", tokens: ["radius-default", "radius-medium", "radius-small", "radius-large"] },
] as const;
