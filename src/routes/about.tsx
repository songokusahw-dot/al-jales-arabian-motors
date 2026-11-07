import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero-atmosphere.jpg";
import { pageHead } from "@/lib/seo";
import { MARKETS, MARKET_LIST } from "@/data/markets";
import { PageHeader } from "@/components/site/PageHeader";
import { ImportJourney } from "@/components/site/ImportJourney";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => pageHead("من نحن", "تعرّف على الجالس للسيارات: سيارات من كوريا ومعرضا السعودية واليمن، بأسعار واضحة بالريال السعودي."),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader eyebrow="من نحن" title="الجالس للسيارات" description="نص تعريفي قابل للتعديل — سيُستبدل بقصة الشركة المعتمدة." />
      <div className="container-site flex flex-col gap-20 py-14">
        <section className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">رؤيتنا</h2>
            <p className="mt-4 leading-loose text-muted-foreground">
              أن يكون اختيار السيارة واضحاً من البداية: سيارة موصوفة بدقة، وسعر مفهوم بالريال السعودي، ومعلومة غير مؤكدة تُقال كما هي.
            </p>
            <h2 className="mt-10 text-3xl font-bold">خدماتنا</h2>
            <ul className="mt-4 flex flex-col gap-3 text-muted-foreground">
              <li>• استيراد السيارات من المصادر والمزادات الكورية.</li>
              <li>• عرض وبيع السيارات في معرضي السعودية واليمن.</li>
              <li>• البحث عن سيارة محددة حسب طلب العميل.</li>
            </ul>
          </div>
          <div className="overflow-hidden rounded-lg shadow-lift">
            <img src={heroImg} alt="" width={1920} height={1088} loading="lazy" className="aspect-[4/3] h-full w-full object-cover" />
          </div>
        </section>
        <section>
          <h2 className="mb-6 text-3xl font-bold">أسواقنا</h2>
          <ul className="grid gap-5 md:grid-cols-3">
            {MARKET_LIST.map((m) => (
              <li key={m} className="rounded-lg bg-card p-6 shadow-card">
                <p className="eyebrow">{MARKETS[m].roleAr}</p>
                <h3 className="mt-2 text-xl font-bold">{MARKETS[m].nameAr}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{MARKETS[m].descriptionAr}</p>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="mb-8 text-3xl font-bold">رحلة الاستيراد</h2>
          <ImportJourney />
        </section>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="hero" size="lg">
            <Link to="/cars">تصفح السيارات</Link>
          </Button>
          <Button asChild variant="surface" size="lg">
            <Link to="/contact">تواصل معنا</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
