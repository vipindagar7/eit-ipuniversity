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
        <p>
          Welcome to {siteConfig.name}. {siteConfig.description}
        </p>
        <p>
          We compare colleges affiliated with Guru Gobind Singh Indraprastha University (GGSIPU)
          across engineering, management, computer applications, science, commerce, and law — and
          back it up with free counselling from people who understand the admissions process
          inside out.
        </p>
        <h2>What We Do</h2>
        <ul>
          <li>Compare colleges by course, fees, rating, and location</li>
          <li>Publish admissions guides, exam updates, and career advice</li>
          <li>Offer free, no-obligation counselling to prospective students</li>
        </ul>
        <p>
          Our rankings and comparisons are maintained by our editorial team and updated
          periodically. As with any third-party resource, we encourage you to verify details
          directly with a college before making a final admissions decision.
        </p>
        <h2>Get in Touch</h2>
        <p>
          Questions, feedback, or want to talk to a counsellor? Reach us at{" "}
          <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a> or{" "}
          {siteConfig.contact.phone}.
        </p>

        <h2>Disclaimer</h2>
        <p>
          {siteConfig.name} is an independent college guidance and counselling platform. We are
          not affiliated with, endorsed by, or operated by Guru Gobind Singh Indraprastha
          University (GGSIPU), and this is not the University's official website. Our college
          rankings and comparisons reflect our own editorial assessment and are provided for
          general guidance only.
        </p>
        <p>
          For official admissions information, counselling schedules, and verified details about
          GGSIPU and its affiliated colleges, please refer to the University's official website
          at{" "}
          <a href="https://ipu.ac.in" target="_blank" rel="noopener noreferrer">
            ipu.ac.in
          </a>
          .
        </p>
      </div>
    </div>
  );
}