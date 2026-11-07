import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MapPin } from "lucide-react";
import { pageHead } from "@/lib/seo";
import { MARKETS, MARKET_LIST } from "@/data/markets";
import { VEHICLES } from "@/data/vehicles";
import { siteConfig } from "@/config/site";
import { formatNumber } from "@/lib/format";
import { PageHeader } from "@/components/site/PageHeader";
import { DemoBadge } from "@/components/site/badges";

export const Route = createFileRoute("/our-showrooms")({
  head: () => pageHead("سياراتنا — اختر المعرض", "اختر سوق كوريا أو معرض السعودية أو معرض اليمن لتصفح سيارات الجالس المتاحة في كل سوق."),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader eyebrow="سياراتنا" title="اختر المعرض" description="ثلاثة أسواق بقالب عرض واحد. اختر السوق لتصفح سياراته." />
      <div className="container-site py-14">
        <ul className="grid gap-5 md:grid-cols-3">
          {MARKET_LIST.map((m) => {
            const cfg = MARKETS[m];
            const branch = siteConfig.contact.branches[m];
            const list = VEHICLES.filter((v) => v.market === m);
            const available = list.filter((v) => v.status === "available").length;
            return (
              <li key={m}>
                <Link to={cfg.path} className="group flex h-full flex-col gap-6 rounded-lg bg-card p-7 shadow-card transition-shadow hover:shadow-lift">
                  <div className="flex items-center justify-between">
                    <span className="ltr-iso font-display text-5xl font-bold text-muted-foreground/30">{m}</span>
                    <span className="eyebrow">{cfg.roleAr}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{cfg.nameAr}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{cfg.descriptionAr}</p>
                  </div>
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="size-4" aria-hidden />
                    {branch.city ?? "سيتم إضافة موقع المعرض"}
                  </p>
                  <div className="mt-auto flex items-center justify-between border-t pt-4 text-sm">
                    <span>
                      {formatNumber(available)} متاحة من {formatNumber(list.length)} <DemoBadge className="ms-1" />
                    </span>
                    <ArrowLeft className="size-5 transition-transform group-hover:-translate-x-1" aria-hidden />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
