<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project architecture (AL-JALES AUTOMOTIVE)

- Arabic-first RTL: `<html lang="ar" dir="rtl">` in `src/routes/__root.tsx`; use logical properties (`ps/pe/start/end`) and `ltr-iso`/`<bdi>` for codes, prices and model names — physical left/right breaks RTL.
- Frontend prototype: inventory, brands, markets and FAQ are typed local modules in `src/data/`; contact values live only in `src/config/site.ts` and stay `null` until supplied — no backend was requested for this version.
- Inventory logic (search normalization, filters, sort, pagination, similar cars) lives in `src/lib/inventory.ts`; pricing totals only via `computeTotal()` in `src/lib/pricing.ts` — one source of truth for prices.
- All listing pages (`/cars`, `/cars/{korea,saudi,yemen}`, `/search`, `/brands/$brandSlug`) render the shared `VehicleListing` with `parseListingSearch` as `validateSearch`; market pages use `MarketListingPage` — avoids three diverging listing implementations.
- Filter state lives in URL search params (all keys optional); any filter change resets `page` — shareable links and working back/forward.
- Motion ownership: GSAP/ScrollTrigger only in `ImportJourney` (scroll scene, via `useGSAP` + `matchMedia` for reduced motion); Embla + Auto Scroll only for the brand marquee and gallery slider; CSS for everything else — prevents two engines animating one element.
- Theme: `.dark` class on `<html>`, persisted in localStorage and applied by an inline head script before paint — avoids flash and hydration mismatch.
- Forms are local-only demos (`src/lib/local-store.ts`) and must show the "not sent to the company" notice.
- Kit reference docs (routes, tokens, data model, QA matrix, phase prompts) are in `docs/al-jales-kit/`.

## AL-JALES kit rules (from the user's prompt kit)

- Inspect existing files, package.json and lockfile before editing; never scaffold over the project or migrate frameworks as part of a UI task.
- Light default + working persistent Dark theme; no Obsidian/Champagne/gold/bronze/beige direction; normal text contrast ≥ 4.5:1.
- Logical URLs: `/`, `/cars`, `/cars/korea`, `/cars/saudi`, `/cars/yemen`, `/car/:slug`, `/search`, `/brands/:brandSlug`, `/korea/showrooms`, `/korea/auctions`, `/our-showrooms`, `/request-car`, `/about`, `/reviews`, `/faq`, `/ask-question`, `/contact`, `/locations`, `/privacy`, `/terms`, `/cookies`, plus a 404.
- Never animate the same element's transform with two engines; clean up GSAP contexts, listeners and Embla instances; no scroll hijacking; support reduced motion; guard browser APIs for SSR.
- Reference codes `KR-01001` / `SA-01001` / `YE-01001`, unique per vehicle; demo data marked Demo; latest arrivals sort by `createdAt` desc.
- SAR is the display currency; `0.00275 SAR/KRW` is demo-only; unknown price items, inspection findings, partners, contact details stay null and are never invented.
- Vehicle states `available` / `reserved` / `sold`; sold vehicles cannot be booked.
- Never generate vehicle photos; use real/licensed images of the exact vehicle or an honest placeholder. Abstract non-vehicle atmosphere images are allowed.
- No fake phone/WhatsApp/email/address/coordinates/social accounts; social icons render only with a real URL. No analytics or pixels without authorization. Legal pages are drafts.
- After each phase: list changed files/routes, dependencies, checks run and results, and remaining placeholders. Test 1440/1024/768/390/360 px, Light/Dark, RTL, keyboard, reduced motion.
- Homepage sections live in `src/components/site/home/` (one component per section); `routes/index.tsx` only composes them — keeps redesign phases isolated. THE CUT tokens (`--cut-angle`, `--cut-depth`, `surface-stage`, `text-display-xl`, `cut-edge*`) are used selectively, never on every card/button.
