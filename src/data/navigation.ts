export interface NavLink {
  href: string;
  label: string;
  /** One-line teaser for the full-screen menu. */
  hint: string;
}

export const navLinks: NavLink[] = [
  { href: "/menu", label: "Menu", hint: "About 240 dishes, a heat guide and a platter builder" },
  { href: "/story", label: "One Plate", hint: "A scroll film: from spice market to your table" },
  { href: "/events", label: "Banquets", hint: "Weddings, birthdays, office dinners" },
  { href: "/visit", label: "Visit", hint: "NH-75, Panna Naka Road · open till 11:30 pm" },
];

export const pagePaths = navLinks.map((l) => l.href);
