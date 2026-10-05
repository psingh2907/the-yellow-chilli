import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { OpenStatus } from "@/components/ui/OpenStatus";
import { PageHero } from "@/components/ui/PageHero";
import { RouteMap } from "@/components/ui/RouteMap";
import { Faq } from "@/components/visit/Faq";
import { business } from "@/data/business";
import { addressLine, directionsUrl, mapEmbedUrl, phoneDisplay, phoneHref, placeUrl, whatsappHref } from "@/lib/contact";
import { hoursText } from "@/lib/hours";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Visit",
  description: `Find The Yellow Chilli, Satna: ${addressLine}. Open daily ${hoursText}. Free parking, about ${business.distances.stationKm} km from Satna railway station.`,
  path: "/visit",
});

const FAQ = [
  { q: "Do I need to book a table?", a: "Walk-ins are welcome. For dinner, weekends and groups, a quick call or WhatsApp to reserve saves you a wait." },
  { q: "Is there parking?", a: "Yes. There's a large free parking lot on site, right on NH-75." },
  { q: "Is the food pure veg?", a: "No: the kitchen cooks both vegetarian and non-vegetarian food, with a long vegetarian menu. Every dish is marked on the menu." },
  { q: "Can I order delivery?", a: "Yes. The restaurant delivers through Zomato, or you can call for takeaway." },
  { q: "Is it good for kids and older family members?", a: "Yes. There's a kids' menu, mild dishes on the menu, and wheelchair-accessible seating and toilets." },
];

export default function VisitPage() {
  return (
    <>
      <PageHero
        label="Visit"
        title={
          <>
            On the Panna road, <span className="text-saffron">near Peptech City.</span>
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
              About {business.distances.stationKm} km from the station
            </h2>
            <p className="mt-3 text-mist">From Satna railway station, head out toward Panna Naka and take the Panna road (NH-75). The restaurant is near Peptech City, with parking at the door.</p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Icon name="train" className="h-5 w-5 text-saffron" /> Satna Junction · about {business.distances.stationKm} km
              </li>
              <li className="flex items-center gap-3">
                <Icon name="car" className="h-5 w-5 text-saffron" /> On NH-75, easy to reach by car or auto
              </li>
              <li className="flex items-center gap-3">
                <Icon name="parking" className="h-5 w-5 text-saffron" /> Free parking lot on site
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="hours-title" className="bg-cream py-24 text-ink md:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div>
            <h2 id="hours-title" data-split className="display-lg">
              Lunch to late. Every day.
            </h2>
            <p className="mt-6 text-2xl font-semibold">{hoursText}</p>
            <OpenStatus className="mt-3 text-muted" />
            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              <a href={phoneHref} className="rounded-3xl bg-paper p-6 transition-colors hover:bg-saffron">
                <Icon name="phone" className="h-6 w-6" />
                <p className="mt-4 label text-muted">Call</p>
                <p className="mt-1 font-display text-xl font-bold">{phoneDisplay}</p>
              </a>
              <a href={whatsappHref("Hi! I'd like to book a table at The Yellow Chilli, Satna.")} className="rounded-3xl bg-paper p-6 transition-colors hover:bg-whatsapp">
                <Icon name="whatsapp" className="h-6 w-6" />
                <p className="mt-4 label text-muted">WhatsApp</p>
                <p className="mt-1 font-display text-xl font-bold">Book a table</p>
              </a>
              <a href={placeUrl} target="_blank" rel="noopener noreferrer" className="rounded-3xl bg-paper p-6 transition-colors hover:bg-saffron">
                <Icon name="star" className="h-6 w-6" />
                <p className="mt-4 label text-muted">Google</p>
                <p className="mt-1 font-display text-xl font-bold">
                  {business.ratings.google.score} · {business.ratings.google.count.toLocaleString("en-IN")} reviews
                </p>
              </a>
              <a href={`mailto:${business.contact.email}`} className="rounded-3xl bg-paper p-6 transition-colors hover:bg-saffron">
                <Icon name="arrow" className="h-6 w-6" />
                <p className="mt-4 label text-muted">Email</p>
                <p className="mt-1 font-display text-lg font-bold break-all">{business.contact.email}</p>
              </a>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl bg-paper" data-reveal="clip">
            <iframe
              title="Map: The Yellow Chilli, Satna"
              src={mapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full min-h-[24rem] w-full border-0"
            />
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
