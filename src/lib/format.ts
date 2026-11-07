import type { FuelType, Transmission, VehicleStatus, BodyType, InspectionStatus } from "./types";

const sar = new Intl.NumberFormat("ar-SA-u-nu-latn", {
  style: "currency",
  currency: "SAR",
  maximumFractionDigits: 0,
});
const num = new Intl.NumberFormat("ar-SA-u-nu-latn");

export function formatSAR(v: number | null | undefined): string {
  return v === null || v === undefined ? "السعر عند الطلب" : sar.format(v);
}
export function formatNumber(v: number): string {
  return num.format(v);
}
export function formatKm(v: number | null | undefined): string {
  return v === null || v === undefined ? "غير محدد" : `${num.format(v)} كم`;
}
export function formatDateAr(iso: string): string {
  return new Intl.DateTimeFormat("ar-SA-u-nu-latn-ca-gregory", { dateStyle: "medium" }).format(new Date(iso));
}

export const FUEL_LABEL: Record<FuelType, string> = {
  gasoline: "بنزين",
  diesel: "ديزل",
  hybrid: "هايبرد",
  electric: "كهرباء",
  gas: "غاز",
};
export const TRANSMISSION_LABEL: Record<Transmission, string> = {
  automatic: "أوتوماتيك",
  manual: "عادي",
};
export const STATUS_LABEL: Record<VehicleStatus, string> = {
  available: "متاحة",
  reserved: "محجوزة",
  sold: "تم البيع",
};
export const BODY_LABEL: Record<BodyType, string> = {
  suv: "دفع رباعي SUV",
  sedan: "سيدان",
  pickup: "بيك أب",
  van: "فان / عائلية",
};
export const INSPECTION_LABEL: Record<InspectionStatus, string> = {
  ok: "سليم",
  note: "ملاحظة",
  damage: "تلف",
  not_inspected: "غير مفحوص",
  unknown: "غير معروف",
};
