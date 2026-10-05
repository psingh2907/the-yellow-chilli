# The Yellow Chilli, Satna

Website prototype for The Yellow Chilli, Satna (Master Chef Sanjeev Kapoor's restaurant on NH-75, Panna Naka Road). Built to be animation-led: GSAP runs every motion on the site, and Three.js renders the 3D scenes under GSAP's clock.

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build
```

Stack: Next.js 16 (App Router, fully static), React 19, TypeScript, Tailwind CSS 4, GSAP 3.15 + `@gsap/react`, three.js 0.186. Deploys to Netlify (`netlify.toml`). Settings in `.env.example`.

## Pages

| Route | What's there |
|---|---|
| `/` | Preloader, 3D hero, three-verb chapters, Chef's Journey map, Shaam Savera, tandoor, 3D dish gallery, Spice-o-meter, banquets, reviews, find us |
| `/menu` | About 240 dishes with Flip filters, search, draggable category rail and a platter builder that sends the order on WhatsApp |
| `/events` | Banquets: expanding "moments", steps, WhatsApp enquiry form |
| `/story` | "One Plate": a scroll-driven 3D film in five chapters |
| `/visit` | Route map, Google Map, hours, contact, FAQ |

## Where the motion lives

| Effect | Where | GSAP |
|---|---|---|
| Smooth scroll, parallax, `data-reveal` / `data-split` | `components/motion/SmoothScroll.tsx` | ScrollSmoother, ScrollTrigger, SplitText |
| Brand eases `chilli`, `simmer`, `heat` | `lib/gsap.ts` | CustomEase, CustomWiggle |
| "Tadka" preloader → header | `components/loader/Preloader.tsx` | DrawSVG, MorphSVG, Flip, SplitText |
| Route-change curtain | `components/motion/PageTransition.tsx` | timeline |
| Cursor, magnetic buttons | `components/motion/Cursor.tsx` | quickTo |
| Hero: 3D chilli + spice burst, scrambled cravings | `components/home/Hero*.tsx`, `lib/three/chilli.ts`, `lib/three/spice.ts` | ScrollTrigger scrub, ScrambleText, quickTo |
| चुनना · पकाना · परोसना chapters | `components/home/Verbs.tsx` | pinned scrub, SplitText, DrawSVG |
| Chef's Journey map | `components/home/Journey.tsx`, `lib/india.ts` | DrawSVG, MotionPath, pinned scrub + snap |
| Shaam Savera (dusk → dawn) | `components/home/ShaamSavera.tsx` | MotionPath, MorphSVG |
| Tandoor | `components/home/Tandoor.tsx` | MotionPath, Physics2D, ScrambleText, CustomWiggle |
| Floating 3D gallery | `components/home/FloatingGallery.tsx` | Draggable + Inertia driving three.js |
| Spice-o-meter | `components/home/SpiceMeter.tsx` | Draggable rotation, Flip, Physics2D, CustomWiggle |
| Review marquee | `components/home/Voices.tsx` | Draggable + Inertia, scroll velocity |
| Menu, platter thali | `components/menu/*` | Flip, Draggable, MotionPath |
| Banquet moments, petals | `components/events/*` | Flip (across a portal), Physics2D, DrawSVG |
| "One Plate" film | `components/story/StoryFilm.tsx`, `lib/three/film.ts` | one scrubbed timeline drives camera, captions, plating |

Three.js helpers (`lib/three/stage.ts`) render from `gsap.ticker`, only while a canvas is on screen, and are imported dynamically so three.js never lands in the first-load bundle.

## Conventions

- Everything respects `prefers-reduced-motion`: content is shown still, 3D scenes become illustrations, pins are removed.
- `position: fixed` doesn't work inside ScrollSmoother's content: overlays (thali, expanded cards) render into `<body>` with portals.
- Pinned sections that are created late (after async three.js setup) call `ScrollTrigger.sort()` before `refresh()`.
- Facts live in `src/data/`. Anything unconfirmed is listed in `docs/owner-checklist.md`.
