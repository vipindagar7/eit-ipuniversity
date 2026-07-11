"use client";

import { useState } from "react";
import { Link2, Check, Linkedin, Twitter, MessageCircle } from "lucide-react";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable — silently ignore, link is still visible in the address bar
    }
  }

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const items = [
    {
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: Twitter,
    },
    {
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: Linkedin,
    },
    {
      label: "Share on WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      icon: MessageCircle,
    },
  ];

  const buttonClass =
    "flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:border-brass-400 hover:text-brass-600 dark:border-white/10 dark:bg-indigo-900/40 dark:text-slate-300 dark:hover:border-brass-400 dark:hover:text-brass-300";

  return (
    <div className="flex flex-row gap-2 lg:flex-col">
      {items.map(({ label, href, icon: Icon }) => (
        <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={buttonClass}>
          <Icon size={16} />
        </a>
      ))}
      <button onClick={copyLink} aria-label="Copy link" className={buttonClass}>
        {copied ? <Check size={16} className="text-green-600" /> : <Link2 size={16} />}
      </button>
    </div>
  );
}
