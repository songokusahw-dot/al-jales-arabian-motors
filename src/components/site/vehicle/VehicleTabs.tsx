import { useState } from "react";
import { Check, FileText, MapPin } from "lucide-react";
import type { FeatureCategory, Vehicle } from "@/lib/types";
import { FEATURE_CATALOG, FEATURE_CATEGORY_LABEL } from "@/data/features";
import { MARKETS } from "@/data/markets";
import { formatDateAr } from "@/lib/format";
import { specGroups } from "@/lib/vehicle-specs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DemoBadge } from "../badges";
import { InspectionReport } from "./InspectionReport";
import { PriceBreakdown } from "./PriceBreakdown";
import { StatusLine } from "./VehicleActions";

export type VehicleTab = "overview" | "specs" | "features" | "inspection" | "pricing";

const TABS: { value: VehicleTab; label: string }[] = [
  { value: "overview", label: "نظرة عامة" },
  { value: "specs", label: "المواصفات" },
  { value: "features", label: "التجهيزات" },
  { value: "inspection", label: "الفحص والحالة" },
  { value: "pricing", label: "السعر والتكاليف" },
];

const PANEL =
  "mt-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background data-[state=active]:fade-soft data-[state=inactive]:hidden";

export function VehicleTabs({ v }: { v: Vehicle }) {
  const [tab, setTab] = useState<VehicleTab>("overview");
  return (
    <Tabs value={tab} onValueChange={(t) => setTab(t as VehicleTab)} dir="rtl">
      <div className="relative">
        <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-none border-b bg-transparent p-0 text-muted-foreground [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map((t) => (
            <TabsTrigger
              key={t.value}
              value={t.value}
              className="relative shrink-0 rounded-none bg-transparent px-3 py-3 font-display text-sm font-semibold after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:after:scale-x-100 md:px-4 md:text-[0.95rem]"
            >
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <TabsContent value="overview" forceMount className={PANEL}>
        <Overview v={v} onInspection={() => setTab("inspection")} />
      </TabsContent>
      <TabsContent value="specs" forceMount className={PANEL}>
        <Specs v={v} />
      </TabsContent>
      <TabsContent value="features" forceMount className={PANEL}>
        <Features v={v} />
      </TabsContent>
      <TabsContent value="inspection" forceMount className={PANEL}>
        <InspectionReport vehicle={v} />
      </TabsContent>
      <TabsContent value="pricing" forceMount className={PANEL}>
        <PriceBreakdown vehicle={v} defaultOpen />
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          تُعرض الأسعار بالريال السعودي (SAR). البنود غير المحددة لا تدخل في المجموع، ولا يُعدّ السعر التقديري سعراً نهائياً.
        </p>
      </TabsContent>
    </Tabs>
  );
}

function Overview({ v, onInspection }: { v: Vehicle; onInspection: () => void }) {
  const market = MARKETS[v.market];
  const report = v.inspection?.reportAvailable ? v.inspection : undefined;
  const notes = report ? report.findings.filter((f) => f.status !== "ok").length : 0;
  const ident: [string, React.ReactNode][] = [
    ["الرقم المرجعي", <span className="ltr-iso font-mono">{v.referenceCode}</span>],
    ["العلامة والطراز", <span className="ltr-iso">{v.brandEn} {v.modelEn}</span>],
    ...(v.year ? ([["سنة الصنع", <span className="ltr-iso">{v.year}</span>]] as [string, React.ReactNode][]) : []),
    ["السوق", `${market.nameAr} — ${market.roleAr}`],
    ["تاريخ الإضافة", formatDateAr(v.createdAt)],
  ];
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="rounded-lg bg-card p-5 shadow-card lg:col-span-2">
        <h3 className="flex items-center gap-2 text-base font-semibold">
          <FileText className="size-4 text-accent-text" aria-hidden /> وصف السيارة
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          لم يُضَف وصف مكتوب لهذه السيارة بعد. البيانات المعروضة مأخوذة من سجل السيارة فقط
          {v.isDemo && " وهي بيانات تجريبية"}.
        </p>
      </div>

      <div className="rounded-lg bg-card p-5 shadow-card">
        <h3 className="flex items-center gap-2 text-base font-semibold">
          <MapPin className="size-4 text-accent-text" aria-hidden /> السوق
        </h3>
        <p className="mt-2 font-display font-semibold">{market.titleAr}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{market.introAr}</p>
      </div>

      <div className="rounded-lg bg-card p-5 shadow-card">
        <h3 className="text-base font-semibold">الحالة العامة</h3>
        <StatusLine v={v} className="mt-3" />
        <div className="mt-3 text-sm text-muted-foreground">
          {report ? (
            <p className="flex flex-wrap items-center gap-2">
              {report.isDemo && <DemoBadge label="فحص تجريبي Demo" />}
              {notes === 0 ? "لا توجد ملاحظات في بيانات الفحص المسجلة." : `${notes} ملاحظات في بيانات الفحص المسجلة.`}
              <button type="button" onClick={onInspection} className="cursor-pointer font-semibold text-accent-text underline-offset-4 hover:underline">
                تفاصيل الفحص
              </button>
            </p>
          ) : (
            <p>لا يتوفر تقرير فحص لهذه السيارة حالياً.</p>
          )}
        </div>
      </div>

      <dl className="grid gap-px overflow-hidden rounded-lg bg-border shadow-card sm:grid-cols-2 lg:col-span-2 lg:grid-cols-5">
        {ident.map(([k, val]) => (
          <div key={k} className="bg-card p-4">
            <dt className="text-xs text-muted-foreground">{k}</dt>
            <dd className="mt-1 text-sm font-semibold">{val}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Specs({ v }: { v: Vehicle }) {
  const groups = specGroups(v);
  if (!groups.length) return <p className="text-sm text-muted-foreground">لم تُسجَّل مواصفات لهذه السيارة بعد.</p>;
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {groups.map((g) => (
        <section key={g.key} className="rounded-lg bg-card p-5 shadow-card">
          <h3 className="text-sm font-semibold text-muted-foreground">{g.title}</h3>
          <dl className="mt-3 divide-y">
            {g.items.map((it) => (
              <div key={it.key} className="flex items-center justify-between gap-4 py-2.5">
                <dt className="text-sm text-muted-foreground">{it.label}</dt>
                <dd className="text-sm font-semibold">{it.ltr ? <span className="ltr-iso">{it.value}</span> : it.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
      {v.isDemo && <p className="text-xs text-muted-foreground sm:col-span-2">المواصفات تجريبية وتُؤكَّد عند الاستفسار. تُعرض الحقول المسجلة فقط.</p>}
    </div>
  );
}

function Features({ v }: { v: Vehicle }) {
  const groups = new Map<FeatureCategory, string[]>();
  v.features.forEach((k) => {
    const f = FEATURE_CATALOG[k];
    if (!f) return;
    groups.set(f.category, [...(groups.get(f.category) ?? []), f.labelAr]);
  });
  if (!groups.size) return <p className="rounded-lg border border-dashed bg-card/60 p-5 text-sm text-muted-foreground">لم تُسجَّل تجهيزات لهذه السيارة بعد.</p>;
  return (
    <div className="grid gap-5 sm:grid-cols-3">
      {[...groups.entries()].map(([cat, items]) => (
        <section key={cat} className="rounded-lg bg-card p-5 shadow-card">
          <h3 className="mb-3 text-sm font-semibold text-muted-foreground">{FEATURE_CATEGORY_LABEL[cat]}</h3>
          <ul className="flex flex-col gap-2 text-sm">
            {items.map((i) => (
              <li key={i} className="flex items-center gap-2">
                <Check className="size-4 shrink-0 text-success" aria-hidden /> {i}
              </li>
            ))}
          </ul>
        </section>
      ))}
      {v.isDemo && <p className="text-xs text-muted-foreground sm:col-span-3">قائمة التجهيزات تجريبية وتُؤكَّد عند الاستفسار.</p>}
    </div>
  );
}
