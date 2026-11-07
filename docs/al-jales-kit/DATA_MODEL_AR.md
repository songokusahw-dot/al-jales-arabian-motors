# نموذج البيانات الموحد — Vehicle / Pricing / Contact

## Vehicle

```ts
type MarketCode = "KR" | "SA" | "YE";
type VehicleStatus = "available" | "reserved" | "sold";
type FuelType = "gasoline" | "diesel" | "hybrid" | "electric" | "gas";
type Transmission = "automatic" | "manual";

type VehicleImage = {
  src: string | null;
  altAr: string;
  sourceName?: string;
  sourceUrl?: string;
  licenseNote?: string;
  isPlaceholder: boolean;
};

type PriceBreakdownItem = {
  key: string;
  labelAr: string;
  amountSAR: number | null;
  source: "verified" | "demo" | "unknown";
};

type VehiclePricing = {
  saleCurrency: "SAR";
  salePriceSAR: number | null;
  sourcePriceKRW?: number | null; // internal demo/source field
  demoKrwToSarRate?: 0.00275;
  items: PriceBreakdownItem[];
  finalPriceSAR: number | null;
  isDemo: boolean;
  noteAr?: string;
};

type InspectionFinding = {
  area: string;
  status: "ok" | "note" | "damage" | "not_inspected" | "unknown";
  noteAr?: string;
};

type Vehicle = {
  id: string;
  slug: string;
  referenceCode: string; // KR-01001 / SA-01001 / YE-01001
  market: MarketCode;
  brandSlug: string;
  brandAr: string;
  brandEn: string;
  modelAr: string;
  modelEn: string;
  year: number | null;
  createdAt: string; // ISO date; Latest Arrivals sorts by this field
  mileageKm: number | null;
  fuelType: FuelType | null;
  transmission: Transmission | null;
  bodyType?: string | null;
  engineCapacityCc?: number | null;
  horsepower?: number | null;
  drivetrain?: string | null;
  exteriorColor?: string | null;
  interiorColor?: string | null;
  seats?: number | null;
  doors?: number | null;
  status: VehicleStatus;
  isDemo: boolean;
  gallery: VehicleImage[];
  features: string[];
  inspection?: {
    reportAvailable: boolean;
    inspectionDate?: string | null;
    sourceName?: string | null;
    findings: InspectionFinding[];
    reportDocumentUrl?: string | null;
  };
  pricing: VehiclePricing;
  sourceName?: string | null;
};
```

## قواعد المعرّفات

- `KR-01001`, `KR-01002`... للسيارات الكورية.
- `SA-01001`, `SA-01002`... للسيارات السعودية.
- `YE-01001`, `YE-01002`... للسيارات اليمنية.
- لا تعِد استخدام referenceCode حتى لو حُذفت السيارة. slug وid فريدان.

## التسعير

- عملة العرض SAR موحدة في الواجهة.
- التحويل التجريبي لبيانات كوريا: `sourcePriceKRW × 0.00275 = sourcePriceSARDemo` مع تقريب مناسب إلى منزلتين أو هللات.
- لا تعرِض مبلغ KRW كأنه سعر بيع للعميل؛ إذا عرضت سعر التحويل، سمّه «معدل توضيحي».
- كل بنود `items` ذات مصدر `verified` أو `demo` فقط تدخل في الإجمالي؛ `unknown/null` لا يدخل الحساب.
- إذا وُجدت بنود ناقصة، أظهر أن الإجمالي تقديري/غير مكتمل. لا تختلق جمارك أو شحناً أو تخليصاً.
- استعمل `Intl.NumberFormat` بعملة `SAR` وتنسيق عربي مناسب، مع عزل اتجاه القيمة LTR عند الضرورة.

## مصدر الاتصال

في `siteConfig` استخدم nullable values:

```ts
contact: {
  phone: null,
  whatsappE164: null,
  email: null,
  branches: {
    KR: { city: null, address: null, latitude: null, longitude: null },
    SA: { city: null, address: null, latitude: null, longitude: null },
    YE: { city: null, address: null, latitude: null, longitude: null }
  }
}
```

لا تنشئ خرائط أو روابط WhatsApp من قيم فارغة.
