import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

// Mirrors Conduit's Button: default = neutral fill, secondary = brand blue,
// outline = surface + border, ghost = text only. Focus is a 2px outline.
// Hover/press change the fill only — no hover shadow (our choice; Conduit adds shadow-1).
const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-solid";
export function Button({ variant = "default", size = "default", className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "secondary" | "outline" | "ghost" | "destructive"; size?: "default" | "sm" | "lg" | "icon" }) {
  const variants = {
    default: `border-transparent bg-button-fill text-button-fill-foreground hover:bg-button-fill-hover active:bg-button-fill-active disabled:bg-disabled-bg disabled:text-text-muted ${focusRing} focus-visible:outline-border-strong`,
    secondary: `border-transparent bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active disabled:bg-primary-disabled disabled:text-primary-disabled-foreground ${focusRing} focus-visible:outline-primary-ring`,
    outline: `border-border bg-surface text-text-default hover:border-transparent hover:bg-hover-bg active:border-transparent active:bg-active-bg disabled:border-transparent disabled:bg-disabled-bg disabled:text-text-muted ${focusRing} focus-visible:outline-border-strong`,
    ghost: `border-transparent text-text-default hover:bg-hover-bg active:bg-active-bg disabled:bg-disabled-bg disabled:text-text-muted ${focusRing} focus-visible:outline-border-strong`,
    destructive: `border-transparent bg-danger text-danger-foreground hover:bg-danger/90 active:bg-danger/85 disabled:bg-danger-disabled disabled:text-danger-disabled-foreground ${focusRing} focus-visible:outline-danger-ring`,
  };
  const sizes = {
    sm: "h-6 gap-1 rounded-button px-2 text-xs leading-[14px] [&_svg]:size-3.5",
    default: "h-7 gap-1.5 rounded-button px-2.5 text-sm leading-4 [&_svg]:size-3.5",
    lg: "h-8 gap-1.5 rounded-default px-3 text-sm leading-4 [&_svg]:size-4",
    icon: "size-7 rounded-button [&_svg]:size-3.5",
  };
  return <button className={`inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap border font-medium outline-none disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 ${variants[variant]} ${sizes[size]} ${className}`} {...props} />;
}
// Mirrors Conduit's badges: default/destructive = solid pill, secondary = gray
// status tag (surface-subtle), outline = dashed pill on the neutral tint.
export function Badge({ variant = "default", className = "", ...props }: HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "secondary" | "outline" | "destructive" }) {
  const variants = {
    default: "h-5 min-w-5 rounded-large px-1.5 bg-primary text-primary-foreground",
    destructive: "h-5 min-w-5 rounded-large px-1.5 bg-danger text-danger-foreground",
    secondary: "h-5 gap-1 rounded-large border border-border-subtle bg-surface-subtle px-1.5 text-text-secondary",
    outline: "h-5 gap-1.5 rounded-large border border-dashed border-border-inverse bg-button-fill-subtle px-2 text-text-default",
  };
  return <span className={`inline-flex shrink-0 items-center justify-center overflow-clip text-xs font-medium leading-[14px] [&_svg]:pointer-events-none [&_svg]:size-3 [&_svg]:shrink-0 ${variants[variant]} ${className}`} {...props} />;
}
// Input: no input token — a --surface-secondary field with --border.
export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) { return <input className={`h-8 w-full min-w-0 rounded-default border border-border bg-surface-secondary px-2.5 py-1 text-base leading-6 text-text-default outline-none transition-colors placeholder:text-text-muted hover:bg-hover-bg focus-visible:border-border-strong focus-visible:bg-hover-bg focus-visible:ring-[3px] focus-visible:ring-border-strong/50 aria-invalid:border-danger aria-invalid:ring-[3px] aria-invalid:ring-danger/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-disabled-bg disabled:opacity-50 md:text-sm md:leading-[21px] ${className}`} {...props} />; }
export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={`rounded-medium border bg-surface text-text-primary ${className}`} {...props} />; }
export function CardHeader({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={`flex flex-col gap-1.5 p-6 ${className}`} {...props} />; }
export function CardTitle({ className = "", ...props }: HTMLAttributes<HTMLHeadingElement>) { return <h3 className={`font-semibold leading-none tracking-tight ${className}`} {...props} />; }
export function CardDescription({ className = "", ...props }: HTMLAttributes<HTMLParagraphElement>) { return <p className={`text-sm text-text-secondary ${className}`} {...props} />; }
export function CardContent({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={`px-6 pb-6 ${className}`} {...props} />; }
export function Label({ children, className = "", ...props }: HTMLAttributes<HTMLLabelElement> & { children: ReactNode }) { return <label className={`text-sm font-medium leading-none ${className}`} {...props}>{children}</label>; }
// Validation message under a field (Conduit: 12/14px regular, destructive text). Pair with aria-invalid on the input.
export function FieldError({ className = "", ...props }: HTMLAttributes<HTMLParagraphElement>) { return <p role="alert" className={`text-xs font-normal leading-[14px] text-text-danger ${className}`} {...props} />; }
