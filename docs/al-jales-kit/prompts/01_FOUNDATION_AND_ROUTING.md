# المرحلة 01 — أساس المشروع ونظام التصميم والمسارات

**الوضع: Build mode بعد مراجعة تقرير المرحلة 00.**

نفّذ أساس الموقع في المشروع الموجود. التزم بالإطار والراوتر والبنية التي اكتشفتها؛ لا تنشئ مشروعاً جديداً ولا تهاجر framework.

## 1. نظام التصميم

- Light هو الافتراضي، مع Dark mode قابل للتبديل ويحفظ اختيار المستخدم.
- اشتق palette من المراجع المعتمدة الموجودة فعلياً. لا تستخدم Champagne/Bronze/Gold/Beige أو Obsidian القديمة.
- إذا اعتمدنا ARCO، ابدأ بالقيم الموجودة في `docs/DESIGN_TOKENS_HSL.md` مع تصحيح تباين النصوص؛ لا تخلط gradient الـProgress Loader مع لون العلامة بالكامل.
- أنشئ semantic CSS variables لـ background/foreground/surface/surface-muted/border/primary/primary-foreground/muted/focus/ring في الثيمين. اجعل المكونات كلها تستخدم tokens، لا hex متكرر داخل المكونات.
- أنشئ scale موحداً للمسافات، radius، الظلال، typography، breakpoints، widths وcontainer.
- الخط العربي من الموجود أو IBM Plex Sans Arabic / Readex Pro / Cairo. لا تنزّل خطوطاً مكررة أو غير مرخصة.
- `lang="ar"`, `dir="rtl"` على الجذر المناسب. استخدم `dir="ltr"` و`unicode-bidi:isolate` لأسماء السيارات والأكواد والقيم اللاتينية.

## 2. هيكل التطبيق

أنشئ/حدّث فقط الملفات اللازمة وفق conventions المشروع. افصل:
- routes/pages؛
- components/ui المشتركة؛
- components/sections؛
- components/vehicles؛
- components/forms؛
- data وconfig؛
- services/repositories؛
- styles/tokens.

اقترح ملفات مثل `src/config/site.ts`, `src/data/vehicles.ts`, `src/data/brands.ts`, `src/data/markets.ts`, `src/services/vehicle-repository.ts` فقط إذا كانت هذه المسارات منسجمة مع المشروع الفعلي.

## 3. إعدادات الشركة

أنشئ config مركزياً يحتوي:
- اسم الشركة العربي والإنجليزي.
- الأسواق KR / SA / YE.
- عملة العرض الافتراضية SAR.
- `phone`, `whatsappE164`, `email`, `socialLinks`, `branchAddress`, `mapCoordinates` بقيم null/فارغة حتى تصل بيانات موثقة.
- روابط الصفحات القانونية.

لا تضع رقم هاتف أو عنواناً أو رابط WhatsApp تجريبياً.

## 4. التوجيه والمسارات

نفّذ خريطة المسارات كما في `docs/ROUTE_MAP_AR.md` مع تكيف صياغة route files حسب الراوتر الحقيقي. احرص على:
- استخدام قالب واحد لقوائم السيارات لكل سوق.
- فصل `/car/:slug` عن `/cars/:market`.
- صفحة 404 مخصصة.
- روابط داخلية واضحة وألا تؤدي أي بطاقة إلى صفحة فارغة.
- لا تنشئ أكثر من مسار canonical للصفحة نفسها؛ استخدم redirect أو alias فقط عند الحاجة.

## 5. نموذج البيانات

أنشئ TypeScript types حسب `docs/DATA_MODEL_AR.md`. أنشئ مجموعة mock vehicles ثابتة من 18 سيارة تقريباً (ست لكل سوق) إذا لم توجد بيانات حقيقية. يجب أن تكون Demo بوضوح، مع أكواد فريدة:
- KR-01001 وما بعدها.
- SA-01001 وما بعدها.
- YE-01001 وما بعدها.

اعتمد pricing موحداً، وكل مبالغ الواجهة SAR. `0.00275 SAR/KRW` معدل تجريبي فقط، وليس Live FX. لا تخترع تقارير فحص أو حوادث أو أسماء شركاء أو أرقام اتصال.

## 6. المكونات الأساسية

أنشئ أو وحّد:
- AppShell / Header / MobileNavigation.
- ThemeProvider + ThemeToggle.
- Footer.
- Button / IconButton / Badge / Input / Select / Accordion عند الحاجة.
- VehicleCard skeleton structure.
- EmptyState / ErrorState / LoadingState.

لا تصمم كل صفحات الموقع بالكامل في هذه المرحلة؛ أنشئ أساساً قابلاً للبناء عليه.

## 7. معيار القبول

- المشروع يبني ويعمل دون كسر الهيكل السابق.
- Light الافتراضي وDark يعملان على shell وheader وfooter.
- المسارات canonical معرفة ولا يوجد تعارض تفاصيل/سوق.
- البيانات typed والأكواد فريدة وعملة SAR موحدة.
- جميع بيانات الاتصال غير المتوفرة null ولا توجد أرقام وهمية.
- SSR لا يتعطل بسبب `window` أو `document`.
- اذكر الملفات المتغيرة، الحزم التي أضيفت ولماذا، وأوامر الفحص التي شغّلتها ونتائجها.
