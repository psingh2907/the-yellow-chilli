import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { OpenStatus } from "@/components/ui/OpenStatus";
import { PageHero } from "@/components/ui/PageHero";
import { RouteMap } from "@/components/ui/RouteMap";
import { Faq } from "@/components/visit/Faq";
import { business } from "@/data/business";
import {
  addressLine,
  bookingMessage,
  directionsUrl,
  mapEmbedUrl,
  phoneDisplay,
  phoneHref,
  placeUrl,
  sisterDirectionsUrl,
  sisterPhoneDisplay,
  sisterPhoneHref,
  whatsappHref,
} from "@/lib/contact";
import { hoursText } from "@/lib/hours";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Visit",
  description: `Find Veerji's, Satna: ${addressLine}. Open daily ${hoursText}. About ${business.distances.stationKm} km from Satna Junction.`,
  path: "/visit",
});

const FAQ = [
  { q: "Is it pure veg?", a: "Yes. The whole menu is vegetarian: thalis, sizzlers, tandoor starters, Chinese, South Indian, sandwiches and shakes." },
  {
    q: "Is there live music tonight?",
    a: "Live music is what Veerji's is known for, and it's usually on in the evenings. Call or WhatsApp to check tonight's plan, especially if you're coming for it.",
  },
  { q: "Can I request or dedicate a song?", a: "Yes. Guests regularly ask for songs for birthdays and anniversaries. Mention it when you book, or ask at the table." },
  { q: "Do I need to book a table?", a: "Walk-ins are welcome. For dinner, weekends and groups, a quick call or WhatsApp saves you a wait." },
  { q: "Can I order delivery?", a: "Yes, through Zomato, or call for takeaway." },
  { q: "Is it good for kids?", a: "Yes. There's a kids' menu, high chairs, mild dishes on the menu, and kids' birthdays are a speciality." },
];

export default function VisitPage() {
  return (
    <>
      <PageHero
        label="Visit"
        title={
          <>
            First floor, <span className="text-gold">R.S Tower.</span>
          </>
        }
        intro={addressLine}
      >
        <div className="flex flex-wrap gap-3">
          <Button href={directionsUrl} icon="pin" external>
            Get directions
          </Button>
          <Button href={phoneHref} variant="outline" icon="phone" className="text-cream">
            {phoneDisplay}
          </Button>
        </div>
      </PageHero>

      <section aria-labelledby="route-title" className="bg-night pb-24 text-cream">
        <div className="container-x grid items-center gap-10 lg:grid-cols-[1.3fr_0.7fr]">
          <RouteMap className="rounded-3xl bg-night-soft p-4 md:p-8" />
          <div>
            <h2 id="route-title" className="font-display text-3xl font-extrabold">
              {business.distances.stationKm} km from the station
            </h2>
            <p className="mt-3 text-mist">
              From Satna Junction, take Railway Station Road toward Railway Colony. Veerji&rsquo;s is on the first floor of R.S Tower, near Circuit House Chowk:
              about {business.distances.stationMinutes} minutes by car or auto.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Icon name="train" className="h-5 w-5 text-gold" /> Satna Junction · {business.distances.stationKm} km
              </li>
              <li className="flex items-center gap-3">
                <Icon name="car" className="h-5 w-5 text-gold" /> Easy by car, auto or e-rickshaw
              </li>
              <li className="flex items-center gap-3">
                <Icon name="parking" className="h-5 w-5 text-gold" /> Free parking nearby
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="hours-title" className="bg-cream py-24 text-ink md:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div>
            <h2 id="hours-title" data-split className="display-lg">
              Coffee to encore. Every day.
            </h2>
            <p className="mt-6 text-2xl font-semibold">{hoursText}</p>
            <OpenStatus className="mt-3 text-muted" />
            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              <a href={phoneHref} className="rounded-3xl bg-paper p-6 transition-colors hover:bg-gold">
                <Icon name="phone" className="h-6 w-6" />
                <p className="mt-4 label text-muted">Call</p>
                <p className="mt-1 font-display text-xl font-bold">{phoneDisplay}</p>
              </a>
              <a href={whatsappHref(bookingMessage)} className="rounded-3xl bg-paper p-6 transition-colors hover:bg-whatsapp">
                <Icon name="whatsapp" className="h-6 w-6" />
                <p className="mt-4 label text-muted">WhatsApp</p>
                <p className="mt-1 font-display text-xl font-bold">Book a table</p>
              </a>
              <a href={placeUrl} target="_blank" rel="noopener noreferrer" className="rounded-3xl bg-paper p-6 transition-colors hover:bg-gold">
                <Icon name="star" className="h-6 w-6" />
                <p className="mt-4 label text-muted">Google</p>
                <p className="mt-1 font-display text-xl font-bold">
                  {business.ratings.google.score} · {business.ratings.google.count.toLocaleString("en-IN")} reviews
                </p>
              </a>
              <a href={business.instagramUrl} target="_blank" rel="noopener noreferrer" className="rounded-3xl bg-paper p-6 transition-colors hover:bg-rose">
                <Icon name="instagram" className="h-6 w-6" />
                <p className="mt-4 label text-muted">Instagram</p>
                <p className="mt-1 font-display text-xl font-bold">{business.instagramHandle}</p>
              </a>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl bg-paper" data-reveal="clip">
            <iframe
              title={`Map: ${business.fullName}, Satna`}
              src={mapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full min-h-[24rem] w-full border-0"
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="sister-title" className="grain relative overflow-hidden bg-night py-24 text-cream">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(50%_70%_at_90%_50%,rgba(242,181,68,0.14),transparent_70%)]" />
        <div className="relative container-x grid items-center gap-10 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="label text-gold">Also by Veerji</p>
            <h2 id="sister-title" className="mt-3 font-display text-[clamp(2.2rem,5vw,4rem)] leading-[0.95] font-extrabold tracking-tight">
              {business.sister.name}
            </h2>
            <p className="mt-2 font-deva text-2xl text-cream/70" lang="hi">
              {business.sister.nameHi}
            </p>
            <p className="mt-4 max-w-xl text-lg text-mist">
              {business.sister.line}. {business.sister.address}.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:flex-col">
            <Button href={sisterDirectionsUrl} icon="pin" external>
              Directions
            </Button>
            <Button href={sisterPhoneHref} variant="outline" icon="phone" className="text-cream">
              {sisterPhoneDisplay}
            </Button>
            <Button href={business.sister.instagramUrl} variant="ghost" icon="instagram" external className="text-cream">
              {business.sister.instagramHandle}
            </Button>
          </div>
        </div>
      </section>

      <section aria-labelledby="amenities-title" className="bg-paper py-24 text-ink">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 id="amenities-title" className="font-display text-4xl font-extrabold">
              Good to know
            </h2>
            <ul className="mt-6 flex flex-wrap gap-2" data-reveal-stagger>
              {business.amenities.map((a) => (
                <li key={a} className="rounded-full bg-cream px-4 py-2 text-sm font-semibold">
                  {a}
                </li>
              ))}
            </ul>
          </div>
          <Faq items={FAQ} />
        </div>
      </section>
    </>
  );
}
