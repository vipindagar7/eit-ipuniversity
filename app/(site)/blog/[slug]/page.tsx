import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight, Clock } from "lucide-react";
import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import { buildMetadata, blogPostingJsonLd } from "@/lib/seo";
import { formatDate, readingTime, initials } from "@/lib/utils";
import { addHeadingIds } from "@/lib/toc";
import { siteConfig } from "@/lib/data";
import { ReadingProgressBar } from "@/components/blog/ReadingProgressBar";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { ArticleContent } from "@/components/blog/ArticleContent";
import { BackToTop } from "@/components/blog/BackToTop";
import { InlineCounsellingCard } from "@/components/forms/InlineCounsellingCard";

export const revalidate = 900;

async function getBlog(slug: string) {
  await connectDB();
  return Blog.findOne({ slug, status: "published" }).lean();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog: any = await getBlog(slug);
  if (!blog) return buildMetadata({ noIndex: true });

  return buildMetadata({
    title: blog.metaTitle || blog.title,
    description: blog.metaDescription || blog.excerpt,
    path: `/blog/${blog.slug}`,
    image: blog.coverImage,
    keywords: blog.tags,
  });
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog: any = await getBlog(slug);
  if (!blog) notFound();

  const jsonLd = blogPostingJsonLd(blog);
  const minutes = readingTime(blog.content);
  const shareUrl = `${siteConfig.url}/blog/${blog.slug}`;
  const { html, headings } = addHeadingIds(blog.content);

  return (
    <article>
      <ReadingProgressBar />
      <BackToTop />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Magazine-style hero */}
      <header className="relative">
        {blog.coverImage ? (
          <div className="relative h-[46vh] min-h-[320px] w-full overflow-hidden bg-indigo-900">
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              priority
              className="object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 via-indigo-900/60 to-transparent" />
            <div className="container relative flex h-full max-w-3xl flex-col justify-end pb-10">
              <Breadcrumb category={blog.category} light />
              <span className="mt-4 w-fit rounded-full bg-brass-400 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-900">
                {blog.category}
              </span>
              <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-white md:text-5xl">
                {blog.title}
              </h1>
            </div>
          </div>
        ) : (
          <div className="border-b border-slate-200 bg-indigo-50 dark:border-white/10 dark:bg-indigo-900/30">
            <div className="container max-w-3xl py-14">
              <Breadcrumb category={blog.category} />
              <span className="mt-4 inline-block rounded-full bg-brass-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brass-600 dark:bg-brass-400/10 dark:text-brass-300">
                {blog.category}
              </span>
              <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-indigo-900 dark:text-white md:text-5xl">
                {blog.title}
              </h1>
            </div>
          </div>
        )}
      </header>

      <div className="container max-w-3xl py-10">
        {/* Byline row */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-6 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-700 text-sm font-semibold text-white">
              {initials(blog.author)}
            </div>
            <div>
              <p className="text-sm font-medium text-indigo-900 dark:text-white">{blog.author}</p>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                {blog.publishedAt && <span>{formatDate(blog.publishedAt)}</span>}
                <span aria-hidden>·</span>
                <span className="flex items-center gap-1">
                  <Clock size={12} /> {minutes} min read
                </span>
              </div>
            </div>
          </div>
          <div className="hidden sm:block">
            <ShareButtons url={shareUrl} title={blog.title} />
          </div>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[13rem_1fr]">
          {/* Sticky rail — table of contents + share, desktop only */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 flex flex-col gap-8">
              <TableOfContents headings={headings} />
              <ShareButtons url={shareUrl} title={blog.title} />
            </div>
          </aside>

          <div className="min-w-0">
            {/* Mobile-only collapsible TOC */}
            {headings.length > 0 && (
              <details className="mb-6 rounded-lg border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-indigo-900/30 lg:hidden">
                <summary className="cursor-pointer text-sm font-medium text-indigo-900 dark:text-white">
                  On this page
                </summary>
                <ul className="mt-3 space-y-1.5">
                  {headings.map((h) => (
                    <li key={h.id} className={h.level === 3 ? "pl-3" : undefined}>
                      <a href={`#${h.id}`} className="text-sm text-slate-600 hover:text-indigo-700 dark:text-slate-300 dark:hover:text-white">
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            )}

            <ArticleContent html={html} />

            {blog.tags?.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2 border-t border-slate-200 pt-6 dark:border-white/10">
                {blog.tags.map((t: string) => (
                  <Link
                    key={t}
                    href={`/blog?category=${encodeURIComponent(blog.category)}`}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                  >
                    #{t}
                  </Link>
                ))}
              </div>
            )}

            {/* Mobile share row */}
            <div className="mt-6 sm:hidden">
              <ShareButtons url={shareUrl} title={blog.title} />
            </div>

            {/* CTA — inline counselling form */}
            <div className="mt-12">
              <InlineCounsellingCard
                title="Not sure which college is right for you?"
                subtitle="Talk to a free counsellor — no cost, no obligation."
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function Breadcrumb({ category, light }: { category: string; light?: boolean }) {
  const base = light ? "text-slate-200" : "text-slate-500 dark:text-slate-400";
  const hover = light ? "hover:text-white" : "hover:text-indigo-700 dark:hover:text-white";
  return (
    <nav className={`flex items-center gap-1.5 text-xs ${base}`} aria-label="Breadcrumb">
      <Link href="/" className={hover}>
        Home
      </Link>
      <ChevronRight size={12} />
      <Link href="/blog" className={hover}>
        Blog
      </Link>
      <ChevronRight size={12} />
      <span className={light ? "text-white" : "text-indigo-900 dark:text-white"}>{category}</span>
    </nav>
  );
}
