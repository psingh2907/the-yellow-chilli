import type { Metadata } from "next";
import { PartyTeaser } from "@/components/home/PartyTeaser";
import { EnquiryForm } from "@/components/parties/EnquiryForm";
import { Moments } from "@/components/parties/Moments";
import { Steps } from "@/components/parties/Steps";
import { Icon, type IconName } from "@/components/ui/Icon";
import { PageHero } from "@/components/ui/PageHero";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Parties & Celebrations",
  description:
    "Birthdays, anniversaries, kitty parties and baby showers at Veerji's, Satna: a private room or the whole floor, the full pure-veg menu, and live music with a song dedicated to your guest of honour.",
  path: "/parties",
});

const FACTS: Array<{ icon: IconName; title: string; text: string }> = [
  { icon: "mic", title: "Live music", text: "Veerji sings for the room. Ask for a song for the birthday girl, the couple, or the whole table." },
  { icon: "users", title: "Big or small", text: "A private dining room for the family, or the floor for a proper party." },
  { icon: "book", title: "The full veg menu", text: "Starters, sizzlers, thalis, Chinese and shakes, or a set menu for the group." },
  { icon: "cake", title: "Bring the cake", text: "Kids' birthdays welcome, with high chairs and a kids' menu. Ask about decoration." },
];

export default function PartiesPage() {
  return (
    <>
      <PageHero
        label="Parties & celebrations"
        title={
          <>
            Your people. <span className="text-gold">Our playlist.</span>
          </>
        }
        intro="Birthdays, anniversaries, kitty parties, baby showers. Tell us the occasion and the headcount; we'll plan the food, the room and the songs around it."
      />

      <section aria-labelledby="moments-title" className="bg-night pb-24 text-cream">
        <div className="container-x">
          <h2 id="moments-title" className="label text-gold">
            How an evening goes · tap a card
          </h2>
          <div className="mt-6">
            <Moments />
          </div>
        </div>
      </section>

      <PartyTeaser />

      <section aria-labelledby="facts-title" className="bg-night py-24 text-cream md:py-32">
        <div className="container-x">
          <h2 id="facts-title" data-split className="display-lg max-w-[16ch]">
            Everything a good party needs.
          </h2>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" data-reveal-stagger>
            {FACTS.map((f) => (
              <li key={f.title} className="rounded-3xl bg-night-soft p-6">
                <Icon name={f.icon} className="h-8 w-8 text-gold" />
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
            <p className="label text-gold">Book a party</p>
            <h2 id="enquire-title" data-split className="display-lg mt-3">
              Let&rsquo;s plan it.
            </h2>
            <p className="mt-4 max-w-md text-lg text-mist">
              Fill this in and it opens WhatsApp with everything written out, song request included. The team will reply with availability and menu options.
            </p>
          </div>
          <EnquiryForm />
        </div>
      </section>
    </>
  );
}
