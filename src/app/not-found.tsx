import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";

export default function NotFound() {
  return (
    <PageHero
      label="404"
      title={
        <>
          That song&rsquo;s not on the <span className="text-gold">setlist</span>.
        </>
      }
      intro="The page you were looking for isn't here. The food and the music, happily, still are."
    >
      <div className="flex flex-wrap gap-3">
        <Button href="/">Back to home</Button>
        <Button href="/menu" variant="outline" icon="book" className="text-cream">
          See the menu
        </Button>
      </div>
    </PageHero>
  );
}
