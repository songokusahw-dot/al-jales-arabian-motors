import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { Link } from "@tanstack/react-router";
import { Pause, Play } from "lucide-react";
import { BRANDS } from "@/data/brands";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Button } from "@/components/ui/button";

/**
 * RTL brand marquee. Embla direction is "rtl"; Auto Scroll "backward" was verified
 * in the browser to move the strip visually from right to left under dir="rtl".
 */
export function BrandMarquee() {
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  // Duplicate the list so loop has enough slides on wide screens.
  const slides = [...BRANDS, ...BRANDS];

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, direction: "rtl", dragFree: true, align: "start", containScroll: false },
    [
      AutoScroll({
        speed: 0.8,
        direction: "backward",
        startDelay: 400,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        stopOnFocusIn: true,
        playOnInit: false,
      }),
    ],
  );

  const autoScroll = useCallback(() => emblaApi?.plugins()?.autoScroll, [emblaApi]);

  useEffect(() => {
    const plugin = autoScroll();
    if (!plugin) return;
    if (reduced || paused) plugin.stop();
    else plugin.play();
  }, [autoScroll, reduced, paused]);

  // Resume after the pointer leaves or focus moves out (drag stops it otherwise).
  useEffect(() => {
    if (!emblaApi) return;
    const resume = () => {
      const plugin = autoScroll();
      if (plugin && !reduced && !paused && !plugin.isPlaying()) plugin.play();
    };
    emblaApi.on("pointerUp", resume);
    return () => {
      emblaApi.off("pointerUp", resume);
    };
  }, [emblaApi, autoScroll, reduced, paused]);

  return (
    <section aria-label="علامات السيارات" className="border-y bg-card/70">
      <div className="container-site flex items-center gap-4 py-2">
        <p className="hidden shrink-0 font-display text-sm font-semibold text-muted-foreground md:block">العلامات</p>
        <div className="marquee-mask min-w-0 flex-1 overflow-hidden" ref={emblaRef} dir="rtl">
          <ul className="flex touch-pan-y" data-testid="brand-track">
            {slides.map((b, i) => (
              <li key={`${b.slug}-${i}`} className="min-w-0 shrink-0 grow-0 basis-auto ps-2" aria-hidden={i >= BRANDS.length ? true : undefined}>
                <Link
                  to="/cars"
                  search={{ brand: b.slug }}
                  tabIndex={i >= BRANDS.length ? -1 : undefined}
                  draggable={false}
                  className="flex h-16 min-w-36 select-none flex-col items-center justify-center rounded-md px-5 transition-colors hover:bg-accent focus-visible:bg-accent"
                  aria-label={`عرض سيارات ${b.nameAr}`}
                >
                  {b.logoSrc ? (
                    <img src={b.logoSrc} alt={b.nameEn} className="h-8 w-auto" />
                  ) : (
                    <span className="ltr-iso font-display text-lg font-bold tracking-wide">{b.nameEn}</span>
                  )}
                  <span className="text-xs text-muted-foreground">{b.nameAr}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {!reduced && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "تشغيل حركة الشريط" : "إيقاف حركة الشريط"}
            aria-pressed={paused}
          >
            {paused ? <Play /> : <Pause />}
          </Button>
        )}
      </div>
    </section>
  );
}
