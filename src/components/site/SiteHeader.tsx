import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { MAIN_NAV, FOOTER_NAV } from "./nav";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const solid = scrolled || pathname !== "/";

  return (
    <header
      data-scrolled={scrolled ? "" : undefined}
      className={cn(
        "fixed inset-x-0 top-0 z-40 border-b transition-[background-color,box-shadow,border-color,backdrop-filter] duration-300 ease-out",
        solid ? "border-border/80 bg-background/85 shadow-card backdrop-blur-md" : "border-transparent bg-transparent",
      )}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-card focus:px-3 focus:py-2">
        تخطَّ إلى المحتوى
      </a>
      <div
        className={cn(
          "container-site flex h-14 items-center justify-between gap-4 transition-[height] duration-300 ease-out",
          scrolled ? "md:h-14" : "md:h-16",
        )}
      >
        <Logo />

        <nav aria-label="القائمة الرئيسية" className="hidden items-center gap-0.5 lg:flex">
          {MAIN_NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="relative rounded-md px-3 py-2 text-[0.8125rem] font-medium text-foreground/75 transition-colors after:absolute after:inset-x-3 after:bottom-0.5 after:h-0.5 after:origin-center after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:text-foreground hover:after:scale-x-50 data-[status=active]:text-foreground data-[status=active]:after:scale-x-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-0.5">
          <Button asChild variant="ghost" size="icon" aria-label="البحث عن سيارة">
            <Link to="/search">
              <Search />
            </Link>
          </Button>
          <ThemeToggle />
          <Button asChild variant="hero" size="sm" className="ms-2 hidden h-9 px-4 text-sm md:inline-flex">
            <Link to="/request-car">اطلب سيارة</Link>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}>
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-sm overflow-y-auto">
              <SheetHeader className="text-start">
                <SheetTitle className="font-display">القائمة</SheetTitle>
              </SheetHeader>
              <nav aria-label="قائمة الهاتف" className="mt-6 flex flex-col gap-6">
                <div className="flex flex-col">
                  {MAIN_NAV.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="flex items-center justify-between border-b py-3 font-display text-lg font-semibold transition-colors hover:text-accent-text data-[status=active]:text-accent-text"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
                {FOOTER_NAV.slice(0, 1).map((group) => (
                  <div key={group.title}>
                    <p className="eyebrow mb-2">{group.title}</p>
                    <div className="flex flex-col gap-2">
                      {group.links.map((l) => (
                        <Link key={l.to} to={l.to} className="py-1 text-muted-foreground hover:text-foreground data-[status=active]:text-foreground">
                          {l.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
                <Button asChild variant="hero" size="lg">
                  <Link to="/request-car">اطلب سيارة</Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
