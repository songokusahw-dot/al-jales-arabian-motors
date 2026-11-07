import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { themeInitScript } from "@/components/site/ThemeToggle";
import { Button } from "@/components/ui/button";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 pt-24">
      <div className="max-w-md text-center">
        <p className="ltr-iso font-display text-8xl font-bold text-accent-text">404</p>
        <h1 className="mt-4 text-2xl font-semibold">الصفحة غير موجودة</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          ربما تغيّر الرابط أو أُزيلت الصفحة. يمكنك العودة للرئيسية أو البحث عن سيارة.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button asChild variant="hero">
            <Link to="/">العودة للرئيسية</Link>
          </Button>
          <Button asChild variant="surface">
            <Link to="/search">ابحث عن سيارة</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 pt-24">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight">تعذّر تحميل الصفحة</h1>
        <p className="mt-2 text-sm text-muted-foreground">حدث خطأ غير متوقع. حاول مرة أخرى أو عُد للرئيسية.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button
            variant="hero"
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            حاول مرة أخرى
          </Button>
          <Button asChild variant="surface">
            <a href="/">الرئيسية</a>
          </Button>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "الجالس للسيارات — AL-JALES AUTOMOTIVE" },
      { name: "description", content: "سيارات من كوريا ومعرضي السعودية واليمن، بأسعار بالريال السعودي." },
      { name: "author", content: "AL-JALES AUTOMOTIVE" },
      { property: "og:title", content: "الجالس للسيارات — AL-JALES AUTOMOTIVE" },
      { property: "og:description", content: "سيارات من كوريا ومعرضي السعودية واليمن، بأسعار بالريال السعودي." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "ar_SA" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Alexandria:wght@400;500;600;700;800&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
    scripts: [{ children: themeInitScript }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <SiteHeader />
      <main id="main">
        <Outlet />
      </main>
      <SiteFooter />
    </QueryClientProvider>
  );
}
