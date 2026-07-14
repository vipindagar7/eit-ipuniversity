import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getActiveBanners } from "@/lib/banners";

/**
 * Renders every active banner for a given placement. Drop this anywhere
 * you want admin-managed banners to appear — it fetches its own data, so
 * no props needed beyond which placement slot this is.
 */
export async function BannerSlot({ placement }: { placement: string }) {
  const banners = await getActiveBanners(placement);

  if (banners.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      {banners.map((banner: any) => (
        <BannerCard key={banner._id} banner={banner} />
      ))}
    </div>
  );
}

function BannerCard({ banner }: { banner: any }) {
  const content = (
    <>
      <div className="relative h-32 w-full overflow-hidden rounded-t-lg bg-indigo-100 dark:bg-indigo-900/50">
        <Image src={banner.image} alt={banner.title} fill className="object-cover" />
      </div>
      <div className="p-4">
        <p className="font-display text-base font-semibold text-indigo-900 dark:text-white">
          {banner.title}
        </p>
        {banner.description && (
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{banner.description}</p>
        )}
        {banner.linkUrl && (
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brass-600 dark:text-brass-300">
            {banner.linkText || "Learn more"} <ArrowRight size={14} />
          </span>
        )}
      </div>
    </>
  );

  const cardClass =
    "block overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-indigo-900/30";

  if (banner.linkUrl) {
    const isExternal = /^https?:\/\//.test(banner.linkUrl);
    return isExternal ? (
      <a href={banner.linkUrl} target="_blank" rel="noopener noreferrer" className={cardClass}>
        {content}
      </a>
    ) : (
      <Link href={banner.linkUrl} className={cardClass}>
        {content}
      </Link>
    );
  }

  return <div className={cardClass}>{content}</div>;
}
