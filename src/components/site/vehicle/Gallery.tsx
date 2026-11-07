import { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Expand, LayoutGrid, GalleryHorizontal, Image as ImageIcon, X } from "lucide-react";
import type { VehicleImage as Img } from "@/lib/types";
import { VehicleImage } from "../VehicleImage";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Mode = "gallery" | "grid" | "slider";

const MODES: { key: Mode; label: string; icon: typeof LayoutGrid }[] = [
  { key: "gallery", label: "معرض", icon: ImageIcon },
  { key: "grid", label: "شبكة", icon: LayoutGrid },
  { key: "slider", label: "شريط", icon: GalleryHorizontal },
];

export function Gallery({ images, title }: { images: Img[]; title: string }) {
  const [mode, setMode] = useState<Mode>("gallery");
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const allPlaceholders = images.every((i) => i.isPlaceholder || !i.src);

  const open = (i: number) => setLightbox(i);

  return (
    <section aria-label={`صور ${title}`}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          <span className="ltr-iso">{images.length}</span> صور
          {allPlaceholders && " — بانتظار الصور الأصلية"}
        </p>
        <div role="tablist" aria-label="طريقة عرض الصور" className="flex rounded-md border bg-card p-0.5">
          {MODES.map((m) => (
            <button
              key={m.key}
              role="tab"
              type="button"
              aria-selected={mode === m.key}
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
        <div className="flex flex-col gap-3">
          <Frame onOpen={() => open(active)} label={`تكبير الصورة ${active + 1}`} className="aspect-[16/10]">
            <VehicleImage image={images[active]} eager />
          </Frame>
          <div className="grid grid-cols-4 gap-3">
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`عرض الصورة ${i + 1}`}
                aria-current={i === active}
                className={cn(
                  "aspect-[4/3] cursor-pointer overflow-hidden rounded-md ring-offset-2 ring-offset-background transition",
                  i === active ? "ring-2 ring-primary" : "opacity-75 hover:opacity-100",
                )}
              >
                <VehicleImage image={img} compact />
              </button>
            ))}
          </div>
        </div>
      )}

      {mode === "grid" && (
        <div className="grid grid-cols-2 gap-3">
          {images.map((img, i) => (
            <Frame key={i} onOpen={() => open(i)} label={`تكبير الصورة ${i + 1}`} className={cn("aspect-[4/3]", i === 0 && "col-span-2 aspect-[16/9]")}>
              <VehicleImage image={img} compact={i !== 0} />
            </Frame>
          ))}
        </div>
      )}

      {mode === "slider" && <Slider images={images} onOpen={open} />}

      <Lightbox images={images} index={lightbox} onIndex={setLightbox} title={title} />
    </section>
  );
}

function Frame({ children, onOpen, label, className }: { children: React.ReactNode; onOpen: () => void; label: string; className?: string }) {
  return (
    <div className={cn("group relative overflow-hidden rounded-lg bg-muted", className)}>
      {children}
      <button
        type="button"
        onClick={onOpen}
        aria-label={label}
        className="absolute end-3 top-3 flex size-9 cursor-pointer items-center justify-center rounded-full bg-card/90 text-card-foreground shadow-card backdrop-blur transition-opacity focus-visible:opacity-100 md:opacity-0 md:group-hover:opacity-100"
      >
        <Expand className="size-4" aria-hidden />
      </button>
    </div>
  );
}

function Slider({ images, onOpen }: { images: Img[]; onOpen: (i: number) => void }) {
  const [ref, api] = useEmblaCarousel({ direction: "rtl", loop: false });
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!api) return;
    const on = () => setIndex(api.selectedScrollSnap());
    api.on("select", on);
    return () => {
      api.off("select", on);
    };
  }, [api]);
  return (
    <div className="relative">
      <div ref={ref} className="overflow-hidden rounded-lg" dir="rtl">
        <div className="flex touch-pan-y">
          {images.map((img, i) => (
            <div key={i} className="min-w-0 shrink-0 grow-0 basis-full">
              <Frame onOpen={() => onOpen(i)} label={`تكبير الصورة ${i + 1}`} className="aspect-[16/10] rounded-none">
                <VehicleImage image={img} />
              </Frame>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <Button variant="surface" size="icon" onClick={() => api?.scrollPrev()} disabled={index === 0} aria-label="الصورة السابقة">
          <ChevronRight />
        </Button>
        <span className="ltr-iso text-sm text-muted-foreground">
          {index + 1} / {images.length}
        </span>
        <Button variant="surface" size="icon" onClick={() => api?.scrollNext()} disabled={index === images.length - 1} aria-label="الصورة التالية">
          <ChevronLeft />
        </Button>
      </div>
    </div>
  );
}

function Lightbox({ images, index, onIndex, title }: { images: Img[]; index: number | null; onIndex: (i: number | null) => void; title: string }) {
  const touchX = useRef<number | null>(null);
  const isOpen = index !== null;
  const i = index ?? 0;
  const next = () => onIndex((i + 1) % images.length);
  const prev = () => onIndex((i - 1 + images.length) % images.length);

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onIndex(null)}>
      <DialogContent
        className="h-[100dvh] max-h-none w-screen max-w-none gap-0 rounded-none border-none bg-ink p-0 text-ink-foreground sm:rounded-none [&>button:last-child]:hidden"
        onKeyDown={(e) => {
          // RTL: the next image sits to the left.
          if (e.key === "ArrowLeft") next();
          if (e.key === "ArrowRight") prev();
        }}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 40) (dx > 0 ? next : prev)();
          touchX.current = null;
        }}
      >
        <DialogTitle className="sr-only">{title} — عرض الصور</DialogTitle>
        <DialogDescription className="sr-only">استخدم الأسهم للتنقل وزر Escape للإغلاق.</DialogDescription>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4">
            <span className="ltr-iso text-sm">
              {i + 1} / {images.length}
            </span>
            <button type="button" onClick={() => onIndex(null)} aria-label="إغلاق" className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-ink-foreground/10 hover:bg-ink-foreground/20">
              <X className="size-5" aria-hidden />
            </button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 md:px-20">
            <div className="h-full max-h-[80vh] w-full max-w-5xl overflow-hidden rounded-lg">
              <VehicleImage image={images[i]} className="object-contain" />
            </div>
            <button type="button" onClick={prev} aria-label="الصورة السابقة" className="absolute start-4 top-1/2 hidden size-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-ink-foreground/10 hover:bg-ink-foreground/20 md:flex">
              <ChevronRight className="size-6" aria-hidden />
            </button>
            <button type="button" onClick={next} aria-label="الصورة التالية" className="absolute end-4 top-1/2 hidden size-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-ink-foreground/10 hover:bg-ink-foreground/20 md:flex">
              <ChevronLeft className="size-6" aria-hidden />
            </button>
          </div>
          <p className="px-4 pb-6 text-center text-sm text-ink-foreground/70">{images[i]?.altAr}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
