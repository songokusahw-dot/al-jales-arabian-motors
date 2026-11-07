import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { VehicleImage } from "@/components/site/VehicleImage";

const real = { src: "/x.jpg", altAr: "صورة", isPlaceholder: false, width: 1600, height: 1000 };

describe("VehicleImage", () => {
  it("renders the real photo with its intrinsic size and no fake srcset", () => {
    const { container } = render(<VehicleImage image={real} />);
    const img = container.querySelector("img")!;
    expect(img.getAttribute("width")).toBe("1600");
    expect(img.hasAttribute("srcset")).toBe(false);
  });
  it("falls back to the honest placeholder when the photo fails to load", () => {
    const { container } = render(<VehicleImage image={real} />);
    fireEvent.error(container.querySelector("img")!);
    expect(container.querySelector("img")).toBeNull();
    expect(screen.getByText("صورة السيارة الأصلية قريباً")).toBeTruthy();
  });
  it("labels illustrative photos as not the listed vehicle", () => {
    render(<VehicleImage image={{ ...real, isIllustrative: true }} />);
    expect(screen.getByText(/ليست السيارة المعروضة/)).toBeTruthy();
  });
  it("shows the placeholder when no source exists", () => {
    render(<VehicleImage image={{ src: null, altAr: "x", isPlaceholder: true }} />);
    expect(screen.getByRole("img", { name: "x" })).toBeTruthy();
  });
});
