import type { BodyType, FuelType, MarketCode, Transmission, Vehicle, VehicleStatus } from "./types";
import { computeTotal } from "./pricing";
import { normalizeText } from "./text";
import { getBrand } from "@/data/brands";

export type SortKey = "latest" | "price-asc" | "price-desc" | "mileage-asc";

export type ListingSearch = {
  q?: string | undefined;
  market?: MarketCode | undefined;
  brand?: string | undefined;
  model?: string | undefined;
  yearFrom?: number | undefined;
  yearTo?: number | undefined;
  priceMin?: number | undefined;
  priceMax?: number | undefined;
  mileageMin?: number | undefined;
  mileageMax?: number | undefined;
  fuel?: FuelType | undefined;
  transmission?: Transmission | undefined;
  body?: BodyType | undefined;
  status?: VehicleStatus | undefined;
  sort?: SortKey | undefined;
  page?: number | undefined;
};

export const PAGE_SIZE = 9;

const MARKETS: MarketCode[] = ["KR", "SA", "YE"];
const FUELS: FuelType[] = ["gasoline", "diesel", "hybrid", "electric", "gas"];
const TRANS: Transmission[] = ["automatic", "manual"];
const BODIES: BodyType[] = ["suv", "sedan", "pickup", "van"];
const STATUSES: VehicleStatus[] = ["available", "reserved", "sold"];
const SORTS: SortKey[] = ["latest", "price-asc", "price-desc", "mileage-asc"];

function str(v: unknown): string | undefined {
  if (typeof v === "string" && v.trim()) return v.trim().slice(0, 80);
  if (typeof v === "number") return String(v);
  return undefined;
}
function int(v: unknown): number | undefined {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : undefined;
}
function oneOf<T extends string>(v: unknown, list: readonly T[]): T | undefined {
  return typeof v === "string" && (list as readonly string[]).includes(v) ? (v as T) : undefined;
}

/** Search-param validator shared by every listing route. All keys optional. */
export function parseListingSearch(raw: Record<string, unknown>): ListingSearch {
  const out: ListingSearch = {
    q: str(raw.q),
    market: oneOf(raw.market, MARKETS),
    brand: str(raw.brand),
    model: str(raw.model),
    yearFrom: int(raw.yearFrom),
    yearTo: int(raw.yearTo),
    priceMin: int(raw.priceMin),
    priceMax: int(raw.priceMax),
    mileageMin: int(raw.mileageMin),
    mileageMax: int(raw.mileageMax),
    fuel: oneOf(raw.fuel, FUELS),
    transmission: oneOf(raw.transmission, TRANS),
    body: oneOf(raw.body, BODIES),
    status: oneOf(raw.status, STATUSES),
    sort: oneOf(raw.sort, SORTS),
    page: int(raw.page),
  };
  if (out.page !== undefined && out.page < 1) out.page = undefined;
  (Object.keys(out) as (keyof ListingSearch)[]).forEach((k) => out[k] === undefined && delete out[k]);
  return out;
}

export function vehiclePrice(v: Vehicle): number | null {
  return computeTotal(v.pricing).totalSAR;
}

export function matchesQuery(v: Vehicle, q: string): boolean {
  const needle = normalizeText(q);
  if (!needle) return true;
  const brand = getBrand(v.brandSlug);
  const haystack = normalizeText(
    [
      v.brandAr,
      v.brandEn,
      v.modelAr,
      v.modelEn,
      v.referenceCode,
      `${v.brandEn} ${v.modelEn}`,
      `${v.brandAr} ${v.modelAr}`,
      ...(brand?.aliases ?? []),
      v.year ? String(v.year) : "",
    ].join(" | "),
  );
  return needle.split(" ").every((token) => haystack.includes(token));
}

export type Fixed = { market?: MarketCode | undefined; brand?: string | undefined };

export function filterVehicles(list: Vehicle[], s: ListingSearch, fixed: Fixed = {}): Vehicle[] {
  const market = fixed.market ?? s.market;
  const brand = fixed.brand ?? s.brand;
  return list.filter((v) => {
    if (market && v.market !== market) return false;
    if (brand && v.brandSlug !== brand) return false;
    if (s.model && v.modelEn !== s.model) return false;
    if (s.q && !matchesQuery(v, s.q)) return false;
    if (s.yearFrom !== undefined && (v.year === null || v.year < s.yearFrom)) return false;
    if (s.yearTo !== undefined && (v.year === null || v.year > s.yearTo)) return false;
    const price = vehiclePrice(v);
    if (s.priceMin !== undefined && (price === null || price < s.priceMin)) return false;
    if (s.priceMax !== undefined && (price === null || price > s.priceMax)) return false;
    if (s.mileageMin !== undefined && (v.mileageKm === null || v.mileageKm < s.mileageMin)) return false;
    if (s.mileageMax !== undefined && (v.mileageKm === null || v.mileageKm > s.mileageMax)) return false;
    if (s.fuel && v.fuelType !== s.fuel) return false;
    if (s.transmission && v.transmission !== s.transmission) return false;
    if (s.body && v.bodyType !== s.body) return false;
    if (s.status && v.status !== s.status) return false;
    return true;
  });
}

/** Null values always sort last, whatever the direction. */
function nullsLast(a: number | null, b: number | null, dir: 1 | -1): number {
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return (a - b) * dir;
}

export function sortVehicles(list: Vehicle[], sort: SortKey = "latest"): Vehicle[] {
  const copy = [...list];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => nullsLast(vehiclePrice(a), vehiclePrice(b), 1));
    case "price-desc":
      return copy.sort((a, b) => nullsLast(vehiclePrice(a), vehiclePrice(b), -1));
    case "mileage-asc":
      return copy.sort((a, b) => nullsLast(a.mileageKm, b.mileageKm, 1));
    case "latest":
    default:
      return copy.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  }
}

export function paginate<T>(list: T[], page = 1, size = PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(list.length / size));
  const current = Math.min(Math.max(1, page), totalPages);
  return {
    items: list.slice((current - 1) * size, current * size),
    page: current,
    totalPages,
    total: list.length,
  };
}

export function latestArrivals(list: Vehicle[], count = 6): Vehicle[] {
  return sortVehicles(list, "latest").slice(0, count);
}

export function modelsForBrand(list: Vehicle[], brand?: string): { value: string; label: string }[] {
  const seen = new Map<string, string>();
  list.filter((v) => !brand || v.brandSlug === brand).forEach((v) => seen.set(v.modelEn, `${v.modelAr} · ${v.modelEn}`));
  return [...seen.entries()].map(([value, label]) => ({ value, label }));
}

export function canBook(v: Vehicle): boolean {
  return v.status === "available";
}

export function similarVehicles(list: Vehicle[], v: Vehicle, count = 3): Vehicle[] {
  const price = vehiclePrice(v);
  const score = (o: Vehicle) =>
    (o.brandSlug === v.brandSlug ? 3 : 0) +
    (o.bodyType === v.bodyType ? 2 : 0) +
    (price && vehiclePrice(o) && Math.abs((vehiclePrice(o) ?? 0) - price) / price < 0.3 ? 1 : 0);
  return list
    .filter((o) => o.id !== v.id)
    .map((o) => ({ o, s: score(o) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || Date.parse(b.o.createdAt) - Date.parse(a.o.createdAt))
    .slice(0, count)
    .map((x) => x.o);
}
