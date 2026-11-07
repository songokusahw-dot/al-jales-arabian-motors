import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HomeClosing() {
  return (
    <>
      <section className="container-site py-20">
        <div className="notch relative overflow-hidden rounded-lg bg-secondary p-10 text-secondary-foreground md:p-14">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold md:text-4xl">لم تجد سيارتك؟ اطلبها الآن.</h2>
            <p className="mt-3 leading-relaxed opacity-80">أخبرنا بالعلامة والموديل والميزانية، وسنبحث لك في الأسواق الثلاثة.</p>
            <Button asChild variant="hero" size="xl" className="mt-6">
              <Link to="/request-car">
                اطلب سيارة <ArrowLeft />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="container-site grid gap-10 pb-4 md:grid-cols-[1fr_1fr]">
        <div>
          <p className="eyebrow">عن الجالس</p>
          <h2 className="mt-3 text-3xl font-bold">نربطك بالسيارة المناسبة، بوضوح.</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            الجالس للسيارات تعرض سيارات من السوق الكوري ومن معرضيها في السعودية واليمن، مع اهتمام بوضوح السعر ودقة البيانات.
          </p>
          <Button asChild variant="link" className="mt-2 px-0">
            <Link to="/about">
              اقرأ المزيد عنا <ArrowLeft />
            </Link>
          </Button>
        </div>
        <ul className="grid grid-cols-2 gap-3 self-end">
          {(
            [
              { to: "/faq", label: "الأسئلة الشائعة" },
              { to: "/reviews", label: "تقييمات العملاء" },
              { to: "/locations", label: "الفروع والمواقع" },
              { to: "/contact", label: "تواصل معنا" },
            ] as const
          ).map((l) => (
            <li key={l.to}>
              <Link to={l.to} className="flex items-center justify-between rounded-md border bg-card px-4 py-4 text-sm font-semibold transition-colors hover:bg-accent">
                {l.label}
                <ArrowLeft className="size-4" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
