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
    openGraph: { title, description, url: path, siteName: `${business.fullName}, ${business.branch}`, type: "website", locale: "en_IN" },
    twitter: { card: "summary_large_image", title, description },
  };
}

/** Site-wide metadata for the root layout. */
export function rootMetadata(): Metadata {
  const title = `${business.name} Satna | Pure Veg Restaurant, Live Music & Party Venue`;
  const description =
    "Pure-veg thalis, sizzlers, tandoor and Chinese with live music by Veerji himself, in Railway Colony, Satna. Open daily 11 am – 11 pm. Menu, parties, directions.";
  return {
    ...pageMetadata({ title, description, path: "/" }),
    metadataBase: new URL(siteConfig.url),
    title: { default: title, template: `%s | ${business.name}, Satna` },
    applicationName: business.fullName,
    robots: siteConfig.prototypeMode ? { index: false, follow: false } : { index: true, follow: true },
    formatDetection: { telephone: false },
  };
}
