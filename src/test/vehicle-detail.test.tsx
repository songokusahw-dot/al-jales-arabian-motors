import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { VEHICLES } from "@/data/vehicles";
import { computeTotal, krwToSarDemo } from "@/lib/pricing";
import { primarySpecs, specGroups } from "@/lib/vehicle-specs";
import { VehicleImage } from "@/components/site/VehicleImage";
import type { Vehicle } from "@/lib/types";

const byRef = (ref: string) => VEHICLES.find((v) => v.referenceCode === ref)!;

describe("Vehicle specs only show recorded fields", () => {
  it("drops fields that are null instead of inventing them", () => {
    const bare: Vehicle = { ...byRef("SA-01003"), engineCapacityCc: null, drivetrain: null, interiorColor: null, exteriorColor: null };
    const keys = specGroups(bare).flatMap((g) => g.items.map((i) => i.key));
    expect(keys).not.toContain("engine");
    expect(keys).not.toContain("drivetrain");
    expect(specGroups(bare).some((g) => g.key === "colors")).toBe(false);
    expect(primarySpecs(bare).map((s) => s.key)).toEqual(["year", "mileage", "fuel", "transmission"]);
  });
  it("puts year, mileage, fuel, transmission and engine in the specs bar when present", () => {
    expect(primarySpecs(byRef("KR-01003")).map((s) => s.key)).toEqual(["year", "mileage", "fuel", "transmission", "engine"]);
  });
});

describe("Displayed prices per market are unchanged", () => {
  it("KR-01003 is an incomplete estimate built only from the demo source price", () => {
    const t = computeTotal(byRef("KR-01003").pricing);
    expect(t.totalSAR).toBe(krwToSarDemo(58_000_000));
    expect(t.totalSAR).toBe(159_500);
    expect(t.complete).toBe(false);
  });
  it("SA-01002 shows its showroom sale price of 395,000 SAR", () => {
    const t = computeTotal(byRef("SA-01002").pricing);
    expect(t.totalSAR).toBe(395_000);
    expect(t.complete).toBe(true);
  });
  it("YE-01006 shows its showroom sale price of 92,000 SAR", () => {
    expect(computeTotal(byRef("YE-01006").pricing).totalSAR).toBe(92_000);
  });
  it("every market displays SAR", () => {
    expect(VEHICLES.every((v) => v.pricing.saleCurrency === "SAR")).toBe(true);
  });
});

describe("VehicleImage thumbnail label", () => {
  it("marks an illustrative thumbnail with a short label", () => {
    render(<VehicleImage image={{ src: "/x.jpg", altAr: "x", isPlaceholder: false, isIllustrative: true }} compact />);
    expect(screen.getByText("توضيحية")).toBeTruthy();
  });
  it("still falls back after an error in compact mode", () => {
    const { container } = render(<VehicleImage image={{ src: "/x.jpg", altAr: "x", isPlaceholder: false }} compact />);
    fireEvent.error(container.querySelector("img")!);
    expect(screen.getByRole("img", { name: "x" })).toBeTruthy();
  });
});
