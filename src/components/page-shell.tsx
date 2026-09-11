import type { ReactNode } from "react";

export function PageShell({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: ReactNode }) {
  return <main><section className="border-b border-border"><div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24"><p className="text-xs font-medium uppercase text-primary">{eyebrow}</p><h1 className="mt-4 max-w-4xl text-5xl leading-none md:text-7xl">{title}</h1><p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground">{intro}</p></div></section>{children}</main>;
}