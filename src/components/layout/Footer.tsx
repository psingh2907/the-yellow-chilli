import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { business } from "@/data/business";
import { navLinks } from "@/data/navigation";
import { addressLine, bookingMessage, directionsUrl, phoneDisplay, phoneHref, placeUrl, whatsappHref } from "@/lib/contact";
import { hoursText } from "@/lib/hours";
import { FooterReveal, OpenBadge } from "./FooterReveal";
import { ScatterWord } from "./ScatterWord";

const card = "relative overflow-hidden rounded-[1.75rem] bg-night-soft/80 p-6 ring-1 ring-cream/[0.07] backdrop-blur";

/**
 * Bento footer: a glowing "table for tonight" card, address, hours and
 * links as separate glass tiles, with the wordmark bleeding off the bottom.
 */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="grain relative overflow-hidden bg-night pt-16 text-cream lg:pt-24">
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[48rem] -translate-x-1/2 rounded-full bg-gold/15 blur-[120px]" />

      <FooterReveal className="container-x relative grid gap-3 md:grid-cols-6 lg:gap-4">
        {/* Booking */}
        <div data-card className={`${card} flex flex-col justify-between gap-10 !bg-gold !p-7 text-night ring-0 md:col-span-4`}>
          <div>
            <p className="label text-night/70">Tonight at Veerji&rsquo;s</p>
            <p className="mt-4 max-w-md font-display text-[clamp(2rem,6vw,3.4rem)] leading-[0.95] font-extrabold tracking-tight">
              Table for tonight?
            </p>
            <p className="mt-3 max-w-sm text-sm font-medium text-night/75">
              Good food, live music and a table near the mic. Call or WhatsApp and we&rsquo;ll hold it for you.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href={phoneHref} className="inline-flex items-center gap-2 rounded-full bg-night px-5 py-3 text-sm font-bold text-cream transition-transform active:scale-95">
              <Icon name="phone" className="h-4 w-4 text-gold" /> {phoneDisplay}
            </a>
            <a
              href={whatsappHref(bookingMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-night/10 px-5 py-3 text-sm font-bold ring-1 ring-night/25 transition-transform active:scale-95"
            >
              <Icon name="whatsapp" className="h-4 w-4" /> WhatsApp
            </a>
          </div>
        </div>

        {/* Rating */}
        <a data-card href={placeUrl} target="_blank" rel="noopener noreferrer" className={`${card} flex flex-row-reverse items-start justify-between gap-6 md:col-span-2 md:flex-col md:items-stretch`}>
          <Icon name="star" className="h-6 w-6 text-gold" />
          <div>
            <p className="font-display text-6xl leading-none font-extrabold tracking-tight">{business.ratings.google.score}</p>
            <p className="mt-2 text-sm text-mist">{business.ratings.google.count.toLocaleString("en-IN")} reviews on Google</p>
          </div>
        </a>

        {/* Visit */}
        <div data-card className={`${card} flex flex-col items-start md:col-span-3`}>
          <OpenBadge />
          <address className="mt-5 text-[0.95rem] leading-relaxed text-cream/90 not-italic">{addressLine}</address>
          <p className="mt-3 flex items-center gap-2 text-sm text-mist">
            <Icon name="clock" className="h-4 w-4 text-gold" /> Daily, {hoursText}
          </p>
          <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="mt-auto flex w-fit items-center gap-2 pt-5 text-sm font-bold text-gold">
            Get directions <Icon name="arrow" className="h-4 w-4" />
          </a>
        </div>

        {/* Explore */}
        <nav data-card aria-label="Footer" className={`${card} md:col-span-3`}>
          <p className="label text-mist">Explore</p>
          <ul className="mt-3 divide-y divide-cream/[0.07]">
            {[{ href: "/", label: "Home" }, ...navLinks].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="group flex items-center justify-between py-2.5 font-display text-lg font-bold tracking-tight">
                  {l.label}
                  <Icon name="arrow" className="h-4 w-4 -translate-x-1 text-gold opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 max-md:translate-x-0 max-md:opacity-60" />
                </Link>
              </li>
            ))}
            <li>
              <a href={business.zomatoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between py-2.5 font-display text-lg font-bold tracking-tight text-mist">
                Order on Zomato <Icon name="arrow" className="h-4 w-4 -rotate-45" />
              </a>
            </li>
            <li>
              <a href={business.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between py-2.5 font-display text-lg font-bold tracking-tight text-mist">
                {business.instagramHandle} <Icon name="instagram" className="h-4 w-4" />
              </a>
            </li>
          </ul>
        </nav>
      </FooterReveal>

      <div className="container-x relative z-10 mt-10 -mb-14 flex flex-col justify-between gap-2 text-xs text-mist sm:flex-row">
        <p>
          © {year} {business.fullName}, Satna. Also by Veerji: {business.sister.name}, Rajendra Nagar.
        </p>
        <Link href="/privacy" className="hover:text-gold">
          Privacy
        </Link>
      </div>

      {/* Wordmark bleeds off the bottom edge, with a fade so it reads as light, not a sticker. */}
      <div className="relative -mb-[0.12em] box-content h-[clamp(6rem,23vw,19rem)] overflow-hidden pt-20 [mask-image:linear-gradient(to_bottom,black_60%,transparent)]">
        <ScatterWord text="veerji’s" />
      </div>
      {/* Keeps the wordmark clear of the floating action button on phones. */}
      <div className="h-16 lg:hidden" aria-hidden="true" />
    </footer>
  );
}
