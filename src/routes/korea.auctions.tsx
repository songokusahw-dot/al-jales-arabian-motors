import { createFileRoute, Link } from "@tanstack/react-router";
import { Gavel } from "lucide-react";
import { pageHead } from "@/lib/seo";
import { PageHeader } from "@/components/site/PageHeader";
import { EmptyState } from "@/components/site/EmptyState";
import { DemoNotice } from "@/components/site/DemoNotice";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/korea/auctions")({
  head: () => pageHead("المزادات الكورية", "تعرّف على كيفية شراء السيارات من المزادات الكورية عبر الجالس للسيارات."),
  component: Page,
});

/** No verified auction records exist yet, so nothing is listed: no fake lots, bids or countdowns. */
const AUCTION_RECORDS: never[] = [];

function Page() {
  return (
    <>
      <PageHeader eyebrow="كوريا · مزادات" title="المزادات الكورية" description="نساعدك في الوصول إلى سيارات من المزادات الكورية ومتابعة الشراء والتصدير." crumbs={[{ label: "كوريا" }]}>
        <DemoNotice className="max-w-2xl">لا يتضمن الموقع مزايدة مباشرة. أي سجل مزاد يُعرض هنا مستقبلاً سيكون من مصدر موثق.</DemoNotice>
      </PageHeader>
      <div className="container-site flex flex-col gap-14 py-14">
        {AUCTION_RECORDS.length === 0 && (
          <EmptyState
            icon={Gavel}
            title="لا توجد سجلات مزادات حالياً"
            description="ستظهر هنا سجلات المزادات بعد ربطها ببيانات موثقة. يمكنك الآن طلب سيارة محددة وسنبحث عنها في المزادات."
            action={
              <>
                <Button asChild variant="hero">
                  <Link to="/request-car">اطلب سيارة من المزاد</Link>
                </Button>
                <Button asChild variant="surface">
                  <Link to="/cars/korea">سيارات كوريا المتاحة</Link>
                </Button>
              </>
            }
          />
        )}
        <section>
          <h2 className="mb-6 text-2xl font-bold">كيف يعمل الشراء من المزاد؟</h2>
          <ol className="grid gap-4 md:grid-cols-4">
            {[
              "تحدد السيارة والميزانية المطلوبة.",
              "نراجع السيارات المعروضة وتقارير الفحص المتاحة.",
              "نؤكد معك قبل المشاركة في أي مزاد.",
              "بعد الشراء نتابع التصدير والشحن والتخليص.",
            ].map((t, i) => (
              <li key={t} className="rounded-lg bg-card p-5 shadow-card">
                <span className="ltr-iso font-display text-3xl font-bold text-muted-foreground/40">0{i + 1}</span>
                <p className="mt-2 text-sm leading-relaxed">{t}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </>
  );
}
