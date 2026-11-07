# مصفوفة اختبار قبول AL-JALES

| المجال | الاختبار | النتيجة المطلوبة |
|---|---|---|
| Routing | فتح كل route مباشرة ثم refresh | لا 404 غير متوقعة ولا صفحة فارغة. |
| Market pages | KR/SA/YE | نفس قالب القائمة مع سوق وبيانات صحيحين. |
| Brand marquee | RTL/autoplay/drag/touch/hover/focus | يمين إلى يسار، سحب طبيعي، إيقاف وإعادة تشغيل. |
| Brand click | الضغط على أي علامة | يفتح inventory مع فلتر العلامة. |
| Latest Arrivals | فرز createdAt | الأحدث تاريخ إضافة أولاً. |
| Search | عربي/إنجليزي/referenceCode | نتائج صحيحة دون تطبيع عدواني. |
| Filters | السعر/السنة/الوقود/القير/الممشى/السوق | تعمل مع بعضها وتنعكس في URL. |
| Sort | التاريخ والسعر والممشى | ترتيب صحيح مع null handling. |
| Pagination | next/previous/pages | totalPages حسابه صحيح. |
| Empty state | فلتر بلا نتائج | رسالة مفيدة وزر clear filters. |
| Card status | available/reserved/sold | CTA يتغير، ولا يمكن حجز sold. |
| Vehicle gallery | Grid/Slider/Lightbox | الصور تتطابق مع السيارة، keyboard/touch يعملان. |
| Pricing | Breakdown | جميع المبالغ SAR، Demo واضح، null لا يحتسب. |
| Inspection | Report missing/present | لا ادعاء سلامة بلا تقرير. |
| Request form | Required fields/steps/errors | validation عربية وتأكيد demo صريح. |
| Reviews/Questions | create local entry | لا ادعاء نشر أو إرسال حقيقي. |
| Contact | contact config null/non-null | لا روابط أو أرقام وهمية. |
| Theme | Light/Dark persistence | المكونات كلها تتبدل دون flash/ hydration issue. |
| RTL | arrows/controls/numbers | اتجاه منطقي وأسماء أكواد LTR. |
| Keyboard | Tab/Enter/Escape | كل الوظائف متاحة. |
| Reduced motion | system preference | تعطيل/تخفيف الحركة دون إخفاء محتوى. |
| Responsive | 1440/1024/768/390/360 | لا overflow أو تداخل أو touch targets صغيرة. |
| Accessibility | contrast/labels/alt/headings | WCAG AA على الأقل للنصوص العادية. |
| Performance | image loading/layout shift | صور بأبعاد صحيحة، lazy load، لا loaders وهمية. |
| Privacy | scripts/cookies | لا tracking بدون موافقة، النماذج demo. |
| Legal | privacy/terms/cookies | مسودة واضحة للمراجعة. |
