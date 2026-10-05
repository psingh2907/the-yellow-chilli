import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";

export default function NotFound() {
  return (
    <PageHero
      label="404"
      title={
        <>
          This plate is <span className="text-saffron">empty</span>.
        </>
      }
      intro="The page you were looking for isn't on the menu. The food, happily, still is."
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
