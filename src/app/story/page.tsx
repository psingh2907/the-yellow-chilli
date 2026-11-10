import type { Metadata } from "next";
import { StoryFilm } from "@/components/story/StoryFilm";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "One Thali",
  description: "A scroll film from morning to music: the spice box, the tandoor, the slow pot, the VRJ Special Thali, and the mic at Veerji's, Satna.",
  path: "/story",
});

export default function StoryPage() {
  return (
    <>
      <PageHero
        label="A scroll film · five chapters"
        title={
          <>
            One <span className="text-gold">thali</span>, from morning to music.
          </>
        }
        intro="Scroll slowly. Everything you'll see is drawn live in your browser: no video, just a little 3D world built for this story."
      />
      <StoryFilm />
      <section className="bg-night py-24 text-center text-cream">
        <div className="container-x">
          <p data-split className="mx-auto max-w-3xl font-display text-[clamp(2rem,5vw,4rem)] leading-tight font-extrabold">
            The real thing smells better. And sounds better.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/menu" icon="book">
              See the menu
            </Button>
            <Button href="/parties" variant="outline" icon="cake" className="text-cream">
              Plan a party
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
