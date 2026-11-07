import { createFileRoute, notFound } from "@tanstack/react-router";
import { parseListingSearch } from "@/lib/inventory";
import { pageHead } from "@/lib/seo";
import { getBrand } from "@/data/brands";
import { PageHeader } from "@/components/site/PageHeader";
import { VehicleListing } from "@/components/site/listing/VehicleListing";

export const Route = createFileRoute("/brands/$brandSlug")({
  validateSearch: parseListingSearch,
  loader: ({ params }) => {
    const brand = getBrand(params.brandSlug);
    if (!brand) throw notFound();
    return { brand };
  },
  head: ({ loaderData }) =>
    loaderData
      ? pageHead(`سيارات ${loaderData.brand.nameAr}`, `تصفح سيارات ${loaderData.brand.nameAr} (${loaderData.brand.nameEn}) المتوفرة لدى الجالس في كوريا والسعودية واليمن.`)
      : pageHead("العلامة غير متوفرة", "العلامة المطلوبة غير موجودة.", { noindex: true }),
  component: BrandPage,
});

function BrandPage() {
  const { brand } = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <>
      <PageHeader eyebrow={brand.nameEn} title={`سيارات ${brand.nameAr}`} crumbs={[{ label: "العلامات" }]} />
      <VehicleListing search={search} onSearchChange={(s) => navigate({ search: s })} fixed={{ brand: brand.slug }} />
    </>
  );
}
