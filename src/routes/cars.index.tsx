import { createFileRoute } from "@tanstack/react-router";
import { parseListingSearch } from "@/lib/inventory";
import { pageHead } from "@/lib/seo";
import { PageHeader } from "@/components/site/PageHeader";
import { VehicleListing } from "@/components/site/listing/VehicleListing";
import { DemoNotice } from "@/components/site/DemoNotice";

export const Route = createFileRoute("/cars/")({
  validateSearch: parseListingSearch,
  head: () => pageHead("كل السيارات", "تصفح كل سيارات الجالس من كوريا والسعودية واليمن مع بحث وفلاتر وترتيب حسب الأحدث والسعر والممشى."),
  component: CarsPage,
});

function CarsPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <>
      <PageHeader eyebrow="المخزون" title="كل السيارات" description="سيارات من ثلاثة أسواق في مكان واحد، بأسعار معروضة بالريال السعودي.">
        <DemoNotice className="max-w-2xl">المخزون المعروض حالياً بيانات تجريبية (Demo) وصور السيارات الأصلية ستُضاف قريباً.</DemoNotice>
      </PageHeader>
      <VehicleListing search={search} onSearchChange={(s) => navigate({ search: s })} />
    </>
  );
}
