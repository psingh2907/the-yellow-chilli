# The Yellow Chilli, Satna — GSAP-led Motion Plan

GSAP is the conductor of the whole site. Three.js is one instrument it plays: GSAP's ticker drives the 3D render loop, and every 3D change is a GSAP tween on a camera, mesh or shader value.

Since GSAP 3.13 (Webflow), **every plugin is free for commercial use**. Current version is 3.15.0. The bamboo-house site used only `ScrollTrigger` and `useGSAP`; this site uses the full toolkit.

---

## 1. Motion foundation

| Piece | Choice | Why |
|---|---|---|
| Smooth scroll | **ScrollSmoother** (replaces Lenis) | Native to GSAP, so no sync glue. Gives `data-speed` / `data-lag` parallax on any element. Smoothing off on touch (`smoothTouch: false`). |
| Brand eases | **CustomEase**: `chilli-snap` (sharp start, long settle), `simmer` (slow, heavy) | One motion "voice" across the site, the way a brand has one font. |
| Shakes | **CustomWiggle** | Heat shake on the spice dial and the tandoor skewers. |
| Responsive / a11y | **gsap.matchMedia()** | Separate timelines for desktop, mobile and `prefers-reduced-motion`; all reverted automatically. |
| React | **useGSAP()** with `scope` | Auto cleanup on unmount and route change. |
| Cursor | **gsap.quickTo()** | Chilli cursor and magnetic buttons without creating new tweens every mouse move. |
| Dev only | **GSDevTools** | Scrub any timeline while tuning. Not shipped to production. |
| 3D clock | **gsap.ticker** renders Three.js | One animation loop for DOM and WebGL, so they never drift apart. |

Plugins are registered once in a `MotionProvider` and lazy-loaded per section, so the first page load stays light.

---

## 2. Section by section

### 0 · Preloader — "Tadka"
- **DrawSVG** traces a chilli outline, then it fills marigold.
- Load counter 0→100 with `snap`.
- **MorphSVG** turns the chilli into the dot over the "o" in the wordmark.
- **Flip** flies the wordmark from screen centre into the navbar, so the preloader becomes the header.

### 1 · Hero — "Redefining Indian food"
- **SplitText** (`mask: "lines"`, `autoSplit`) reveals the headline line by line from behind a clip.
- **ScrambleText** cycles the regional word: *Punjabi → Mughlai → Awadhi → Frontier → Bundeli*, with a Hindi-mode scramble using Devanagari characters.
- **Three.js**: a glossy yellow chilli with spice particles (saffron, chilli flakes, cumin). Mouse tilts it through `quickTo`; scrolling scrubs a shader value that bursts it into spice dust leading to the next section.
- Mobile fallback: **Physics2D** throws a few DOM spice sprites instead of WebGL.

### 2 · "The Chef's Journey" — signature GSAP moment
Built on the brand idea: dishes Chef Sanjeev Kapoor found while travelling India.
- Section pins; content scrolls **horizontally** (ScrollTrigger `containerAnimation`).
- **DrawSVG** draws a route line across a stylised SVG map of India as you scroll.
- **MotionPath** moves a chilli marker along that route.
- At each stop, a dish card rises in (SplitText name, price counts up):
  Punjab → Lalla Mussa Dal · Puran Singh Tari Wala Murgh
  Delhi → Dilli Wala Butter Chicken
  Rajasthan → Laal Maas
  Lucknow → Murgh Noormahal Biryani
  Hyderabad → Dum Gosht Biryani
  Kashmir → Nalli Rogan Josh
- Ends by zooming into **Satna** with the local Bundeli Veg Kofta: "and the journey ends at your table."
- Mobile: becomes a vertical journey with the same DrawSVG route.

### 3 · Shaam Savera — "dusk to dawn"
- Scroll-scrubbed sky gradient, dusk → night → dawn.
- **MotionPath** arcs the sun across the sky; **MorphSVG** turns the sun into a moon and back.
- Live hours: "Open now · closes 11:30 PM" uses the same day-cycle visual.

### 4 · The Tandoor
- Pinned section. Skewers slide along a **MotionPath** into the tandoor mouth.
- **CustomWiggle** heat shimmer; Three.js ember particles with intensity tied to scroll.
- Kebab names (Murgh Malai Tikka, Angara Murgh Tikka, Nawabi Mutton Seekh) burn in with **ScrambleText**.

### 5 · Menu explorer (about 280 items)
- Veg / non-veg / category filters animate with **Flip**: cards glide to new positions instead of jumping.
- Category rail uses **Draggable + Inertia** with snapping.
- **ScrollTo** jumps between categories smoothly.
- Seasonal specials (Holi, Monsoon, Navratri) appear with a festive accent.

### 6 · Build-a-Platter (answers "too expensive")
- Drag dishes onto a thali with **Draggable + Inertia**; they snap into the bowls.
- Total and per-person cost count up live: "Feeds 4 · about ₹X per person".
- Ends with a "Reserve this table" button. Turns the price concern into a visible value story.

### 7 · Spice-o-meter (signature easter egg, like bamboo-house's tiger game)
- A dial rotated with **Draggable** (`type: "rotation"`) + Inertia.
- As heat rises, dishes re-sort with **Flip** (mild → fiery) and the UI starts to **CustomWiggle**.
- At max: chilli flames burst with **Physics2D** and the headline scrambles to "Bas! Paani laao!" ("Enough! Bring water!").

### 8 · Banquets & Events
- **DrawSVG** marigold garland draws across the section top.
- **Flip** gallery: a tapped photo expands full-screen from its exact spot.
- Counter "up to 400 guests"; marigold petals fall with **Physics2D**.
- Enquiry button goes to WhatsApp.

### 9 · What Satna says
- Infinite review marquee (GSAP `horizontalLoop` helper) that can be dragged and flung (**Draggable + Inertia**).
- Featured quotes reveal with **SplitText** lines.

### 10 · Find us — "4.5 km from Satna station"
- **DrawSVG** draws the road route from the railway station to the restaurant, with landmarks (Panna Naka, Peptech City).
- **MotionPath** moves a little car along it.
- Large buttons for directions, call and WhatsApp; free parking called out.

### 11 · Footer
- Giant "the yellow chilli" wordmark; letters scatter from the cursor with `quickTo` and spring back (elastic ease).

### Site-wide
- Page transitions between routes: a GSAP timeline in Next.js `template.tsx`, with a saffron wipe and the logo **Flip**.
- Magnetic buttons, chilli cursor (desktop only), `data-speed` parallax on food photos.

---

## 3. Three.js under GSAP

- **One fixed canvas** behind the page; ScrollTrigger swaps which "scene" is active (hero chilli, tandoor embers).
- Rendering happens in `gsap.ticker.add()`, not a separate `requestAnimationFrame`.
- Every 3D change is a GSAP tween: `gsap.to(camera.position, …)`, `gsap.to(material.uniforms.uBurst, { value: 1, scrollTrigger: { scrub: true } })`.
- Recommendation: **vanilla three.js** with a thin React wrapper rather than React Three Fiber. GSAP then owns the clock with no second render loop to reconcile.
- glTF models compressed with Draco; WebGL is skipped on low-end devices, where SVG/DOM fallbacks take over.

---

## 4. Performance budget (Satna audience = mostly mid-range Android on 4G)

- Animate only `transform` and `opacity` (plus shader values); never layout properties.
- `SplitText.revert()` after one-time reveals to cut DOM size.
- Lazy-load plugins and the 3D canvas per section; ScrollTrigger refresh after fonts load (SplitText `autoSplit` handles text).
- `gsap.matchMedia` with a light mobile timeline and a reduced-motion version (instant states, no scrub, no shake).
- Targets: LCP < 2.5 s on 4G, 60 fps scroll on a mid-range Android, initial JS < 200 KB gzipped.

---

## 5. Stack summary

Next.js 16 · React 19 · TypeScript · Tailwind 4 · **GSAP 3.15** (ScrollTrigger, ScrollSmoother, SplitText, ScrambleText, DrawSVG, MorphSVG, MotionPath, Flip, Draggable, Inertia, Observer, Physics2D, CustomEase, CustomWiggle, ScrollTo, GSDevTools in dev) · `@gsap/react` · three.js (vanilla) · pnpm · Netlify · English and Hindi.

Optional tooling: GreenSock's official agent skills (`github.com/greensock/gsap-skills`) — gsap-core, timeline, scrolltrigger, plugins, utils, react, performance — so generated GSAP code follows their current best practices.

---

## 6. Ideas borrowed from the GSAP Showcase (gsap.com/showcase)

| Showcase site | What it does | Our version |
|---|---|---|
| **Millemann Wines** (millemannwines.fr) — WebGL, ScrollTrigger | Story told through three giant vertical verbs (Choisir / Maîtriser / Partager = Choose / Master / Share); short poetic lines; a particle "mist" field in WebGL; text duplicated for mask-roll reveals | **Three verb chapters: CHUNNA · PAKANA · PAROSNA** (Choose · Cook · Serve). Letters stack vertically and SplitText-reveal one by one. Poetic lines: "A pinch of hing. A moment of silence. Then the tadka." A Three.js steam-and-spice particle field drifts behind the page. |
| **Chasing the Moment** (byholm.co) — real-time 3D web film | Five-scene 3D film rendered live in the browser; scrolling sets the pace; no text needed | **"One Plate" scroll film**: spice market at dawn → tandoor fire → dum handi sealed with dough → plating → a table in Satna. GSAP timeline scrubbed by scroll drives the camera. Pre-rendered video fallback on phones. |
| **Pahāri** (pahari.vercel.app) — Indian art "Floating Gallery" in 3D | Paintings float in 3D; a toggle switches the layout between a sphere and a cylinder | **Floating dish gallery** for the signature dishes or banquet photos. A GSAP tween morphs the arrangement between cylinder and sphere; drag to spin with Inertia. |
| **TILToooTILT / "Everything Has Weight"** (tote.co.jp) — Draggable, Inertia | Every object has physics stats (mass, drift, stability), can be dragged and flung, and there's a ranked list | **Dish "stat cards"**: spice level, richness, veg/non-veg. Drag and fling them with Inertia, heavier dishes moving slower. A ranked "hottest to mildest" list feeds the Spice-o-meter. |
| **Illoca** (unseen.co) — canvas with a live X/Y readout | Live coordinate display reinforces the canvas metaphor | During the India-map journey, a live readout shows the latitude/longitude ticking as the camera flies, landing on **24.5765° N, 80.7830° E — Satna**. |
| **A24 / Ravi Klaassens** — Observer, Draggable, Flip, Inertia (from tags; not viewed) | Draggable infinite grid that opens items with Flip | **Infinite draggable menu wall**: all about 280 dishes on a pannable grid; tap one and it expands with Flip into a detail card. |
| **Noomo storytelling** — Observer chapters | Full-screen chapters advanced by swipe or wheel | On mobile, the India journey becomes **Observer-driven full-screen chapters** (one swipe = one region) instead of horizontal scroll. |

Note: the in-app browser could not render several of these WebGL sites, so some notes come from page text, structure and GSAP's plugin tags rather than watching them run.
