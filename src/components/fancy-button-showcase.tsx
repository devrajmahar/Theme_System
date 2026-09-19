"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  ArrowRight01Icon,
  Delete02Icon,
  Download01Icon,
  PlusSignIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { FancyButton } from "@/components/ui/fancy-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/showcase";

function RowLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="w-24 shrink-0 text-xs font-medium text-text-secondary">
      {children}
    </p>
  );
}

export function FancyButtonShowcase() {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">FancyButton · variants</CardTitle>
          <CardDescription>
            Glossy buttons on Base UI — neutral (default), primary,
            destructive, basic. Hover for the gloss lift; Tab for the focus
            outline.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-2">
          <FancyButton variant="neutral">Neutral</FancyButton>
          <FancyButton variant="primary">Primary</FancyButton>
          <FancyButton variant="destructive">Destructive</FancyButton>
          <FancyButton variant="basic">Basic</FancyButton>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Sizes</CardTitle>
          <CardDescription>
            medium (default, h-10) · small (h-9) · xsmall (h-8).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {(
            [
              ["neutral", "Neutral"],
              ["primary", "Primary"],
              ["destructive", "Destructive"],
              ["basic", "Basic"],
            ] as const
          ).map(([variant, label]) => (
            <div key={variant} className="flex flex-wrap items-center gap-2">
              <RowLabel>{label}</RowLabel>
              <FancyButton variant={variant} size="medium">
                Medium
              </FancyButton>
              <FancyButton variant={variant} size="small">
                Small
              </FancyButton>
              <FancyButton variant={variant} size="xsmall">
                Xsmall
              </FancyButton>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Leading / trailing icons</CardTitle>
          <CardDescription>
            20px icons with an optical -mx-1 inset. Icons sit above
            the gloss layer (z-10).
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-2">
          <FancyButton
            variant="neutral"
            leadingIcon={<HugeiconsIcon icon={Download01Icon} size={20} />}
          >
            Download
          </FancyButton>
          <FancyButton
            variant="primary"
            trailingIcon={<HugeiconsIcon icon={ArrowRight01Icon} size={20} />}
          >
            Continue
          </FancyButton>
          <FancyButton
            variant="destructive"
            leadingIcon={<HugeiconsIcon icon={Delete02Icon} size={20} />}
            trailingIcon={<HugeiconsIcon icon={ArrowRight01Icon} size={20} />}
          >
            Delete
          </FancyButton>
          <FancyButton
            variant="basic"
            size="small"
            leadingIcon={<HugeiconsIcon icon={Search01Icon} size={20} />}
          >
            Search
          </FancyButton>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Icon-only buttons</CardTitle>
          <CardDescription>
            Same three sizes — width tracks height for a square button.
            Always provide an <code>aria-label</code>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <RowLabel>Sizes</RowLabel>
            <FancyButton
              size="medium"
              aria-label="Add item"
              leadingIcon={<HugeiconsIcon icon={PlusSignIcon} size={20} />}
            />
            <FancyButton
              size="small"
              aria-label="Add item"
              leadingIcon={<HugeiconsIcon icon={PlusSignIcon} size={20} />}
            />
            <FancyButton
              size="xsmall"
              aria-label="Add item"
              leadingIcon={<HugeiconsIcon icon={PlusSignIcon} size={20} />}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <RowLabel>Variants</RowLabel>
            <FancyButton
              variant="neutral"
              aria-label="Add item"
              leadingIcon={<HugeiconsIcon icon={Add01Icon} size={20} />}
            />
            <FancyButton
              variant="primary"
              aria-label="Add item"
              leadingIcon={<HugeiconsIcon icon={Add01Icon} size={20} />}
            />
            <FancyButton
              variant="destructive"
              aria-label="Delete item"
              leadingIcon={<HugeiconsIcon icon={Delete02Icon} size={20} />}
            />
            <FancyButton
              variant="basic"
              aria-label="Search"
              leadingIcon={<HugeiconsIcon icon={Search01Icon} size={20} />}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Loading states</CardTitle>
          <CardDescription>
            <code>loading</code> shows a spinner, disables the button, and
            sets <code>aria-busy</code>. Layout stays stable.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-2">
          <FancyButton variant="neutral" loading>
            Saving…
          </FancyButton>
          <FancyButton variant="primary" loading>
            Processing…
          </FancyButton>
          <FancyButton variant="destructive" loading>
            Deleting…
          </FancyButton>
          <FancyButton variant="basic" loading>
            Loading…
          </FancyButton>
          <FancyButton variant="primary" size="small" loading aria-label="Saving">
            Saving
          </FancyButton>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Disabled states</CardTitle>
          <CardDescription>
            Gradients and shadows are stripped; muted theme tokens take over —
            identical treatment across all variants.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-2">
          <FancyButton variant="neutral" disabled>
            Neutral
          </FancyButton>
          <FancyButton variant="primary" disabled>
            Primary
          </FancyButton>
          <FancyButton variant="destructive" disabled>
            Destructive
          </FancyButton>
          <FancyButton variant="basic" disabled>
            Basic
          </FancyButton>
        </CardContent>
      </Card>
    </div>
  );
}

export default FancyButtonShowcase;
