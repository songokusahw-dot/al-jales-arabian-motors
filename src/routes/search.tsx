import { createFileRoute } from "@tanstack/react-router";
import { parseListingSearch } from "@/lib/inventory";
import { pageHead } from "@/lib/seo";
import { PageHeader } from "@/components/site/PageHeader";
import { VehicleListing } from "@/components/site/listing/VehicleListing";

export const Route = createFileRoute("/search")({
  validateSearch: parseListingSearch,
  head: () => pageHead("البحث عن سيارة", "ابحث بالعربية أو الإنجليزية أو بالرقم المرجعي عن سيارات الجالس في كوريا والسعودية واليمن."),
  component: SearchPage,
});

function SearchPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <>
      <PageHeader eyebrow="بحث شامل" title="البحث عن سيارة" description="ابحث بالعلامة أو الموديل بالعربية أو الإنجليزية، أو بالرقم المرجعي مثل KR-01001." />
      <VehicleListing search={search} onSearchChange={(s) => navigate({ search: s })} autoFocusSearch />
    </>
  );
}
