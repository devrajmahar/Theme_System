import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

const focus = "outline-none focus-visible:border-ring focus-visible:ring-[2px] focus-visible:ring-ring/50";

export function Button({ variant = "default", size = "default", className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "secondary" | "outline" | "ghost" | "destructive" | "inverted"; size?: "default" | "sm" | "icon" }) {
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/85 [&_svg]:text-primary-foreground",
    inverted: "bg-button-fill text-surface hover:bg-button-fill/90 active:bg-button-fill/85 [&_svg]:text-surface",
    secondary: "ui-secondary border text-text-interactive hover:text-text-hover active:text-text-active [&_svg]:text-icon hover:[&_svg]:text-icon-active active:[&_svg]:text-icon-active",
    outline: "border bg-surface hover:bg-hover-bg active:bg-active-bg text-text-interactive hover:text-text-hover active:text-text-active [&_svg]:text-icon hover:[&_svg]:text-icon-active active:[&_svg]:text-icon-active",
    ghost: "hover:bg-hover-bg active:bg-active-bg text-text-interactive hover:text-text-hover active:text-text-active [&_svg]:text-icon hover:[&_svg]:text-icon-active active:[&_svg]:text-icon-active",
    destructive: "bg-danger text-danger-foreground hover:bg-danger/90 active:bg-danger/85 [&_svg]:text-danger-foreground",
  };
  const sizes = { default: "h-9 px-4 py-2", sm: "h-8 rounded-default px-3 text-xs", icon: "size-9" };
  return <button className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-default text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-45 ${focus} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />;
}
export function Badge({ variant = "default", className = "", ...props }: HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "secondary" | "outline" | "destructive" }) {
  const variants = { default: "border-transparent bg-primary text-primary-foreground", secondary: "border-border-secondary bg-surface-secondary text-text-primary", outline: "text-text-primary", destructive: "border-transparent bg-danger text-danger-foreground" };
  return <span className={`inline-flex items-center rounded-large border px-2.5 py-0.5 text-xs font-semibold ${variants[variant]} ${className}`} {...props} />;
}
export function Input({ className = "", style, ...props }: InputHTMLAttributes<HTMLInputElement>) { return <input className={`flex h-9 w-full rounded-default border border-input-border bg-input-fill px-3 py-1 text-sm transition-colors placeholder:text-text-secondary ${focus} disabled:opacity-50 ${className}`} {...props} />; }
export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={`rounded-default border bg-surface text-text-primary ${className}`} {...props} />; }
export function CardHeader({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={`flex flex-col gap-1.5 p-6 ${className}`} {...props} />; }
export function CardTitle({ className = "", ...props }: HTMLAttributes<HTMLHeadingElement>) { return <h3 className={`font-semibold leading-none tracking-tight ${className}`} {...props} />; }
export function CardDescription({ className = "", ...props }: HTMLAttributes<HTMLParagraphElement>) { return <p className={`text-sm text-text-secondary ${className}`} {...props} />; }
export function CardContent({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={`px-6 pb-6 ${className}`} {...props} />; }
export function Label({ children, className = "", ...props }: HTMLAttributes<HTMLLabelElement> & { children: ReactNode }) { return <label className={`text-sm font-medium leading-none ${className}`} {...props}>{children}</label>; }
