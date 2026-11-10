import { DinSeRaat } from "@/components/home/DinSeRaat";
import { FindUs } from "@/components/home/FindUs";
import { FloatingGallery } from "@/components/home/FloatingGallery";
import { Hero } from "@/components/home/Hero";
import { PartyTeaser } from "@/components/home/PartyTeaser";
import { Setlist } from "@/components/home/Setlist";
import { SpiceMeter } from "@/components/home/SpiceMeter";
import { Tandoor } from "@/components/home/Tandoor";
import { Verbs } from "@/components/home/Verbs";
import { Voices } from "@/components/home/Voices";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Verbs />
      <Setlist />
      <DinSeRaat />
      <Tandoor />
      <FloatingGallery />
      <SpiceMeter />
      <PartyTeaser />
      <Voices />
      <FindUs />
    </>
  );
}
