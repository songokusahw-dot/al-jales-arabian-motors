import { Link } from "@tanstack/react-router";
import { Building2, Gavel, Car, ShieldCheck, Coins, Globe2 } from "lucide-react";
import heroImg from "@/assets/hero-atmosphere.jpg";
import { Button } from "@/components/ui/button";

export function HomeHero() {
  return (
      {/* HERO */}
      <section className="relative isolate flex min-h-[min(92svh,60rem)] items-end overflow-hidden pb-14 pt-28 md:items-center md:pb-20">
        <img src={heroImg} alt="" width={1920} height={1088} fetchPriority="high" className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div className="scrim-hero absolute inset-0 -z-10" aria-hidden />
        <div className="container-site">
          <div className="max-w-2xl">
            <p className="eyebrow reveal-up">AL-JALES AUTOMOTIVE · كوريا · السعودية · اليمن</p>
            <h1 className="reveal-up mt-5 text-4xl font-bold leading-[1.15] [animation-delay:120ms] md:text-6xl">
              سيارتك القادمة،
              <br />
              من المصدر إلى بابك.
            </h1>
            <p className="reveal-up mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground [animation-delay:220ms]">
              نختار السيارات من السوق الكوري ونعرضها مع سيارات معرضي السعودية واليمن، بأسعار واضحة بالريال السعودي.
            </p>
            <div className="reveal-up mt-8 flex flex-wrap gap-3 [animation-delay:320ms]">
              <Button asChild variant="hero" size="xl">
                <Link to="/korea/showrooms">
                  <Building2 /> المعارض الكورية
                </Link>
              </Button>
              <Button asChild variant="ink" size="xl">
                <Link to="/korea/auctions">
                  <Gavel /> المزادات
                </Link>
              </Button>
              <Button asChild variant="surface" size="xl">
                <Link to="/our-showrooms">
                  <Car /> سياراتنا
                </Link>
              </Button>
            </div>
          </div>

          <ul className="reveal-up mt-12 grid max-w-3xl grid-cols-1 gap-3 [animation-delay:420ms] sm:grid-cols-3">
            {[
              { icon: Globe2, t: "ثلاثة أسواق", d: "كوريا للاستيراد، والسعودية واليمن معارض محلية." },
              { icon: Coins, t: "عملة موحدة SAR", d: "كل الأسعار المعروضة بالريال السعودي." },
              { icon: ShieldCheck, t: "شفافية في البيانات", d: "لا نعرض سعراً أو فحصاً غير مؤكد." },
            ].map((c) => (
              <li key={c.t} className="notch bg-card/90 p-4 shadow-card backdrop-blur">
                <c.icon className="mb-2 size-5 text-accent-text" aria-hidden />
                <p className="font-display text-sm font-semibold">{c.t}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{c.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
  );
}
