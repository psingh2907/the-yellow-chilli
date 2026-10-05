import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { pagePaths } from "@/data/navigation";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", ...pagePaths, "/privacy"].map((path) => ({
    url: new URL(path, siteConfig.url).toString(),
    changeFrequency: path === "/menu" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/privacy" ? 0.3 : 0.8,
  }));
}
