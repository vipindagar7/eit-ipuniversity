import Link from "next/link";
import Image from "next/image";
import { Star, MapPin } from "lucide-react";

export function CollegeCard({ college }: { college: any }) {
  return (
    <Link
      href={`/colleges/${college.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-indigo-900/30"
    >
      <div className="relative h-40 w-full bg-indigo-100 dark:bg-indigo-900/50">
        {college.coverImage && (
          <Image src={college.coverImage} alt={college.name} fill className="object-contain" />
        )}
        {college.isFeatured && (
          <span className="absolute left-3 top-3 rounded-full bg-brass-400 px-2 py-0.5 text-xs font-semibold text-indigo-900">
            Featured
          </span>
        )}
        {college.logo && (
          <div className="absolute bottom-3 right-3 h-10 w-10 overflow-hidden rounded-md border border-white/50 shadow-sm">
            <Image
              src={college.logo}
              alt=""
              fill
              className={college.logoDark ? "object-cover dark:hidden" : "object-cover"}
            />
            {college.logoDark && (
              <Image src={college.logoDark} alt="" fill className="hidden object-cover dark:block" />
            )}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-lg font-semibold text-indigo-900 group-hover:text-brass-600 dark:text-white dark:group-hover:text-brass-300">
          {college.name}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
          <MapPin size={14} /> {college.city}, {college.state}
        </p>
        {college.rating ? (
          <p className="mt-2 flex items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-200">
            <Star size={14} className="fill-brass-400 text-brass-400" /> {college.rating.toFixed(1)} / 5
          </p>
        ) : null}
        {college.feesRange && (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Fees: {college.feesRange}</p>
        )}
      </div>
    </Link>
  );
}