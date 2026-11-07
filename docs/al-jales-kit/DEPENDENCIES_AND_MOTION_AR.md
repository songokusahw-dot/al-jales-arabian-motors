# الحزم ومعمارية الحركة — قرار التنفيذ

## 1. المبدأ

لا يوجد package list واحد يصلح لكل مشروع Lovable. اقرأ الإطار والـlockfile أولاً، ثم احتفظ بالحزم الموجودة ما دامت تؤدي الوظيفة المطلوبة. لا تثبّت نسختين من مكتبة واحدة.

## 2. الحزم المقترحة

| Package | الدور | قرار التثبيت |
|---|---|---|
| `gsap` | Scroll-driven animation وtimelines | أضفه فقط إذا كانت المشاهد السينمائية المختارة تحتاجه وغير مثبت. |
| `@gsap/react` | React lifecycle وcleanup لـ GSAP | أضفه مع GSAP عند التنفيذ في React. |
| `motion` | Micro-interactions عبر `motion/react` | استخدمه إن لم يكن `framer-motion` موجوداً ويؤدي الوظيفة. لا تثبّت الاثنين لمجرد الاختلاف في اسم الاستيراد. |
| `lenis` | Smooth scroll | اختياري. لا تثبّته تلقائياً؛ الصفحة يجب أن تعمل بسكرول المتصفح الطبيعي. |
| `embla-carousel-react` | Carousel قابل للسحب في React | اختَر v8 stable عند غياب بديل مناسب. |
| `embla-carousel-auto-scroll` | continuous marquee/autoscroll | استخدم نفس major version (v8) مع Embla. |
| `lucide-react` | أيقونات واجهة عامة | استخدم النسخة الموجودة؛ لا تضفها إن كان المشروع يستخدم مكتبة مناسبة. |

## 3. أدوار الحركة

- GSAP/ScrollTrigger: pinned story واحد، SVG path drawing، scroll reveal للمشاهد المركّبة.
- Motion: قائمة الموبايل، Dialog، tabs، accordion، hover/press، theme toggle.
- CSS: transition بسيط للون والظل والـfocus.
- Embla: شريط شعارات قابل للسحب مع Auto Scroll؛ لا تجعل GSAP يحرك track في الوقت نفسه.

## 4. Brand marquee — Embla v8

- خيارات Embla RTL مع `dir="rtl"` على العنصر.
- loop إذا كان عدد الشرائح يسمح.
- Auto Scroll مع سرعة منخفضة، `stopOnMouseEnter` و`stopOnFocusIn`، وعودة تلقائية بعد مغادرة hover/focus عبر إعداد التفاعل المناسب.
- اجعل اتجاه Auto Scroll `forward` أو `backward` بعد التحقق من المسار المرئي؛ RTL وAuto Scroll direction محوران منفصلان.
- `dragFree` مناسب لشعور السحب السلس إذا لم يؤثر على الوصول.
- احترم `prefers-reduced-motion`; لا تفرض autoplay على المستخدمين الذين يفضلون تقليل الحركة.
- اضبط `aria-label`، أسماء الشعارات، focus، واختبار اللمس.

## 5. SSR safety

في TanStack Start أو أي SSR framework:
- لا تنفّذ تهيئة مكتبة تعتمد على DOM في module scope.
- شغّل التهيئة داخل `useEffect`/client component أو الآلية التي يفرضها إطار المشروع.
- استخدم cleanup صريحاً لكل instance وlisteners وScrollTriggers.
- لا تقرأ localStorage خلال render الخادمي؛ نفّذ theme persistence بالطريقة المتوافقة مع SSR لتجنب hydration mismatch.

## 6. ما لا نضيفه في هذه النسخة

- Anime.js أو Locomotive Scroll أو fullpage.js كمحركات تمرير إضافية.
- أكثر من Carousel library.
- analytics, Meta/TikTok pixels, session replay أو trackers.
- Backend/DB/Auth/API/Payments/Scraping.

## 7. جرد package بعد كل مرحلة

بعد تعديل package.json وlockfile، اذكر:
- الاسم والنسخة التي أضيفت.
- الوظيفة الفعلية في الموقع.
- الملفات التي تستوردها.
- هل توجد مكتبة أخرى تؤدي الوظيفة نفسها؟
- هل الاختبارات/build تعمل؟

احذف الحزمة التي لم تعد مستخدمة فقط بعد التأكد من أنها غير مطلوبة في بقية المشروع.
