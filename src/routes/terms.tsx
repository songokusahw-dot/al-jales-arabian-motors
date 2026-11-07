import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/terms")({
  head: () => pageHead("الشروط والأحكام (مسودة)", "مسودة الشروط والأحكام لموقع الجالس للسيارات، قيد المراجعة القانونية."),
  component: () => (
    <LegalPage title="الشروط والأحكام">
      <section>
        <h2>طبيعة المحتوى</h2>
        <p>السيارات والأسعار وتقارير الفحص المعروضة في هذه النسخة بيانات توضيحية (Demo) ولا تمثل عرض بيع ملزماً.</p>
      </section>
      <section>
        <h2>الأسعار</h2>
        <p>تُعرض الأسعار بالريال السعودي. أسعار السيارات الكورية تقديرية وتعتمد على معدل تحويل توضيحي، ولا تشمل البنود غير المحددة.</p>
      </section>
      <section>
        <h2>الحجز والتوفر</h2>
        <p>يخضع توفر أي سيارة للتأكيد من الشركة. السيارات المباعة لا يمكن حجزها، والمحجوزة متاحة للاستفسار فقط.</p>
      </section>
      <section>
        <h2>الصور</h2>
        <p>تُستبدل الصور التوضيحية بصور أصلية للسيارة المعروضة عند توفرها.</p>
      </section>
    </LegalPage>
  ),
});
