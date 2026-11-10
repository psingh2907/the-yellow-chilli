import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Header for inner pages: label, a big headline that rises in (data-split), intro. */
export function PageHero({
  label,
  title,
  intro,
  children,
  className,
}: {
  label: string;
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("grain relative overflow-hidden bg-night pt-40 pb-16 text-cream md:pt-48 md:pb-24", className)}>
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(50%_60%_at_85%_10%,rgba(242,181,68,0.16),transparent_70%)]" />
      <div className="relative container-x">
        <p className="label text-gold" data-reveal>
          {label}
        </p>
        <h1 data-split className="display-xl mt-4 max-w-[14ch]">
          {title}
        </h1>
        {intro && (
          <div data-reveal className="mt-6 max-w-2xl text-lg leading-relaxed text-mist md:text-xl">
            {intro}
          </div>
        )}
        {children && (
          <div data-reveal className="mt-8">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
