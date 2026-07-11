"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import { navLinks, siteConfig } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/site/ThemeToggle";

export function Header({ phone }: { phone?: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-paper/90 backdrop-blur dark:border-white/10 dark:bg-indigo-950/90">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <Image src={siteConfig.logo.light} alt={siteConfig.shortName} width={36} height={36} priority className="dark:hidden" />
          <Image src={siteConfig.logo.dark} alt={siteConfig.shortName} width={36} height={36} priority className="hidden dark:block" />
          <span className="font-display text-lg font-semibold text-indigo-700 dark:text-white">
            {siteConfig.shortName}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium text-slate-700 transition-colors hover:text-indigo-700 dark:text-slate-300 dark:hover:text-white",
                pathname === link.href && "text-indigo-700 dark:text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
          {phone && (
            <a
              href={`tel:${phone.replace(/[^\d+]/g, "")}`}
              className="hidden items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-indigo-700 dark:text-slate-300 dark:hover:text-white lg:flex"
            >
              <Phone size={15} /> {phone}
            </a>
          )}
          <ThemeToggle />
          <Button asChild size="sm">
            <Link href="/counselling">Get Free Counselling</Link>
          </Button>
        </nav>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            className="p-2"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-slate-200 bg-paper dark:border-white/10 dark:bg-indigo-950 md:hidden">
          <div className="container flex flex-col gap-1 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {phone && (
              <a
                href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                <Phone size={15} /> {phone}
              </a>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
