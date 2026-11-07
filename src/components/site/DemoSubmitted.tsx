import type { ReactNode } from "react";
import { CircleCheck } from "lucide-react";

export function DemoSubmitted({ title, children, action }: { title: string; children?: ReactNode | undefined; action?: ReactNode | undefined }) {
  return (
    <div role="status" className="flex flex-col items-center gap-3 rounded-lg bg-card px-6 py-12 text-center shadow-card">
      <CircleCheck className="size-10 text-success" aria-hidden />
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="max-w-md rounded-md border border-dashed border-muted-foreground/50 bg-muted/50 px-4 py-3 text-sm font-semibold">
        هذا نموذج تجريبي — لم يتم إرسال البيانات إلى الشركة.
      </p>
      {children && <div className="max-w-md text-sm text-muted-foreground">{children}</div>}
      {action && <div className="mt-2 flex flex-wrap justify-center gap-2">{action}</div>}
    </div>
  );
}
