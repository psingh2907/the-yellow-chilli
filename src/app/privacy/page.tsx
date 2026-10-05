import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { business } from "@/data/business";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy",
  description: "How The Yellow Chilli, Satna website handles your information: it collects none.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <PageHero label="Privacy" title="Short and simple." />
      <section className="bg-cream py-20 text-ink">
        <div className="container-x max-w-3xl space-y-6 text-lg leading-relaxed">
          <p>This website doesn&rsquo;t ask you to sign up and doesn&rsquo;t store anything you type.</p>
          <p>
            The platter builder and the banquet enquiry form run entirely in your browser. When you press &ldquo;Send on WhatsApp&rdquo;, they open WhatsApp with
            a message you can read and edit before sending. Nothing is sent to us until you send it yourself.
          </p>
          <p>
            The map on the Visit page is embedded from Google Maps, and links to Google, Zomato and Facebook take you to those services, which have their
            own privacy policies.
          </p>
          <p>
            If analytics are switched on, Google Analytics records anonymous page visits so we can see which pages are useful. Questions? Write to{" "}
            <a className="underline" href={`mailto:${business.contact.email}`}>
              {business.contact.email}
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
