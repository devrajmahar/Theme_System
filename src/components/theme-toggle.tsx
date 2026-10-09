"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className="inline-flex size-9 items-center justify-center rounded-default border bg-surface"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex size-9 items-center justify-center rounded-default border bg-surface text-icon outline-none transition-colors hover:bg-hover-bg hover:text-icon-active active:bg-active-bg focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-solid focus-visible:outline-ring-primary"
    >
      <HugeiconsIcon
        icon={isDark ? Sun03Icon : Moon02Icon}
        size={20}
        strokeWidth={1.75}
      />
    </button>
  );
}
