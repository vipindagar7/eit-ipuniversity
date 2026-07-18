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
    {
      url: `${siteConfig.url}/`,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/colleges`,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/blog`,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/counselling`,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/about`,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/colleges/echelon-institute-of-technology`,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/colleges/mait-and-maims-rohini`,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/colleges/vivekananda-institute-of-professional-studies-(vips)-pitampura-complete-admission-guide-2026`,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/colleges/university-school-of-information-communication-and-technology-(usict)-dwarka-complete-admission-guide-2026`,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/colleges/bhagwan-parshuram-institute-of-technology-(bpit)-rohini-complete-admission-guide-2026`,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/colleges/jims-rohini-(jagan-institute-of-management-studies)-complete-admission-guide-2026`,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/blog/top-10-ggsipu-btech-colleges`,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/blog/best-ggsipu-colleges-delhi-ncr`,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/blog/best-ggsipu-college-in-delhi-ncr-our-recommended-choice`,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/privacy-policy`,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/terms`,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/blog/top-5-ggsipu-affiliated-colleges-in-delhi-ncr-(2026)-or-best-ip-university-colleges`,
      changeFrequency: "daily",
      priority: 0.64,
    },
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
