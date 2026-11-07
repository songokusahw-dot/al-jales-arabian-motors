import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Phone, Mail, MessageCircle } from "lucide-react";
import { pageHead } from "@/lib/seo";
import { siteConfig, whatsappLink } from "@/config/site";
import { saveLocal } from "@/lib/local-store";
import { isValidEmail, isValidPhone } from "@/lib/validation";
import { PageHeader } from "@/components/site/PageHeader";
import { DemoNotice } from "@/components/site/DemoNotice";
import { DemoSubmitted } from "@/components/site/DemoSubmitted";
import { SocialIcons, hasSocialLinks } from "@/components/site/SocialIcons";
import { Field, TextInput } from "@/components/site/listing/controls";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contact")({
  head: () => pageHead("تواصل معنا", "تواصل مع الجالس للسيارات للاستفسار عن سيارة أو طلب خاص."),
  component: Page,
});

function Page() {
  const { phone, email } = siteConfig.contact;
  const wa = whatsappLink("مرحباً، لدي استفسار.");
  const [f, setF] = useState({ name: "", phone: "", email: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<"name" | "phone" | "email" | "message", string>>>({});
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Partial<Record<"name" | "phone" | "email" | "message", string>> = {};
    if (f.name.trim().length < 2) er.name = "اكتب اسمك";
    if (!f.phone.trim() && !f.email.trim()) er.phone = "أدخل رقم هاتف أو بريداً إلكترونياً";
    if (f.phone.trim() && !isValidPhone(f.phone)) er.phone = "صيغة الهاتف غير صحيحة";
    if (f.email.trim() && !isValidEmail(f.email)) er.email = "صيغة البريد غير صحيحة";
    if (f.message.trim().length < 10) er.message = "اكتب رسالتك (10 أحرف على الأقل)";
    setErrors(er);
    if (Object.keys(er).length) return;
    saveLocal("aljales-demo-contact", { ...f, at: new Date().toISOString() });
    setDone(true);
  };
  const inv = (k: "name" | "phone" | "email" | "message", id: string) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${id}-error` : undefined });

  const channels = [
    phone && { icon: Phone, label: "الهاتف", value: phone, href: `tel:${phone}` },
    email && { icon: Mail, label: "البريد", value: email, href: `mailto:${email}` },
    wa && { icon: MessageCircle, label: "واتساب", value: "راسلنا على واتساب", href: wa },
  ].filter(Boolean) as { icon: typeof Phone; label: string; value: string; href: string }[];

  return (
    <>
      <PageHeader eyebrow="تواصل" title="تواصل معنا" description="أرسل رسالتك وسنعود إليك." />
      <div className="container-site grid gap-10 py-12 lg:grid-cols-[22rem_1fr]">
        <aside className="flex flex-col gap-4">
          {channels.length > 0 ? (
            channels.map((c) => (
              <a key={c.label} href={c.href} className="flex items-center gap-3 rounded-lg bg-card p-5 shadow-card hover:bg-accent">
                <c.icon className="size-5 text-accent-text" aria-hidden />
                <span>
                  <span className="block text-xs text-muted-foreground">{c.label}</span>
                  <span className="ltr-iso font-semibold">{c.value}</span>
                </span>
              </a>
            ))
          ) : (
            <div className="rounded-lg border border-dashed bg-card/60 p-5">
              <p className="font-semibold">سيتم إضافة بيانات التواصل</p>
              <p className="mt-1 text-sm text-muted-foreground">أرقام الهاتف وواتساب والبريد ستظهر هنا بعد اعتمادها. استخدم النموذج في الوقت الحالي.</p>
            </div>
          )}
          {hasSocialLinks() && (
            <div className="rounded-lg bg-card p-5 shadow-card">
              <p className="mb-3 text-sm font-semibold">تابعنا</p>
              <SocialIcons />
            </div>
          )}
        </aside>
        <div>
          {done ? (
            <DemoSubmitted title="تم حفظ رسالتك محلياً">لم تصل الرسالة إلى الشركة.</DemoSubmitted>
          ) : (
            <form noValidate onSubmit={submit} className="flex flex-col gap-5 rounded-lg bg-card p-6 shadow-card md:p-8">
              <DemoNotice>نموذج تجريبي: الرسالة تُحفظ في متصفحك فقط ولا تُرسل إلى الشركة.</DemoNotice>
              <Field label="الاسم" error={errors.name} id="c-name">
                {(id) => <TextInput id={id} autoComplete="name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} {...inv("name", id)} />}
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="رقم الهاتف" error={errors.phone} id="c-phone">
                  {(id) => <TextInput id={id} type="tel" dir="ltr" className="text-start" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} {...inv("phone", id)} />}
                </Field>
                <Field label="البريد الإلكتروني" error={errors.email} id="c-email">
                  {(id) => <TextInput id={id} type="email" dir="ltr" className="text-start" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} {...inv("email", id)} />}
                </Field>
              </div>
              <Field label="الرسالة" error={errors.message} id="c-msg">
                {(id) => <Textarea id={id} rows={5} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} {...inv("message", id)} />}
              </Field>
              <Button type="submit" variant="hero" size="lg" className="self-start">
                إرسال تجريبي
              </Button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
