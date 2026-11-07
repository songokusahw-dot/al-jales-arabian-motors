import { createFileRoute, Link } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { FAQ } from "@/data/faq";
import { PageHeader } from "@/components/site/PageHeader";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/faq")({
  head: () => pageHead("الأسئلة الشائعة", "إجابات عن الأسعار بالريال السعودي، استيراد السيارات من كوريا، تقارير الفحص والحجز لدى الجالس للسيارات."),
  component: FaqPage,
});

function FaqPage() {
  const categories = [...new Set(FAQ.map((f) => f.category))];
  return (
    <>
      <PageHeader eyebrow="مساعدة" title="الأسئلة الشائعة" description="أجوبة مختصرة عن أكثر ما يسألنا عنه العملاء." />
      <div className="container-site grid gap-12 py-14 lg:grid-cols-[1fr_20rem]">
        <div className="flex flex-col gap-10">
          {categories.map((c) => (
            <section key={c}>
              <h2 className="mb-3 text-lg font-bold">{c}</h2>
              <Accordion type="multiple" className="rounded-lg bg-card px-5 shadow-card">
                {FAQ.filter((f) => f.category === c).map((f, i) => (
                  <AccordionItem key={f.q} value={`${c}-${i}`} className="last:border-none">
                    <AccordionTrigger className="text-start text-base font-semibold hover:no-underline">{f.q}</AccordionTrigger>
                    <AccordionContent className="leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          ))}
        </div>
        <aside className="h-fit rounded-lg bg-secondary p-6 text-secondary-foreground">
          <h2 className="text-lg font-bold">لم تجد إجابتك؟</h2>
          <p className="mt-2 text-sm opacity-80">أرسل سؤالك وسنضيفه إلى قائمة الأسئلة.</p>
          <Button asChild variant="hero" className="mt-4">
            <Link to="/ask-question">اطرح سؤالاً</Link>
          </Button>
        </aside>
      </div>
    </>
  );
}
