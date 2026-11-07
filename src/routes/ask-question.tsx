import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { saveLocal } from "@/lib/local-store";
import { isValidEmail, isValidPhone } from "@/lib/validation";
import { PageHeader } from "@/components/site/PageHeader";
import { DemoNotice } from "@/components/site/DemoNotice";
import { DemoSubmitted } from "@/components/site/DemoSubmitted";
import { Field, NativeSelect, TextInput } from "@/components/site/listing/controls";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/ask-question")({
  validateSearch: (raw: Record<string, unknown>): { car?: string } => (typeof raw.car === "string" && raw.car ? { car: raw.car.slice(0, 20) } : {}),
  head: () => pageHead("اطرح سؤالاً", "اسأل فريق الجالس للسيارات عن سيارة أو سعر أو عملية الاستيراد من كوريا."),
  component: Page,
});

const CATEGORIES = ["سؤال عن سيارة", "الأسعار والتكاليف", "الاستيراد من كوريا", "الحجز والتوفر", "أخرى"];

function Page() {
  const { car } = Route.useSearch();
  const [f, setF] = useState({ name: "", contact: "", category: car ? CATEGORIES[0] : "", text: car ? `أستفسر عن السيارة ${car}: ` : "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (f.name.trim().length < 2) er.name = "اكتب اسمك";
    if (f.contact.trim() && !isValidEmail(f.contact) && !isValidPhone(f.contact)) er.contact = "أدخل بريداً أو رقم هاتف صحيحاً";
    if (!f.category) er.category = "اختر تصنيف السؤال";
    if (f.text.trim().length < 10) er.text = "اكتب سؤالك (10 أحرف على الأقل)";
    setErrors(er);
    if (Object.keys(er).length) return;
    saveLocal("aljales-demo-questions", { ...f, at: new Date().toISOString() });
    setDone(true);
  };

  const inv = (k: string, id: string) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${id}-error` : undefined });

  return (
    <>
      <PageHeader eyebrow="اسألنا" title="اطرح سؤالاً" description="أرسل سؤالك عن سيارة أو سعر أو مرحلة من مراحل الاستيراد." />
      <div className="container-site max-w-2xl py-12">
        {done ? (
          <DemoSubmitted
            title="تم حفظ السؤال محلياً كتجربة فقط"
            action={
              <Button asChild variant="surface">
                <Link to="/faq">الأسئلة الشائعة</Link>
              </Button>
            }
          >
            لم يصل سؤالك إلى الشركة.
          </DemoSubmitted>
        ) : (
          <form noValidate onSubmit={submit} className="flex flex-col gap-5 rounded-lg bg-card p-6 shadow-card md:p-8">
            <DemoNotice>نموذج تجريبي: السؤال يُحفظ في متصفحك فقط ولا يُرسل إلى الشركة.</DemoNotice>
            <Field label="الاسم" error={errors.name} id="q-name">
              {(id) => <TextInput id={id} autoComplete="name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} {...inv("name", id)} />}
            </Field>
            <Field label="وسيلة التواصل (اختياري)" hint="بريد إلكتروني أو رقم هاتف" error={errors.contact} id="q-contact">
              {(id) => <TextInput id={id} dir="ltr" className="text-start" value={f.contact} onChange={(e) => setF({ ...f, contact: e.target.value })} {...inv("contact", id)} />}
            </Field>
            <Field label="تصنيف السؤال" error={errors.category} id="q-cat">
              {(id) => (
                <NativeSelect id={id} value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} {...inv("category", id)}>
                  <option value="">اختر التصنيف</option>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </NativeSelect>
              )}
            </Field>
            <Field label="سؤالك" error={errors.text} id="q-text">
              {(id) => <Textarea id={id} rows={5} value={f.text} onChange={(e) => setF({ ...f, text: e.target.value })} {...inv("text", id)} />}
            </Field>
            <Button type="submit" variant="hero" size="lg" className="self-start">
              حفظ السؤال (تجريبي)
            </Button>
          </form>
        )}
      </div>
    </>
  );
}
