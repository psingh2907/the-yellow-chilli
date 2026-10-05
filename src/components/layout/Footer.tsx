import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { business } from "@/data/business";
import { navLinks } from "@/data/navigation";
import { addressLine, directionsUrl, phoneDisplay, phoneHref, placeUrl, whatsappHref } from "@/lib/contact";
import { hoursText } from "@/lib/hours";
import { ScatterWord } from "./ScatterWord";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="grain relative overflow-hidden bg-night pt-24 pb-28 text-cream lg:pb-10">
      <div className="container-x grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="label text-saffron">The Yellow Chilli · Satna</p>
          <p className="mt-4 max-w-sm font-display text-2xl leading-tight font-semibold">
            Master Chef Sanjeev Kapoor&rsquo;s recipes, cooked on the Panna road.
          </p>
          <a href={placeUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm text-mist hover:text-saffron">
            <Icon name="star" className="h-4 w-4 text-saffron" />
            {business.ratings.google.score} on Google · {business.ratings.google.count.toLocaleString("en-IN")} reviews
          </a>
        </div>
        <div>
          <p className="label text-mist">Explore</p>
          <ul className="mt-4 space-y-2">
            <li>
              <Link href="/" className="hover:text-saffron">
                Home
              </Link>
            </li>
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-saffron">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="label text-mist">Visit</p>
          <address className="mt-4 text-sm leading-relaxed text-cream/85 not-italic">{addressLine}</address>
          <p className="mt-3 inline-flex items-center gap-2 text-sm text-cream/85">
            <Icon name="clock" className="h-4 w-4 text-saffron" /> Daily, {hoursText}
          </p>
        </div>
        <div>
          <p className="label text-mist">Talk to us</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href={phoneHref} className="inline-flex items-center gap-2 hover:text-saffron">
                <Icon name="phone" className="h-4 w-4" /> {phoneDisplay}
              </a>
            </li>
            <li>
              <a href={whatsappHref("Hi! I'd like to book a table at The Yellow Chilli, Satna.")} className="inline-flex items-center gap-2 hover:text-saffron">
                <Icon name="whatsapp" className="h-4 w-4" /> WhatsApp
              </a>
            </li>
            <li>
              <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-saffron">
                <Icon name="pin" className="h-4 w-4" /> Directions
              </a>
            </li>
            <li>
              <a href={business.zomatoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-saffron">
                <Icon name="arrow" className="h-4 w-4" /> Order on Zomato
              </a>
            </li>
          </ul>
        </div>
      </div>

      <ScatterWord text="the yellow chilli" />

      <div className="container-x flex flex-col justify-between gap-2 border-t border-night-line pt-6 text-xs text-mist sm:flex-row">
        <p>© {year} The Yellow Chilli, Satna. A Sanjeev Kapoor restaurant.</p>
        <Link href="/privacy" className="hover:text-saffron">
          Privacy
        </Link>
      </div>
    </footer>
  );
}
