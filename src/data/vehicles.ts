import type { Vehicle, VehicleImage, PriceBreakdownItem, MarketCode, VehicleStatus, FuelType, BodyType } from "@/lib/types";
import { getBrand } from "./brands";
import { krwToSarDemo } from "@/lib/pricing";

/**
 * DEMO INVENTORY — every vehicle, price and inspection value below is illustrative only.
 * Replace with the company's verified records. Gallery entries are honest placeholders
 * until real photos of each exact vehicle are supplied.
 */

function placeholderGallery(count = 4): VehicleImage[] {
  return Array.from({ length: count }, (_, i) => ({
    src: null,
    altAr: `صورة ${i + 1} من ${count} — بانتظار الصورة الأصلية للسيارة`,
    isPlaceholder: true,
  }));
}

type Seed = {
  ref: string;
  market: MarketCode;
  brand: string;
  modelAr: string;
  modelEn: string;
  year: number;
  createdAt: string;
  mileageKm: number;
  fuel: FuelType;
  transmission?: "automatic" | "manual" | undefined;
  body: BodyType;
  status?: VehicleStatus | undefined;
  engineCc?: number | undefined;
  hp?: number | undefined;
  drivetrain?: string | undefined;
  ext?: string | undefined;
  int?: string | undefined;
  seats?: number | undefined;
  doors?: number | undefined;
  features?: string[] | undefined;
  /** Korean vehicles: source price in KRW (demo). */
  krw?: number | undefined;
  /** Saudi/Yemen showroom vehicles: sale price (demo). */
  saleSAR?: number | undefined;
  inspection?: Vehicle["inspection"] | undefined;
};

function koreaItems(krw: number): PriceBreakdownItem[] {
  return [
    { key: "source", labelAr: "سعر السيارة في المصدر الكوري (محوّل بمعدل توضيحي)", amountSAR: krwToSarDemo(krw), source: "demo" },
    { key: "inspection-export", labelAr: "الفحص ووثائق التصدير", amountSAR: null, source: "unknown" },
    { key: "shipping", labelAr: "الشحن", amountSAR: null, source: "unknown" },
    { key: "customs", labelAr: "الجمارك", amountSAR: null, source: "unknown" },
    { key: "clearance", labelAr: "التخليص", amountSAR: null, source: "unknown" },
    { key: "service", labelAr: "أتعاب الخدمة", amountSAR: null, source: "unknown" },
  ];
}

function build(s: Seed): Vehicle {
  const brand = getBrand(s.brand);
  if (!brand) throw new Error(`Unknown brand ${s.brand}`);
  const slug = `${s.brand}-${s.modelEn.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${s.year}-${s.ref.toLowerCase()}`;
  const isKR = s.market === "KR";
  return {
    id: s.ref,
    slug,
    referenceCode: s.ref,
    market: s.market,
    brandSlug: brand.slug,
    brandAr: brand.nameAr,
    brandEn: brand.nameEn,
    modelAr: s.modelAr,
    modelEn: s.modelEn,
    year: s.year,
    createdAt: s.createdAt,
    mileageKm: s.mileageKm,
    fuelType: s.fuel,
    transmission: s.transmission ?? "automatic",
    bodyType: s.body,
    engineCapacityCc: s.engineCc ?? null,
    horsepower: s.hp ?? null,
    drivetrain: s.drivetrain ?? null,
    exteriorColor: s.ext ?? null,
    interiorColor: s.int ?? null,
    seats: s.seats ?? null,
    doors: s.doors ?? null,
    status: s.status ?? "available",
    isDemo: true,
    gallery: placeholderGallery(),
    features: s.features ?? [],
    ...(s.inspection ? { inspection: s.inspection } : {}),
    pricing: isKR
      ? {
          saleCurrency: "SAR",
          sourcePriceKRW: s.krw ?? null,
          items: s.krw ? koreaItems(s.krw) : [],
          isDemo: true,
          noteAr: "السعر تقديري: يشمل سعر المصدر فقط، وبقية البنود تُحدَّد عند تأكيد الطلب.",
        }
      : {
          saleCurrency: "SAR",
          items: [{ key: "sale", labelAr: "سعر البيع في المعرض", amountSAR: s.saleSAR ?? null, source: s.saleSAR ? "demo" : "unknown" }],
          isDemo: true,
        },
    sourceName: null,
  };
}

const demoInspection = (date: string, overrides: Partial<Record<string, "ok" | "note" | "damage" | "not_inspected">> = {}): Vehicle["inspection"] => {
  const areas: [string, string][] = [
    ["body", "الهيكل"],
    ["paint", "الطلاء"],
    ["engine", "المحرك"],
    ["transmission", "ناقل الحركة"],
    ["chassis", "الشاصي"],
    ["airbags", "الوسائد الهوائية"],
    ["interior", "المقصورة الداخلية"],
    ["tires", "الإطارات"],
  ];
  return {
    reportAvailable: true,
    isDemo: true,
    inspectionDate: date,
    sourceName: "بيانات فحص تجريبية",
    reportDocumentUrl: null,
    findings: areas.map(([key, label]) => ({
      area: label,
      status: overrides[key] ?? "ok",
      noteAr: overrides[key] === "note" ? "ملاحظة تجريبية — راجع التقرير الأصلي عند توفره" : undefined,
    })),
  };
};

const SEEDS: Seed[] = [
  // ---------- Korea (import) ----------
  { ref: "KR-01001", market: "KR", brand: "hyundai", modelAr: "باليسيد", modelEn: "Palisade", year: 2024, createdAt: "2026-11-02T09:00:00Z", mileageKm: 18400, fuel: "gasoline", body: "suv", engineCc: 3778, hp: 291, drivetrain: "دفع رباعي AWD", ext: "أبيض", int: "بيج", seats: 7, doors: 5, features: ["leather", "ventilated-seats", "third-row", "camera-360", "adaptive-cruise", "lane-keep", "smart-key"], krw: 42000000, inspection: demoInspection("2026-10-28", { paint: "note" }) },
  { ref: "KR-01002", market: "KR", brand: "kia", modelAr: "سورينتو هايبرد", modelEn: "Sorento Hybrid", year: 2023, createdAt: "2026-10-27T09:00:00Z", mileageKm: 31200, fuel: "hybrid", body: "suv", engineCc: 1598, hp: 230, drivetrain: "دفع أمامي", ext: "رمادي", int: "أسود", seats: 7, doors: 5, features: ["leather", "heated-seats", "rear-camera", "lane-keep", "blind-spot"], krw: 33500000 },
  { ref: "KR-01003", market: "KR", brand: "genesis", modelAr: "جي في 80", modelEn: "GV80", year: 2023, createdAt: "2026-10-30T09:00:00Z", mileageKm: 24800, fuel: "gasoline", body: "suv", engineCc: 2497, hp: 300, drivetrain: "دفع رباعي AWD", ext: "أسود", int: "بني", seats: 5, doors: 5, features: ["leather", "ventilated-seats", "sunroof", "navigation", "camera-360", "adaptive-cruise", "blind-spot", "wireless-charging"], krw: 58000000, inspection: demoInspection("2026-10-25") },
  { ref: "KR-01004", market: "KR", brand: "hyundai", modelAr: "سوناتا", modelEn: "Sonata", year: 2022, createdAt: "2026-10-12T09:00:00Z", mileageKm: 46500, fuel: "gasoline", body: "sedan", status: "reserved", engineCc: 1999, hp: 160, ext: "فضي", seats: 5, doors: 4, features: ["rear-camera", "smart-key", "lane-keep"], krw: 19800000 },
  { ref: "KR-01005", market: "KR", brand: "kia", modelAr: "كرنفال", modelEn: "Carnival", year: 2024, createdAt: "2026-10-20T09:00:00Z", mileageKm: 12900, fuel: "diesel", body: "van", engineCc: 2151, hp: 199, ext: "أسود", seats: 8, doors: 5, features: ["third-row", "rear-ac", "rear-camera", "parking-sensors", "smart-key"], krw: 39000000 },
  { ref: "KR-01006", market: "KR", brand: "genesis", modelAr: "جي 80", modelEn: "G80", year: 2022, createdAt: "2026-09-18T09:00:00Z", mileageKm: 38700, fuel: "gasoline", body: "sedan", status: "sold", engineCc: 2497, hp: 304, ext: "أزرق داكن", seats: 5, doors: 4, features: ["leather", "heated-seats", "navigation", "adaptive-cruise"], krw: 41000000 },
  // ---------- Saudi showroom ----------
  { ref: "SA-01001", market: "SA", brand: "toyota", modelAr: "لاند كروزر", modelEn: "Land Cruiser", year: 2023, createdAt: "2026-11-04T09:00:00Z", mileageKm: 22100, fuel: "gasoline", body: "suv", engineCc: 3445, hp: 409, drivetrain: "دفع رباعي 4WD", ext: "أبيض لؤلؤي", seats: 7, doors: 5, features: ["leather", "ventilated-seats", "third-row", "camera-360", "adaptive-cruise"], saleSAR: 289000 },
  { ref: "SA-01002", market: "SA", brand: "lexus", modelAr: "إل إكس 600", modelEn: "LX 600", year: 2022, createdAt: "2026-10-22T09:00:00Z", mileageKm: 35800, fuel: "gasoline", body: "suv", status: "reserved", engineCc: 3445, hp: 409, drivetrain: "دفع رباعي 4WD", ext: "أسود", seats: 7, doors: 5, features: ["leather", "ventilated-seats", "sunroof", "navigation", "camera-360"], saleSAR: 395000 },
  { ref: "SA-01003", market: "SA", brand: "mercedes-benz", modelAr: "الفئة E 300", modelEn: "E 300", year: 2023, createdAt: "2026-10-15T09:00:00Z", mileageKm: 19600, fuel: "gasoline", body: "sedan", engineCc: 1991, hp: 255, ext: "رمادي", seats: 5, doors: 4, features: ["leather", "heated-seats", "navigation", "wireless-charging", "blind-spot"], saleSAR: 245000 },
  { ref: "SA-01004", market: "SA", brand: "nissan", modelAr: "باترول", modelEn: "Patrol", year: 2022, createdAt: "2026-09-29T09:00:00Z", mileageKm: 51200, fuel: "gasoline", body: "suv", engineCc: 5552, hp: 400, drivetrain: "دفع رباعي 4WD", ext: "أبيض", seats: 8, doors: 5, features: ["leather", "third-row", "rear-camera"], saleSAR: 198000 },
  { ref: "SA-01005", market: "SA", brand: "bmw", modelAr: "إكس 5", modelEn: "X5", year: 2023, createdAt: "2026-09-10T09:00:00Z", mileageKm: 27400, fuel: "gasoline", body: "suv", status: "sold", engineCc: 2998, hp: 375, ext: "أزرق", seats: 5, doors: 5, features: ["leather", "sunroof", "navigation", "adaptive-cruise"], saleSAR: 279000 },
  { ref: "SA-01006", market: "SA", brand: "hyundai", modelAr: "توسان هايبرد", modelEn: "Tucson Hybrid", year: 2024, createdAt: "2026-11-06T09:00:00Z", mileageKm: 8900, fuel: "hybrid", body: "suv", engineCc: 1598, hp: 226, ext: "أخضر داكن", seats: 5, doors: 5, features: ["heated-seats", "rear-camera", "lane-keep", "smart-key"], saleSAR: 112000 },
  // ---------- Yemen showroom ----------
  { ref: "YE-01001", market: "YE", brand: "toyota", modelAr: "هايلكس", modelEn: "Hilux", year: 2021, createdAt: "2026-10-31T09:00:00Z", mileageKm: 68300, fuel: "diesel", transmission: "manual", body: "pickup", engineCc: 2755, hp: 201, drivetrain: "دفع رباعي 4WD", ext: "أبيض", seats: 5, doors: 4, features: ["rear-camera"], saleSAR: 118000 },
  { ref: "YE-01002", market: "YE", brand: "toyota", modelAr: "برادو", modelEn: "Land Cruiser Prado", year: 2020, createdAt: "2026-10-18T09:00:00Z", mileageKm: 92400, fuel: "gasoline", body: "suv", engineCc: 3956, hp: 271, drivetrain: "دفع رباعي 4WD", ext: "فضي", seats: 7, doors: 5, features: ["third-row", "rear-camera", "smart-key"], saleSAR: 142000 },
  { ref: "YE-01003", market: "YE", brand: "nissan", modelAr: "صني", modelEn: "Sunny", year: 2022, createdAt: "2026-10-05T09:00:00Z", mileageKm: 41000, fuel: "gasoline", body: "sedan", engineCc: 1498, hp: 118, ext: "أبيض", seats: 5, doors: 4, features: ["smart-key"], saleSAR: 46000 },
  { ref: "YE-01004", market: "YE", brand: "kia", modelAr: "سبورتاج", modelEn: "Sportage", year: 2023, createdAt: "2026-11-01T09:00:00Z", mileageKm: 21700, fuel: "gasoline", body: "suv", status: "reserved", engineCc: 1999, hp: 154, ext: "رمادي", seats: 5, doors: 5, features: ["rear-camera", "lane-keep", "heated-seats"], saleSAR: 89000 },
  { ref: "YE-01005", market: "YE", brand: "hyundai", modelAr: "إلنترا", modelEn: "Elantra", year: 2022, createdAt: "2026-09-24T09:00:00Z", mileageKm: 37900, fuel: "gasoline", body: "sedan", engineCc: 1999, hp: 147, ext: "أحمر", seats: 5, doors: 4, features: ["rear-camera", "smart-key"], saleSAR: 58000 },
  { ref: "YE-01006", market: "YE", brand: "mitsubishi", modelAr: "إل 200", modelEn: "L200", year: 2021, createdAt: "2026-09-02T09:00:00Z", mileageKm: 74500, fuel: "diesel", transmission: "manual", body: "pickup", status: "sold", engineCc: 2442, hp: 178, drivetrain: "دفع رباعي 4WD", ext: "رمادي", seats: 5, doors: 4, features: [], saleSAR: 92000 },
];

export const VEHICLES: Vehicle[] = SEEDS.map(build);

export function getVehicleBySlug(slug: string): Vehicle | undefined {
  return VEHICLES.find((v) => v.slug === slug);
}
