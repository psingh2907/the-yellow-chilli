/**
 * The restaurant's facts, gathered in October 2026 from Google Maps,
 * Zomato, TripAdvisor, Justdial and theyellowchilli.com/outlets.html.
 * Anything not confirmed by the owner is listed in docs/owner-checklist.md.
 */
export const business = {
  name: "The Yellow Chilli",
  nameHi: "द येलो चिली",
  branch: "Satna",
  /** The brand line used across the chain. */
  tagline: "Redefining Indian food",
  description:
    "The Yellow Chilli, Satna: Master Chef Sanjeev Kapoor's restaurant for Mughlai, Punjabi and frontier cooking, with banquets for large gatherings. NH-75, Panna Naka Road, near Peptech City.",

  address: {
    street: "NH-75, Panna Naka Road",
    landmark: "Near Peptech City",
    locality: "Satna",
    state: "Madhya Pradesh",
    postalCode: "485001",
  },
  geo: { lat: 24.576493, lng: 80.783028 },
  plusCode: "HQGM+H6 Satna",

  contact: {
    /** Listed on Zomato and TripAdvisor. Other numbers are in the checklist. */
    phone: "+91 93290 62819",
    /** Assumed to be the same number until the owner confirms. */
    whatsapp: "+91 93290 62819",
    email: "tyc.satna@gmail.com",
  },

  /** Daily, India Standard Time (Google Maps). */
  hours: {
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "11:30",
    closes: "23:30",
  },

  priceRange: { min: 200, max: 1000 },

  ratings: {
    google: { score: 3.9, count: 1255 },
    zomatoDelivery: { score: 4.0, count: 909 },
  },

  /** Distances for the "find us" section (approximate, by road). */
  distances: { stationKm: 4.5 },

  /** From the Google Maps place id 0x34b8b321b6a08bc7. */
  googleCid: "3798983243066280903",
  zomatoUrl: "https://www.zomato.com/satna/the-yellow-chilli-satna-locality/order",
  facebookUrl: "https://www.facebook.com/p/The-Yellow-Chilli-Satna-100063960189040/",

  amenities: [
    "Free parking",
    "Banquet hall",
    "Private dining room",
    "Big-screen sport",
    "Wheelchair accessible",
    "Kids' menu",
    "Takeaway & delivery",
    "Cards & mobile pay",
  ],
} as const;
