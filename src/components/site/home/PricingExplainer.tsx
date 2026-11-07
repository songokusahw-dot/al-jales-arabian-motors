import { DemoBadge } from "@/components/site/badges";
import { VEHICLES } from "@/data/vehicles";
import { DEMO_KRW_TO_SAR, krwToSarDemo } from "@/lib/pricing";
import { formatNumber, formatSAR } from "@/lib/format";

export function PricingExplainer() {
  const sample = VEHICLES.find((v) => v.referenceCode === "KR-01001");
  const sampleKrw = sample?.pricing.sourcePriceKRW ?? 0;
  return (
      <section className="bg-card/60 py-20">
        <div className="container-site grid gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow">تسعير شفاف</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">كيف نعرض سعر السيارة الكورية؟</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              نعرض كل المبالغ بالريال السعودي. نحوّل سعر المصدر الكوري بمعدل توضيحي، ونترك كل بند غير مؤكد — كالشحن والجمارك — خارج الإجمالي حتى يُحدَّد فعلياً.
            </p>
            <p className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <DemoBadge /> معدل التحويل التوضيحي <bdi className="ltr-iso font-semibold text-foreground">{DEMO_KRW_TO_SAR} SAR / KRW</bdi> — ليس سعر صرف حياً.
            </p>
          </div>
          <div className="rounded-lg bg-background p-6 shadow-card">
            <p className="mb-4 flex items-center justify-between text-sm font-semibold">
              مثال توضيحي
              <DemoBadge />
            </p>
            <ul className="divide-y text-sm">
              <li className="flex justify-between gap-4 py-3">
                <span>سعر المصدر <span className="ltr-iso text-muted-foreground">({formatNumber(sampleKrw)} KRW × {DEMO_KRW_TO_SAR})</span></span>
                <bdi className="font-semibold">{formatSAR(krwToSarDemo(sampleKrw))}</bdi>
              </li>
              {["الفحص ووثائق التصدير", "الشحن", "الجمارك والتخليص", "أتعاب الخدمة"].map((l) => (
                <li key={l} className="flex justify-between gap-4 py-3">
                  <span>{l}</span>
                  <span className="text-muted-foreground">يُحدَّد عند الطلب</span>
                </li>
              ))}
              <li className="flex justify-between gap-4 py-3 font-display">
                <span className="font-semibold">الإجمالي التقديري</span>
                <bdi className="text-lg font-bold">{formatSAR(krwToSarDemo(sampleKrw))}</bdi>
              </li>
            </ul>
          </div>
        </div>
      </section>
  );
}
