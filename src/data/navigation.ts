export interface NavLink {
  href: string;
  label: string;
  /** One-line teaser for the full-screen menu. */
  hint: string;
}

export const navLinks: NavLink[] = [
  { href: "/menu", label: "Menu", hint: "About 200 pure-veg dishes, a heat guide and a thali builder" },
  { href: "/story", label: "One Thali", hint: "A scroll film: from the spice box to the mic" },
  { href: "/parties", label: "Parties", hint: "Birthdays, anniversaries, kitty parties, with a song" },
  { href: "/visit", label: "Visit", hint: "R.S Tower, Railway Colony · open till 11 pm" },
];

export const pagePaths = navLinks.map((l) => l.href);
