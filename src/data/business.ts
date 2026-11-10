/**
 * The restaurant's facts, gathered in October 2026 from Google Maps,
 * JustDial, Zomato, Instagram and Wanderboat (see docs/research.md).
 * Anything not confirmed by the owner is listed in docs/owner-checklist.md.
 */
export const business = {
  name: "Veerji's",
  fullName: "Veerji's Cafe Club & Restaurant",
  nameHi: "वीरजी'स",
  branch: "Satna",
  /** Our line for the site: the food, the music, the room. */
  tagline: "Food that sings",
  description:
    "Veerji's Cafe Club & Restaurant, Satna: a pure-veg kitchen with live music by Veerji himself, thalis, sizzlers, tandoor and Chinese, and a party floor for birthdays and anniversaries. First floor, R.S Tower, Railway Colony.",

  /** Adityaveer Singh, "Veerji": the host, and the voice on the mic. */
  owner: { name: "Adityaveer Singh", known: "Veerji" },

  address: {
    street: "First floor, R.S Tower",
    landmark: "Railway Colony, near Circuit House Chowk",
    locality: "Satna",
    state: "Madhya Pradesh",
    postalCode: "485001",
  },
  geo: { lat: 24.5740858, lng: 80.8326484 },
  plusCode: "HRFM+J3 Satna",

  contact: {
    /** Google Maps and Instagram. Other numbers are in the owner checklist. */
    phone: "+91 88188 88385",
    /** Assumed to be the same number until the owner confirms. */
    whatsapp: "+91 88188 88385",
  },

  /** Daily, India Standard Time (Google Maps, JustDial, Wanderboat). */
  hours: {
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "11:00",
    closes: "23:00",
  },

  priceRange: { min: 200, max: 1000 },

  ratings: {
    google: { score: 4.6, count: 1012 },
    justdial: { score: 4.9, count: 993 },
  },

  /** What Google's review topics count most often. */
  reviewMentions: { liveMusic: 78, party: 64, birthday: 17 },

  /** By road, from Google Maps directions. */
  distances: { stationKm: 1.1, stationMinutes: 4 },

  /** From the Google Maps place id 0xff807661682601af. */
  googleCid: "18410845437421814191",
  zomatoUrl: "https://www.zomato.com/satna/veerjis-restaurant-satna-locality/order",
  justdialUrl:
    "https://www.justdial.com/Satna/Veerjis-Restaurant-Behind-Automobile-Parts-Near-R-S-Tower-Railway-Colony/9999P7672-7672-221012162308-E6L5_BZDET",
  instagramUrl: "https://www.instagram.com/veerjisatna/",
  instagramHandle: "@veerjisatna",

  amenities: [
    "Pure veg",
    "Live music",
    "Song dedications",
    "Private dining room",
    "Free Wi-Fi",
    "Free parking",
    "Kids' menu & high chairs",
    "Wheelchair accessible",
    "Takeaway & delivery",
    "Cards & UPI",
  ],

  /** The sister venue, opened in 2026. */
  sister: {
    name: "Bikaner by Veerji's",
    nameHi: "बीकानेर बाय वीरजी'स",
    line: "Rajasthani flavours, fine dining and party bookings",
    address: "Gali No. 16, Rajendra Nagar, Satna 485001",
    phone: "+91 95844 39543",
    geo: { lat: 24.5676096, lng: 80.8223319 },
    googleCid: "16277577999844461606",
    instagramUrl: "https://www.instagram.com/bikanerbyveerjis/",
    instagramHandle: "@bikanerbyveerjis",
  },
} as const;
