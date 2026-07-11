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

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteConfig.url}/`, changeFrequency: "daily", priority: 1 },
    { url: `${siteConfig.url}/colleges`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteConfig.url}/blog`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteConfig.url}/counselling`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteConfig.url}/about`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const blogRoutes: MetadataRoute.Sitemap = blogs.map((b: any) => ({
    url: `${siteConfig.url}/blog/${b.slug}`,
    lastModified: b.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const collegeRoutes: MetadataRoute.Sitemap = colleges.map((c: any) => ({
    url: `${siteConfig.url}/colleges/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...collegeRoutes, ...blogRoutes];
}
