export type MarketCode = "KR" | "SA" | "YE";
export type VehicleStatus = "available" | "reserved" | "sold";
export type FuelType = "gasoline" | "diesel" | "hybrid" | "electric" | "gas";
export type Transmission = "automatic" | "manual";
export type BodyType = "suv" | "sedan" | "pickup" | "van";

export type VehicleImage = {
  src: string | null;
  altAr: string;
  sourceName?: string | undefined;
  sourceUrl?: string | undefined;
  licenseNote?: string | undefined;
  isPlaceholder: boolean;
};

export type PriceBreakdownItem = {
  key: string;
  labelAr: string;
  amountSAR: number | null;
  source: "verified" | "demo" | "unknown";
};

export type VehiclePricing = {
  saleCurrency: "SAR";
  /** Internal source price for Korean vehicles. Never shown as a customer price. */
  sourcePriceKRW?: number | null | undefined;
  items: PriceBreakdownItem[];
  isDemo: boolean;
  noteAr?: string | undefined;
};

export type InspectionStatus = "ok" | "note" | "damage" | "not_inspected" | "unknown";

export type InspectionFinding = {
  area: string;
  status: InspectionStatus;
  noteAr?: string | undefined;
};

export type FeatureCategory = "interior" | "tech" | "safety";

export type Vehicle = {
  id: string;
  slug: string;
  referenceCode: string;
  market: MarketCode;
  brandSlug: string;
  brandAr: string;
  brandEn: string;
  modelAr: string;
  modelEn: string;
  year: number | null;
  createdAt: string;
  mileageKm: number | null;
  fuelType: FuelType | null;
  transmission: Transmission | null;
  bodyType?: BodyType | null | undefined;
  engineCapacityCc?: number | null | undefined;
  horsepower?: number | null | undefined;
  drivetrain?: string | null | undefined;
  exteriorColor?: string | null | undefined;
  interiorColor?: string | null | undefined;
  seats?: number | null | undefined;
  doors?: number | null | undefined;
  status: VehicleStatus;
  isDemo: boolean;
  gallery: VehicleImage[];
  /** Keys into FEATURE_CATALOG */
  features: string[];
  inspection?: {
    reportAvailable: boolean | undefined;
    isDemo: boolean;
    inspectionDate?: string | null | undefined;
    sourceName?: string | null | undefined;
    findings: InspectionFinding[];
    reportDocumentUrl?: string | null | undefined;
  };
  pricing: VehiclePricing;
  sourceName?: string | null | undefined;
};

export type Brand = {
  slug: string;
  nameAr: string;
  nameEn: string;
  aliases: string[];
  /** Official logo asset URL; null until a genuine asset is supplied. */
  logoSrc: string | null;
};
