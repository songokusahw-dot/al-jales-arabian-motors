import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Expand, GalleryHorizontal, Image as ImageIcon, ImageOff, Info, LayoutGrid, X } from "lucide-react";
import type { VehicleImage as Img } from "@/lib/types";
import { VehicleImage } from "../VehicleImage";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

type Mode = "gallery" | "grid" | "slider";

const MODES: { key: Mode; label: string; icon: typeof LayoutGrid }[] = [
  { key: "gallery", label: "معرض", icon: ImageIcon },
  { key: "grid", label: "شبكة", icon: LayoutGrid },
  { key: "slider", label: "شريط", icon: GalleryHorizontal },
];

const isReal = (i: Img | undefined) => Boolean(i?.src) && !i?.isPlaceholder;

/** RTL: the next image sits to the left. */
function arrowStep(e: KeyboardEvent): -1 | 0 | 1 {
  if (e.key === "ArrowLeft") return 1;
  if (e.key === "ArrowRight") return -1;
  return 0;
}

const CONTROL =
  "flex size-10 cursor-pointer items-center justify-center rounded-full bg-card/90 text-card-foreground shadow-card backdrop-blur transition-[opacity,transform,background-color] hover:bg-card active:scale-95 disabled:pointer-events-none disabled:opacity-35";

export function Gallery({ images, title, referenceCode }: { images: Img[]; title: string; referenceCode?: string | undefined }) {
  const [mode, setMode] = useState<Mode>("gallery");
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const count = images.length;
  const realCount = images.filter(isReal).length;
  const hasIllustrative = images.some((i) => isReal(i) && i.isIllustrative);

  const returnFocus = useRef<HTMLElement | null>(null);
  const openLightbox = (i: number) => {
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setLightbox(i);
  };
  const onLightbox = (i: number | null) => {
    if (i === null && lightbox !== null) setActive(lightbox);
    setLightbox(i);
  };

  if (count === 0) {
    return (
      <section aria-label={`صور ${title}`}>
        <div className="aspect-[4/3] overflow-hidden rounded-lg sm:aspect-[16/10]">
          <VehicleImage image={undefined} />
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
          <ImageOff className="size-4" aria-hidden /> لا توجد صور لهذه السيارة بعد.
        </p>
      </section>
    );
  }

  return (
    <section aria-label={`صور ${title}`}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          {realCount === 0 ? <ImageOff className="size-4" aria-hidden /> : <Info className="size-4" aria-hidden />}
          <span>
            <span className="ltr-iso">{count}</span> صور
            {realCount === 0 && " — بانتظار الصور الأصلية للسيارة"}
            {hasIllustrative && " — تتضمن صوراً توضيحية لنفس الطراز"}
          </span>
        </p>
        <div role="group" aria-label="طريقة عرض الصور" className="flex rounded-md border bg-card p-0.5">
          {MODES.map((m) => (
            <button
              key={m.key}
              type="button"
              aria-pressed={mode === m.key}
              onClick={() => setMode(m.key)}
              className={cn(
                "flex cursor-pointer items-center gap-1.5 rounded-sm px-2.5 py-1.5 text-xs font-medium transition-colors",
                mode === m.key ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <m.icon className="size-3.5" aria-hidden />
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {mode === "gallery" && (
        <StageCarousel images={images} active={active} onSelect={setActive} onOpen={openLightbox} title={title} referenceCode={referenceCode} />
      )}

      {mode === "grid" && (
        <div className="fade-soft grid grid-cols-2 gap-3">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => openLightbox(i)}
              aria-label={`عرض الصورة ${i + 1} بملء الشاشة`}
              className={cn(
                "group relative cursor-zoom-in overflow-hidden rounded-lg bg-background/60 transition-shadow hover:shadow-card",
                i === 0 ? "col-span-2 aspect-[16/9]" : "aspect-[4/3]",
              )}
            >
              <VehicleImage image={img} compact={i !== 0} fit="contain" className="bg-transparent transition-transform duration-500 group-hover:scale-[1.02]" />
            </button>
          ))}
        </div>
      )}

      {mode === "slider" && <Filmstrip images={images} active={active} onSelect={setActive} onOpen={openLightbox} />}

      <Lightbox images={images} index={lightbox} onIndex={onLightbox} title={title} returnFocus={returnFocus} />
    </section>
  );
}

function StageCarousel({
  images,
  active,
  onSelect,
  onOpen,
  title,
  referenceCode,
}: {
  images: Img[];
  active: number;
  onSelect: (i: number) => void;
  onOpen: (i: number) => void;
  title: string;
  referenceCode?: string | undefined;
}) {
  const reduced = useReducedMotion();
  const [start] = useState(active);
  const [viewportRef, api] = useEmblaCarousel({ direction: "rtl", loop: false, duration: 28, startIndex: start });
  const n = images.length;

  useEffect(() => {
    if (!api) return;
    const on = () => onSelect(api.selectedScrollSnap());
    api.on("select", on);
    return () => {
      api.off("select", on);
    };
  }, [api, onSelect]);

  useEffect(() => {
    if (api && api.selectedScrollSnap() !== active) api.scrollTo(active, reduced);
  }, [api, active, reduced]);

  const go = (i: number) => onSelect(Math.max(0, Math.min(n - 1, i)));
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = arrowStep(e);
    if (step) {
      e.preventDefault();
      go(active + step);
    } else if (e.key === "Home") {
      e.preventDefault();
      go(0);
    } else if (e.key === "End") {
      e.preventDefault();
      go(n - 1);
    } else if (e.key === "Enter" && e.target === e.currentTarget) {
      onOpen(active);
    }
  };

  return (
    <div>
      <div className="@container relative">
        {referenceCode && (
          <span aria-hidden className="stage-code absolute inset-x-0 top-1/2 -translate-y-1/2 text-center">
            {referenceCode}
          </span>
        )}
        <div
          role="region"
          aria-roledescription="معرض صور"
          aria-label={`${title} — استخدم الأسهم للتنقل`}
          tabIndex={0}
          onKeyDown={onKeyDown}
          className="relative rounded-lg focus-visible:outline-offset-4"
        >
          <div ref={viewportRef} className="overflow-hidden rounded-lg" dir="rtl">
            <div className="flex touch-pan-y">
              {images.map((img, i) => (
                <div
                  key={i}
                  role="group"
                  aria-roledescription="صورة"
                  aria-label={`${i + 1} من ${n}`}
                  aria-hidden={i !== active}
                  onClick={() => onOpen(i)}
                  className="min-w-0 shrink-0 grow-0 basis-full cursor-zoom-in"
                >
                  <div className="aspect-[4/3] sm:aspect-[16/10]">
                    <VehicleImage image={img} eager={i === 0} fit="contain" className="bg-transparent" sizes="(min-width: 1024px) 60vw, 100vw" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <span className="pointer-events-none absolute start-3 top-3 rounded-full bg-card/90 px-3 py-1 text-xs font-semibold text-card-foreground shadow-card" aria-hidden>
            <span className="ltr-iso">
              {active + 1} / {n}
            </span>
          </span>
          <span className="sr-only" aria-live="polite">
            الصورة {active + 1} من {n}
          </span>
          <button type="button" onClick={() => onOpen(active)} aria-label="عرض الصورة بملء الشاشة" className={cn(CONTROL, "absolute end-3 top-3")}>
            <Expand className="size-4" aria-hidden />
          </button>
          {n > 1 && (
            <>
              <button type="button" onClick={() => go(active - 1)} disabled={active === 0} aria-label="الصورة السابقة" className={cn(CONTROL, "absolute start-3 top-1/2 -translate-y-1/2")}>
                <ChevronRight className="size-5" aria-hidden />
              </button>
              <button type="button" onClick={() => go(active + 1)} disabled={active === n - 1} aria-label="الصورة التالية" className={cn(CONTROL, "absolute end-3 top-1/2 -translate-y-1/2")}>
                <ChevronLeft className="size-5" aria-hidden />
              </button>
            </>
          )}
        </div>
      </div>

      {n > 1 && (
        <div role="group" aria-label="الصور المصغرة" className="mt-4 flex gap-2.5 overflow-x-auto p-1 [scrollbar-width:thin]">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(i)}
              aria-label={`عرض الصورة ${i + 1}`}
              aria-current={i === active ? "true" : undefined}
              className={cn(
                "relative aspect-[4/3] w-[4.25rem] shrink-0 cursor-pointer overflow-hidden rounded-md bg-background/70 ring-offset-2 ring-offset-surface-stage transition-[opacity,box-shadow] duration-300 sm:w-24 md:w-28",
                i === active ? "ring-2 ring-primary" : "opacity-70 hover:opacity-100",
              )}
            >
              <VehicleImage image={img} compact />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Filmstrip({ images, active, onSelect, onOpen }: { images: Img[]; active: number; onSelect: (i: number) => void; onOpen: (i: number) => void }) {
  const reduced = useReducedMotion();
  const [start] = useState(active);
  const [ref, api] = useEmblaCarousel({ direction: "rtl", loop: false, align: "start", startIndex: start });
  const n = images.length;
  useEffect(() => {
    if (!api) return;
    const on = () => onSelect(api.selectedScrollSnap());
    api.on("select", on);
    return () => {
      api.off("select", on);
    };
  }, [api, onSelect]);
  useEffect(() => {
    if (api && api.selectedScrollSnap() !== active) api.scrollTo(active, reduced);
  }, [api, active, reduced]);

  return (
    <div className="fade-soft">
      <div ref={ref} className="overflow-hidden" dir="rtl">
        <div className="-ms-3 flex touch-pan-y">
          {images.map((img, i) => (
            <div key={i} className="min-w-0 shrink-0 grow-0 basis-[85%] ps-3 sm:basis-[70%]">
              <button
                type="button"
                onClick={() => onOpen(i)}
                aria-label={`عرض الصورة ${i + 1} بملء الشاشة`}
                className={cn("block aspect-[16/10] w-full cursor-zoom-in overflow-hidden rounded-lg bg-background/60 transition-opacity", i !== active && "opacity-60")}
              >
                <VehicleImage image={img} fit="contain" className="bg-transparent" />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <button type="button" className={CONTROL} onClick={() => onSelect(Math.max(0, active - 1))} disabled={active === 0} aria-label="الصورة السابقة">
          <ChevronRight className="size-5" aria-hidden />
        </button>
        <span className="ltr-iso text-sm text-muted-foreground" aria-live="polite">
          {active + 1} / {n}
        </span>
        <button type="button" className={CONTROL} onClick={() => onSelect(Math.min(n - 1, active + 1))} disabled={active === n - 1} aria-label="الصورة التالية">
          <ChevronLeft className="size-5" aria-hidden />
        </button>
      </div>
    </div>
  );
}

function Lightbox({
  images,
  index,
  onIndex,
  title,
  returnFocus,
}: {
  images: Img[];
  index: number | null;
  onIndex: (i: number | null) => void;
  title: string;
  returnFocus: React.RefObject<HTMLElement | null>;
}) {
  const touchX = useRef<number | null>(null);
  const isOpen = index !== null;
  const i = index ?? 0;
  const n = images.length;
  const next = () => onIndex((i + 1) % n);
  const prev = () => onIndex((i - 1 + n) % n);
  const NAV = "flex size-11 cursor-pointer items-center justify-center rounded-full bg-ink-foreground/10 transition-colors hover:bg-ink-foreground/20 active:scale-95";

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onIndex(null)}>
      <DialogContent
        className="h-[100dvh] max-h-none w-screen max-w-none gap-0 rounded-none border-none bg-ink p-0 text-ink-foreground sm:rounded-none [&>button:last-child]:hidden"
        onCloseAutoFocus={(e) => {
          // Return focus to the control that opened the lightbox (page position is kept).
          const el = returnFocus.current;
          if (el?.isConnected) {
            e.preventDefault();
            el.focus({ preventScroll: true });
          }
        }}
        onKeyDown={(e) => {
          const step = arrowStep(e);
          if (step === 1) next();
          if (step === -1) prev();
        }}
        onTouchStart={(e) => (touchX.current = e.touches[0]?.clientX ?? null)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = (e.changedTouches[0]?.clientX ?? touchX.current) - touchX.current;
          if (Math.abs(dx) > 40) (dx > 0 ? next : prev)();
          touchX.current = null;
        }}
      >
        <DialogTitle className="sr-only">{title} — عرض الصور</DialogTitle>
        <DialogDescription className="sr-only">استخدم الأسهم أو السحب للتنقل وزر Escape للإغلاق.</DialogDescription>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4">
            <span className="ltr-iso text-sm font-semibold" aria-live="polite">
              {i + 1} / {n}
            </span>
            <button type="button" onClick={() => onIndex(null)} aria-label="إغلاق" className={NAV}>
              <X className="size-5" aria-hidden />
            </button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-20">
            <div key={i} className="fade-soft h-full max-h-[78vh] w-full max-w-5xl overflow-hidden rounded-lg">
              <VehicleImage image={images[i]} fit="contain" />
            </div>
            {n > 1 && (
              <>
                <button type="button" onClick={prev} aria-label="الصورة السابقة" className={cn(NAV, "absolute start-2 top-1/2 -translate-y-1/2 md:start-4 md:size-12")}>
                  <ChevronRight className="size-6" aria-hidden />
                </button>
                <button type="button" onClick={next} aria-label="الصورة التالية" className={cn(NAV, "absolute end-2 top-1/2 -translate-y-1/2 md:end-4 md:size-12")}>
                  <ChevronLeft className="size-6" aria-hidden />
                </button>
              </>
            )}
          </div>
          <p className="px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4 text-center text-sm text-ink-foreground/70">{images[i]?.altAr}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
