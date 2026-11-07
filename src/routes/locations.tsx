import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Clock } from "lucide-react";
import { pageHead } from "@/lib/seo";
import { MARKETS, MARKET_LIST } from "@/data/markets";
import { siteConfig } from "@/config/site";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/locations")({
  head: () => pageHead("الفروع والمواقع", "فروع الجالس للسيارات في كوريا والسعودية واليمن."),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader eyebrow="فروعنا" title="الفروع والمواقع" description="لا نعرض خرائط أو عناوين قبل اعتمادها من الشركة." />
      <div className="container-site grid gap-5 py-14 md:grid-cols-3">
        {MARKET_LIST.map((m) => {
          const b = siteConfig.contact.branches[m];
          const hasMap = b.latitude !== null && b.longitude !== null;
          return (
            <article key={m} className="flex flex-col gap-4 rounded-lg bg-card p-6 shadow-card">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">{MARKETS[m].nameAr}</h2>
                <span className="ltr-iso font-display text-sm font-semibold text-muted-foreground">{m}</span>
              </div>
              <p className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
                {b.address ?? (b.city ? b.city : "سيتم إضافة عنوان الفرع")}
              </p>
              <p className="flex items-start gap-2 text-sm text-muted-foreground">
                <Clock className="mt-0.5 size-4 shrink-0" aria-hidden />
                {b.hours ?? "سيتم إضافة ساعات العمل"}
              </p>
              {hasMap && (
                <a className="text-sm font-semibold text-accent-text underline" href={`https://www.google.com/maps?q=${b.latitude},${b.longitude}`} target="_blank" rel="noopener noreferrer">
                  فتح في الخرائط
                </a>
              )}
              <Button asChild variant="surface" className="mt-auto">
                <Link to="/contact">تواصل معنا</Link>
              </Button>
            </article>
          );
        })}
      </div>
    </>
  );
}
