import { business } from "@/data/business";

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** "23:30" → "11:30 pm". */
export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const hour = h % 12 || 12;
  const clock = m ? `${hour}:${String(m).padStart(2, "0")}` : `${hour}`;
  return `${clock} ${h >= 12 ? "pm" : "am"}`;
}

/** "11:30 am – 11:30 pm". */
export const hoursText = `${formatTime(business.hours.opens)} – ${formatTime(business.hours.closes)}`;

export interface OpenStatus {
  open: boolean;
  label: string;
  /** Minutes since midnight, India Standard Time. */
  minutes: number;
}

/** Open/closed right now, in India Standard Time regardless of the visitor's clock. */
export function getOpenStatus(now: Date = new Date()): OpenStatus {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const minutes = Number(get("hour")) * 60 + Number(get("minute"));
  const openToday = (business.hours.days as readonly string[]).includes(get("weekday"));
  const opens = toMinutes(business.hours.opens);
  const closes = toMinutes(business.hours.closes);

  if (openToday && minutes >= opens && minutes < closes) {
    return { open: true, minutes, label: `Open now · closes ${formatTime(business.hours.closes)}` };
  }
  const openTime = formatTime(business.hours.opens);
  return {
    open: false,
    minutes,
    label: openToday && minutes < opens ? `Closed · opens ${openTime} today` : `Closed · opens ${openTime} tomorrow`,
  };
}
