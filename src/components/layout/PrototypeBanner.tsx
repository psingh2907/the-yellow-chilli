import { siteConfig } from "@/config/site";

/** Thin strip shown on the sales prototype only. */
export function PrototypeBanner() {
  if (!siteConfig.prototypeMode) return null;
  return (
    <div data-banner className="fixed inset-x-0 top-0 z-[55] flex h-8 items-center justify-center bg-chilli px-4 text-center text-[0.7rem] font-semibold tracking-wide text-cream">
      <span className="sm:hidden">Website preview · details to be confirmed</span>
      <span className="hidden sm:inline">Website preview · illustrations stand in for real photos · details to be confirmed by the restaurant</span>
    </div>
  );
}
