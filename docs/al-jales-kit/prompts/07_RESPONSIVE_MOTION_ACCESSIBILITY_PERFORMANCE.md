# المرحلة 07 — الحركة والتجاوب وإمكانية الوصول والأداء

نفّذ مرحلة مستقلة لتحسين التجربة كاملة دون إعادة تصميم كل الصفحات من الصفر.

## 1. توزيع ملكية الحركة

- GSAP + ScrollTrigger + `@gsap/react`: المشاهد المرتبطة بالتمرير، SVG path reveal، parallax محدود، pinned scene واحد أو اثنان كحد أقصى في الموقع، product storytelling.
- `motion/react`: القوائم، dialog، tabs، accordion، card hover/press، theme transition، micro-interactions.
- CSS transitions: hover بسيط وتغير ألوان وحالات التركيز.
- Lenis اختياري؛ global instance واحد فقط، ولا تستخدمه إذا كانت التجربة الحالية سلسة بما يكفي أو إذا سبب تعارضاً.
- لا تحرك transform للعنصر نفسه بمحركين. إذا احتجت أكثر من محرك، افصل wrapper ownership بوضوح.
- استخدم `gsap.context()` أو `useGSAP` مع cleanup، وأزل ScrollTriggers/listeners/observers عند unmount.

## 2. تأثيرات مناسبة للمشروع

- Hero: reveal واحد واضح، مع ظهور العنوان على مستوى الكلمات/الجملة، لا حرفاً حرفاً بالعربية.
- Featured car: cinematic image reveal/thumbnail-to-stage إن كان مفيداً.
- Import Journey: رسم SVG للمسار وتحريك marker بين المراحل.
- Vehicle details: انتقالات gallery و3-strip media explorer اختياري إذا لم يربك المواصفات.
- Cards/buttons: hover لطيف، لا scale كبير ولا ظلال ثقيلة.
- لا تكرر scroll scenes المتشابهة في أقسام متتالية. لا تثبّت كل قسم.

## 3. شريط العلامات

اختبر RTL في المتصفح: autoplay من اليمين إلى اليسار، drag بالماوس، swipe باللمس، hover/focus pause، resume بعد التفاعل، loop بدون jump، وعدم تعطيل scroll العمودي. أوقف autoplay مع `prefers-reduced-motion` أو وفر زر pause واضحاً.

## 4. Responsive QA

راجع على الأقل هذه المقاسات CSS:
- 1440×900 desktop.
- 1024×768 laptop/tablet landscape.
- 768×1024 tablet portrait.
- 390×844 mobile.
- 360×800 mobile narrow.

لا تصغّر desktop فقط. اضبط grid، menu، hero crop، cards، filters drawer، gallery controls، sticky CTA، tables، forms وfooter لكل breakpoint. لا يوجد horizontal overflow غير مقصود.

## 5. Accessibility

- keyboard navigation لكل العناصر التفاعلية.
- focus-visible واضح.
- labels حقيقية للنماذج، ورسائل الخطأ مرتبطة بالحقل.
- semantic headings وlandmarks.
- contrast للنص العادي 4.5:1 على الأقل، وللنص الكبير/العناصر الرسومية وفق WCAG AA.
- alt نصي دقيق للصور؛ decorative images بـ alt فارغ.
- dialogs/lightbox تدعم Escape وfocus management.
- لا تجعل المعلومات تظهر عند hover فقط.
- reduced motion: إلغاء/تبسيط pinning وparallax/autoplay مع إبقاء المحتوى كاملاً.

## 6. الأداء

- استخدم صوراً responsive بأبعاد معلومة، lazy-load لما بعد الطي، ولا تؤخر صورة Hero الرئيسية بلا داعٍ.
- لا تحمل كل صور معرض السيارة قبل فتح التفاصيل إذا كان ذلك يضر بالأداء.
- code split للصفحات/المعارض/المكتبات الثقيلة وفق إطار المشروع.
- تجنب تكرار GSAP/Embla instances.
- راقب layout shift، broken images، console errors وrequests الفاشلة.
- لا تنشئ preloaders وهمية أو progress bars لا تقيس عملية حقيقية.

## 7. الصفحات القانونية و404

نفّذ `/privacy`, `/terms`, `/cookies` بصياغة مسودة قابلة لمراجعة الشركة؛ لا تدّعِ أنها مراجعة قانونياً. وضّح عدم وجود تتبع أو Analytics في النسخة التجريبية إن كان ذلك صحيحاً في الكود. أنشئ 404 مخصصة بها رابط للعودة للرئيسية والبحث.

## معيار القبول

لا توجد أخطاء console أو overflow أو عناصر غير قابلة للكيبورد؛ motion نظيف مع SSR؛ reduced motion عملي؛ كل الصفحات جيدة على المقاسات الخمسة والثيمين؛ صور محسنة؛ صفحات قانونية و404 موجودة.
