export const MAIN_NAV = [
  { to: "/cars", label: "السيارات" },
  { to: "/our-showrooms", label: "معارضنا" },
  { to: "/korea/showrooms", label: "المعارض الكورية" },
  { to: "/korea/auctions", label: "المزادات" },
  { to: "/about", label: "من نحن" },
  { to: "/contact", label: "تواصل معنا" },
] as const;

export const FOOTER_NAV = [
  {
    title: "الأسواق",
    links: [
      { to: "/cars/korea", label: "سيارات كوريا" },
      { to: "/cars/saudi", label: "سيارات السعودية" },
      { to: "/cars/yemen", label: "سيارات اليمن" },
      { to: "/our-showrooms", label: "اختر المعرض" },
    ],
  },
  {
    title: "السيارات",
    links: [
      { to: "/cars", label: "كل السيارات" },
      { to: "/search", label: "البحث" },
      { to: "/korea/showrooms", label: "المعارض الكورية" },
      { to: "/korea/auctions", label: "المزادات الكورية" },
      { to: "/request-car", label: "اطلب سيارة" },
    ],
  },
  {
    title: "خدمة العملاء",
    links: [
      { to: "/about", label: "من نحن" },
      { to: "/reviews", label: "تقييمات العملاء" },
      { to: "/faq", label: "الأسئلة الشائعة" },
      { to: "/ask-question", label: "اطرح سؤالاً" },
      { to: "/contact", label: "تواصل معنا" },
      { to: "/locations", label: "الفروع والمواقع" },
    ],
  },
] as const;

export const LEGAL_NAV = [
  { to: "/privacy", label: "الخصوصية" },
  { to: "/terms", label: "الشروط والأحكام" },
  { to: "/cookies", label: "ملفات الارتباط" },
] as const;
