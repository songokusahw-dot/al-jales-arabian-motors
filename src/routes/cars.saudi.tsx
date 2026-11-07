import { createFileRoute } from "@tanstack/react-router";
import { parseListingSearch } from "@/lib/inventory";
import { pageHead } from "@/lib/seo";
import { MarketListingPage } from "@/components/site/listing/MarketListingPage";

export const Route = createFileRoute("/cars/saudi")({
  validateSearch: parseListingSearch,
  head: () => pageHead("سيارات معرض السعودية", "سيارات متوفرة في معرض الجالس بالمملكة العربية السعودية، بأسعار بالريال السعودي."),
  component: Page,
});

function Page() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  return <MarketListingPage market="SA" search={search} onSearchChange={(s) => navigate({ search: s })} />;
}
