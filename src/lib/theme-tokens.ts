export const DEFAULT_THEME_CSS = `:root {
  /* Surfaces */
  --surface: #ffffff;
  --surface-secondary: #fafafa;
  --surface-subtle: #fafafa;
  --surface-raised: #f0f0f0;
  --surface-overlay: color-mix(in srgb, #000000 50%, transparent);
  --surface-inverse: #222222;

  /* Borders */
  --border: #e5e5e5;
  --border-secondary: var(--border);
  --border-subtle: #f0f0f0;
  --border-softer: #f5f5f5;
  --border-strong: #c2c2c2;
  --border-inverse: #222222;
  --border-width: 0.5px;

  /* Text */
  --text-primary: #222222;
  --text-default: #404040;
  --text-secondary: #646465;
  --text-muted: #c2c2c2;
  --text-positive: var(--positive);
  --text-negative: var(--negative);
  --text-danger: var(--danger);
  --text-warning: #ff6900;
  /* Text on interactive items (buttons, tabs, links). Keep these values in
     step with --icon / --icon-active: normal text = normal icon colour,
     hover/active text = active icon colour. They are separate tokens on
     purpose, never point one at the other. */
  --text-interactive: #646465;
  --text-hover: #404040;
  --text-active: #404040;

  /* Interaction states — hover / selected fill, pressed fill, disabled fill. */
  --hover-bg: #f0f0f0;
  --active-bg: #e5e5e5;
  --disabled-bg: #e5e5e5;

  /* Icons — normal and hovered/pressed/selected */
  --icon: #646465;
  --icon-active: #404040;

  /* Status — gains / losses, success / failure. Shared with the main platform. */
  --positive: #089981;
  --positive-subtle: #dbfce7;
  --negative: #f7525f;
  --negative-subtle: #ffe2e2;
  --warning: #ff6900;
  --warning-subtle: #ffedd4;
  --indigo: #615fff;
  --indigo-subtle: #e0e7ff;
  --purple: #ad46ff;
  --purple-subtle: #f3e8ff;

  /* Actions */
  --primary: #0091ff;
  --primary-hover: #0077fa;
  --primary-active: #0050b2;
  --primary-disabled: #b7d9f8;
  --primary-disabled-foreground: #5eb0ef;
  --primary-ring: #cee7fe;
  --primary-subtle: #e1f0ff;
  --primary-foreground: #ffffff;
  --danger: #f7525f;
  --danger-disabled: #ffc9c9;
  --danger-disabled-foreground: #ffa2a2;
  --danger-ring: #ffc9c9;
  --danger-foreground: #ffffff;

  /* Buttons — neutral default button */
  --button-fill: #333333;
  --button-fill-hover: #404040;
  --button-fill-active: #222222;
  --button-fill-foreground: #ffffff;
  --button-fill-subtle: #f5f5f5;

  /* Focus */
  --ring: color-mix(in srgb, #c2c2c2 50%, transparent);

  /* Radius */
  --radius-default: 8px;
  --radius-medium: 12px;
  --radius-small: 4px;
  --radius-large: 999px;
  --radius-button: 6px;

  /* Shadows */
  --shadow-1: 0 0 1px 0 color-mix(in srgb, #000000 20%, transparent), 0 1px 2px 0 color-mix(in srgb, #000000 5%, transparent), 0 1px 1px 0 color-mix(in srgb, #000000 1%, transparent);
  --shadow-2: 0 1px 6px 0 color-mix(in srgb, #000000 10%, transparent);
  --shadow-3: 0 2.75px 5.5px 0 color-mix(in srgb, #000000 10%, transparent);
  --shadow-dialog: 0 4px 6px -4px color-mix(in srgb, #101828 10%, transparent), 0 10px 15px -3px color-mix(in srgb, #000000 10%, transparent);

  /* Chart */
  --bullish: #089981;
  --bearish: #f7525f;
}

.dark {
  /* Surfaces */
  --surface: #1f1f1f;
  --surface-secondary: #222222;
  --surface-subtle: #2b2b2b;
  --surface-raised: #333333;
  --surface-overlay: color-mix(in srgb, #000000 60%, transparent);
  --surface-inverse: #ffffff;

  /* Borders */
  --border: #333333;
  --border-secondary: var(--border);
  --border-subtle: #333333;
  --border-softer: #2b2b2b;
  --border-strong: #404040;
  --border-inverse: #ffffff;
  --border-width: 0.5px;

  /* Text */
  --text-primary: #f5f5f5;
  --text-default: #f0f0f0;
  --text-secondary: #c2c2c2;
  --text-muted: #808080;
  --text-positive: var(--positive);
  --text-negative: var(--negative);
  --text-danger: #ffa2a2;
  --text-warning: #ffb86a;
  --text-interactive: #c2c2c2;
  --text-hover: #f0f0f0;
  --text-active: #f0f0f0;

  /* Interaction states */
  --hover-bg: #333333;
  --active-bg: #404040;
  --disabled-bg: #404040;

  /* Icons */
  --icon: #c2c2c2;
  --icon-active: #f0f0f0;

  /* Status — gains / losses, success / failure. Shared with the main platform. */
  --positive: #089981;
  --positive-subtle: #0d542b;
  --negative: #f7525f;
  --negative-subtle: #460809;
  --warning: #ff6900;
  --warning-subtle: #7e2a0c;
  --indigo: #615fff;
  --indigo-subtle: #312c85;
  --purple: #ad46ff;
  --purple-subtle: #59168b;

  /* Actions */
  --primary: #0091ff;
  --primary-hover: #0077fa;
  --primary-active: #0050b2;
  --primary-disabled: #5eb0ef;
  --primary-disabled-foreground: #b7d9f8;
  --primary-ring: #5eb0ef;
  --primary-subtle: #0050b2;
  --primary-foreground: #ffffff;
  --danger: #f7525f;
  --danger-disabled: #9f0712;
  --danger-disabled-foreground: #ff6467;
  --danger-ring: #c10007;
  --danger-foreground: #ffffff;

  /* Buttons — neutral default button */
  --button-fill: #f5f5f5;
  --button-fill-hover: #f0f0f0;
  --button-fill-active: #e5e5e5;
  --button-fill-foreground: #404040;
  --button-fill-subtle: #222222;

  /* Focus */
  --ring: color-mix(in srgb, #404040 50%, transparent);

  /* Chart */
  --bullish: #089981;
  --bearish: #f7525f;
}`;

export const TOKEN_GROUPS = [
  { label: "Surfaces", tokens: ["surface", "surface-secondary", "surface-subtle", "surface-raised", "surface-overlay", "surface-inverse"] },
  { label: "Borders", tokens: ["border", "border-secondary", "border-subtle", "border-softer", "border-strong", "border-inverse"] },
  { label: "Text", tokens: ["text-primary", "text-default", "text-secondary", "text-muted", "text-positive", "text-negative", "text-danger", "text-warning", "text-interactive", "text-hover", "text-active"] },
  { label: "States", tokens: ["hover-bg", "active-bg", "disabled-bg"] },
  { label: "Icons", tokens: ["icon", "icon-active"] },
  { label: "Status", tokens: ["positive", "positive-subtle", "negative", "negative-subtle", "warning", "warning-subtle", "indigo", "indigo-subtle", "purple", "purple-subtle"] },
  { label: "Actions", tokens: ["primary", "primary-hover", "primary-active", "primary-disabled", "primary-ring", "primary-subtle", "primary-foreground", "danger", "danger-disabled", "danger-ring", "danger-foreground", "button-fill", "button-fill-hover", "button-fill-active", "button-fill-foreground", "button-fill-subtle"] },
  { label: "Shadows", tokens: ["shadow-1", "shadow-2", "shadow-3", "shadow-dialog"] },
  { label: "Chart", tokens: ["bullish", "bearish"] },
  { label: "Radius", tokens: ["radius-default", "radius-medium", "radius-small", "radius-large", "radius-button"] },
] as const;
