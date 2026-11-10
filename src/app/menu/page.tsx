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
  description: `The full Veerji's Satna menu: ${itemCount} pure-veg dishes across ${menu.length} sections, from the ₹199 thali and paneer sizzlers to tandoor starters, Chinese, dosas and shakes. Build your order and send it on WhatsApp.`,
  path: "/menu",
});

export default function MenuPage() {
  return (
    <>
      <PageHero
        label={`${itemCount} dishes · ${menu.length} sections · 100% veg`}
        title={
          <>
            The <span className="text-gold">menu</span>.
          </>
        }
        intro="Thalis, sizzlers, tandoor, paneer, Chinese, dosas, sandwiches and shakes, all vegetarian. Tap + to build your order: we'll add it up per person, and you can send it straight to Veerji's on WhatsApp."
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
