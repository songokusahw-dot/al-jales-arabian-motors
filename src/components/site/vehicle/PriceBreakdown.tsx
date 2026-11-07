import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Vehicle } from "@/lib/types";
import { computeTotal, DEMO_KRW_TO_SAR } from "@/lib/pricing";
import { formatSAR } from "@/lib/format";
import { DemoBadge } from "../badges";

export function PriceBreakdown({ vehicle }: { vehicle: Vehicle }) {
  const { totalSAR, complete, unknownItems } = computeTotal(vehicle.pricing);
  return (
    <Accordion type="single" collapsible className="rounded-lg bg-card px-5 shadow-card">
      <AccordionItem value="price" className="border-none">
        <AccordionTrigger className="font-display text-base font-semibold hover:no-underline">كيف تم احتساب السعر؟</AccordionTrigger>
        <AccordionContent>
          <ul className="divide-y">
            {vehicle.pricing.items.map((item) => (
              <li key={item.key} className="flex items-center justify-between gap-4 py-3 text-sm">
                <span className="flex items-center gap-2">
                  {item.labelAr}
                  {item.source === "demo" && <DemoBadge />}
                </span>
                <span className={item.amountSAR === null ? "text-muted-foreground" : "font-semibold"}>
                  {item.amountSAR === null ? "غير محدد بعد" : <bdi>{formatSAR(item.amountSAR)}</bdi>}
                </span>
              </li>
            ))}
            <li className="flex items-center justify-between gap-4 py-3">
              <span className="font-display font-semibold">{complete ? "الإجمالي" : "الإجمالي التقديري"}</span>
              <span className="font-display text-lg font-bold">
                <bdi>{formatSAR(totalSAR)}</bdi>
              </span>
            </li>
          </ul>
          {!complete && unknownItems.length > 0 && (
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              الإجمالي غير مكتمل: البنود غير المحددة ({unknownItems.map((i) => i.labelAr).join("، ")}) لم تدخل في الحساب وستُحدَّد عند تأكيد الطلب.
            </p>
          )}
          {vehicle.market === "KR" && (
            <p className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <DemoBadge />
              معدل تحويل توضيحي: <bdi className="ltr-iso">{DEMO_KRW_TO_SAR} SAR / KRW</bdi> — ليس سعر صرف اليوم.
            </p>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
