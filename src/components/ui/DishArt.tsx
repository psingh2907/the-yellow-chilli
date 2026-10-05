/**
 * Top-down dish illustrations that stand in for food photography until the
 * restaurant shares real photos. Each is drawn from a few parameters
 * (kind + colour + seed), so every dish looks a little different but the
 * set stays consistent. Also serialised to images for the 3D gallery.
 */
export type DishKind = "curry" | "dal" | "biryani" | "kebab" | "dessert" | "kofta" | "bread" | "noodles";

export interface DishSpec {
  kind: DishKind;
  tone: string;
  seed?: number;
}

/** Small deterministic random, so server and client draw the same dish. */
function rng(seed: number) {
  let s = seed % 2147483647 || 1;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

export function dishSvgMarkup({ kind, tone, seed = 7 }: DishSpec, id: string): string {
  const r = rng(seed * 997 + kind.length * 31);
  const parts: string[] = [];
  const g = `g${id}`;
  // Brass thali rim and plate.
  parts.push(
    `<defs><radialGradient id="${g}p" cx="45%" cy="40%"><stop offset="0" stop-color="#f3e3bf"/><stop offset="1" stop-color="#cdb07a"/></radialGradient>` +
      `<radialGradient id="${g}f" cx="42%" cy="38%"><stop offset="0" stop-color="${tone}" stop-opacity="1"/><stop offset="0.7" stop-color="${tone}"/><stop offset="1" stop-color="#1a0d06" stop-opacity="0.85"/></radialGradient>` +
      `<radialGradient id="${g}s" cx="50%" cy="50%"><stop offset="0.8" stop-color="#000" stop-opacity="0.35"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>`,
    `<circle cx="100" cy="104" r="96" fill="url(#${g}s)"/>`,
    `<circle cx="100" cy="100" r="92" fill="#b8924a"/><circle cx="100" cy="100" r="86" fill="url(#${g}p)"/>`,
  );

  const garnish = (n: number, radius: number, colors: string[], size = 3) => {
    for (let i = 0; i < n; i++) {
      const a = r() * Math.PI * 2;
      const d = Math.sqrt(r()) * radius;
      const x = 100 + Math.cos(a) * d;
      const y = 100 + Math.sin(a) * d;
      const c = colors[Math.floor(r() * colors.length)];
      const s = size * (0.6 + r() * 0.8);
      parts.push(`<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${s.toFixed(1)}" ry="${(s * 0.6).toFixed(1)}" transform="rotate(${Math.round(r() * 180)} ${x.toFixed(1)} ${y.toFixed(1)})" fill="${c}"/>`);
    }
  };
  const bowl = (rad = 64) => {
    parts.push(`<circle cx="100" cy="100" r="${rad + 6}" fill="#6b4a22"/><circle cx="100" cy="100" r="${rad + 2}" fill="#2a1a0c"/>`);
    parts.push(`<circle cx="100" cy="100" r="${rad}" fill="url(#${g}f)"/>`);
  };
  const swirl = (color = "#fff6e6", w = 4) =>
    parts.push(`<path d="M70,96 C80,74 122,76 128,98 C134,120 98,132 86,114 C78,102 96,92 106,102" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" opacity="0.85"/>`);

  switch (kind) {
    case "curry":
      bowl();
      swirl();
      garnish(14, 50, ["#3f8f4f", "#5aa860"], 3.2);
      garnish(3, 40, ["#e0392b"], 4);
      break;
    case "dal":
      bowl();
      swirl("#fff2d6", 5);
      parts.push(`<ellipse cx="112" cy="88" rx="9" ry="6" fill="#ffe08a"/>`);
      garnish(8, 46, ["#3f8f4f"], 2.6);
      break;
    case "kofta":
      bowl();
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + 0.4;
        const x = 100 + Math.cos(a) * 26;
        const y = 100 + Math.sin(a) * 26;
        parts.push(`<circle cx="${x}" cy="${y}" r="15" fill="#2f6a35"/><circle cx="${x + 2}" cy="${y - 1}" r="7" fill="#fbf3e4"/>`);
      }
      swirl("#fff6e6", 3);
      break;
    case "biryani":
      parts.push(`<circle cx="100" cy="100" r="70" fill="#4a2c12"/><circle cx="100" cy="100" r="64" fill="#efd9a8"/>`);
      garnish(70, 58, ["#fff8e8", "#f4c45a", "#e89a2c", "#fffdf6"], 2.6);
      garnish(8, 50, ["#7a3a14"], 5);
      garnish(10, 54, ["#3f8f4f"], 2.4);
      garnish(6, 50, ["#c94a16"], 2.4);
      break;
    case "kebab":
      for (let i = 0; i < 5; i++) {
        const y = 62 + i * 19;
        parts.push(`<rect x="${44 + r() * 8}" y="${y}" width="${104 - r() * 12}" height="13" rx="6.5" fill="${tone}"/>`);
        parts.push(`<rect x="${58 + r() * 20}" y="${y + 3}" width="${18}" height="4" rx="2" fill="#2a1408" opacity="0.6"/>`);
      }
      garnish(10, 70, ["#f3f0d8", "#c9e3a0"], 4);
      parts.push(`<path d="M132,140 a16,16 0 1,0 18,-20 z" fill="#f2d24a"/>`);
      break;
    case "dessert":
      bowl(58);
      for (let i = 0; i < 3; i++) {
        const a = (i / 3) * Math.PI * 2;
        const x = 100 + Math.cos(a) * 20;
        const y = 100 + Math.sin(a) * 20;
        parts.push(`<circle cx="${x}" cy="${y}" r="17" fill="#5a1e0e"/><circle cx="${x - 5}" cy="${y - 6}" r="5" fill="#fff" opacity="0.25"/>`);
      }
      garnish(10, 44, ["#c8e27a", "#e86a8a"], 2.4);
      break;
    case "bread":
      parts.push(`<ellipse cx="100" cy="100" rx="70" ry="54" fill="#e8c27c"/>`);
      garnish(22, 50, ["#8a4a18", "#5a2c0c"], 5);
      garnish(10, 40, ["#3f8f4f"], 2.4);
      break;
    case "noodles":
      bowl();
      for (let i = 0; i < 9; i++) {
        const y = 70 + r() * 60;
        parts.push(`<path d="M${50 + r() * 10},${y} C80,${y - 20} 110,${y + 20} ${148 - r() * 10},${y - 4}" fill="none" stroke="#f3cf7a" stroke-width="3.5" stroke-linecap="round"/>`);
      }
      garnish(10, 48, ["#3f8f4f", "#e0392b"], 3);
      break;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 208">${parts.join("")}</svg>`;
}

export function DishArt({ spec, className, label }: { spec: DishSpec; className?: string; label?: string }) {
  const id = `${spec.kind}${spec.seed ?? 0}`;
  const markup = dishSvgMarkup(spec, id).replace(/^<svg[^>]*>|<\/svg>$/g, "");
  return (
    <svg
      viewBox="0 0 200 208"
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}

/** Picks an illustration for a dish from its name. */
export function specForDish(name: string, tone?: string, seed = 1): DishSpec {
  const n = name.toLowerCase();
  const kind: DishKind = /biryani|pulao|rice|chawal/.test(n)
    ? "biryani"
    : /tikka|kebab|kabab|seekh|boti|tandoori|machchi|fish|chaap|tangri/.test(n) && !/masala|curry|biryani/.test(n)
      ? "kebab"
      : /dal|chole|cholley|khichdi/.test(n)
        ? "dal"
        : /kofta|shaam savera/.test(n)
          ? "kofta"
          : /gulab|malai|rabdi|rasgulla|brownie|tukda/.test(n)
            ? "dessert"
            : /naan|roti|kulcha|paratha/.test(n)
              ? "bread"
              : /noodle|chowmein/.test(n)
                ? "noodles"
                : "curry";
  const defaultTone: Record<DishKind, string> = {
    curry: "#c9581f",
    dal: "#4a2416",
    biryani: "#e3b25a",
    kebab: "#c0571f",
    dessert: "#f3e6c8",
    kofta: "#d2632a",
    bread: "#e8c27c",
    noodles: "#8a4a18",
  };
  return { kind, tone: tone ?? defaultTone[kind], seed };
}
