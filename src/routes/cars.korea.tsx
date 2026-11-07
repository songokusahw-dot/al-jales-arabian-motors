import { createFileRoute } from "@tanstack/react-router";
import { parseListingSearch } from "@/lib/inventory";
import { pageHead } from "@/lib/seo";
import { MarketListingPage } from "@/components/site/listing/MarketListingPage";

export const Route = createFileRoute("/cars/korea")({
  validateSearch: parseListingSearch,
  head: () => pageHead("سيارات من كوريا", "سيارات مختارة من السوق الكوري بأسعار تقديرية بالريال السعودي، مع شرح شفاف لبنود التكلفة."),
  component: Page,
});

function Page() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  return <MarketListingPage market="KR" search={search} onSearchChange={(s) => navigate({ search: s })} />;
}
