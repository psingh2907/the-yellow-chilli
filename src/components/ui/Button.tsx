import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./Icon";

type Variant = "solid" | "outline" | "ghost" | "rose";

const styles: Record<Variant, string> = {
  solid: "bg-gold text-night hover:bg-gold-light",
  rose: "bg-rose text-night hover:bg-rose-deep hover:text-cream",
  outline: "border border-current/30 text-current hover:border-gold hover:text-gold",
  ghost: "text-current underline-offset-4 hover:underline",
};

interface ButtonProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  icon?: IconName;
  className?: string;
  /** Opens in a new tab (external sites). */
  external?: boolean;
}

/**
 * Pill button. `data-magnetic` lets the cursor pull it (desktop only), and
 * the label sits in its own span so it can move a little further than the pill.
 */
export function Button({ href, children, variant = "solid", icon, className, external }: ButtonProps) {
  const classes = cn(
    "group relative inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-6 py-3 text-[0.95rem] font-semibold transition-colors duration-300",
    styles[variant],
    className,
  );
  const inner = (
    <span data-magnetic-label className="inline-flex items-center gap-2.5">
      {icon && <Icon name={icon} className="h-[1.1em] w-[1.1em]" />}
      {children}
    </span>
  );
  const isRoute = href.startsWith("/") && !external;
  if (isRoute) {
    return (
      <Link href={href} className={classes} data-magnetic>
        {inner}
      </Link>
    );
  }
  return (
    <a href={href} className={classes} data-magnetic {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {inner}
    </a>
  );
}
