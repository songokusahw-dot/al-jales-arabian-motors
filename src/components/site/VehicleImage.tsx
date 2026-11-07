import { useState } from "react";
import { ImageOff } from "lucide-react";
import type { VehicleImage as Img } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Real photo when supplied; otherwise an honest placeholder that never pretends to be the vehicle. */
export function VehicleImage({
  image,
  className,
  eager = false,
  compact = false,
  fit = "cover",
  sizes,
}: {
  image: Img | undefined;
  className?: string | undefined;
  eager?: boolean | undefined;
  compact?: boolean | undefined;
  /** "contain" keeps the whole vehicle visible on the stage surface. */
  fit?: "cover" | "contain" | undefined;
  /** Only used when the image has a real srcSet. */
  sizes?: string | undefined;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const usable = image?.src && !image.isPlaceholder && failedSrc !== image.src;

  if (usable && image.src) {
    const src = image.src;
    return (
      <div className={cn("relative h-full w-full", fit === "contain" && "bg-surface-stage")}>
        <img
          src={src}
          srcSet={image.srcSet}
          sizes={image.srcSet ? (sizes ?? "100vw") : undefined}
          width={image.width}
          height={image.height}
          alt={image.altAr}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onError={() => setFailedSrc(src)}
          className={cn("h-full w-full", fit === "contain" ? "object-contain" : "object-cover", className)}
        />
        {image.isIllustrative && (
          <span className="absolute bottom-2 start-2 rounded-sm bg-card/90 px-2 py-0.5 text-[0.7rem] font-medium text-card-foreground">
            صورة توضيحية — ليست السيارة المعروضة
          </span>
        )}
      </div>
    );
  }
  return (
    <div
      role="img"
      aria-label={image?.altAr ?? "صورة السيارة غير متوفرة"}
      className={cn(
        "relative flex h-full w-full flex-col items-center justify-center gap-2 overflow-hidden bg-muted text-muted-foreground",
        className,
      )}
    >
      <svg viewBox="0 0 240 80" aria-hidden className={cn("w-3/5 max-w-56 opacity-50", compact && "w-2/5")}>
        <path
          d="M14 58c0-6 4-10 10-11l28-5 26-18c5-3 10-4 16-4h44c7 0 13 3 18 7l20 15 34 6c7 1 12 6 12 13v6H14z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <circle cx="62" cy="64" r="11" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="180" cy="64" r="11" fill="none" stroke="currentColor" strokeWidth="2.5" />
      </svg>
      {!compact && (
        <span className="flex items-center gap-1.5 text-xs font-medium">
          <ImageOff className="size-3.5" aria-hidden />
          صورة السيارة الأصلية قريباً
        </span>
      )}
    </div>
  );
}
