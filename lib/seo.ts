import type { Metadata } from "next";
import { siteConfig, defaultSeo } from "@/lib/data";
import { stripHtml } from "@/lib/utils";

/**
 * Build a consistent Metadata object for any page. Pass only what's
 * different about that page — everything else falls back to sane,
 * centralized defaults so SEO stays consistent site-wide.
 */
export function buildMetadata(opts: {
  title?: string;
  description?: string;
  path?: string; // e.g. "/blog/my-post"
  image?: string;
  noIndex?: boolean;
  keywords?: string[];
}): Metadata {
  const title = opts.title ? `${opts.title} | ${siteConfig.name}` : defaultSeo.defaultTitle;
  const description = opts.description || defaultSeo.description;
  const url = `${siteConfig.url}${opts.path || ""}`;
  const image = opts.image || `${siteConfig.url}${siteConfig.ogImage}`;

  return {
    title,
    description,
    keywords: opts.keywords?.length ? opts.keywords : [...siteConfig.keywords],
    metadataBase: new URL(siteConfig.url),
    alternates: { canonical: url },
    robots: opts.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      images: [{ url: image, width: 1200, height: 630 }],
      locale: siteConfig.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      site: siteConfig.twitterHandle,
    },
  };
}

/** JSON-LD builders — rendered inline via <script type="application/ld+json"> */
export function blogPostingJsonLd(blog: {
  title: string;
  excerpt: string;
  slug: string;
  coverImage?: string;
  author: string;
  publishedAt?: Date;
  updatedAt?: Date;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.excerpt,
    image: blog.coverImage ? [blog.coverImage] : undefined,
    author: { "@type": "Person", name: blog.author },
    datePublished: blog.publishedAt?.toISOString(),
    dateModified: (blog.updatedAt || blog.publishedAt)?.toISOString(),
    mainEntityOfPage: `${siteConfig.url}/blog/${blog.slug}`,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: { "@type": "ImageObject", url: `${siteConfig.url}${siteConfig.logo.light}` },
    },
  };
}

export function collegeJsonLd(college: {
  name: string;
  slug: string;
  city: string;
  state: string;
  description: string;
  logo?: string;
  rating?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollegeOrUniversity",
    name: college.name,
    description: stripHtml(college.description),
    url: `${siteConfig.url}/colleges/${college.slug}`,
    logo: college.logo,
    address: {
      "@type": "PostalAddress",
      addressLocality: college.city,
      addressRegion: college.state,
      addressCountry: "IN",
    },
    ...(college.rating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: college.rating,
            bestRating: 5,
            ratingCount: 1,
          },
        }
      : {}),
  };
}
