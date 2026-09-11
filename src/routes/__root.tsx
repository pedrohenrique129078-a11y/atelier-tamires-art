import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Menu } from "lucide-react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
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
      { name: "author", content: "Tamires Correia" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Fira+Sans:wght@300;400;500;600&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
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
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur">
        <div className="mx-auto grid h-16 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 lg:px-8">
          <Link to="/" className="min-w-0 truncate font-serif text-xl">Tamires Correia</Link>
          <nav aria-label="Navegação principal" className="hidden items-center gap-6 lg:flex">
            <Link to="/" className="text-sm hover:text-primary">Início</Link>
            <Link to="/servicos" className="text-sm hover:text-primary">Serviços</Link>
            <Link to="/cursos" className="text-sm hover:text-primary">Cursos</Link>
            <Link to="/galeria" className="text-sm hover:text-primary">Galeria</Link>
            <Link to="/sobre" className="text-sm hover:text-primary">Sobre</Link>
            <Link to="/agendar" className="inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-ink">Agendar agora</Link>
          </nav>
          <details className="relative lg:hidden">
            <summary className="grid size-11 cursor-pointer list-none place-items-center rounded-full border border-border" aria-label="Abrir menu"><Menu className="size-5" /></summary>
            <nav className="absolute right-0 top-13 grid w-56 gap-1 border border-border bg-background p-3 shadow-xl" aria-label="Navegação móvel">
              <Link to="/" className="p-3">Início</Link><Link to="/servicos" className="p-3">Serviços</Link><Link to="/cursos" className="p-3">Cursos</Link><Link to="/galeria" className="p-3">Galeria</Link><Link to="/sobre" className="p-3">Sobre</Link><Link to="/agendar" className="mt-1 rounded-full bg-primary p-3 text-center text-primary-foreground">Agendar agora</Link>
            </nav>
          </details>
        </div>
      </header>
      <Outlet />
      <footer className="border-t border-border bg-ink text-cream">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-[1.2fr_1fr_1fr] lg:px-8">
          <div><p className="font-serif text-3xl">Tamires Correia</p><p className="mt-3 max-w-sm text-sm text-cream/65">Beleza, cuidado e formação presencial.</p></div>
          <div><p className="text-xs font-medium uppercase text-blush">Navegação</p><div className="mt-4 grid gap-2 text-sm text-cream/75"><Link to="/servicos">Serviços</Link><Link to="/cursos">Cursos</Link><Link to="/galeria">Galeria</Link><Link to="/sobre">Sobre</Link><Link to="/agendar">Agendar</Link></div></div>
          <div><p className="text-xs font-medium uppercase text-blush">Local</p><p className="mt-4 text-sm text-cream/75">Av. Rio Largo, nº 100</p><p className="mt-4 text-xs text-cream/45">WhatsApp e Instagram: aguardando configuração.</p></div>
        </div>
      </footer>
    </QueryClientProvider>
  );
}
