import { Link } from "@tanstack/react-router";

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-2.5" aria-label="الجالس للسيارات — الرئيسية">
      <span aria-hidden className="notch flex size-9 items-center justify-center bg-primary font-display text-lg font-bold text-primary-foreground">
        ج
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-bold">الجالس</span>
        <span className={`ltr-iso mt-1 text-[0.6rem] font-semibold tracking-[0.2em] ${inverted ? "text-ink-foreground/70" : "text-muted-foreground"}`}>AL-JALES AUTOMOTIVE</span>
      </span>
    </Link>
  );
}
