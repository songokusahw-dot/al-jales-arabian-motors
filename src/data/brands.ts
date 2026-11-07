import type { Brand } from "@/lib/types";

export const BRANDS: Brand[] = [
  { slug: "hyundai", nameAr: "هيونداي", nameEn: "Hyundai", aliases: ["هونداي", "هيونداى"], logoSrc: null },
  { slug: "kia", nameAr: "كيا", nameEn: "Kia", aliases: ["كيا موتورز"], logoSrc: null },
  { slug: "genesis", nameAr: "جينيسيس", nameEn: "Genesis", aliases: ["جنسس", "جينسيس"], logoSrc: null },
  { slug: "toyota", nameAr: "تويوتا", nameEn: "Toyota", aliases: ["تيوتا"], logoSrc: null },
  { slug: "lexus", nameAr: "لكزس", nameEn: "Lexus", aliases: ["لكسز", "ليكزس"], logoSrc: null },
  { slug: "nissan", nameAr: "نيسان", nameEn: "Nissan", aliases: ["نيسن"], logoSrc: null },
  { slug: "mercedes-benz", nameAr: "مرسيدس-بنز", nameEn: "Mercedes-Benz", aliases: ["مرسيدس", "مرسيدس بنز", "mercedes", "benz"], logoSrc: null },
  { slug: "bmw", nameAr: "بي إم دبليو", nameEn: "BMW", aliases: ["بي ام", "بي ام دبليو"], logoSrc: null },
  { slug: "mitsubishi", nameAr: "ميتسوبيشي", nameEn: "Mitsubishi", aliases: ["متسوبيشي"], logoSrc: null },
];

export function getBrand(slug: string | undefined | null): Brand | undefined {
  if (!slug) return undefined;
  return BRANDS.find((b) => b.slug === slug);
}
