"use client";

import * as React from "react";
import { Button as BaseButton } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * FancyButton — glossy gradient button on top of Base UI's Button primitive.
 *
 * Preserved visual traits:
 * - 4 variants (neutral / primary / destructive / basic), 3 sizes
 *   (medium / small / xsmall), default neutral + medium
 * - Gradient gloss overlays (`::before` inner 1px highlight + `::after`
 *   white sheen at 16% -> 24% on hover) for neutral/primary/destructive
 * - Per-variant shadows + rings, basic stroke treatment with hover fill
 * - Spacing/typography/icon positioning (h-10/9/8, gap-3, label-sm,
 *   20px icons with -mx-1 optical inset)
 * - Disabled strips gradients + shadows and falls back to muted tokens
 *
 * Theme mapping (existing tokens reused; only shadows are additive):
 * - neutral  -> bg `--button-fill`, light `#f0f0f0` / dark `#333333` text
 *   (mirrors the existing `inverted` showcase pattern; inverts between
 *   light and dark themes)
 * - primary  -> bg `--primary` / text `--primary-foreground`
 * - destructive -> bg `--danger` / text `--danger-foreground`
 * - basic    -> bg `--surface`, text `--text-secondary`,
 *   hover `--surface-secondary` + `--text-primary`
 * - disabled -> bg `--surface-secondary`, text `--text-muted`
 * - focus    -> `outline` in `--ring` (outline, not box-shadow, so the
 *   fancy per-variant shadows are never clobbered on keyboard focus)
 */

const fancyButtonVariants = cva(
  [
    // base styles
    "group relative inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap",
    "text-sm font-medium tracking-[-0.006em] outline-none",
    "transition duration-200 ease-out",
    "focus:outline-none",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
    // disabled: strip gradients/shadows, muted tokens from theme
    "disabled:pointer-events-none disabled:bg-[var(--surface-secondary)] disabled:bg-none disabled:text-[var(--text-muted)] disabled:shadow-none disabled:before:hidden disabled:after:hidden",
    // icon normalization: default 20px, respect explicit sizes
    "[&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  ].join(" "),
  {
    variants: {
      variant: {
        neutral:
          "bg-[var(--button-fill)] text-[#f0f0f0] shadow-[var(--fancy-shadow-neutral)] dark:text-[#333333]",
        primary:
          "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[var(--fancy-shadow-primary)]",
        destructive:
          "bg-[var(--danger)] text-[var(--danger-foreground)] shadow-[var(--fancy-shadow-destructive)]",
        basic:
          "bg-[var(--surface)] text-[var(--text-secondary)] shadow-[var(--fancy-shadow-basic)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)] hover:shadow-none",
      },
      size: {
        medium: "h-10 gap-3 rounded-[10px] px-3.5",
        small: "h-9 gap-3 rounded-[var(--radius-default)] px-3",
        xsmall: "h-8 gap-3 rounded-[var(--radius-default)] px-2.5",
      },
    },
    compoundVariants: [
      // Gloss overlays for the three filled variants:
      // ::before = 1px inner top highlight (masked border), ::after = sheen.
      // Gloss white is intentionally non-themeable (always white).
      {
        variant: ["neutral", "primary", "destructive"],
        className: [
          "before:pointer-events-none before:absolute before:inset-0 before:z-10 before:rounded-[inherit]",
          "before:bg-gradient-to-b before:p-px",
          "before:from-white/[.12] before:to-transparent",
          "before:[mask-clip:content-box,border-box] before:[mask-composite:exclude] before:[mask-image:linear-gradient(#fff_0_0),linear-gradient(#fff_0_0)]",
          "after:absolute after:inset-0 after:rounded-[inherit] after:bg-gradient-to-b after:from-white after:to-transparent",
          "after:pointer-events-none after:opacity-[.16] after:transition after:duration-200 after:ease-out",
          "hover:after:opacity-[.24]",
        ].join(" "),
      },
    ],
    defaultVariants: {
      variant: "neutral",
      size: "medium",
    },
  },
);

const iconSlotClass =
  "relative z-10 -mx-1 inline-flex size-5 shrink-0 items-center justify-center [&_svg]:size-full";

function FancySpinner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn(iconSlotClass, "animate-spin", className)}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="4"
      />
      <path
        d="M22 12a10 10 0 0 0-10-10"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export type FancyButtonVariant = "neutral" | "primary" | "destructive" | "basic";
export type FancyButtonSize = "medium" | "small" | "xsmall";

export interface FancyButtonProps
  extends Omit<
      BaseButton.Props,
      "children" | "className" | "style" | "color" | "defaultValue" | "defaultChecked"
    >,
    VariantProps<typeof fancyButtonVariants> {
  /** Icon rendered before the label. */
  leadingIcon?: React.ReactNode;
  /** Icon rendered after the label. */
  trailingIcon?: React.ReactNode;
  /** Shows a spinner, disables interaction, and sets `aria-busy`. */
  loading?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const FancyButton = React.forwardRef<HTMLButtonElement, FancyButtonProps>(
  function FancyButton(
    {
      variant = "neutral",
      size = "medium",
      leadingIcon,
      trailingIcon,
      loading = false,
      disabled,
      type = "button",
      children,
      className,
      ...rest
    },
    forwardedRef,
  ) {
    const isDisabled = disabled || loading;
    const hasText = children !== undefined && children !== null && children !== false;
    // Icon-only buttons stay square within the same 3-size scale (no new
    // size variants): width tracks height, horizontal padding collapses.
    const isIconOnly =
      !hasText && !loading && (!!leadingIcon !== !!trailingIcon);
    const isLoadingIconOnly = loading && !hasText && !leadingIcon && !trailingIcon;

    return (
      <BaseButton
        // Base UI handles native semantics, disabled behavior,
        // and keyboard interaction (Space/Enter) for us.
        ref={forwardedRef as React.Ref<HTMLElement>}
        type={type}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        data-variant={variant}
        data-size={size}
        data-loading={loading || undefined}
        className={cn(
          fancyButtonVariants({ variant, size }),
          (isIconOnly || isLoadingIconOnly) &&
            (size === "medium"
              ? "w-10 gap-0 px-0"
              : size === "small"
                ? "w-9 gap-0 px-0"
                : "w-8 gap-0 px-0"),
          className,
        )}
        {...rest}
      >
        {loading ? (
          <FancySpinner />
        ) : leadingIcon ? (
          <span data-slot="fancy-button-leading" className={iconSlotClass}>
            {leadingIcon}
          </span>
        ) : null}
        {children}
        {!loading && trailingIcon ? (
          <span data-slot="fancy-button-trailing" className={iconSlotClass}>
            {trailingIcon}
          </span>
        ) : null}
      </BaseButton>
    );
  },
);

FancyButton.displayName = "FancyButton";

export { fancyButtonVariants };
export default FancyButton;
