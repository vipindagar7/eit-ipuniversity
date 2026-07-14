import Link from "next/link";
import { Facebook, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { siteConfig, footerLinks } from "@/lib/data";

export function Footer({ phone, email }: { phone?: string; email?: string }) {
  return (
    <footer className="mt-24 border-t border-slate-200 bg-indigo-900 text-slate-200 dark:border-white/10">
      <div className="container grid gap-10 py-12 md:grid-cols-4">
        <div>
          <h3 className="font-display text-lg font-semibold text-white">{siteConfig.shortName}</h3>
          <p className="mt-3 text-sm text-slate-300">{siteConfig.description}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-brass-400">Explore</h4>
          <ul className="mt-3 space-y-2">
            {footerLinks.explore.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-slate-300 hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-brass-400">Company</h4>
          <ul className="mt-3 space-y-2">
            {footerLinks.company.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-slate-300 hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-brass-400">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0" /> {siteConfig.contact.address}
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} /> {phone || siteConfig.contact.phone}
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} /> {email || siteConfig.contact.email}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-slate-400">
        <p>
          © {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.
        </p>
        <p className="mt-1">
          This is an independent college guidance and counselling platform. It is not the
          official website of Guru Gobind Singh Indraprastha University and is not affiliated
          with, endorsed by, or operated by the University. For official admission information,
          visit{" "}
          <a
            href="https://ipu.ac.in"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white"
          >
            ipu.ac.in
          </a>
          .
        </p>
      </div>
    </footer>
  );
}