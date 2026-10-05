import type { Viewport } from "next";
import Script from "next/script";
import { ActionDock } from "@/components/layout/ActionDock";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PrototypeBanner } from "@/components/layout/PrototypeBanner";
import { Preloader } from "@/components/loader/Preloader";
import { Cursor } from "@/components/motion/Cursor";
import { PageTransition } from "@/components/motion/PageTransition";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { RestaurantSchema } from "@/components/seo/RestaurantSchema";
import { siteConfig } from "@/config/site";
import { LOADER_INIT_SCRIPT } from "@/lib/intro";
import { rootMetadata } from "@/lib/seo";
import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata = rootMetadata();

export const viewport: Viewport = {
  themeColor: "#0d1020",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the head script adds loader classes to <html> before React hydrates.
    <html lang="en-IN" className={`${fontVariables} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: LOADER_INIT_SCRIPT }} />
      </head>
      <body className="min-h-svh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[110] focus:rounded-full focus:bg-cream focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-night"
        >
          Skip to content
        </a>
        <Preloader />
        <PrototypeBanner />
        <Navbar hasBanner={siteConfig.prototypeMode} />
        <SmoothScroll>
          <main id="main">{children}</main>
          <Footer />
        </SmoothScroll>
        <ActionDock />
        <Cursor />
        <PageTransition />
        <RestaurantSchema />

        {siteConfig.gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.gaId}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${siteConfig.gaId}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
