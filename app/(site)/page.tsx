import Link from "next/link";
import { GraduationCap, Building2, Users, ShieldCheck } from "lucide-react";
import { connectDB } from "@/lib/db";
import College from "@/models/College";
import Blog from "@/models/Blog";
import { buildMetadata } from "@/lib/seo";
import { getSettings } from "@/lib/settings";
import { Button } from "@/components/ui/button";
import { CollegeCard } from "@/components/college/CollegeCard";
import { BlogCard } from "@/components/blog/BlogCard";
import { InlineCounsellingCard } from "@/components/forms/InlineCounsellingCard";
import { courseCategories } from "@/lib/data";

export const metadata = buildMetadata({
  path: "/",
});

export const revalidate = 3600; // ISR: refresh homepage hourly for SEO freshness

const trustStats = [
  { label: "Students Counselled", value: "5,000+", icon: Users },
  { label: "Partner Colleges", value: "50+", icon: Building2 },
  { label: "Course Categories", value: "6", icon: GraduationCap },
  { label: "Counselling Cost", value: "Free", icon: ShieldCheck },
];

export default async function HomePage() {
  await connectDB();
  const settings = await getSettings();

  const [featuredColleges, latestBlogs] = await Promise.all([
    College.find({ isPublished: true }).sort({ rank: 1 }).limit(6).lean(),
    Blog.find({ status: "published" }).sort({ publishedAt: -1 }).limit(3).lean(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-indigo-50 to-paper dark:border-white/10 dark:from-indigo-900/40 dark:to-indigo-950">
        <div className="container grid gap-10 py-16 md:grid-cols-2 md:py-24">
          <div className="flex flex-col justify-center">
            <span className="mb-3 inline-block w-fit rounded-full bg-brass-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brass-600 dark:bg-brass-400/10 dark:text-brass-300">
              Free & Unbiased Guidance
            </span>
            <h1 className="font-display text-4xl font-semibold leading-tight text-indigo-900 dark:text-white md:text-5xl">
              Find the right college. Talk to a counsellor who actually knows the campus.
            </h1>
            <p className="mt-4 max-w-md text-slate-600 dark:text-slate-300">
              Compare colleges by course, fees, and rating, read admissions guides written by
              our team, and get matched with a free counsellor before you decide.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/counselling">Get Free Counselling</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/colleges">Compare Colleges</Link>
              </Button>
            </div>
          </div>
          <div className="hidden items-center justify-center md:flex">
            <div className="grid w-full max-w-sm grid-cols-2 gap-4">
              {courseCategories.slice(0, 4).map((c) => (
                <Link
                  key={c.slug}
                  href={`/colleges?course=${c.slug}`}
                  className="rounded-lg border border-slate-200 bg-white p-4 text-sm font-medium text-indigo-700 shadow-sm transition hover:border-brass-400 hover:shadow-md dark:border-white/10 dark:bg-indigo-900/40 dark:text-brass-200 dark:hover:border-brass-400"
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust stats */}
      <section className="border-b border-slate-200 bg-white py-10 dark:border-white/10 dark:bg-indigo-950">
        <div className="container grid grid-cols-2 gap-6 sm:grid-cols-4">
          {trustStats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex flex-col items-center gap-2 text-center">
              <Icon className="text-brass-500" size={24} />
              <p className="font-display text-2xl font-semibold text-indigo-900 dark:text-white">{value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured colleges */}
      <section className="container py-16">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold text-indigo-900 dark:text-white md:text-3xl">
            Top Ranked Colleges
          </h2>
          <Link href="/colleges" className="text-sm font-medium text-brass-600 hover:underline dark:text-brass-300">
            View all →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredColleges.map((college: any) => (
            <CollegeCard key={college._id} college={college} />
          ))}
          {featuredColleges.length === 0 && (
            <p className="text-slate-500 dark:text-slate-400">Colleges added by the admin will appear here.</p>
          )}
        </div>
      </section>

      {/* Inline counselling form — toggled from /admin/settings */}
      {settings.showCounsellingWidgetOnHome && (
        <section className="border-y border-slate-200 bg-indigo-50/40 py-16 dark:border-white/10 dark:bg-indigo-900/20">
          <div className="container max-w-2xl">
            <InlineCounsellingCard
              title="Not sure where to start?"
              subtitle="Tell us what you're interested in — a counsellor will call you within 24 hours."
            />
          </div>
        </section>
      )}

      {/* Latest blogs */}
      <section className="py-16">
        <div className="container">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-display text-2xl font-semibold text-indigo-900 dark:text-white md:text-3xl">
              Latest From The Blog
            </h2>
            <Link href="/blog" className="text-sm font-medium text-brass-600 hover:underline dark:text-brass-300">
              View all →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestBlogs.map((blog: any) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
            {latestBlogs.length === 0 && (
              <p className="text-slate-500 dark:text-slate-400">Published articles will appear here.</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
