import { business } from "@/data/business";

const digits = (value: string) => value.replace(/\D/g, "");

const { lat, lng } = business.geo;
const coords = `${lat},${lng}`;

export const phoneHref = `tel:+${digits(business.contact.phone)}`;

/** Local display format, e.g. "093290 62819". */
export const phoneDisplay = business.contact.phone.replace(/^\+91\s*/, "0");

export function whatsappHref(message?: string): string {
  const base = `https://wa.me/${digits(business.contact.whatsapp)}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Opens the Google listing itself (photos, reviews). */
export const placeUrl = `https://maps.google.com/?cid=${business.googleCid}`;

/** Starts turn-by-turn navigation to the exact pin. */
export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coords}`;

/** Keyless embed centred on the pin. */
export const mapEmbedUrl = `https://www.google.com/maps?q=${coords}&z=15&output=embed`;

export const addressLine = `${business.address.street}, ${business.address.landmark}, ${business.address.locality}, ${business.address.state} ${business.address.postalCode}`;
