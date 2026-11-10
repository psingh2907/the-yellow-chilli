# Owner checklist: Veerji's Cafe Club & Restaurant, Satna

Everything on the site came from public listings (Google Maps, JustDial, Zomato, Instagram, Wanderboat) in October 2026. These items need the owner's confirmation before launch. Background is in `docs/research.md`.

## Must confirm

- [ ] **Name and logo.** The site uses "Veerji's" with a full name of "Veerji's Cafe Club & Restaurant" (Google says "Veerji cafe club & restaurant", Zomato and JustDial say "Veerji's Restaurant"). The mic mark and wordmark are ours; swap in a real logo if there is one.
- [ ] **Using Veerji's name.** The site names the owner, Adityaveer Singh ("Veerji"), as the live singer. Confirm he's happy with that.
- [ ] **Main phone and WhatsApp number.** The site uses **088188 88385** (Google, Instagram) for calls and WhatsApp. Others seen: 89825 45800 and 87701 89646 (Instagram bio), 95844 39543 (Zomato, also Bikaner by Veerji's). Set the real ones in `src/data/business.ts`.
- [ ] **Hours.** The site says 11 am – 11 pm, every day.
- [ ] **Live music schedule.** The site says live music is "usually on in the evenings" and puts it at about 9 pm on the home page setlist. Which evenings, and from what time? Can guests request songs in advance?
- [ ] **Pure veg.** The menu is all vegetarian and the site says "pure veg" / "100% veg". Google's listing also tags alcohol and cocktails; the site makes no alcohol claims.
- [ ] **Menu and prices.** Transcribed from Zomato (₹199-style prices). JustDial shows most prices ₹1 higher.
- [ ] **Dish notes.** Thali and sizzler contents come from Zomato. Other short descriptions are ours (e.g. Dahi Sholey, Veg Kothe, Paneer Pardanashi). Check them, especially the VRJ specials, which have no description anywhere.
- [ ] **Heat levels** on the Spice-o-meter and menu are our estimates.
- [ ] **Party details.** The booking form allows 4–150 guests. What do the private room and the full floor hold? Are decorations or cakes arranged in-house?

## Should confirm

- [ ] **Bikaner by Veerji's** (Gali No. 16, Rajendra Nagar, 095844 39543): the Visit page and party form feature it as a sister venue. The same address used to be "Bikaner Express"; the site doesn't mention that name. Confirm how it should be described.
- [ ] Parking: Google lists a free parking lot and free street parking. The site says "free parking nearby".
- [ ] Directions text: Satna Junction → Railway Station Road → R.S Tower, near Circuit House Chowk (1.1 km, about 4 minutes).
- [ ] Catering, Wi-Fi, kids' menu and high chairs come from Google's attribute list.
- [ ] Email address for the privacy page (none found; the site uses the phone and Instagram).

## To replace

- [ ] **Photos.** All dishes, party "moments" and the 3D gallery use drawn illustrations. Real photos of the room with the stage, live music nights, signature dishes, party set-ups and the R.S Tower entrance will replace them.
- [ ] Review themes on the home page are our own summary of public Google and JustDial reviews. With permission, real quotes from guests can be used instead.

## Launch

- [ ] Set `NEXT_PUBLIC_PROTOTYPE_MODE=false` (removes the preview strip, allows search indexing).
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the real domain.
- [ ] Optional: `NEXT_PUBLIC_GA_ID` for Google Analytics.
- [ ] Claim the Google listing's "Add website" slot and the JustDial listing ("Claim this business", "Add Website") and point both at the new site.
