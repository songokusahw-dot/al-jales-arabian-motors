import { describe, expect, it } from "vitest";
import { VEHICLES } from "@/data/vehicles";
import { computeTotal, DEMO_KRW_TO_SAR, krwToSarDemo } from "@/lib/pricing";
import { canBook, filterVehicles, latestArrivals, paginate, parseListingSearch, sortVehicles } from "@/lib/inventory";

describe("pricing rules", () => {
  it("uses the demo rate of 0.00275 SAR per KRW", () => {
    expect(DEMO_KRW_TO_SAR).toBe(0.00275);
    expect(krwToSarDemo(42_000_000)).toBe(115_500);
  });

  it("excludes unknown/null items from the total and marks it incomplete", () => {
    const t = computeTotal({
      saleCurrency: "SAR",
      isDemo: true,
      items: [
        { key: "a", labelAr: "a", amountSAR: 1000, source: "demo" },
        { key: "b", labelAr: "b", amountSAR: null, source: "unknown" },
        { key: "c", labelAr: "c", amountSAR: 500, source: "verified" },
      ],
    });
    expect(t.totalSAR).toBe(1500);
    expect(t.complete).toBe(false);
    expect(t.unknownItems.map((i) => i.key)).toEqual(["b"]);
  });

  it("Korean vehicles total only the converted source price", () => {
    const kr = VEHICLES.find((v) => v.referenceCode === "KR-01001")!;
    expect(computeTotal(kr.pricing).totalSAR).toBe(115_500);
  });
});

describe("inventory rules", () => {
  it("reference codes follow MARKET-01NNN and are unique; slugs unique", () => {
    const codes = VEHICLES.map((v) => v.referenceCode);
    expect(new Set(codes).size).toBe(codes.length);
    expect(new Set(VEHICLES.map((v) => v.slug)).size).toBe(VEHICLES.length);
    VEHICLES.forEach((v) => expect(v.referenceCode).toMatch(new RegExp(`^${v.market}-01\\d{3}$`)));
  });

  it("has 6 demo vehicles per market", () => {
    (["KR", "SA", "YE"] as const).forEach((m) => expect(VEHICLES.filter((v) => v.market === m)).toHaveLength(6));
  });

  it("latest arrivals sort by createdAt descending, not by year", () => {
    const latest = latestArrivals(VEHICLES, 18);
    for (let i = 1; i < latest.length; i++) {
      expect(Date.parse(latest[i - 1]!.createdAt)).toBeGreaterThanOrEqual(Date.parse(latest[i]!.createdAt));
    }
    expect(latest[0]!.referenceCode).toBe("SA-01006");
  });

  it("sold and reserved vehicles cannot be booked", () => {
    expect(canBook({ ...VEHICLES[0]!, status: "sold" })).toBe(false);
    expect(canBook({ ...VEHICLES[0]!, status: "reserved" })).toBe(false);
    expect(canBook({ ...VEHICLES[0]!, status: "available" })).toBe(true);
  });

  it("totalPages is the number of pages, not the number of cars", () => {
    const p = paginate(Array.from({ length: 19 }), 1, 9);
    expect(p.totalPages).toBe(3);
    expect(p.total).toBe(19);
  });

  it("search matches Arabic, English, aliases and reference codes", () => {
    expect(filterVehicles(VEHICLES, { q: "باليسيد" }).map((v) => v.referenceCode)).toEqual(["KR-01001"]);
    expect(filterVehicles(VEHICLES, { q: "palisade" }).map((v) => v.referenceCode)).toEqual(["KR-01001"]);
    expect(filterVehicles(VEHICLES, { q: "kr-01003" }).map((v) => v.referenceCode)).toEqual(["KR-01003"]);
    expect(filterVehicles(VEHICLES, { q: "مرسيدس" }).map((v) => v.referenceCode)).toEqual(["SA-01003"]);
  });

  it("a fixed market cannot be overridden by the URL market param", () => {
    const res = filterVehicles(VEHICLES, { market: "SA" }, { market: "KR" });
    expect(res.every((v) => v.market === "KR")).toBe(true);
    expect(res).toHaveLength(6);
  });

  it("price sort puts the cheapest first", () => {
    const sorted = sortVehicles(VEHICLES, "price-asc");
    expect(sorted[0]!.referenceCode).toBe("YE-01003");
  });

  it("parses and drops invalid search params", () => {
    expect(parseListingSearch({ market: "XX", page: "0", priceMax: "50000", fuel: "hybrid" })).toEqual({ priceMax: 50000, fuel: "hybrid" });
  });
});
