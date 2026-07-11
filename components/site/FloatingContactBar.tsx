"use client";

import Link from "next/link";
import { Phone, MessageCircle, GraduationCap } from "lucide-react";

export function FloatingContactBar({
  phone,
  whatsapp,
}: {
  phone: string;
  whatsapp?: string;
}) {
  const telHref = `tel:${phone.replace(/[^\d+]/g, "")}`;
  const waHref = whatsapp ? `https://wa.me/${whatsapp.replace(/[^\d]/g, "")}` : undefined;

  return (
    <>
      {/* Mobile: fixed bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex border-t border-slate-200 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-indigo-950 sm:hidden">
        <a href={telHref} className="flex flex-1 items-center justify-center gap-2 border-r border-slate-200 py-3 text-sm font-medium text-indigo-700 dark:border-white/10 dark:text-brass-300">
          <Phone size={16} /> Call
        </a>
        {waHref && (
          <a href={waHref} target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center gap-2 border-r border-slate-200 py-3 text-sm font-medium text-green-600 dark:border-white/10">
            <MessageCircle size={16} /> WhatsApp
          </a>
        )}
        <Link href="/counselling" className="flex flex-1 items-center justify-center gap-2 bg-brass-400 py-3 text-sm font-semibold text-indigo-900">
          <GraduationCap size={16} /> Counselling
        </Link>
      </div>

      {/* Desktop: floating pill, bottom-right */}
      <div className="fixed bottom-6 right-6 z-40 hidden flex-col items-end gap-2 sm:flex">
        {waHref && (
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white shadow-lg transition-transform hover:-translate-y-0.5"
          >
            <MessageCircle size={20} />
          </a>
        )}
        <a
          href={telHref}
          className="flex items-center gap-2 rounded-full bg-indigo-700 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5"
        >
          <Phone size={16} /> {phone}
        </a>
      </div>
    </>
  );
}
