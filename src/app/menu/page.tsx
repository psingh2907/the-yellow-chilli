import type { Metadata } from "next";
import { MenuExplorer } from "@/components/menu/MenuExplorer";
import { PlatterThali } from "@/components/menu/PlatterThali";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { business } from "@/data/business";
import { itemCount, menu } from "@/data/menu";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Menu",
  description: `The full Yellow Chilli Satna menu: ${itemCount} dishes across ${menu.length} sections, from Lalla Mussa Dal and Dahi Ke Kabab to biryanis, tandoor and Indo-Chinese. Build a platter and send it on WhatsApp.`,
  path: "/menu",
});

export default function MenuPage() {
  return (
    <>
      <PageHero
        label={`${itemCount} dishes · ${menu.length} sections`}
        title={
          <>
            The <span className="text-saffron">menu</span>.
          </>
        }
        intro="Tandoor, curries, biryanis, Indo-Chinese and desserts. Tap + to build a platter: we'll add it up per person, and you can send it straight to the restaurant."
      >
        <Button href={business.zomatoUrl} variant="outline" icon="arrow" external className="text-cream">
          Order delivery on Zomato
        </Button>
      </PageHero>
      <MenuExplorer />
      <PlatterThali />
    </>
  );
}
