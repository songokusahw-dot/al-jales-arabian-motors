export type MarketCode = "KR" | "SA" | "YE";
export type VehicleStatus = "available" | "reserved" | "sold";
export type FuelType = "gasoline" | "diesel" | "hybrid" | "electric" | "gas";
export type Transmission = "automatic" | "manual";
export type BodyType = "suv" | "sedan" | "pickup" | "van";

export type VehicleImage = {
  src: string | null;
  altAr: string;
  sourceName?: string;
  sourceUrl?: string;
  licenseNote?: string;
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
  sourcePriceKRW?: number | null;
  items: PriceBreakdownItem[];
  isDemo: boolean;
  noteAr?: string;
};

export type InspectionStatus = "ok" | "note" | "damage" | "not_inspected" | "unknown";

export type InspectionFinding = {
  area: string;
  status: InspectionStatus;
  noteAr?: string;
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
  bodyType?: BodyType | null;
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
  /** Keys into FEATURE_CATALOG */
  features: string[];
  inspection?: {
    reportAvailable: boolean;
    isDemo: boolean;
    inspectionDate?: string | null;
    sourceName?: string | null;
    findings: InspectionFinding[];
    reportDocumentUrl?: string | null;
  };
  pricing: VehiclePricing;
  sourceName?: string | null;
};

export type Brand = {
  slug: string;
  nameAr: string;
  nameEn: string;
  aliases: string[];
  /** Official logo asset URL; null until a genuine asset is supplied. */
  logoSrc: string | null;
};
