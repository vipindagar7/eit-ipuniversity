import type { MetadataRoute } from "next";
import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import College from "@/models/College";
import { siteConfig } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectDB();

  const [blogs, colleges] = await Promise.all([
    Blog.find({ status: "published" }).select("slug updatedAt").lean(),
    College.find({ isPublished: true }).select("slug updatedAt").lean(),
  ]);

  const now = new Date();

  // Only genuinely static routes go here. Every blog/college URL is
  // generated below straight from the database — hand-listing individual
  // slugs here as well (as this file used to) produces duplicate <url>
  // entries in the sitemap, which search engines treat as a signal to
  // distrust the rest of it. Add a new static page here; never add an
  // individual blog/college slug.
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteConfig.url}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${siteConfig.url}/colleges`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteConfig.url}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteConfig.url}/counselling`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteConfig.url}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteConfig.url}/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteConfig.url}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const blogRoutes: MetadataRoute.Sitemap = blogs.map((b: any) => ({
    url: `${siteConfig.url}/blog/${b.slug}`,
    lastModified: b.updatedAt || now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const collegeRoutes: MetadataRoute.Sitemap = colleges.map((c: any) => ({
    url: `${siteConfig.url}/colleges/${c.slug}`,
    lastModified: c.updatedAt || now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...collegeRoutes, ...blogRoutes];
}