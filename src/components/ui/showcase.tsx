import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

const focus = "outline-none focus-visible:border-ring focus-visible:ring-[2px] focus-visible:ring-ring/50";

export function Button({ variant = "default", size = "default", className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "secondary" | "outline" | "ghost" | "destructive" | "inverted"; size?: "default" | "sm" | "icon" }) {
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/85 [&_svg]:text-primary-foreground",
    inverted: "bg-surface-inverted text-surface-inverted-foreground hover:bg-surface-inverted/90 active:bg-surface-inverted/85 [&_svg]:text-surface-inverted-foreground",
    secondary: "ui-secondary border text-secondary-foreground [&_svg]:text-icon hover:[&_svg]:text-icon-active",
    outline: "border bg-background text-foreground hover:bg-hover-bg active:bg-active-bg [&_svg]:text-icon hover:[&_svg]:text-icon-active",
    ghost: "text-foreground hover:bg-hover-bg active:bg-active-bg [&_svg]:text-icon hover:[&_svg]:text-icon-active",
    destructive: "bg-danger text-danger-foreground hover:bg-danger/90 active:bg-danger/85 [&_svg]:text-danger-foreground",
  };
  const sizes = { default: "h-9 px-4 py-2", sm: "h-8 rounded-md px-3 text-xs", icon: "size-9" };
  return <button className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-[var(--radius-default)] text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-45 ${focus} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />;
}
export function Badge({ variant = "default", className = "", ...props }: HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "secondary" | "outline" | "destructive" }) {
  const variants = { default: "border-transparent bg-primary text-primary-foreground", secondary: "border-transparent bg-secondary text-secondary-foreground", outline: "text-foreground", destructive: "border-transparent bg-danger text-danger-foreground" };
  return <span className={`inline-flex items-center rounded-[var(--radius-large)] border px-2.5 py-0.5 text-xs font-semibold ${variants[variant]} ${className}`} {...props} />;
}
export function Input({ className = "", style, ...props }: InputHTMLAttributes<HTMLInputElement>) { return <input style={{ backgroundColor: "var(--input-fill)", borderColor: "var(--input-border)", ...style }} className={`flex h-9 w-full rounded-[var(--radius-default)] border px-3 py-1 text-sm transition-colors placeholder:text-muted-foreground ${focus} disabled:opacity-50 ${className}`} {...props} />; }
export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={`rounded-[var(--radius-default)] border bg-card text-card-foreground ${className}`} {...props} />; }
export function CardHeader({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={`flex flex-col gap-1.5 p-6 ${className}`} {...props} />; }
export function CardTitle({ className = "", ...props }: HTMLAttributes<HTMLHeadingElement>) { return <h3 className={`font-semibold leading-none tracking-tight ${className}`} {...props} />; }
export function CardDescription({ className = "", ...props }: HTMLAttributes<HTMLParagraphElement>) { return <p className={`text-sm text-muted-foreground ${className}`} {...props} />; }
export function CardContent({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={`px-6 pb-6 ${className}`} {...props} />; }
export function Label({ children, className = "", ...props }: HTMLAttributes<HTMLLabelElement> & { children: ReactNode }) { return <label className={`text-sm font-medium leading-none ${className}`} {...props}>{children}</label>; }
