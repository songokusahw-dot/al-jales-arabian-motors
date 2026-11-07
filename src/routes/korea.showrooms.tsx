import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, FileCheck2, Handshake } from "lucide-react";
import { pageHead } from "@/lib/seo";
import { PageHeader } from "@/components/site/PageHeader";
import { EmptyState } from "@/components/site/EmptyState";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/korea/showrooms")({
  head: () => pageHead("المعارض الكورية", "مصادر السيارات الكورية التي تعمل معها الجالس للسيارات، وكيف نختار السيارة من المصدر."),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader eyebrow="كوريا · مصادر" title="المعارض الكورية" description="نتعامل مع مصادر ومعارض في كوريا لاختيار السيارات قبل تصديرها." crumbs={[{ label: "كوريا" }]} />
      <div className="container-site flex flex-col gap-14 py-14">
        <section>
          <h2 className="mb-6 text-2xl font-bold">مصادر السيارات الكورية</h2>
          <EmptyState
            icon={Handshake}
            title="بيانات الشركاء ستُضاف لاحقاً"
            description="نعرض أسماء المعارض الكورية وشعاراتها ومواقعها فقط بعد اعتمادها من الشركة. حتى ذلك الحين يمكنك تصفح السيارات الكورية المتاحة."
            action={
              <>
                <Button asChild variant="hero">
                  <Link to="/cars/korea">سيارات كوريا</Link>
                </Button>
                <Button asChild variant="surface">
                  <Link to="/korea/auctions">المزادات الكورية</Link>
                </Button>
              </>
            }
          />
        </section>
        <section className="grid gap-5 md:grid-cols-3">
          {[
            { icon: Building2, t: "اختيار المصدر", d: "نبحث عن السيارة المطلوبة لدى المصادر الكورية ونقارن الخيارات المتاحة." },
            { icon: FileCheck2, t: "مراجعة البيانات", d: "نراجع بيانات السيارة وتقرير الفحص عند توفره قبل أي التزام." },
            { icon: Handshake, t: "تأكيد الطلب", d: "نؤكد معك السعر التقديري والبنود المتبقية قبل الشراء." },
          ].map((c) => (
            <div key={c.t} className="rounded-lg bg-card p-6 shadow-card">
              <c.icon className="mb-4 size-6 text-accent-text" aria-hidden />
              <h3 className="font-semibold">{c.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.d}</p>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
