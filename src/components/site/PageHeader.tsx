import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

export function PageHeader({
  eyebrow,
  title,
  description,
  crumbs = [],
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  crumbs?: { label: string }[];
  children?: ReactNode;
}) {
  return (
    <section className="border-b bg-card/60 pb-10 pt-28 md:pb-14 md:pt-36">
      <div className="container-site">
        <nav aria-label="مسار التنقل" className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            الرئيسية
          </Link>
          {crumbs.map((c) => (
            <span key={c.label} className="flex items-center gap-1">
              <ChevronLeft className="size-3.5" aria-hidden />
              <span>{c.label}</span>
            </span>
          ))}
          <ChevronLeft className="size-3.5" aria-hidden />
          <span aria-current="page" className="text-foreground">
            {title}
          </span>
        </nav>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="max-w-3xl text-3xl font-bold leading-tight md:text-5xl">{title}</h1>
        {description && <div className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">{description}</div>}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}
