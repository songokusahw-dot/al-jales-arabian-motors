import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Search, ClipboardCheck, FileText, Ship, KeyRound } from "lucide-react";

const STEPS = [
  { icon: Search, title: "اختيار المصدر", text: "نحدد السيارة المطلوبة من المصادر الكورية المتاحة ونراجع بياناتها." },
  { icon: ClipboardCheck, title: "الفحص", text: "نراجع تقرير الفحص عند توفره، ولا نعرض نتيجة لم تُثبت." },
  { icon: FileText, title: "التصدير", text: "إنهاء أوراق الشراء والتصدير من كوريا." },
  { icon: Ship, title: "الشحن", text: "شحن السيارة إلى بلد الوصول وفق الترتيب المتفق عليه." },
  { icon: KeyRound, title: "التخليص والتسليم", text: "التخليص الجمركي ثم تسليم السيارة للعميل." },
];

/** Single scroll-linked scene: draws the path and moves the marker. Static under reduced motion. */
export function ImportJourney() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const path = root.current?.querySelector<SVGPathElement>("[data-journey-path]");
        if (!path) return;
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        const track = root.current?.querySelector<HTMLElement>("[data-journey-track]");
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top 75%", end: "bottom 60%", scrub: 0.6, invalidateOnRefresh: true },
        });
        tl.to(path, { strokeDashoffset: 0, ease: "none" }, 0);
        // RTL: travel from the right edge to the left edge of the track.
        tl.fromTo("[data-journey-marker]", { x: 0 }, { x: () => -((track?.offsetWidth ?? 16) - 16), ease: "none" }, 0);
        gsap.from("[data-journey-step]", {
          opacity: 0,
          y: 16,
          stagger: 0.12,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: { trigger: root.current, start: "top 80%" },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative">
      <div className="relative hidden h-10 md:block" aria-hidden>
        <svg viewBox="0 0 1000 40" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <path d="M1000 20 C 850 0, 750 40, 600 20 S 350 0, 200 20 S 50 40, 0 20" fill="none" className="stroke-border" strokeWidth="2" />
          <path data-journey-path d="M1000 20 C 850 0, 750 40, 600 20 S 350 0, 200 20 S 50 40, 0 20" fill="none" className="stroke-primary" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <div data-journey-track className="absolute inset-y-0 start-0 w-full">
          <span data-journey-marker className="absolute end-auto start-0 top-1/2 block size-4 -translate-y-1/2 rounded-full border-4 border-card bg-primary shadow-card" />
        </div>
      </div>
      <ol className="mt-6 grid gap-4 md:grid-cols-5">
        {STEPS.map((s, i) => (
          <li key={s.title} data-journey-step className="relative rounded-lg bg-card p-5 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <span className="flex size-10 items-center justify-center rounded-md bg-muted">
                <s.icon className="size-5" aria-hidden />
              </span>
              <span className="ltr-iso font-display text-3xl font-bold text-muted-foreground/40">0{i + 1}</span>
            </div>
            <h3 className="font-semibold">{s.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-xs text-muted-foreground">
        المراحل توضيحية؛ المدد الزمنية والموانئ وتكاليف كل مرحلة تُحدَّد عند تأكيد الطلب.
      </p>
    </div>
  );
}
