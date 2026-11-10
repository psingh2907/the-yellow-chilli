"use client";

import { Physics2DPlugin } from "gsap/Physics2DPlugin";
import { type FormEvent, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { business } from "@/data/business";
import { whatsappHref } from "@/lib/contact";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

gsap.registerPlugin(Physics2DPlugin);

const OCCASIONS = ["Birthday", "Anniversary", "Kitty party", "Baby shower", "Family dinner", "Office party", "Other"];
const VENUES = [`${business.name}, R.S Tower`, `${business.sister.name}, Rajendra Nagar`, "Either is fine"];

/**
 * Party enquiry. There's no server: it writes a tidy WhatsApp message
 * and opens the chat, so the restaurant gets every detail (song request
 * included) in one go. On send, confetti bursts from the button (Physics2D).
 */
export function EnquiryForm() {
  const button = useRef<HTMLButtonElement>(null);
  const petals = useRef<HTMLDivElement>(null);
  const [guests, setGuests] = useState(25);
  const [occasion, setOccasion] = useState(OCCASIONS[0]);
  const [venue, setVenue] = useState(VENUES[0]);

  const burst = () => {
    if (prefersReducedMotion() || !petals.current) return;
    gsap.utils.toArray<HTMLElement>("[data-petal]", petals.current).forEach((p) => {
      gsap.fromTo(
        p,
        { x: 0, y: 0, opacity: 1, rotation: 0, scale: gsap.utils.random(0.6, 1.2) },
        {
          duration: gsap.utils.random(1.4, 2.4),
          physics2D: { velocity: gsap.utils.random(300, 650), angle: gsap.utils.random(-160, -20), gravity: 700 },
          rotation: gsap.utils.random(-540, 540),
          opacity: 0,
          ease: "none",
        },
      );
    });
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const message = [
      "Hi Veerji's! I'd like to book a party.",
      `Name: ${data.get("name")}`,
      `Occasion: ${occasion}`,
      `Date: ${data.get("date") || "flexible"}`,
      `Guests: about ${guests}`,
      `Venue: ${venue}`,
      data.get("song") ? `Song request: ${data.get("song")}` : "",
      data.get("notes") ? `Notes: ${data.get("notes")}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    burst();
    setTimeout(() => window.open(whatsappHref(message), "_blank", "noopener"), prefersReducedMotion() ? 0 : 700);
  };

  const field = "mt-2 min-h-12 w-full rounded-2xl border border-cream/15 bg-night px-4 text-cream placeholder:text-mist/60 focus:border-gold focus:outline-none";
  return (
    <form onSubmit={submit} className="grid gap-5 rounded-3xl bg-night-soft p-6 text-cream md:grid-cols-2 md:p-10">
      <label className="block">
        <span className="label text-mist">Your name</span>
        <input name="name" required autoComplete="name" className={field} />
      </label>
      <label className="block">
        <span className="label text-mist">Date</span>
        <input name="date" type="date" className={cn(field, "[color-scheme:dark]")} />
      </label>
      <fieldset className="md:col-span-2">
        <legend className="label text-mist">Occasion</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {OCCASIONS.map((o) => (
            <button
              key={o}
              type="button"
              aria-pressed={occasion === o}
              onClick={() => setOccasion(o)}
              className={cn("min-h-11 rounded-full px-4 text-sm font-semibold transition-colors", occasion === o ? "bg-gold text-night" : "bg-night hover:text-gold")}
            >
              {o}
            </button>
          ))}
        </div>
      </fieldset>
      <label className="block md:col-span-2">
        <span className="label flex justify-between text-mist">
          Guests <span className="font-display text-xl text-gold tabular-nums">{guests}</span>
        </span>
        <input
          type="range"
          min={4}
          max={150}
          step={1}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="mt-4 w-full accent-[var(--color-gold)]"
        />
      </label>
      <fieldset className="md:col-span-2">
        <legend className="label text-mist">Where</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {VENUES.map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={venue === v}
              onClick={() => setVenue(v)}
              className={cn("min-h-11 rounded-full px-4 text-sm font-semibold transition-colors", venue === v ? "bg-gold text-night" : "bg-night hover:text-gold")}
            >
              {v}
            </button>
          ))}
        </div>
      </fieldset>
      <label className="block md:col-span-2">
        <span className="label flex items-center gap-2 text-mist">
          <Icon name="music" className="h-4 w-4 text-gold" /> A song for the occasion? <span className="normal-case tracking-normal">(optional)</span>
        </span>
        <input name="song" placeholder="e.g. “Tum Jiyo Hazaaron Saal” for Priya’s 30th" className={field} />
      </label>
      <label className="block md:col-span-2">
        <span className="label text-mist">Anything else?</span>
        <textarea name="notes" rows={3} placeholder="Timing, decoration, cake, kids, special requests…" className={cn(field, "py-3")} />
      </label>
      <div className="relative md:col-span-2">
        <button ref={button} type="submit" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-whatsapp px-7 font-semibold text-night">
          <Icon name="whatsapp" /> Send enquiry on WhatsApp
        </button>
        <div ref={petals} aria-hidden="true" className="pointer-events-none absolute top-1/2 left-24">
          {Array.from({ length: 22 }, (_, i) => (
            <span
              key={i}
              data-petal
              className="absolute h-3 w-2 rounded-[60%_40%_60%_40%] opacity-0"
              style={{ background: i % 3 === 0 ? "#9b7bff" : i % 3 === 1 ? "#f2b544" : "#ff4d7d" }}
            />
          ))}
        </div>
        <p className="mt-3 text-xs text-mist">Opens WhatsApp with your details filled in. Nothing is stored on this website.</p>
      </div>
    </form>
  );
}
