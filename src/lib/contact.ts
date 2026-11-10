import { business } from "@/data/business";

const digits = (value: string) => value.replace(/\D/g, "");

const { lat, lng } = business.geo;
const coords = `${lat},${lng}`;

export const phoneHref = `tel:+${digits(business.contact.phone)}`;

/** Local display format, e.g. "088188 88385". */
export const phoneDisplay = business.contact.phone.replace(/^\+91\s*/, "0");

export function whatsappHref(message?: string): string {
  const base = `https://wa.me/${digits(business.contact.whatsapp)}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** The message most buttons start a chat with. */
export const bookingMessage = `Hi Veerji's! I'd like to book a table at ${business.fullName}, Satna.`;

/** Opens the Google listing itself (photos, reviews). */
export const placeUrl = `https://maps.google.com/?cid=${business.googleCid}`;

/** Starts turn-by-turn navigation to the exact pin. */
export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coords}`;

/** Keyless embed centred on the pin. */
export const mapEmbedUrl = `https://www.google.com/maps?q=${coords}&z=16&output=embed`;

export const addressLine = `${business.address.street}, ${business.address.landmark}, ${business.address.locality}, ${business.address.state} ${business.address.postalCode}`;

const { sister } = business;
export const sisterPhoneHref = `tel:+${digits(sister.phone)}`;
export const sisterPhoneDisplay = sister.phone.replace(/^\+91\s*/, "0");
export const sisterDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${sister.geo.lat},${sister.geo.lng}`;
export const sisterPlaceUrl = `https://maps.google.com/?cid=${sister.googleCid}`;
