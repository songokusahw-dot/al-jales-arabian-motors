import { Link } from "@tanstack/react-router";
import { ArrowLeft, Building2, Globe2 } from "lucide-react";
import { VEHICLES } from "@/data/vehicles";
import { MARKETS, MARKET_LIST } from "@/data/markets";
import { formatNumber } from "@/lib/format";
import { DemoBadge } from "@/components/site/badges";
import { SectionHead } from "./SectionHead";

const PORTAL_ICON = { KR: Globe2, SA: Building2, YE: Building2 } as const;

export function MarketsOverview() {
  return (
      <section className="bg-card/60 py-20">
        <div className="container-site">
          <SectionHead eyebrow="اختر السوق" title="ثلاثة معارض، تجربة واحدة" />
          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {MARKET_LIST.map((m) => {
              const cfg = MARKETS[m];
              const Icon = PORTAL_ICON[m];
              const count = VEHICLES.filter((v) => v.market === m).length;
              return (
                <li key={m}>
                  <Link
                    to={cfg.path}
                    className="group relative flex h-full flex-col justify-between gap-10 overflow-hidden rounded-lg bg-background p-7 shadow-card transition-shadow hover:shadow-lift"
                  >
                    <div className="flex items-start justify-between">
                      <span className="ltr-iso font-display text-6xl font-bold text-muted-foreground/30">{m}</span>
                      <Icon className="size-6 text-accent-text" aria-hidden />
                    </div>
                    <div>
                      <p className="eyebrow">{cfg.roleAr}</p>
                      <h3 className="mt-2 text-2xl font-bold">{cfg.nameAr}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{cfg.descriptionAr}</p>
                      <p className="mt-5 flex items-center justify-between text-sm font-semibold">
                        <span>
                          {formatNumber(count)} سيارات تجريبية <DemoBadge className="ms-1" />
                        </span>
                        <ArrowLeft className="size-5 transition-transform group-hover:-translate-x-1" aria-hidden />
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
  );
}
