import type { DishSpec } from "@/components/ui/DishArt";

/**
 * "The Setlist": a day at Veerji's, from the cafe crowd at opening to the
 * last song. Dishes and prices are from the menu; the live-music hour is
 * our estimate until the owner confirms the evening schedule.
 */
export interface SetlistStop {
  id: string;
  /** 24-hour "HH:MM", India Standard Time. */
  time: string;
  title: string;
  line: string;
  picks: Array<{ name: string; price: number }>;
  art: DishSpec | "record" | "finale";
}

export const setlist: SetlistStop[] = [
  {
    id: "doors",
    time: "11:00",
    title: "Doors open",
    line: "Cold coffee, a grilled sandwich, free Wi-Fi, and nobody hurrying you along.",
    picks: [
      { name: "Cold Coffee", price: 99 },
      { name: "VRJ Special Sandwich", price: 159 },
    ],
    art: { kind: "shake", tone: "#c8a07a", seed: 31 },
  },
  {
    id: "thali",
    time: "13:00",
    title: "Thali o'clock",
    line: "Two rotis, rice, dal tadka, paneer, veg, raita and salad. Lunch, sorted.",
    picks: [
      { name: "Regular Thali", price: 199 },
      { name: "VRJ Special Thali", price: 299 },
    ],
    art: { kind: "thali", tone: "#2f9e57", seed: 32 },
  },
  {
    id: "teatime",
    time: "16:30",
    title: "Tea-time",
    line: "A crisp dosa, Chinese bhel, a KitKat shake. The college crowd's hour.",
    picks: [
      { name: "Masala Dosa", price: 119 },
      { name: "KitKat Shake", price: 129 },
    ],
    art: { kind: "dosa", tone: "#e8b25a", seed: 33 },
  },
  {
    id: "sizzle",
    time: "19:30",
    title: "The sizzle",
    line: "Paneer off the tandoor, and sizzlers that arrive at the table still smoking.",
    picks: [
      { name: "Paneer Sizzler", price: 289 },
      { name: "Paneer Tikka", price: 229 },
    ],
    art: { kind: "sizzler", tone: "#c98a3a", seed: 34 },
  },
  {
    id: "live",
    time: "21:00",
    title: "Live",
    line: "The lights go down and Veerji takes the mic. Requests and dedications welcome.",
    picks: [],
    art: "record",
  },
  {
    id: "encore",
    time: "23:00",
    title: "One more song",
    line: "Last orders, the encore, and home. Doors open again at 11 tomorrow.",
    picks: [],
    art: "finale",
  },
];
