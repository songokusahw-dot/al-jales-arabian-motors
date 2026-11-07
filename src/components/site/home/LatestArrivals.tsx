import { Link } from "@tanstack/react-router";
import { VEHICLES } from "@/data/vehicles";
import { latestArrivals } from "@/lib/inventory";
import { VehicleCard } from "@/components/site/VehicleCard";
import { SectionHead } from "./SectionHead";

export function LatestArrivals() {
  const latest = latestArrivals(VEHICLES, 6);
  return (
      <section className="container-site py-20">
        <SectionHead eyebrow="أضيفت حديثاً" title="أحدث السيارات" action={<Link to="/cars" search={{ sort: "latest" }}>عرض كل السيارات</Link>} />
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((v) => (
            <li key={v.id}>
              <VehicleCard vehicle={v} className="h-full" />
            </li>
          ))}
        </ul>
      </section>
  );
}
