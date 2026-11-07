import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { SlidersHorizontal, X, Search, ChevronRight, ChevronLeft } from "lucide-react";
import { VEHICLES } from "@/data/vehicles";
import { BRANDS, getBrand } from "@/data/brands";
import { MARKETS, MARKET_LIST } from "@/data/markets";
import {
  filterVehicles,
  modelsForBrand,
  paginate,
  sortVehicles,
  type Fixed,
  type ListingSearch,
  type SortKey,
} from "@/lib/inventory";
import { BODY_LABEL, FUEL_LABEL, STATUS_LABEL, TRANSMISSION_LABEL, formatNumber, formatSAR } from "@/lib/format";
import type { BodyType, FuelType, MarketCode, Transmission, VehicleStatus } from "@/lib/types";
import { VehicleCard } from "../VehicleCard";
import { EmptyState } from "../EmptyState";
import { Field, NativeSelect, TextInput } from "./controls";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const SORT_LABEL: Record<SortKey, string> = {
  latest: "الأحدث إضافة",
  "price-asc": "السعر: الأقل أولاً",
  "price-desc": "السعر: الأعلى أولاً",
  "mileage-asc": "الممشى: الأقل أولاً",
};

const YEARS = Array.from(new Set(VEHICLES.map((v) => v.year).filter((y): y is number => y !== null))).sort((a, b) => b - a);
const MILEAGE_STEPS = [10000, 25000, 50000, 75000, 100000];

export type ListingProps = {
  search: ListingSearch;
  onSearchChange: (next: ListingSearch) => void;
  fixed?: Fixed;
  /** Show the search box prominently (used by /search). */
  autoFocusSearch?: boolean;
};

export function VehicleListing({ search, onSearchChange, fixed = {}, autoFocusSearch }: ListingProps) {
  const filtered = useMemo(() => sortVehicles(filterVehicles(VEHICLES, search, fixed), search.sort), [search, fixed]);
  const { items, page, totalPages, total } = paginate(filtered, search.page);
  const [open, setOpen] = useState(false);

  /** Any filter change resets pagination to page 1. */
  const update = (patch: Partial<ListingSearch>) => {
    const next: ListingSearch = { ...search, ...patch, page: undefined };
    (Object.keys(next) as (keyof ListingSearch)[]).forEach((k) => (next[k] === undefined || next[k] === "") && delete next[k]);
    onSearchChange(next);
  };

  const chips = activeChips(search, fixed);
  const clearAll = () => onSearchChange(search.sort ? { sort: search.sort } : {});

  const filters = <FiltersForm search={search} fixed={fixed} update={update} />;

  return (
    <div className="container-site py-10">
      <SearchBox value={search.q ?? ""} onCommit={(q) => update({ q: q || undefined })} autoFocus={autoFocusSearch} />

      <div className="mt-6 grid gap-8 lg:grid-cols-[17rem_1fr]">
        <aside aria-label="الفلاتر" className="hidden lg:block">
          <div className="sticky top-24 rounded-lg bg-card p-5 shadow-card">
            <h2 className="mb-4 font-display text-base font-semibold">تصفية النتائج</h2>
            {filters}
          </div>
        </aside>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground" aria-live="polite">
              <span className="font-display text-lg font-bold text-foreground">{formatNumber(total)}</span> سيارة
            </p>
            <div className="flex items-center gap-2">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="surface" className="lg:hidden">
                    <SlidersHorizontal /> الفلاتر {chips.length > 0 && <span className="ltr-iso rounded-full bg-primary px-1.5 text-xs text-primary-foreground">{chips.length}</span>}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[88vw] max-w-sm overflow-y-auto">
                  <SheetHeader className="text-start">
                    <SheetTitle className="font-display">تصفية النتائج</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">{filters}</div>
                  <Button variant="hero" className="mt-6 w-full" onClick={() => setOpen(false)}>
                    عرض {formatNumber(total)} سيارة
                  </Button>
                </SheetContent>
              </Sheet>
              <label htmlFor="sort" className="sr-only">
                ترتيب النتائج
              </label>
              <NativeSelect id="sort" value={search.sort ?? "latest"} onChange={(e) => update({ sort: e.target.value === "latest" ? undefined : (e.target.value as SortKey) })} className="w-48">
                {(Object.keys(SORT_LABEL) as SortKey[]).map((k) => (
                  <option key={k} value={k}>
                    {SORT_LABEL[k]}
                  </option>
                ))}
              </NativeSelect>
            </div>
          </div>

          {chips.length > 0 && (
            <ul className="mt-4 flex flex-wrap items-center gap-2" aria-label="الفلاتر النشطة">
              {chips.map((c) => (
                <li key={c.key}>
                  <button
                    type="button"
                    onClick={() => update(c.clear)}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-sm transition-colors hover:bg-accent"
                    aria-label={`إزالة فلتر ${c.label}`}
                  >
                    {c.label}
                    <X className="size-3.5" aria-hidden />
                  </button>
                </li>
              ))}
              <li>
                <Button variant="link" size="sm" onClick={clearAll}>
                  مسح الكل
                </Button>
              </li>
            </ul>
          )}

          <div className="mt-6">
            {items.length === 0 ? (
              <EmptyState
                title="لا توجد سيارات مطابقة"
                description="جرّب تخفيف الفلاتر أو البحث بكلمة أخرى، أو اطلب السيارة التي تبحث عنها وسنحاول توفيرها."
                action={
                  <>
                    <Button variant="hero" onClick={clearAll}>
                      مسح الفلاتر
                    </Button>
                    <Button asChild variant="surface">
                      <Link to="/cars">كل السيارات</Link>
                    </Button>
                    <Button asChild variant="ghost">
                      <Link to="/request-car">اطلب سيارة</Link>
                    </Button>
                  </>
                }
              />
            ) : (
              <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((v) => (
                  <li key={v.id}>
                    <VehicleCard vehicle={v} className="h-full" />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {totalPages > 1 && (
            <nav aria-label="التنقل بين الصفحات" className="mt-10 flex items-center justify-center gap-1">
              <Button variant="surface" size="icon" disabled={page <= 1} onClick={() => onSearchChange({ ...search, page: page - 1 === 1 ? undefined : page - 1 })} aria-label="الصفحة السابقة">
                <ChevronRight />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={p === page ? "ink" : "ghost"}
                  size="icon"
                  aria-current={p === page ? "page" : undefined}
                  aria-label={`الصفحة ${p}`}
                  onClick={() => onSearchChange({ ...search, page: p === 1 ? undefined : p })}
                >
                  <span className="ltr-iso">{p}</span>
                </Button>
              ))}
              <Button variant="surface" size="icon" disabled={page >= totalPages} onClick={() => onSearchChange({ ...search, page: page + 1 })} aria-label="الصفحة التالية">
                <ChevronLeft />
              </Button>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}

function SearchBox({ value, onCommit, autoFocus }: { value: string; onCommit: (q: string) => void; autoFocus?: boolean }) {
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);
  useEffect(() => {
    if (draft === value) return;
    const t = setTimeout(() => onCommit(draft.trim()), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        onCommit(draft.trim());
      }}
      className="relative"
    >
      <label htmlFor="q" className="sr-only">
        ابحث بالعلامة أو الموديل أو الرقم المرجعي
      </label>
      <Search className="pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
      <input
        id="q"
        type="search"
        value={draft}
        autoFocus={autoFocus}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="ابحث: تويوتا، Palisade، KR-01001…"
        className="h-14 w-full rounded-lg border border-input bg-card pe-4 ps-12 text-base shadow-card placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    </form>
  );
}

function FiltersForm({ search, fixed, update }: { search: ListingSearch; fixed: Fixed; update: (p: Partial<ListingSearch>) => void }) {
  const brand = fixed.brand ?? search.brand;
  const models = modelsForBrand(VEHICLES, brand);
  return (
    <div className="flex flex-col gap-4">
      {!fixed.market && (
        <Field label="السوق">
          {(id) => (
            <NativeSelect id={id} value={search.market ?? ""} onChange={(e) => update({ market: (e.target.value || undefined) as MarketCode | undefined })}>
              <option value="">كل الأسواق</option>
              {MARKET_LIST.map((m) => (
                <option key={m} value={m}>
                  {MARKETS[m].nameAr}
                </option>
              ))}
            </NativeSelect>
          )}
        </Field>
      )}
      {!fixed.brand && (
        <Field label="العلامة">
          {(id) => (
            <NativeSelect id={id} value={search.brand ?? ""} onChange={(e) => update({ brand: e.target.value || undefined, model: undefined })}>
              <option value="">كل العلامات</option>
              {BRANDS.map((b) => (
                <option key={b.slug} value={b.slug}>
                  {b.nameAr} — {b.nameEn}
                </option>
              ))}
            </NativeSelect>
          )}
        </Field>
      )}
      <Field label="الموديل" hint={!brand ? "اختر العلامة لتضييق قائمة الموديلات" : undefined}>
        {(id) => (
          <NativeSelect id={id} value={search.model ?? ""} onChange={(e) => update({ model: e.target.value || undefined })}>
            <option value="">كل الموديلات</option>
            {models.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </NativeSelect>
        )}
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="السنة من">
          {(id) => (
            <NativeSelect id={id} value={search.yearFrom ?? ""} onChange={(e) => update({ yearFrom: e.target.value ? Number(e.target.value) : undefined })}>
              <option value="">أي</option>
              {[...YEARS].reverse().map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </NativeSelect>
          )}
        </Field>
        <Field label="إلى">
          {(id) => (
            <NativeSelect id={id} value={search.yearTo ?? ""} onChange={(e) => update({ yearTo: e.target.value ? Number(e.target.value) : undefined })}>
              <option value="">أي</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </NativeSelect>
          )}
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <PriceInput label="السعر من (ر.س)" value={search.priceMin} onCommit={(v) => update({ priceMin: v })} />
        <PriceInput label="إلى (ر.س)" value={search.priceMax} onCommit={(v) => update({ priceMax: v })} />
      </div>
      <Field label="الممشى الأقصى">
        {(id) => (
          <NativeSelect id={id} value={search.mileageMax ?? ""} onChange={(e) => update({ mileageMax: e.target.value ? Number(e.target.value) : undefined })}>
            <option value="">أي ممشى</option>
            {MILEAGE_STEPS.map((m) => (
              <option key={m} value={m}>
                حتى {formatNumber(m)} كم
              </option>
            ))}
          </NativeSelect>
        )}
      </Field>
      <Field label="نوع الوقود">
        {(id) => (
          <NativeSelect id={id} value={search.fuel ?? ""} onChange={(e) => update({ fuel: (e.target.value || undefined) as FuelType | undefined })}>
            <option value="">الكل</option>
            {(Object.keys(FUEL_LABEL) as FuelType[]).filter((f) => VEHICLES.some((v) => v.fuelType === f)).map((f) => (
              <option key={f} value={f}>
                {FUEL_LABEL[f]}
              </option>
            ))}
          </NativeSelect>
        )}
      </Field>
      <Field label="ناقل الحركة">
        {(id) => (
          <NativeSelect id={id} value={search.transmission ?? ""} onChange={(e) => update({ transmission: (e.target.value || undefined) as Transmission | undefined })}>
            <option value="">الكل</option>
            {(Object.keys(TRANSMISSION_LABEL) as Transmission[]).map((t) => (
              <option key={t} value={t}>
                {TRANSMISSION_LABEL[t]}
              </option>
            ))}
          </NativeSelect>
        )}
      </Field>
      <Field label="نوع الهيكل">
        {(id) => (
          <NativeSelect id={id} value={search.body ?? ""} onChange={(e) => update({ body: (e.target.value || undefined) as BodyType | undefined })}>
            <option value="">الكل</option>
            {(Object.keys(BODY_LABEL) as BodyType[]).map((b) => (
              <option key={b} value={b}>
                {BODY_LABEL[b]}
              </option>
            ))}
          </NativeSelect>
        )}
      </Field>
      <Field label="حالة السيارة">
        {(id) => (
          <NativeSelect id={id} value={search.status ?? ""} onChange={(e) => update({ status: (e.target.value || undefined) as VehicleStatus | undefined })}>
            <option value="">الكل</option>
            {(Object.keys(STATUS_LABEL) as VehicleStatus[]).map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </NativeSelect>
        )}
      </Field>
    </div>
  );
}

function PriceInput({ label, value, onCommit }: { label: string; value?: number | undefined; onCommit: (v: number | undefined) => void }) {
  const [draft, setDraft] = useState(value?.toString() ?? "");
  useEffect(() => setDraft(value?.toString() ?? ""), [value]);
  const commit = () => {
    const n = Number(draft.replace(/[^\d]/g, ""));
    const next = draft.trim() && Number.isFinite(n) ? n : undefined;
    if (next !== value) onCommit(next);
  };
  return (
    <Field label={label}>
      {(id) => (
        <TextInput
          id={id}
          inputMode="numeric"
          dir="ltr"
          value={draft}
          placeholder="—"
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => e.key === "Enter" && commit()}
          className="text-start"
        />
      )}
    </Field>
  );
}

function activeChips(s: ListingSearch, fixed: Fixed) {
  const chips: { key: string; label: string; clear: Partial<ListingSearch> }[] = [];
  if (s.q) chips.push({ key: "q", label: `«${s.q}»`, clear: { q: undefined } });
  if (s.market && !fixed.market) chips.push({ key: "market", label: MARKETS[s.market].nameAr, clear: { market: undefined } });
  if (s.brand && !fixed.brand) chips.push({ key: "brand", label: getBrand(s.brand)?.nameAr ?? s.brand, clear: { brand: undefined, model: undefined } });
  if (s.model) chips.push({ key: "model", label: s.model, clear: { model: undefined } });
  if (s.yearFrom) chips.push({ key: "yf", label: `من ${s.yearFrom}`, clear: { yearFrom: undefined } });
  if (s.yearTo) chips.push({ key: "yt", label: `حتى ${s.yearTo}`, clear: { yearTo: undefined } });
  if (s.priceMin !== undefined) chips.push({ key: "pmin", label: `من ${formatSAR(s.priceMin)}`, clear: { priceMin: undefined } });
  if (s.priceMax !== undefined) chips.push({ key: "pmax", label: `حتى ${formatSAR(s.priceMax)}`, clear: { priceMax: undefined } });
  if (s.mileageMax !== undefined) chips.push({ key: "mmax", label: `حتى ${formatNumber(s.mileageMax)} كم`, clear: { mileageMax: undefined } });
  if (s.fuel) chips.push({ key: "fuel", label: FUEL_LABEL[s.fuel], clear: { fuel: undefined } });
  if (s.transmission) chips.push({ key: "tr", label: TRANSMISSION_LABEL[s.transmission], clear: { transmission: undefined } });
  if (s.body) chips.push({ key: "body", label: BODY_LABEL[s.body], clear: { body: undefined } });
  if (s.status) chips.push({ key: "status", label: STATUS_LABEL[s.status], clear: { status: undefined } });
  return chips;
}
