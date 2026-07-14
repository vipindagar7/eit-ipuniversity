import { notFound } from "next/navigation";
import Image from "next/image";
import { connectDB } from "@/lib/db";
import College from "@/models/College";
import { buildMetadata, collegeJsonLd } from "@/lib/seo";
import { stripHtml } from "@/lib/utils";
import { Star, MapPin, CalendarDays, BadgeCheck } from "lucide-react";
import { InlineCounsellingCard } from "@/components/forms/InlineCounsellingCard";
import { BannerSlot } from "@/components/site/BannerSlot";
import type { Metadata } from "next";

export const revalidate = 1800;

async function getCollege(slug: string) {
  await connectDB();
  return College.findOne({ slug, isPublished: true }).lean();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const college: any = await getCollege(slug);
  if (!college) return buildMetadata({ noIndex: true });

  return buildMetadata({
    title: college.metaTitle || college.name,
    description: college.metaDescription || stripHtml(college.description).slice(0, 155),
    path: `/colleges/${college.slug}`,
    image: college.coverImage,
  });
}

export default async function CollegeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const college: any = await getCollege(slug);
  if (!college) notFound();

  const jsonLd = collegeJsonLd(college);

  return (
    <article className="container max-w-3xl py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {college.coverImage && (
        <div className="relative mb-6 h-64 w-full overflow-hidden rounded-lg">
          <Image src={college.coverImage} alt={college.name} fill className="object-contain" />
        </div>
      )}

      <div className="flex items-start gap-4">
        {college.logo && (
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-slate-200 dark:border-white/10">
            <Image
              src={college.logo}
              alt={`${college.name} logo`}
              fill
              className={college.logoDark ? "object-cover dark:hidden" : "object-cover"}
            />
            {college.logoDark && (
              <Image
                src={college.logoDark}
                alt={`${college.name} logo`}
                fill
                className="hidden object-cover dark:block"
              />
            )}
          </div>
        )}
        <h1 className="font-display text-3xl font-semibold text-indigo-900 dark:text-white">
          {college.name}
        </h1>
      </div>

      <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-300">
        <span className="flex items-center gap-1">
          <MapPin size={16} /> {college.city}, {college.state}
        </span>
        {college.establishedYear && (
          <span className="flex items-center gap-1">
            <CalendarDays size={16} /> Est. {college.establishedYear}
          </span>
        )}
        {college.rating ? (
          <span className="flex items-center gap-1 font-medium text-slate-800 dark:text-slate-100">
            <Star size={16} className="fill-brass-400 text-brass-400" /> {college.rating.toFixed(1)} / 5
          </span>
        ) : null}
      </div>

      {college.highlights?.length > 0 && (
        <ul className="mt-6 grid gap-2 sm:grid-cols-2">
          {college.highlights.map((h: string, i: number) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
              <BadgeCheck size={16} className="mt-0.5 shrink-0 text-brass-600 dark:text-brass-400" /> {h}
            </li>
          ))}
        </ul>
      )}

      <div className="prose-blog mt-8" dangerouslySetInnerHTML={{ __html: college.description }} />

      {college.feesRange && (
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
          <strong className="text-ink dark:text-white">Fees range:</strong> {college.feesRange}
        </p>
      )}
      {college.approvedBy && (
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          <strong className="text-ink dark:text-white">Approved by:</strong> {college.approvedBy}
        </p>
      )}

      <div className="mt-10">
        <BannerSlot placement="college-sidebar" />
      </div>

      <div className="mt-6">
        <InlineCounsellingCard
          title={`Considering ${college.name}?`}
          subtitle="Talk to a free counsellor before you apply — no cost, no obligation."
        />
      </div>
    </article>
  );
}