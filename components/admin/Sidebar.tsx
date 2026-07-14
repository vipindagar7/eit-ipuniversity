"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Newspaper, Building2, Users, Image as ImageIcon, Settings as SettingsIcon, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/blogs", label: "Blogs", icon: Newspaper },
  { href: "/admin/colleges", label: "Colleges", icon: Building2 },
  { href: "/admin/banners", label: "Banners", icon: ImageIcon },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: SettingsIcon },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-slate-200 bg-indigo-900 text-slate-200 dark:border-white/10">
      <div className="p-5">
        <span className="font-display text-lg font-semibold text-white">Admin Panel</span>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Button
              key={href}
              asChild
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 px-3 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white",
                active && "bg-brass-400 text-indigo-900 hover:bg-brass-400 hover:text-indigo-900"
              )}
            >
              <Link href={href}>
                <Icon size={18} /> {label}
              </Link>
            </Button>
          );
        })}
      </nav>

      <Separator className="mx-3 w-auto bg-white/10" />

      <div className="m-3 flex items-center justify-between rounded-md px-3 py-1">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">Theme</span>
        <ThemeToggle className="flex h-8 w-8 items-center justify-center rounded-md text-slate-300 hover:bg-white/10" />
      </div>

      <Button
        variant="ghost"
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
        className="m-3 mt-0 justify-start gap-3 px-3 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white"
      >
        <LogOut size={18} /> Sign Out
      </Button>
    </aside>
  );
}
