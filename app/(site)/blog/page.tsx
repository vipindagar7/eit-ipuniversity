import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import { buildMetadata } from "@/lib/seo";
import { BlogCard } from "@/components/blog/BlogCard";
import { blogCategories } from "@/lib/data";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Admissions Guides & Career Blog",
  description:
    "Expert advice on admissions, career guidance, exam updates, and campus life to help you make informed decisions.",
  path: "/blog",
});

export const revalidate = 900;

export default async function BlogListPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  await connectDB();

  const filter: Record<string, unknown> = { status: "published" };
  if (category) filter.category = category;

  const blogs = await Blog.find(filter).sort({ publishedAt: -1 }).lean();

  return (
    <div className="container py-12">
      <h1 className="font-display text-3xl font-semibold text-indigo-900 dark:text-white">Blog</h1>
      <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
        Guidance on admissions, careers, and campus life, written by our counselling team.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/blog"
          className={cn(
            "rounded-full border px-3 py-1.5 text-sm",
            !category
              ? "border-indigo-700 bg-indigo-700 text-white"
              : "border-slate-200 text-slate-600 hover:border-indigo-400 dark:border-white/10 dark:text-slate-300"
          )}
        >
          All
        </Link>
        {blogCategories.map((c) => (
          <Link
            key={c}
            href={`/blog?category=${encodeURIComponent(c)}`}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm",
              category === c
                ? "border-indigo-700 bg-indigo-700 text-white"
                : "border-slate-200 text-slate-600 hover:border-indigo-400 dark:border-white/10 dark:text-slate-300"
            )}
          >
            {c}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog: any) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
        {blogs.length === 0 && <p className="text-slate-500 dark:text-slate-400">No articles published yet.</p>}
      </div>
    </div>
  );
}
