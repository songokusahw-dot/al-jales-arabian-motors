import type { MarketCode } from "@/lib/types";

export type MarketConfig = {
  code: MarketCode;
  slug: "korea" | "saudi" | "yemen";
  nameAr: string;
  roleAr: string;
  titleAr: string;
  descriptionAr: string;
  introAr: string;
};

export const MARKETS: Record<MarketCode, MarketConfig> = {
  KR: {
    code: "KR",
    slug: "korea",
    nameAr: "كوريا",
    roleAr: "مصادر واستيراد",
    titleAr: "سيارات من كوريا",
    descriptionAr: "سيارات مختارة من السوق الكوري، تُعرض بأسعار تقديرية بالريال السعودي.",
    introAr:
      "نختار السيارة من المصدر الكوري، نراجع بيانات الفحص المتاحة، ثم نتابع التصدير والشحن والتخليص حتى التسليم. الأسعار المعروضة تقديرية ولا تشمل البنود غير المؤكدة.",
  },
  SA: {
    code: "SA",
    slug: "saudi",
    nameAr: "السعودية",
    roleAr: "معرض محلي",
    titleAr: "سيارات معرض السعودية",
    descriptionAr: "سيارات متوفرة في معرض الجالس بالمملكة العربية السعودية.",
    introAr: "سيارات جاهزة للمعاينة في معرض السعودية. تواصل معنا لتأكيد التوفر وموعد المعاينة.",
  },
  YE: {
    code: "YE",
    slug: "yemen",
    nameAr: "اليمن",
    roleAr: "معرض محلي",
    titleAr: "سيارات معرض اليمن",
    descriptionAr: "سيارات متوفرة في معرض الجالس باليمن.",
    introAr: "سيارات معروضة في معرض اليمن. الأسعار بالريال السعودي كعملة عرض موحدة.",
  },
};

export const MARKET_LIST: MarketCode[] = ["KR", "SA", "YE"];
