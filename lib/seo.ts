import type { Metadata } from "next";
import { siteConfig, defaultSeo } from "@/lib/data";
import { stripHtml, readingTime } from "@/lib/utils";

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
  const twitterHandle = (siteConfig as any).twitterHandle as string | undefined;

  return {
    title,
    description,
    keywords: opts.keywords?.length ? opts.keywords : [...siteConfig.keywords],
    metadataBase: new URL(siteConfig.url),
    alternates: { canonical: url },
    robots: opts.noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      locale: siteConfig.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      ...(twitterHandle ? { site: twitterHandle, creator: twitterHandle } : {}),
    },
  };
}

/** JSON-LD builders — rendered inline via <script type="application/ld+json"> */
export function blogPostingJsonLd(blog: {
  title: string;
  excerpt: string;
  slug: string;
  content?: string;
  coverImage?: string;
  author: string;
  category?: string;
  tags?: string[];
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
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteConfig.url}/blog/${blog.slug}` },
    url: `${siteConfig.url}/blog/${blog.slug}`,
    inLanguage: siteConfig.locale.replace("_", "-"),
    articleSection: blog.category,
    keywords: blog.tags?.length ? blog.tags.join(", ") : undefined,
    ...(blog.content
      ? {
          wordCount: stripHtml(blog.content).split(/\s+/).filter(Boolean).length,
          timeRequired: `PT${readingTime(blog.content)}M`,
        }
      : {}),
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
  coverImage?: string;
  rating?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollegeOrUniversity",
    name: college.name,
    description: stripHtml(college.description),
    url: `${siteConfig.url}/colleges/${college.slug}`,
    image: college.coverImage || college.logo,
    logo: college.logo,
    inLanguage: siteConfig.locale.replace("_", "-"),
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

/**
 * Site-wide Organization + WebSite JSON-LD. Rendered once, in the root
 * layout, on every page. This is what tells Google "this is the entity
 * behind the site" (feeds the Knowledge Panel / sitelinks) and, via the
 * WebSite SearchAction, makes the site eligible for the sitelinks search
 * box in results — both things a WordPress+Yoast site gets by default and
 * a hand-rolled Next.js site otherwise skips.
 */
export function organizationJsonLd() {
  const social = ((siteConfig as any).social || {}) as Record<string, string>;
  const sameAs = Object.values(social).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.legalName,
    alternateName: siteConfig.shortName,
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
      url: `${siteConfig.url}${siteConfig.logo.light}`,
    },
    ...(sameAs.length ? { sameAs } : {}),
    ...(siteConfig.contact?.phone
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            telephone: siteConfig.contact.phone,
            contactType: "customer service",
            email: siteConfig.contact.email,
            areaServed: "IN",
          },
        }
      : {}),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    publisher: { "@id": `${siteConfig.url}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/blog?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * BreadcrumbList JSON-LD — drives the breadcrumb trail Google shows under
 * the blue link in search results instead of the raw URL. Pass the trail
 * from root to current page, e.g. [{name:"Blog",path:"/blog"},{name:title}]
 * (the last item can omit `path` — it's the current page).
 */
export function breadcrumbJsonLd(items: { name: string; path?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.path ? { item: `${siteConfig.url}${item.path}` } : {}),
    })),
  };
}