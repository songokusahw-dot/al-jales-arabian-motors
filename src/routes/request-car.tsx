import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { pageHead } from "@/lib/seo";
import { BRANDS } from "@/data/brands";
import { MARKETS, MARKET_LIST } from "@/data/markets";
import { FUEL_LABEL, TRANSMISSION_LABEL } from "@/lib/format";
import { isValidEmail, isValidPhone } from "@/lib/validation";
import { saveLocal } from "@/lib/local-store";
import { PageHeader } from "@/components/site/PageHeader";
import { DemoNotice } from "@/components/site/DemoNotice";
import { DemoSubmitted } from "@/components/site/DemoSubmitted";
import { Field, NativeSelect, TextInput } from "@/components/site/listing/controls";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/request-car")({
  validateSearch: (raw: Record<string, unknown>): { car?: string | undefined } => (typeof raw["car"] === "string" && raw["car"] ? { car: raw["car"].slice(0, 20) } : {}),
  head: () => pageHead("اطلب سيارة", "لم تجد سيارتك؟ أخبرنا بالسوق والعلامة والموديل والميزانية وسنبحث لك في كوريا والسعودية واليمن."),
  component: Page,
});

type Form = {
  market: string;
  brand: string;
  model: string;
  noModel: boolean;
  yearFrom: string;
  yearTo: string;
  budgetMin: string;
  budgetMax: string;
  fuel: string;
  transmission: string;
  color: string;
  specs: string;
  notes: string;
  name: string;
  phone: string;
  city: string;
  email: string;
};

const EMPTY: Form = { market: "", brand: "", model: "", noModel: false, yearFrom: "", yearTo: "", budgetMin: "", budgetMax: "", fuel: "", transmission: "", color: "", specs: "", notes: "", name: "", phone: "", city: "", email: "" };

const STEPS = ["السوق", "العلامة والموديل", "السنة والميزانية", "المواصفات", "ملاحظات", "بياناتك", "المراجعة"];

type Errors = Partial<Record<keyof Form, string>>;

function validate(step: number, f: Form): Errors {
  const e: Errors = {};
  if (step === 0 && !f.market) e.market = "اختر السوق أو «مفتوح»";
  if (step === 1) {
    if (!f.brand) e.brand = "اختر العلامة";
    if (!f.noModel && !f.model.trim()) e.model = "اكتب الموديل أو اختر «لا يوجد موديل محدد»";
  }
  if (step === 2) {
    const yf = Number(f.yearFrom), yt = Number(f.yearTo);
    if (f.yearFrom && (yf < 1990 || yf > 2027)) e.yearFrom = "سنة غير صحيحة";
    if (f.yearTo && (yt < 1990 || yt > 2027)) e.yearTo = "سنة غير صحيحة";
    if (f.yearFrom && f.yearTo && yf > yt) e.yearTo = "يجب أن تكون بعد سنة البداية";
    const bmin = Number(f.budgetMin), bmax = Number(f.budgetMax);
    if (f.budgetMin && !(bmin > 0)) e.budgetMin = "أدخل رقماً صحيحاً";
    if (f.budgetMax && !(bmax > 0)) e.budgetMax = "أدخل رقماً صحيحاً";
    if (f.budgetMin && f.budgetMax && bmin > bmax) e.budgetMax = "يجب أن يكون أكبر من الحد الأدنى";
  }
  if (step === 5) {
    if (f.name.trim().length < 2) e.name = "اكتب اسمك";
    if (!f.phone.trim()) e.phone = "رقم الهاتف مطلوب";
    else if (!isValidPhone(f.phone)) e.phone = "صيغة الهاتف غير صحيحة، مثال: ‎+966500000000";
    if (!f.city.trim()) e.city = "اكتب المدينة أو الدولة";
    if (f.email.trim() && !isValidEmail(f.email)) e.email = "صيغة البريد غير صحيحة";
  }
  return e;
}

function Page() {
  const { car } = Route.useSearch();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>({ ...EMPTY, notes: car ? `بخصوص السيارة ${car}` : "" });
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState(false);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const next = () => {
    const e = validate(step, form);
    setErrors(e);
    if (Object.keys(e).length) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const submit = () => {
    for (let s = 0; s < STEPS.length - 1; s++) {
      const e = validate(s, form);
      if (Object.keys(e).length) {
        setErrors(e);
        setStep(s);
        return;
      }
    }
    saveLocal("aljales-demo-requests", { ...form, at: new Date().toISOString() });
    setDone(true);
  };

  const err = (k: keyof Form) => errors[k];
  const inv = (k: keyof Form, id: string) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${id}-error` : undefined });

  return (
    <>
      <PageHeader eyebrow="طلب خاص" title="اطلب سيارة" description="سبع خطوات قصيرة، وسنبحث لك عن السيارة المناسبة.">
        <DemoNotice className="max-w-2xl">نموذج تجريبي: البيانات تُحفظ في متصفحك فقط ولا تُرسل إلى الشركة.</DemoNotice>
      </PageHeader>
      <div className="container-site max-w-3xl py-12">
        {done ? (
          <DemoSubmitted
            title="تم حفظ طلبك محلياً"
            action={
              <>
                <Button asChild variant="hero">
                  <Link to="/cars">تصفح السيارات</Link>
                </Button>
                <Button variant="surface" onClick={() => { setForm(EMPTY); setStep(0); setDone(false); }}>
                  طلب جديد
                </Button>
              </>
            }
          >
            لم يصل الطلب إلى الشركة. عند تفعيل الإرسال الفعلي سيتم التواصل معك.
          </DemoSubmitted>
        ) : (
          <>
            <ol className="mb-8 flex gap-1.5" aria-label="مراحل الطلب">
              {STEPS.map((s, i) => (
                <li key={s} className="flex-1">
                  <span className={cn("block h-1.5 rounded-full transition-colors", i <= step ? "bg-primary" : "bg-muted")} aria-hidden />
                  <span className={cn("mt-2 hidden text-xs md:block", i === step ? "font-semibold" : "text-muted-foreground")} aria-current={i === step ? "step" : undefined}>
                    {s}
                  </span>
                </li>
              ))}
            </ol>
            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                if (step === STEPS.length - 1) submit();
                else next();
              }}
              className="rounded-lg bg-card p-6 shadow-card md:p-8"
            >
              <h2 className="mb-6 text-xl font-bold">
                <span className="ltr-iso text-muted-foreground">{step + 1}/{STEPS.length}</span> · {STEPS[step]}
              </h2>

              {step === 0 && (
                <fieldset>
                  <legend className="mb-3 text-sm font-medium">السوق المطلوب</legend>
                  <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-describedby={errors.market ? "market-error" : undefined}>
                    {[...MARKET_LIST.map((m) => ({ v: m, l: `${MARKETS[m].nameAr} — ${MARKETS[m].roleAr}` })), { v: "OPEN", l: "مفتوح — أي سوق" }].map((o) => (
                      <label key={o.v} className={cn("flex cursor-pointer items-center gap-3 rounded-md border p-4 transition-colors has-[:checked]:border-primary has-[:checked]:bg-accent", "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring")}>
                        <input type="radio" name="market" value={o.v} checked={form.market === o.v} onChange={() => set("market", o.v)} className="accent-primary" />
                        {o.l}
                      </label>
                    ))}
                  </div>
                  {err("market") && <p id="market-error" role="alert" className="mt-2 text-xs font-medium text-destructive">{err("market")}</p>}
                </fieldset>
              )}

              {step === 1 && (
                <div className="flex flex-col gap-4">
                  <Field label="العلامة" error={err("brand")} id="brand">
                    {(id) => (
                      <NativeSelect id={id} value={form.brand} onChange={(e) => set("brand", e.target.value)} {...inv("brand", id)}>
                        <option value="">اختر العلامة</option>
                        {BRANDS.map((b) => <option key={b.slug} value={b.slug}>{b.nameAr} — {b.nameEn}</option>)}
                        <option value="other">علامة أخرى</option>
                      </NativeSelect>
                    )}
                  </Field>
                  <Field label="الموديل" error={err("model")} id="model">
                    {(id) => <TextInput id={id} value={form.model} disabled={form.noModel} onChange={(e) => set("model", e.target.value)} placeholder="مثال: باليسيد" {...inv("model", id)} />}
                  </Field>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={form.noModel} onChange={(e) => { set("noModel", e.target.checked); if (e.target.checked) set("model", ""); }} className="accent-primary" />
                    لا يوجد موديل محدد
                  </label>
                </div>
              )}

              {step === 2 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="سنة الصنع من" error={err("yearFrom")} id="yearFrom">
                    {(id) => <TextInput id={id} inputMode="numeric" dir="ltr" value={form.yearFrom} onChange={(e) => set("yearFrom", e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="2020" {...inv("yearFrom", id)} />}
                  </Field>
                  <Field label="إلى" error={err("yearTo")} id="yearTo">
                    {(id) => <TextInput id={id} inputMode="numeric" dir="ltr" value={form.yearTo} onChange={(e) => set("yearTo", e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="2025" {...inv("yearTo", id)} />}
                  </Field>
                  <Field label="الميزانية من (ر.س)" error={err("budgetMin")} id="budgetMin">
                    {(id) => <TextInput id={id} inputMode="numeric" dir="ltr" value={form.budgetMin} onChange={(e) => set("budgetMin", e.target.value.replace(/\D/g, ""))} {...inv("budgetMin", id)} />}
                  </Field>
                  <Field label="إلى (ر.س)" error={err("budgetMax")} id="budgetMax">
                    {(id) => <TextInput id={id} inputMode="numeric" dir="ltr" value={form.budgetMax} onChange={(e) => set("budgetMax", e.target.value.replace(/\D/g, ""))} {...inv("budgetMax", id)} />}
                  </Field>
                </div>
              )}

              {step === 3 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="نوع الوقود">
                    {(id) => (
                      <NativeSelect id={id} value={form.fuel} onChange={(e) => set("fuel", e.target.value)}>
                        <option value="">لا يهم</option>
                        {Object.entries(FUEL_LABEL).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                      </NativeSelect>
                    )}
                  </Field>
                  <Field label="ناقل الحركة">
                    {(id) => (
                      <NativeSelect id={id} value={form.transmission} onChange={(e) => set("transmission", e.target.value)}>
                        <option value="">لا يهم</option>
                        {Object.entries(TRANSMISSION_LABEL).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                      </NativeSelect>
                    )}
                  </Field>
                  <Field label="اللون المفضل">
                    {(id) => <TextInput id={id} value={form.color} onChange={(e) => set("color", e.target.value)} />}
                  </Field>
                  <Field label="مواصفات مطلوبة">
                    {(id) => <TextInput id={id} value={form.specs} onChange={(e) => set("specs", e.target.value)} placeholder="مثال: فتحة سقف، 7 مقاعد" />}
                  </Field>
                </div>
              )}

              {step === 4 && (
                <Field label="ملاحظات إضافية (اختياري)">
                  {(id) => <Textarea id={id} rows={5} value={form.notes} onChange={(e) => set("notes", e.target.value)} />}
                </Field>
              )}

              {step === 5 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="الاسم" error={err("name")} id="name">
                    {(id) => <TextInput id={id} autoComplete="name" value={form.name} onChange={(e) => set("name", e.target.value)} {...inv("name", id)} />}
                  </Field>
                  <Field label="رقم الهاتف" error={err("phone")} id="phone">
                    {(id) => <TextInput id={id} type="tel" dir="ltr" autoComplete="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+966…" className="text-start" {...inv("phone", id)} />}
                  </Field>
                  <Field label="المدينة / الدولة" error={err("city")} id="city">
                    {(id) => <TextInput id={id} value={form.city} onChange={(e) => set("city", e.target.value)} {...inv("city", id)} />}
                  </Field>
                  <Field label="البريد الإلكتروني (اختياري)" error={err("email")} id="email">
                    {(id) => <TextInput id={id} type="email" dir="ltr" autoComplete="email" value={form.email} onChange={(e) => set("email", e.target.value)} className="text-start" {...inv("email", id)} />}
                  </Field>
                </div>
              )}

              {step === 6 && <Review form={form} onEdit={setStep} />}

              <div className="mt-8 flex items-center justify-between gap-3 border-t pt-6">
                <Button type="button" variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
                  <ChevronRight /> السابق
                </Button>
                {step < STEPS.length - 1 ? (
                  <Button type="submit" variant="hero" size="lg">
                    التالي <ChevronLeft />
                  </Button>
                ) : (
                  <Button type="submit" variant="hero" size="lg">
                    <Check /> إرسال تجريبي
                  </Button>
                )}
              </div>
            </form>
          </>
        )}
      </div>
    </>
  );
}

function Review({ form, onEdit }: { form: Form; onEdit: (s: number) => void }) {
  const brand = BRANDS.find((b) => b.slug === form.brand)?.nameAr ?? (form.brand === "other" ? "علامة أخرى" : "—");
  const market = form.market === "OPEN" ? "مفتوح" : form.market ? MARKETS[form.market as keyof typeof MARKETS].nameAr : "—";
  const rows: [string, string, number][] = [
    ["السوق", market, 0],
    ["العلامة والموديل", `${brand} ${form.noModel ? "(بدون موديل محدد)" : form.model}`, 1],
    ["السنة", [form.yearFrom, form.yearTo].filter(Boolean).join(" – ") || "—", 2],
    ["الميزانية (ر.س)", [form.budgetMin, form.budgetMax].filter(Boolean).join(" – ") || "—", 2],
    ["المواصفات", [form.fuel && FUEL_LABEL[form.fuel as keyof typeof FUEL_LABEL], form.transmission && TRANSMISSION_LABEL[form.transmission as keyof typeof TRANSMISSION_LABEL], form.color, form.specs].filter(Boolean).join("، ") || "—", 3],
    ["ملاحظات", form.notes || "—", 4],
    ["بياناتك", [form.name, form.phone, form.city, form.email].filter(Boolean).join(" · "), 5],
  ];
  return (
    <dl className="divide-y">
      {rows.map(([k, v, s]) => (
        <div key={k} className="flex items-start justify-between gap-4 py-3 text-sm">
          <div>
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="mt-0.5 font-medium">{v}</dd>
          </div>
          <Button type="button" variant="link" size="sm" onClick={() => onEdit(s)}>
            تعديل
          </Button>
        </div>
      ))}
    </dl>
  );
}
