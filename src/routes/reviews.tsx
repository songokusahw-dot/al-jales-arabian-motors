import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Star, MessageSquareQuote } from "lucide-react";
import { pageHead } from "@/lib/seo";
import { readLocal, saveLocal } from "@/lib/local-store";
import { PageHeader } from "@/components/site/PageHeader";
import { EmptyState } from "@/components/site/EmptyState";
import { DemoNotice } from "@/components/site/DemoNotice";
import { Field, TextInput } from "@/components/site/listing/controls";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reviews")({
  head: () => pageHead("تقييمات العملاء", "تقييمات عملاء الجالس للسيارات. نعرض فقط التقييمات الحقيقية المعتمدة."),
  component: Page,
});

type Review = { name: string; stars: number; text: string; car: string; at: string };
const KEY = "aljales-demo-reviews";

/** Verified company-supplied reviews go here. Empty until real reviews are provided. */
const VERIFIED_REVIEWS: Review[] = [];

function Page() {
  const [local, setLocal] = useState<Review[]>([]);
  const [f, setF] = useState({ name: "", stars: 0, text: "", car: "" });
  const [errors, setErrors] = useState<Partial<Record<"name" | "stars" | "text", string>>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => setLocal(readLocal<Review>(KEY)), []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Partial<Record<"name" | "stars" | "text", string>> = {};
    if (f.name.trim().length < 2) er.name = "اكتب اسمك";
    if (f.stars < 1) er.stars = "اختر عدد النجوم";
    if (f.text.trim().length < 10) er.text = "اكتب تقييمك (10 أحرف على الأقل)";
    setErrors(er);
    if (Object.keys(er).length) return;
    const r = { ...f, at: new Date().toISOString() };
    saveLocal(KEY, r);
    setLocal((l) => [r, ...l]);
    setF({ name: "", stars: 0, text: "", car: "" });
    setSaved(true);
  };

  return (
    <>
      <PageHeader eyebrow="آراء العملاء" title="تقييمات العملاء" description="نعرض هنا التقييمات الحقيقية فقط بعد اعتمادها." />
      <div className="container-site grid gap-10 py-12 lg:grid-cols-[1fr_24rem]">
        <div className="flex flex-col gap-6">
          {VERIFIED_REVIEWS.length === 0 && (
            <EmptyState icon={MessageSquareQuote} title="لا توجد تقييمات منشورة بعد" description="ستظهر تقييمات العملاء الحقيقية هنا بعد اعتمادها من الشركة. يمكنك تجربة إضافة تقييم من النموذج." />
          )}
          {local.length > 0 && (
            <section>
              <h2 className="mb-3 text-lg font-bold">تقييماتك المحفوظة على هذا الجهاز</h2>
              <p className="mb-4 text-xs text-muted-foreground">غير منشورة وغير مرسلة إلى الشركة.</p>
              <ul className="flex flex-col gap-3">
                {local.map((r) => (
                  <li key={r.at} className="rounded-lg border border-dashed bg-card p-5">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{r.name}</p>
                      <Stars value={r.stars} />
                    </div>
                    {r.car && <p className="mt-1 text-xs text-muted-foreground">{r.car}</p>}
                    <p className="mt-3 text-sm leading-relaxed">{r.text}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
        <form noValidate onSubmit={submit} className="flex h-fit flex-col gap-4 rounded-lg bg-card p-6 shadow-card">
          <h2 className="text-lg font-bold">أضف تقييمك</h2>
          <DemoNotice>تجريبي: يُحفظ التقييم على جهازك فقط، وهو غير منشور وغير مرسل للشركة.</DemoNotice>
          {saved && <p role="status" className="text-sm font-semibold text-success">تم الحفظ محلياً — لم يُرسل إلى الشركة.</p>}
          <Field label="الاسم" error={errors.name} id="r-name">
            {(id) => <TextInput id={id} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} aria-invalid={!!errors.name} aria-describedby={errors.name ? `${id}-error` : undefined} />}
          </Field>
          <fieldset>
            <legend className="mb-1.5 text-sm font-medium">التقييم</legend>
            <div className="flex gap-1" role="radiogroup" aria-label="عدد النجوم">
              {[1, 2, 3, 4, 5].map((n) => (
                <label key={n} className="cursor-pointer rounded-sm has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring">
                  <input type="radio" name="stars" value={n} checked={f.stars === n} onChange={() => setF({ ...f, stars: n })} className="sr-only" aria-label={`${n} نجوم`} />
                  <Star className={cn("size-7 transition-colors", n <= f.stars ? "fill-primary text-primary" : "text-muted-foreground")} aria-hidden />
                </label>
              ))}
            </div>
            {errors.stars && <p role="alert" className="mt-1 text-xs font-medium text-destructive">{errors.stars}</p>}
          </fieldset>
          <Field label="السيارة (اختياري)">
            {(id) => <TextInput id={id} value={f.car} onChange={(e) => setF({ ...f, car: e.target.value })} />}
          </Field>
          <Field label="نص التقييم" error={errors.text} id="r-text">
            {(id) => <Textarea id={id} rows={4} value={f.text} onChange={(e) => setF({ ...f, text: e.target.value })} aria-invalid={!!errors.text} aria-describedby={errors.text ? `${id}-error` : undefined} />}
          </Field>
          <Button type="submit" variant="hero">حفظ التقييم (تجريبي)</Button>
        </form>
      </div>
    </>
  );
}

function Stars({ value }: { value: number }) {
  return (
    <span className="flex" aria-label={`${value} من 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={cn("size-4", n <= value ? "fill-primary text-primary" : "text-muted-foreground")} aria-hidden />
      ))}
    </span>
  );
}
