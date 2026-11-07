import type { Vehicle } from "./types";
import { BODY_LABEL, FUEL_LABEL, TRANSMISSION_LABEL, formatKm, formatNumber } from "./format";

export type SpecKey =
  | "year" | "mileage" | "fuel" | "transmission" | "engine" | "power"
  | "drivetrain" | "body" | "doors" | "seats" | "exterior" | "interior";

export type SpecItem = { key: SpecKey; label: string; value: string; ltr?: boolean | undefined };
export type SpecGroup = { key: string; title: string; items: SpecItem[] };

function item(key: SpecKey, label: string, value: string | null | undefined, ltr = false): SpecItem | null {
  return value ? { key, label, value, ltr } : null;
}
const present = (list: (SpecItem | null)[]) => list.filter((i): i is SpecItem => i !== null);

const year = (v: Vehicle) => item("year", "سنة الصنع", v.year ? String(v.year) : null, true);
const mileage = (v: Vehicle) => item("mileage", "الممشى", v.mileageKm !== null ? formatKm(v.mileageKm) : null);
const fuel = (v: Vehicle) => item("fuel", "الوقود", v.fuelType ? FUEL_LABEL[v.fuelType] : null);
const transmission = (v: Vehicle) => item("transmission", "ناقل الحركة", v.transmission ? TRANSMISSION_LABEL[v.transmission] : null);
const engine = (v: Vehicle) => item("engine", "سعة المحرك", v.engineCapacityCc ? `${formatNumber(v.engineCapacityCc)} سي سي` : null);

/** Essential facts for the specs bar. Only fields that exist on the record — nothing is inferred. */
export function primarySpecs(v: Vehicle): SpecItem[] {
  return present([year(v), mileage(v), fuel(v), transmission(v), engine(v)]);
}

/** Detailed specifications, grouped. Empty groups are dropped; no dimensions exist in the data model. */
export function specGroups(v: Vehicle): SpecGroup[] {
  const groups: SpecGroup[] = [
    {
      key: "engine",
      title: "المحرك والأداء",
      items: present([engine(v), item("power", "القوة", v.horsepower ? `${formatNumber(v.horsepower)} حصان` : null), fuel(v)]),
    },
    {
      key: "drive",
      title: "ناقل الحركة والدفع",
      items: present([transmission(v), item("drivetrain", "نظام الدفع", v.drivetrain ?? null)]),
    },
    {
      key: "body",
      title: "الهيكل والمقصورة",
      items: present([
        item("body", "نوع الهيكل", v.bodyType ? BODY_LABEL[v.bodyType] : null),
        item("doors", "الأبواب", v.doors ? String(v.doors) : null, true),
        item("seats", "المقاعد", v.seats ? String(v.seats) : null, true),
      ]),
    },
    {
      key: "colors",
      title: "الألوان",
      items: present([item("exterior", "اللون الخارجي", v.exteriorColor ?? null), item("interior", "اللون الداخلي", v.interiorColor ?? null)]),
    },
    { key: "usage", title: "الاستخدام", items: present([year(v), mileage(v)]) },
  ];
  return groups.filter((g) => g.items.length > 0);
}
