import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { FOOTER_NAV, LEGAL_NAV } from "./nav";
import { SocialIcons } from "./SocialIcons";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-ink text-ink-foreground">
      <div className="container-site grid gap-12 py-16 md:grid-cols-[1.3fr_repeat(3,1fr)]">
        <div className="flex flex-col gap-5">
          <Logo inverted />
          <p className="max-w-xs text-sm leading-relaxed text-ink-foreground/75">
            تجربة عربية لاختيار السيارات من كوريا ومعرضي السعودية واليمن، بأسعار معروضة بالريال السعودي.
          </p>
          <SocialIcons />
        </div>
        {FOOTER_NAV.map((group) => (
          <div key={group.title}>
            <h2 className="mb-4 font-display text-sm font-semibold text-ink-foreground">{group.title}</h2>
            <ul className="flex flex-col gap-2.5 text-sm">
              {group.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-ink-foreground/70 transition-colors hover:text-ink-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-ink-foreground/15">
        <div className="container-site flex flex-col gap-4 py-6 text-xs text-ink-foreground/65 md:flex-row md:items-center md:justify-between">
          <p>
            © <span className="ltr-iso">2026</span> الجالس للسيارات — نسخة تجريبية؛ البيانات المعروضة توضيحية.
          </p>
          <ul className="flex flex-wrap gap-4">
            {LEGAL_NAV.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-ink-foreground">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
