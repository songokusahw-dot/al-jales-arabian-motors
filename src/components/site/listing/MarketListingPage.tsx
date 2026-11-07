import { Link } from "@tanstack/react-router";
import type { MarketCode } from "@/lib/types";
import { MARKETS } from "@/data/markets";
import { PageHeader } from "../PageHeader";
import { DemoNotice } from "../DemoNotice";
import { VehicleListing } from "./VehicleListing";
import type { ListingSearch } from "@/lib/inventory";
import { DEMO_KRW_TO_SAR } from "@/lib/pricing";
import { Button } from "@/components/ui/button";

const FIXED: Record<MarketCode, { market: MarketCode }> = { KR: { market: "KR" }, SA: { market: "SA" }, YE: { market: "YE" } };

/** One page template for every market; only the market config differs. */
export function MarketListingPage({ market, search, onSearchChange }: { market: MarketCode; search: ListingSearch; onSearchChange: (s: ListingSearch) => void }) {
  const cfg = MARKETS[market];
  return (
    <>
      <PageHeader eyebrow={`${cfg.nameAr} · ${cfg.roleAr}`} title={cfg.titleAr} description={cfg.introAr} crumbs={[{ label: "السيارات" }]}>
        {market === "KR" ? (
          <div className="flex flex-col gap-4">
            <DemoNotice className="max-w-2xl">
              كل الأسعار معروضة بالريال السعودي. سعر المصدر الكوري محوّل بمعدل توضيحي (<bdi className="ltr-iso">{DEMO_KRW_TO_SAR} SAR/KRW</bdi>) لأغراض العرض فقط وليس سعر صرف حياً.
            </DemoNotice>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="surface">
                <Link to="/korea/showrooms">المعارض الكورية</Link>
              </Button>
              <Button asChild variant="surface">
                <Link to="/korea/auctions">المزادات الكورية</Link>
              </Button>
            </div>
          </div>
        ) : (
          <DemoNotice className="max-w-2xl">السيارات والأسعار المعروضة بيانات تجريبية (Demo) إلى حين إضافة المخزون الفعلي.</DemoNotice>
        )}
      </PageHeader>
      <VehicleListing search={search} onSearchChange={onSearchChange} fixed={FIXED[market]} />
    </>
  );
}
