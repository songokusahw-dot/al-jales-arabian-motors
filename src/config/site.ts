import type { MarketCode } from "@/lib/types";

type Branch = {
  city: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  hours: string | null;
};

type SocialLinks = {
  instagram: string | null;
  x: string | null;
  tiktok: string | null;
  snapchat: string | null;
  youtube: string | null;
  facebook: string | null;
};

/**
 * Every contact value stays null until the company supplies a verified value.
 * Nothing here is rendered as a link while it is null.
 */
export const siteConfig = {
  nameAr: "الجالس للسيارات",
  nameEn: "AL-JALES AUTOMOTIVE",
  contact: {
    phone: null as string | null,
    whatsappE164: null as string | null,
    email: null as string | null,
    branches: {
      KR: { city: null, address: null, latitude: null, longitude: null, hours: null },
      SA: { city: null, address: null, latitude: null, longitude: null, hours: null },
      YE: { city: null, address: null, latitude: null, longitude: null, hours: null },
    } as Record<MarketCode, Branch>,
  },
  social: {
    instagram: null,
    x: null,
    tiktok: null,
    snapchat: null,
    youtube: null,
    facebook: null,
  } as SocialLinks,
};

export function whatsappLink(message: string): string | null {
  const num = siteConfig.contact.whatsappE164;
  if (!num || !/^\+?[1-9]\d{7,14}$/.test(num)) return null;
  return `https://wa.me/${num.replace("+", "")}?text=${encodeURIComponent(message)}`;
}
