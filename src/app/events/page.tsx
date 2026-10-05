import type { Metadata } from "next";
import { EnquiryForm } from "@/components/events/EnquiryForm";
import { Moments } from "@/components/events/Moments";
import { Steps } from "@/components/events/Steps";
import { BanquetTeaser } from "@/components/home/BanquetTeaser";
import { Icon, type IconName } from "@/components/ui/Icon";
import { PageHero } from "@/components/ui/PageHero";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Banquets & Events",
  description:
    "Weddings, birthdays, kitty parties and office dinners at The Yellow Chilli, Satna: a banquet hall, the full Sanjeev Kapoor menu, catering and free parking on NH-75.",
  path: "/events",
});

const FACTS: Array<{ icon: IconName; title: string; text: string }> = [
  { icon: "users", title: "Big or small", text: "From a private dining room for the family to the banquet hall for a full function." },
  { icon: "book", title: "The full menu", text: "Build your spread from the same menu as the restaurant, or ask about set menus." },
  { icon: "parking", title: "Free parking", text: "A large lot on site, right on NH-75: easy for guests coming from across Satna." },
  { icon: "flame", title: "Catering", text: "The kitchen also caters, if you'd rather celebrate somewhere else." },
];

export default function EventsPage() {
  return (
    <>
      <PageHero
        label="Banquets & celebrations"
        title={
          <>
            Your people. <span className="text-saffron">Our tandoor.</span>
          </>
        }
        intro="Weddings and receptions, birthdays, kitty parties, office dinners. Tell us the occasion and the headcount; we'll plan the food and the hall around it."
      />

      <section aria-labelledby="moments-title" className="bg-night pb-24 text-cream">
        <div className="container-x">
          <h2 id="moments-title" className="label text-saffron">
            How an evening goes · tap a card
          </h2>
          <div className="mt-6">
            <Moments />
          </div>
        </div>
      </section>

      <BanquetTeaser />

      <section aria-labelledby="facts-title" className="bg-night py-24 text-cream md:py-32">
        <div className="container-x">
          <h2 id="facts-title" data-split className="display-lg max-w-[16ch]">
            Everything a good party needs.
          </h2>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" data-reveal-stagger>
            {FACTS.map((f) => (
              <li key={f.title} className="rounded-3xl bg-night-soft p-6">
                <Icon name={f.icon} className="h-8 w-8 text-saffron" />
                <h3 className="mt-4 font-display text-xl font-bold">{f.title}</h3>
                <p className="mt-2 text-sm text-mist">{f.text}</p>
              </li>
            ))}
          </ul>
          <div className="mt-24">
            <Steps />
          </div>
        </div>
      </section>

      <section id="enquire" aria-labelledby="enquire-title" className="grain bg-night pb-24 text-cream md:pb-32">
        <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="label text-saffron">Enquire</p>
            <h2 id="enquire-title" data-split className="display-lg mt-3">
              Let&rsquo;s plan it.
            </h2>
            <p className="mt-4 max-w-md text-lg text-mist">Fill this in and it opens WhatsApp with everything written out. The team will reply with availability and menu options.</p>
          </div>
          <EnquiryForm />
        </div>
      </section>
    </>
  );
}
