import type { FeatureCategory } from "@/lib/types";

export const FEATURE_CATALOG: Record<string, { labelAr: string; category: FeatureCategory }> = {
  leather: { labelAr: "مقاعد جلدية", category: "interior" },
  "heated-seats": { labelAr: "مقاعد بتدفئة", category: "interior" },
  "ventilated-seats": { labelAr: "مقاعد بتهوية", category: "interior" },
  sunroof: { labelAr: "فتحة سقف", category: "interior" },
  "third-row": { labelAr: "صف ثالث للمقاعد", category: "interior" },
  "rear-ac": { labelAr: "تكييف خلفي", category: "interior" },
  navigation: { labelAr: "نظام ملاحة", category: "tech" },
  "rear-camera": { labelAr: "كاميرا خلفية", category: "tech" },
  "camera-360": { labelAr: "كاميرا 360 درجة", category: "tech" },
  "wireless-charging": { labelAr: "شحن لاسلكي", category: "tech" },
  "smart-key": { labelAr: "مفتاح ذكي", category: "tech" },
  "adaptive-cruise": { labelAr: "مثبت سرعة تكيفي", category: "safety" },
  "lane-keep": { labelAr: "مساعد البقاء في المسار", category: "safety" },
  "blind-spot": { labelAr: "مراقبة النقطة العمياء", category: "safety" },
  "parking-sensors": { labelAr: "حساسات ركن", category: "safety" },
};

export const FEATURE_CATEGORY_LABEL: Record<FeatureCategory, string> = {
  interior: "الداخلية والراحة",
  tech: "التقنية",
  safety: "السلامة ومساعدة السائق",
};
