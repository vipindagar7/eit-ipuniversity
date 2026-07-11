import { connectDB } from "@/lib/db";
import College from "@/models/College";
import { buildMetadata } from "@/lib/seo";
import { CollegeCard } from "@/components/college/CollegeCard";
import { courseCategories } from "@/lib/data";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Compare Colleges",
  description:
    "Browse and compare top colleges by course, city, fees, and rating. Editorially ranked to help you choose confidently.",
  path: "/colleges",
});

export const revalidate = 1800;

export default async function CollegesPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string }>;
}) {
  const { course } = await searchParams;
  await connectDB();

  const filter: Record<string, unknown> = { isPublished: true };
  if (course) filter.courses = course;

  const colleges = await College.find(filter).sort({ rank: 1 }).lean();

  return (
    <div className="container py-12">
      <h1 className="font-display text-3xl font-semibold text-indigo-900 dark:text-white">
        Compare Colleges
      </h1>
      <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
        Ranked and reviewed by our academic counselling team — updated regularly.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/colleges"
          className={cn(
            "rounded-full border px-3 py-1.5 text-sm",
            !course
              ? "border-indigo-700 bg-indigo-700 text-white"
              : "border-slate-200 text-slate-600 hover:border-indigo-400 dark:border-white/10 dark:text-slate-300"
          )}
        >
          All
        </Link>
        {courseCategories.map((c) => (
          <Link
            key={c.slug}
            href={`/colleges?course=${c.slug}`}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm",
              course === c.slug
                ? "border-indigo-700 bg-indigo-700 text-white"
                : "border-slate-200 text-slate-600 hover:border-indigo-400 dark:border-white/10 dark:text-slate-300"
            )}
          >
            {c.label}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {colleges.map((college: any) => (
          <CollegeCard key={college._id} college={college} />
        ))}
        {colleges.length === 0 && (
          <p className="text-slate-500 dark:text-slate-400">No colleges found for this filter yet.</p>
        )}
      </div>
    </div>
  );
}
