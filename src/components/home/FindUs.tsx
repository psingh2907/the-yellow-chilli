import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { OpenStatus } from "@/components/ui/OpenStatus";
import { RouteMap } from "@/components/ui/RouteMap";
import { business } from "@/data/business";
import { addressLine, directionsUrl, phoneDisplay, phoneHref } from "@/lib/contact";
import { hoursText } from "@/lib/hours";

export function FindUs() {
  return (
    <section aria-labelledby="find-title" className="grain relative overflow-hidden bg-night py-24 text-cream md:py-32">
      <div className="container-x grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="label text-gold">Find us</p>
          <h2 id="find-title" data-split className="display-lg mt-3">
            {business.distances.stationKm} km from the station. Right in town.
          </h2>
          <address className="mt-6 text-lg leading-relaxed text-mist not-italic">{addressLine}</address>
          <ul className="mt-6 space-y-2 text-sm">
            <li>
              <OpenStatus />
            </li>
            <li className="flex items-center gap-2">
              <Icon name="clock" className="h-4 w-4 text-gold" /> Daily, {hoursText}
            </li>
            <li className="flex items-center gap-2">
              <Icon name="train" className="h-4 w-4 text-gold" /> About {business.distances.stationMinutes} minutes from Satna Junction
            </li>
            <li className="flex items-center gap-2">
              <Icon name="parking" className="h-4 w-4 text-gold" /> Free parking nearby
            </li>
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={directionsUrl} icon="pin" external>
              Directions
            </Button>
            <Button href={phoneHref} variant="outline" icon="phone" className="text-cream">
              {phoneDisplay}
            </Button>
          </div>
        </div>
        <RouteMap className="rounded-3xl bg-night-soft p-4 md:p-8" />
      </div>
    </section>
  );
}
