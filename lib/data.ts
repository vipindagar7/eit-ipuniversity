/**
 * lib/data.ts
 * -----------------------------------------------------------------------
 * SINGLE CENTRALIZED FILE for every static/config value used across the app.
 * Nothing here should be hardcoded again anywhere else — import from here.
 * When you rebrand, change SEO defaults, or add a nav link, this is the
 * only file you should need to touch.
 * -----------------------------------------------------------------------
 */

export const siteConfig = {
  name: "IPU ADMISSION GUIDANCE",
  shortName: "IPU",
  legalName: "IPU ADMISSION GUIDANCE",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com",
  logo: {
    light: "/logo-dark.svg", // shown on light backgrounds
    dark: "/logo-light.svg", // shown on dark backgrounds / dark mode
  },
  ogImage: "/og-default.jpg",
  description:
    "Compare colleges, read expert admissions guidance, and get free counselling to choose the right course and campus for your future.",
  keywords: [
    "college counselling",
    "best engineering colleges",
    "college admissions guidance",
    "compare colleges Faridabad",
    "Best GGSIPU College",
  "Best GGSIPU College in Delhi",
  "Best GGSIPU College in Delhi NCR",
  "Top GGSIPU College",
  "Top 10 GGSIPU Colleges",
  "Top 10 GGSIPU Colleges in Delhi NCR",
  "Top IPU College",
  "Best IPU College",
  "Best Engineering College under GGSIPU",
  "Top Engineering College under IP University",
  "Top 5 BTech Colleges under GGSIPU",
  "Best BTech College in IP University",
  "Best Engineering College in Delhi under IPU",
  "Top Engineering Colleges in GGSIPU",
  "Top Private Engineering College under GGSIPU",
  "Best CSE College under GGSIPU",
  "Best AI Engineering College under IPU",
  "Best Engineering College in Delhi NCR under GGSIPU",
  "Best IP University College",
  "Best IP University Engineering College",
  "Top IP University College",
  "Top 10 IP University Colleges",
  "Best College under IP University",
  "Best Engineering College under IP University",
  "Top IPU Engineering College",
  "Top IPU College in Delhi",
  "Which is the best GGSIPU college?",
  "Which is the best GGSIPU college in Delhi?",
  "Which is the best GGSIPU college in Delhi NCR?",
  "What is the best engineering college under GGSIPU?",
  "Which IPU college is best for BTech?",
  "Which is the best private GGSIPU college?",
  "Which college is best under Guru Gobind Singh Indraprastha University?",
  "Which is the top engineering college in IP University?",
  "Which GGSIPU college should I choose for BTech?",
  "Which IP University college has the best placements?",
  "Which GGSIPU college has the best campus?",
  "Which GGSIPU college has the best engineering labs?",
  "Which GGSIPU college is best for future careers?",
  "Which engineering college under GGSIPU offers industry exposure?"
  ],
  locale: "en_IN",
  themeColor: "#1A2547",
  // twitterHandle: "@eitfaridabad",
  contact: {
    email: "admissions@yourdomain.com",
    phone: "+91-00000-00000",
    address: "Echelon Institute of Technology, Faridabad, Haryana, India",
  },
  // social: {
  //   facebook: "https://facebook.com/eitfaridabad",
  //   instagram: "https://instagram.com/eitfaridabad",
  //   linkedin: "https://linkedin.com/company/eitfaridabad",
  //   youtube: "https://youtube.com/@eitfaridabad",
  // },
} as const;

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Colleges", href: "/colleges" },
  { label: "Blog", href: "/blog" },
  { label: "Get Counselling", href: "/counselling" },
  { label: "About", href: "/about" },
] as const;

export const footerLinks = {
  explore: [
    { label: "Compare Colleges", href: "/colleges" },
    { label: "Latest Articles", href: "/blog" },
    { label: "Free Counselling", href: "/counselling" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms" },
  ],
} as const;

// Course/stream categories used for filtering colleges and tagging blogs.
export const courseCategories = [
  { slug: "engineering", label: "Engineering (B.Tech)" },
  { slug: "management", label: "Management (MBA/BBA)" },
  { slug: "computer-applications", label: "Computer Applications (MCA/BCA)" },
  { slug: "science", label: "Science (B.Sc/M.Sc)" },
  { slug: "commerce", label: "Commerce (B.Com/M.Com)" },
  { slug: "law", label: "Law (LLB/LLM)" },
] as const;

// Used to populate the counselling form's "interested in" select.
export const counsellingInterests = courseCategories.map((c) => c.label);

// Blog categories — keep in sync with what editors pick in the admin CMS.
export const blogCategories = [
  "Admissions",
  "Career Guidance",
  "Exam Updates",
  "Campus Life",
  "Scholarships",
  "College Reviews",
] as const;

// Default SEO fallback used by generateMetadata() when a page doesn't
// override title/description.
export const defaultSeo = {
  titleTemplate: `%s | ${siteConfig.name}`,
  defaultTitle: `${siteConfig.name} — Find & Compare the Right College`,
  description: siteConfig.description,
} as const;

export type CourseCategorySlug = (typeof courseCategories)[number]["slug"];
export type BlogCategory = (typeof blogCategories)[number];
