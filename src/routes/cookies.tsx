import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/cookies")({
  head: () => pageHead("سياسة ملفات الارتباط (مسودة)", "مسودة سياسة ملفات الارتباط والتخزين المحلي لموقع الجالس للسيارات."),
  component: () => (
    <LegalPage title="ملفات الارتباط">
      <section>
        <h2>هل يستخدم الموقع ملفات ارتباط؟</h2>
        <p>لا يُنشئ الموقع حالياً ملفات ارتباط للتتبع أو الإعلانات. يستخدم التخزين المحلي في المتصفح فقط لحفظ تفضيل الثيم والنماذج التجريبية.</p>
      </section>
      <section>
        <h2>أدوات الطرف الثالث</h2>
        <p>تُحمَّل الخطوط من خدمة Google Fonts. لا توجد أدوات تحليلات أو بكسلات إعلانية.</p>
      </section>
    </LegalPage>
  ),
});
