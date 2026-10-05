import { BanquetTeaser } from "@/components/home/BanquetTeaser";
import { FindUs } from "@/components/home/FindUs";
import { FloatingGallery } from "@/components/home/FloatingGallery";
import { Hero } from "@/components/home/Hero";
import { Journey } from "@/components/home/Journey";
import { ShaamSavera } from "@/components/home/ShaamSavera";
import { SpiceMeter } from "@/components/home/SpiceMeter";
import { Tandoor } from "@/components/home/Tandoor";
import { Verbs } from "@/components/home/Verbs";
import { Voices } from "@/components/home/Voices";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Verbs />
      <Journey />
      <ShaamSavera />
      <Tandoor />
      <FloatingGallery />
      <SpiceMeter />
      <BanquetTeaser />
      <Voices />
      <FindUs />
    </>
  );
}
