import { CheckCircle2, AlertTriangle, XOctagon, CircleHelp, CircleDashed, FileX2 } from "lucide-react";
import type { InspectionStatus, Vehicle } from "@/lib/types";
import { INSPECTION_LABEL, formatDateAr } from "@/lib/format";
import { DemoBadge } from "../badges";
import { cn } from "@/lib/utils";

const ICON: Record<InspectionStatus, typeof CheckCircle2> = {
  ok: CheckCircle2,
  note: AlertTriangle,
  damage: XOctagon,
  not_inspected: CircleDashed,
  unknown: CircleHelp,
};
const TONE: Record<InspectionStatus, string> = {
  ok: "text-success",
  note: "text-warning",
  damage: "text-destructive",
  not_inspected: "text-muted-foreground",
  unknown: "text-muted-foreground",
};

export function InspectionReport({ vehicle }: { vehicle: Vehicle }) {
  const report = vehicle.inspection;
  if (!report?.reportAvailable) {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-dashed bg-card/60 p-5">
        <FileX2 className="mt-0.5 size-5 text-muted-foreground" aria-hidden />
        <div>
          <p className="font-semibold">تقرير الفحص غير متوفر</p>
          <p className="mt-1 text-sm text-muted-foreground">لا تتوفر لدينا بيانات فحص لهذه السيارة حالياً. اطلب التقرير عند الاستفسار.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-lg bg-card p-5 shadow-card">
      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
        {report.isDemo && <DemoBadge label="فحص تجريبي Demo" />}
        {report.inspectionDate && <span>تاريخ الفحص: {formatDateAr(report.inspectionDate)}</span>}
        {report.sourceName && <span>المصدر: {report.sourceName}</span>}
      </div>
      <ul className="grid gap-2 sm:grid-cols-2">
        {report.findings.map((f) => {
          const Icon = ICON[f.status];
          return (
            <li key={f.area} className="flex items-start justify-between gap-3 rounded-md bg-muted/50 px-3 py-2.5">
              <div>
                <p className="text-sm font-medium">{f.area}</p>
                {f.noteAr && <p className="mt-0.5 text-xs text-muted-foreground">{f.noteAr}</p>}
              </div>
              <span className={cn("flex shrink-0 items-center gap-1 text-sm font-semibold", TONE[f.status])}>
                <Icon className="size-4" aria-hidden />
                {INSPECTION_LABEL[f.status]}
              </span>
            </li>
          );
        })}
      </ul>
      {report.isDemo && (
        <p className="mt-3 text-xs text-muted-foreground">هذه نتائج تجريبية لعرض شكل التقرير فقط، ولا تمثل حالة السيارة الفعلية.</p>
      )}
    </div>
  );
}
