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
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow,border-color] duration-300",
        solid ? "border-b bg-background/90 shadow-card backdrop-blur-md" : "border-b border-transparent bg-transparent",
      )}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-3 focus:rounded-md focus:bg-card focus:px-3 focus:py-2">
        تخطَّ إلى المحتوى
      </a>
      <div className="container-site flex h-16 items-center justify-between gap-4 md:h-20">
        <Logo />

        <nav aria-label="القائمة الرئيسية" className="hidden items-center gap-1 lg:flex">
          {MAIN_NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground after:block after:h-0.5 after:bg-primary after:mt-1" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Button asChild variant="ghost" size="icon" aria-label="البحث عن سيارة">
            <Link to="/search">
              <Search />
            </Link>
          </Button>
          <ThemeToggle />
          <Button asChild variant="hero" className="hidden md:inline-flex">
            <Link to="/request-car">اطلب سيارة</Link>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="فتح القائمة">
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
                    <Link key={item.to} to={item.to} className="border-b py-3 font-display text-lg font-semibold">
                      {item.label}
                    </Link>
                  ))}
                </div>
                {FOOTER_NAV.slice(0, 1).map((group) => (
                  <div key={group.title}>
                    <p className="eyebrow mb-2">{group.title}</p>
                    <div className="flex flex-col gap-2">
                      {group.links.map((l) => (
                        <Link key={l.to} to={l.to} className="py-1 text-muted-foreground hover:text-foreground">
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
