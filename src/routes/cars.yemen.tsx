import { createFileRoute } from "@tanstack/react-router";
import { parseListingSearch } from "@/lib/inventory";
import { pageHead } from "@/lib/seo";
import { MarketListingPage } from "@/components/site/listing/MarketListingPage";

export const Route = createFileRoute("/cars/yemen")({
  validateSearch: parseListingSearch,
  head: () => pageHead("سيارات معرض اليمن", "سيارات معروضة في معرض الجالس باليمن، بأسعار بالريال السعودي كعملة عرض موحدة."),
  component: Page,
});

function Page() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  return <MarketListingPage market="YE" search={search} onSearchChange={(s) => navigate({ search: s })} />;
}
