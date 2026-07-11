import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/data";

export const metadata = buildMetadata({
  title: "About Us",
  description: `Learn about ${siteConfig.name} and our mission to help students choose the right college.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="container max-w-2xl py-12">
      <h1 className="font-display text-3xl font-semibold text-indigo-900 dark:text-white">About Us</h1>
      <div className="prose-blog mt-6">
        <p>{siteConfig.description}</p>
        <p>
          We compare colleges across engineering, management, computer applications, science,
          commerce, and law — and back it up with free counselling from people who understand
          the admissions process inside out.
        </p>
      </div>
    </div>
  );
}
