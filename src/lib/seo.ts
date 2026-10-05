import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { business } from "@/data/business";

interface PageSeo {
  title: string;
  description: string;
  path: string;
}

/** Per-page metadata: canonical URL and Open Graph / X cards. */
export function pageMetadata({ title, description, path }: PageSeo): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, siteName: `${business.name}, ${business.branch}`, type: "website", locale: "en_IN" },
    twitter: { card: "summary_large_image", title, description },
  };
}

/** Site-wide metadata for the root layout. */
export function rootMetadata(): Metadata {
  const title = `${business.name} Satna | Sanjeev Kapoor's Indian Restaurant & Banquets`;
  const description =
    "Mughlai, Punjabi and frontier cooking from Master Chef Sanjeev Kapoor's recipes, on NH-75, Panna Naka Road, Satna. Open daily 11:30 am – 11:30 pm. Menu, banquets, directions.";
  return {
    ...pageMetadata({ title, description, path: "/" }),
    metadataBase: new URL(siteConfig.url),
    title: { default: title, template: `%s | ${business.name}, Satna` },
    applicationName: business.name,
    robots: siteConfig.prototypeMode ? { index: false, follow: false } : { index: true, follow: true },
    formatDetection: { telephone: false },
  };
}
