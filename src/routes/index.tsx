import { createFileRoute, Link } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { BrandMarquee } from "@/components/site/BrandMarquee";
import { ImportJourney } from "@/components/site/ImportJourney";
import { HomeHero } from "@/components/site/home/HomeHero";
import { LatestArrivals } from "@/components/site/home/LatestArrivals";
import { MarketsOverview } from "@/components/site/home/MarketsOverview";
import { FeaturedVehicle } from "@/components/site/home/FeaturedVehicle";
import { PricingExplainer } from "@/components/site/home/PricingExplainer";
import { HomeClosing } from "@/components/site/home/HomeClosing";
import { SectionHead } from "@/components/site/home/SectionHead";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead(
      "سيارات من كوريا والسعودية واليمن",
      "الجالس للسيارات: اختر سيارتك من مصادر كوريا أو معرضي السعودية واليمن، بأسعار واضحة بالريال السعودي ورحلة استيراد شفافة.",
    ),
  component: HomePage,
});


function HomePage() {
  return (
    <>
      <HomeHero />
      <BrandMarquee />
      <LatestArrivals />
      <MarketsOverview />
      <FeaturedVehicle />
      {/* JOURNEY */}
      <section className="container-site py-20">
        <SectionHead eyebrow="من كوريا إليك" title="رحلة الاستيراد بخمس مراحل" action={<Link to="/cars/korea">سيارات كوريا</Link>} />
        <div className="mt-10">
          <ImportJourney />
        </div>
      </section>
      <PricingExplainer />
      <HomeClosing />
    </>
  );
}
