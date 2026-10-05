import { Bricolage_Grotesque, Mukta, Yatra_One } from "next/font/google";

/*
 *  - Bricolage Grotesque  headlines: chunky, warm, a little playful. Preloaded.
 *  - Mukta                body text, Latin + Devanagari.
 *  - Yatra One            Devanagari display for the three verbs
 *                         (चुनना · पकाना · परोसना), loaded on demand.
 */
export const display = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"], display: "swap" });

export const body = Mukta({ variable: "--font-mukta", subsets: ["latin"], weight: ["400", "600", "700"], display: "swap" });

export const deva = Yatra_One({ variable: "--font-yatra", subsets: ["devanagari"], weight: "400", display: "swap", preload: false });

export const fontVariables = [display, body, deva].map((f) => f.variable).join(" ");
