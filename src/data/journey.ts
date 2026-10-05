/**
 * "The Chef's Journey": the brand's idea that every dish is something
 * Chef Sanjeev Kapoor found on his travels across India. Each stop is a
 * real dish on the Satna menu; the route ends at the restaurant.
 */
export interface JourneyStop {
  id: string;
  city: string;
  region: string;
  /** [longitude, latitude] */
  lonLat: [number, number];
  dish: string;
  price: number;
  line: string;
  /** Colour of the dish illustration (gravy / rice / char). */
  tone: string;
}

export const journey: JourneyStop[] = [
  {
    id: "srinagar",
    city: "Srinagar",
    region: "Kashmir",
    lonLat: [74.8, 34.08],
    dish: "Nalli Rogan Josh",
    price: 625,
    line: "Lamb shank, cooked slow the Kashmiri way. The valley's red, warm and deep.",
    tone: "#9b2a1c",
  },
  {
    id: "amritsar",
    city: "Amritsar",
    region: "Punjab",
    lonLat: [74.87, 31.63],
    dish: "Lalla Mussa Dal",
    price: 415,
    line: "Black dal simmered slow, finished with butter. The dal people drive back for.",
    tone: "#4a2416",
  },
  {
    id: "ambala",
    city: "Ambala",
    region: "Haryana",
    lonLat: [76.78, 30.38],
    dish: "Puran Singh Tari Wala Murgh",
    price: 545,
    line: "A highway dhaba legend, a thin fiery tari, and a chicken worth the detour.",
    tone: "#b5461f",
  },
  {
    id: "delhi",
    city: "Delhi",
    region: "Delhi",
    lonLat: [77.21, 28.61],
    dish: "Dilli Wala Butter Chicken",
    price: 545,
    line: "Tandoori chicken in tomato, butter and cream. Delhi's gift to the world.",
    tone: "#d2632a",
  },
  {
    id: "jaipur",
    city: "Jaipur",
    region: "Rajasthan",
    lonLat: [75.79, 26.91],
    dish: "Laal Maas",
    price: 575,
    line: "Red chillies, mutton and smoke. Rajasthan doesn't do mild.",
    tone: "#a3221b",
  },
  {
    id: "lucknow",
    city: "Lucknow",
    region: "Awadh",
    lonLat: [80.95, 26.85],
    dish: "Murgh Noormahal Biryani",
    price: 575,
    line: "Sealed with dough, steamed in its own perfume. Nawabi patience on a plate.",
    tone: "#e3b25a",
  },
  {
    id: "kolkata",
    city: "Kolkata",
    region: "Bengal",
    lonLat: [88.36, 22.57],
    dish: "Chowringhee Chilli Chicken",
    price: 495,
    line: "From the Chinese kitchens of Tangra and Chowringhee: soy, chilli, high flame.",
    tone: "#6e2a14",
  },
  {
    id: "hyderabad",
    city: "Hyderabad",
    region: "Deccan",
    lonLat: [78.49, 17.39],
    dish: "Hyderabadi Dum Gosht Biryani",
    price: 615,
    line: "Mutton and rice layered raw and cooked together on dum. The Nizam's way.",
    tone: "#c98a3a",
  },
  {
    id: "satna",
    city: "Satna",
    region: "Bundelkhand",
    lonLat: [80.783, 24.576],
    dish: "Your table",
    price: 0,
    line: "Every road on this map ends here: NH-75, Panna Naka Road.",
    tone: "#f4a521",
  },
];
