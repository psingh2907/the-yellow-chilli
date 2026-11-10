# Veerji's Cafe Club & Restaurant, Satna

Website prototype for Veerji's Cafe Club & Restaurant, Satna: a pure-veg restaurant with live music by the owner, Adityaveer Singh ("Veerji"), on the first floor of R.S Tower, Railway Colony. Built to be animation-led: GSAP runs every motion on the site, and Three.js renders the 3D scenes under GSAP's clock.

The repository started as a prototype for The Yellow Chilli, Satna; that restaurant already has a website, so the site was rebuilt for Veerji's, which doesn't. Research and the reasons for the choice are in `docs/research.md`.

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build
```

Stack: Next.js 16 (App Router, fully static), React 19, TypeScript, Tailwind CSS 4, GSAP 3.15 + `@gsap/react`, three.js 0.186. Deploys to Netlify (`netlify.toml`). Settings in `.env.example`.

## Pages

| Route | What's there |
|---|---|
| `/` | Preloader, 3D record hero, खाओ · गाओ · मनाओ chapters, the Setlist (a day at Veerji's on a music staff), Din se Raat, tandoor, 3D dish gallery, Spice-o-meter, parties, reviews, find us |
| `/menu` | All 204 dishes with Flip filters, search, draggable category rail and an order builder that sends the order on WhatsApp |
| `/parties` | Birthdays, anniversaries, kitty parties: expanding "moments", steps, WhatsApp booking form with a song request |
| `/story` | "One Thali": a scroll-driven 3D film in five chapters |
| `/visit` | Route map, Google Map, hours, contact, Bikaner by Veerji's, FAQ |

## Where the motion lives

| Effect | Where | GSAP |
|---|---|---|
| Smooth scroll, parallax, `data-reveal` / `data-split` | `components/motion/SmoothScroll.tsx` | ScrollSmoother, ScrollTrigger, SplitText |
| Brand eases `groove`, `simmer`, `heat` | `lib/gsap.ts` | CustomEase, CustomWiggle |
| "Mic check" preloader → header | `components/loader/Preloader.tsx` | DrawSVG, MorphSVG, Flip, SplitText |
| Route-change curtain | `components/motion/PageTransition.tsx` | timeline |
| Cursor, magnetic buttons | `components/motion/Cursor.tsx` | quickTo |
| Hero: 3D record + confetti burst, scrambled cravings | `components/home/Hero*.tsx`, `lib/three/record.ts`, `lib/three/confetti.ts` | ScrollTrigger scrub, ScrambleText, quickTo |
| खाओ · गाओ · मनाओ chapters | `components/home/Verbs.tsx` | pinned scrub, SplitText, DrawSVG |
| The Setlist (11 am → 11 pm on a staff) | `components/home/Setlist.tsx`, `data/setlist.ts` | DrawSVG, MotionPath, pinned scrub |
| Din se Raat (cafe → club) | `components/home/DinSeRaat.tsx` | MotionPath, MorphSVG |
| Tandoor | `components/home/Tandoor.tsx` | MotionPath, Physics2D, ScrambleText, CustomWiggle |
| Floating 3D gallery | `components/home/FloatingGallery.tsx` | Draggable + Inertia driving three.js |
| Spice-o-meter | `components/home/SpiceMeter.tsx` | Draggable rotation, Flip, Physics2D, CustomWiggle |
| Review marquee | `components/home/Voices.tsx` | Draggable + Inertia, scroll velocity |
| Menu, order builder | `components/menu/*` | Flip, Draggable, MotionPath |
| Party moments, string lights, confetti | `components/parties/*`, `components/home/PartyTeaser.tsx` | Flip (across a portal), Physics2D, DrawSVG |
| "One Thali" film | `components/story/StoryFilm.tsx`, `lib/three/film.ts` | one scrubbed timeline drives camera, captions, plating |

Three.js helpers (`lib/three/stage.ts`) render from `gsap.ticker`, only while a canvas is on screen, and are imported dynamically so three.js never lands in the first-load bundle.

## Conventions

- Everything respects `prefers-reduced-motion`: content is shown still, 3D scenes become illustrations, pins are removed.
- `position: fixed` doesn't work inside ScrollSmoother's content: overlays (thali, expanded cards) render into `<body>` with portals.
- Pinned sections that are created late (after async three.js setup) call `ScrollTrigger.sort()` before `refresh()`.
- Facts live in `src/data/`. Anything unconfirmed is listed in `docs/owner-checklist.md`.
