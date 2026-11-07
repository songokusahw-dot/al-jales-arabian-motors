import { Link } from "@tanstack/react-router";
import { Ban, CalendarCheck, Check, Clock3, MessageSquareText } from "lucide-react";
import type { Vehicle } from "@/lib/types";
import { canBook } from "@/lib/inventory";
import { whatsappLink } from "@/config/site";
import { Button } from "@/components/ui/button";
import { PriceTag } from "../PriceTag";
import { DemoNotice } from "../DemoNotice";
import { StatusBadge } from "../badges";
import { cn } from "@/lib/utils";

const PRESS = "transition-[background-color,transform] active:scale-[0.98]";

export function StatusLine({ v, className }: { v: Vehicle; className?: string | undefined }) {
  const base = cn("flex items-center gap-2 text-sm font-medium", className);
  if (v.status === "sold")
    return (
      <p className={cn(base, "text-muted-foreground")}>
        <Ban className="size-4 shrink-0" aria-hidden /> تم بيع هذه السيارة — الحجز غير متاح.
      </p>
    );
  if (v.status === "reserved")
    return (
      <p className={cn(base, "text-warning")}>
        <Clock3 className="size-4 shrink-0" aria-hidden /> السيارة محجوزة حالياً — يمكنك الاستفسار فقط.
      </p>
    );
  return (
    <p className={cn(base, "text-success")}>
      <Check className="size-4 shrink-0" aria-hidden /> السيارة متاحة للاستفسار والحجز.
    </p>
  );
}

/** Inquiry is always the primary action; booking appears only when canBook() allows it. */
export function VehicleCtas({ v, layout = "stack" }: { v: Vehicle; layout?: "stack" | "row" | "bar" | undefined }) {
  const message = `مرحباً، أستفسر عن ${v.brandEn} ${v.modelEn} ${v.year ?? ""} — ${v.referenceCode}`;
  const wa = whatsappLink(message);
  const bar = layout === "bar";
  const size = bar ? "default" : "lg";
  return (
    <div className={cn(layout === "stack" && "flex flex-col gap-2", layout === "row" && "flex flex-wrap gap-2", bar && "flex shrink-0 gap-2")}>
      <Button asChild variant="hero" size={size} className={PRESS}>
        <Link to="/ask-question" search={{ car: v.referenceCode }}>
          <MessageSquareText /> {bar ? "استفسر" : "استفسر عن السيارة"}
        </Link>
      </Button>
      {canBook(v) && (
        <Button asChild variant="surface" size={size} className={PRESS}>
          <Link to="/request-car" search={{ car: v.referenceCode }}>
            <CalendarCheck /> {bar ? "احجز" : "اطلب حجزاً"}
          </Link>
        </Button>
      )}
      {wa && !bar && (
        <Button asChild variant="ink" size={size}>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              const withUrl = whatsappLink(`${message} — ${window.location.href}`);
              if (withUrl) e.currentTarget.href = withUrl;
            }}
          >
            واتساب
          </a>
        </Button>
      )}
    </div>
  );
}

/** Desktop decision placard beside the gallery; on mobile it shows price + status (actions live in the sticky bar). */
export function DecisionPanel({ v }: { v: Vehicle }) {
  return (
    <div className="rounded-lg bg-card p-5 shadow-lift md:p-6">
      <PriceTag vehicle={v} size="lg" />
      <div className="my-5 h-px bg-border" />
      <StatusLine v={v} />
      <div className="mt-5 hidden lg:block">
        <VehicleCtas v={v} />
      </div>
    </div>
  );
}

export function InquiryPanel({ v, title }: { v: Vehicle; title: string }) {
  return (
    <section aria-labelledby="inquiry-title" className="relative overflow-hidden rounded-lg bg-card shadow-card">
      <div aria-hidden className="notch absolute end-0 top-0 h-2 w-24 bg-primary" />
      <div className="grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-end md:p-8">
        <div className="min-w-0">
          <p className="eyebrow">الخطوة التالية</p>
          <h2 id="inquiry-title" className="mt-2 text-2xl font-bold">
            مهتم بـ{title}؟
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            سيُرفق الرقم المرجعي <span className="ltr-iso rounded-sm bg-muted px-1.5 py-0.5 font-mono text-foreground">{v.referenceCode}</span> تلقائياً مع طلبك.
          </p>
          <StatusLine v={v} className="mt-4" />
        </div>
        <VehicleCtas v={v} layout="row" />
      </div>
      <DemoNotice className="mx-6 mb-6 md:mx-8 md:mb-8">
        نماذج الاستفسار والحجز تجريبية في هذه النسخة: تُحفظ على جهازك فقط ولا تُرسَل إلى الشركة، ولا تُعدّ تأكيداً لأي حجز.
      </DemoNotice>
    </section>
  );
}

/** Fixed bottom bar on phones/tablets. The body gets matching bottom padding via [data-sticky-actions] in styles.css. */
export function MobileActionBar({ v }: { v: Vehicle }) {
  return (
    <div
      data-sticky-actions
      role="region"
      aria-label="إجراءات السيارة"
      className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 pb-[max(0.625rem,env(safe-area-inset-bottom))] pt-2.5 shadow-lift backdrop-blur lg:hidden"
    >
      <div className="container-site flex items-center justify-between gap-3">
        {v.status === "sold" ? (
          <StatusBadge status="sold" />
        ) : (
          <div className="flex min-w-0 items-center gap-2">
            <PriceTag vehicle={v} size="sm" />
            {v.status === "reserved" && <StatusBadge status="reserved" className="shrink-0" />}
          </div>
        )}
        <VehicleCtas v={v} layout="bar" />
      </div>
    </div>
  );
}
