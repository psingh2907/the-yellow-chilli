import { siteConfig } from "@/config/site";
import { business } from "@/data/business";
import { placeUrl } from "@/lib/contact";
import { JsonLd } from "./JsonLd";

/**
 * schema.org Restaurant markup, built only from real values. The rating is
 * shown on the page but not marked up: Google does not allow a business to
 * mark up its own reviews.
 */
export function RestaurantSchema() {
  const { address, contact, hours, priceRange, geo } = business;
  const url = siteConfig.url;
  const data = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${url}/#restaurant`,
    name: `${business.fullName}, ${business.branch}`,
    alternateName: business.name,
    description: business.description,
    url,
    telephone: contact.phone.replace(/\s/g, ""),
    priceRange: `₹${priceRange.min}–${priceRange.max}`,
    servesCuisine: ["Vegetarian", "North Indian", "Chinese", "South Indian", "Continental"],
    acceptsReservations: true,
    hasMenu: `${url}/menu`,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${address.street}, ${address.landmark}`,
      addressLocality: address.locality,
      addressRegion: address.state,
      postalCode: address.postalCode,
      addressCountry: "IN",
    },
    geo: { "@type": "GeoCoordinates", latitude: geo.lat, longitude: geo.lng },
    hasMap: placeUrl,
    openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: hours.days, opens: hours.opens, closes: hours.closes }],
    sameAs: [placeUrl, business.zomatoUrl, business.instagramUrl, business.justdialUrl],
  };
  return <JsonLd data={data} />;
}
