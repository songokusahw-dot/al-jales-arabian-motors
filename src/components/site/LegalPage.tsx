import type { ReactNode } from "react";
import { PageHeader } from "./PageHeader";
import { DemoNotice } from "./DemoNotice";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <PageHeader eyebrow="مسودة للمراجعة" title={title} crumbs={[{ label: "الصفحات القانونية" }]} />
      <div className="container-site max-w-3xl py-14">
        <DemoNotice className="mb-10">
          هذه الصفحة <strong>مسودة</strong> تحتاج إلى مراجعة الشركة والمستشار القانوني قبل اعتمادها، ولا تُعد استشارة قانونية أو سياسة معتمدة.
        </DemoNotice>
        <div className="flex flex-col gap-8 leading-loose [&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-bold [&_p]:text-muted-foreground [&_ul]:list-disc [&_ul]:ps-6 [&_li]:text-muted-foreground">
          {children}
        </div>
      </div>
    </>
  );
}
