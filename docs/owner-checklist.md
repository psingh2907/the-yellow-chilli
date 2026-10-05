# Owner checklist: The Yellow Chilli, Satna

Everything on the site came from public listings (Google Maps, Zomato, TripAdvisor, Justdial, theyellowchilli.com) in October 2026. These items need the owner's confirmation before launch.

## Must confirm

- [ ] **Brand permission.** The site uses "The Yellow Chilli" name, "Master Chef Sanjeev Kapoor's" and the brand line "Redefining Indian food". Confirm SK Restaurants' franchise guidelines allow this outlet's own website, and whether the official logo must be used instead of our drawn wordmark.
- [ ] **Main phone and WhatsApp number.** Listings show five numbers. The site uses **+91 93290 62819** (Zomato and TripAdvisor) for calls and WhatsApp. Others seen: 076722 96777 (Google), 97540 47000 (brand site), 76722 96888 (magicpin), 91798 36797 (Zomato). Set the real ones in `src/data/business.ts`.
- [ ] **Hours.** Google says 11:30 am – 11:30 pm daily; magicpin says 12 – 10:30 pm.
- [ ] **Banquet capacity.** The site says "400 guests". This comes from a single review about a function of about 400 people.
- [ ] **Menu and prices.** Transcribed from Zomato (delivery prices). A few dish names were unclear on the listing ("Murgh Survedaar", "Harippa Paneer Tikka") and are shown as listed. Seasonal sections (Holi, Monsoon, Summer, Food Festival) may be out of date.
- [ ] **Dish descriptions.** Short descriptions were written by us (e.g. Shaam Savera: spinach koftas with a paneer heart in makhani gravy). Check each signature dish.
- [ ] **Heat levels** on the Spice-o-meter and menu are our estimates.

## Should confirm

- [ ] Rooms: a few reviews mention rooms. The site doesn't mention them; add if offered.
- [ ] Walk-ins welcome / reservations recommended (Visit page FAQ).
- [ ] Directions text: station → Panna Naka → Panna road (NH-75) → near Peptech City.
- [ ] Email `tyc.satna@gmail.com` (from a directory listing).
- [ ] Instagram account for the Satna outlet (none confirmed; `@theyellowchilli.ixd` appears to be another branch).

## To replace

- [ ] **Photos.** All dishes, banquet "moments" and the 3D gallery use drawn illustrations. Real photos of signature dishes, the dining room, the banquet hall and the storefront will replace them.
- [ ] Review themes on the home page are our own summary of public Google reviews. With permission, real quotes from guests can be used instead.

## Launch

- [ ] Set `NEXT_PUBLIC_PROTOTYPE_MODE=false` (removes the preview strip, allows search indexing).
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the real domain.
- [ ] Optional: `NEXT_PUBLIC_GA_ID` for Google Analytics.
- [ ] Claim the TripAdvisor listing (unclaimed, 0 reviews) and fix its broken website link (`theyellowchilli.me`).
