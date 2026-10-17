import { Container } from "@/components/layout/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Squiggle } from "@/components/ui/Doodles";

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="font-display text-8xl font-extrabold text-royal-200">404</p>
      <h1 className="relative mx-auto mt-2 inline-block text-3xl font-extrabold">
        This page skipped class
        <Squiggle className="absolute -bottom-2 left-0 h-3 w-full" />
      </h1>
      <p className="mt-5 text-ink-2">The link may be old, or the chapter hasn&apos;t been written yet.</p>
      <ButtonLink href="/dashboard" className="mt-8">
        Back to my desk
      </ButtonLink>
    </Container>
  );
}
