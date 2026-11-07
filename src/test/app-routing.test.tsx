import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

const ROUTES = [
  "/", "/cars", "/cars/korea", "/cars/saudi", "/cars/yemen", "/car/some-slug", "/search", "/brands/kia",
  "/korea/showrooms", "/korea/auctions", "/our-showrooms", "/request-car", "/about", "/reviews", "/faq",
  "/ask-question", "/contact", "/locations", "/privacy", "/terms", "/cookies",
];

// Match routes without running loaders or rendering.
describe("App routing", () => {
  const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
  it.each(ROUTES)("matches a page for %s", (path) => {
    const matches = router.matchRoutes(path);
    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("market pages do not collide with the vehicle detail route", () => {
    expect(router.matchRoutes("/cars/korea").at(-1)?.routeId).toBe("/cars/korea");
    expect(router.matchRoutes("/car/abc").at(-1)?.routeId).toBe("/car/$slug");
  });
});
