import type { PriceBreakdownItem, VehiclePricing } from "./types";

/** Demo-only conversion input. Not a live exchange rate. */
export const DEMO_KRW_TO_SAR = 0.00275;

export function krwToSarDemo(krw: number): number {
  return Math.round(krw * DEMO_KRW_TO_SAR * 100) / 100;
}

export type PriceTotal = {
  /** Sum of verified + demo items; null when no item has a known amount. */
  totalSAR: number | null;
  /** True when every item has a known amount. */
  complete: boolean;
  unknownItems: PriceBreakdownItem[];
};

/** Single source of truth for the customer-facing price. Unknown/null items never enter the sum. */
export function computeTotal(pricing: VehiclePricing): PriceTotal {
  const known = pricing.items.filter(
    (i) => i.amountSAR !== null && (i.source === "verified" || i.source === "demo"),
  );
  const unknownItems = pricing.items.filter((i) => !known.includes(i));
  const totalSAR = known.length
    ? Math.round(known.reduce((sum, i) => sum + (i.amountSAR ?? 0), 0) * 100) / 100
    : null;
  return { totalSAR, complete: unknownItems.length === 0 && known.length > 0, unknownItems };
}
