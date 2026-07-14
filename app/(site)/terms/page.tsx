import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/data";

export const metadata = buildMetadata({
  title: "Terms of Service",
  description: `The terms and conditions for using ${siteConfig.name}.`,
  path: "/terms",
});

const lastUpdated = "July 2026";

export default function TermsPage() {
  return (
    <div className="container max-w-2xl py-12">
      <h1 className="font-display text-3xl font-semibold text-indigo-900 dark:text-white">
        Terms of Service
      </h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Last updated: {lastUpdated}</p>

      <div className="prose-blog mt-8">
        <p>
          These Terms of Service ("Terms") govern your use of {siteConfig.url} (the "Site"),
          operating under the name {siteConfig.name}. By using the Site, you agree to these
          Terms. If you do not agree, please don't use the Site.
        </p>

        <h2>Using the Site</h2>
        <p>
          The Site provides college information, comparisons, editorial rankings, blog content,
          and a free counselling enquiry service. You may browse the Site and submit the
          counselling form for personal, non-commercial use.
        </p>
        <p>You agree not to:</p>
        <ul>
          <li>Submit false or misleading information through our forms</li>
          <li>Use automated tools (bots, scrapers) to access the Site at scale</li>
          <li>Attempt to gain unauthorized access to any part of the Site or its systems</li>
          <li>Use the Site to transmit spam, malware, or harmful content</li>
        </ul>

        <h2>No Official Affiliation</h2>
        <p>
          {siteConfig.name} is an independent platform and is not the official website of Guru
          Gobind Singh Indraprastha University ("GGSIPU" or "the University"). We are not
          affiliated with, endorsed by, sponsored by, or in any way officially connected with
          GGSIPU or any of the colleges affiliated with it, except where a specific partnership
          is explicitly stated on this Site.
        </p>
        <p>
          All university names, college names, and logos referenced on this Site are the
          property of their respective owners and are used solely for identification and
          informational purposes. For official, authoritative information regarding admissions,
          counselling schedules, seat allotment, and university policies, please refer to the
          University's official website at{" "}
          <a href="https://ipu.ac.in" target="_blank" rel="noopener noreferrer">
            ipu.ac.in
          </a>
          .
        </p>

        <h2>College Information &amp; Rankings</h2>
        <p>
          College listings, rankings, fees, ratings, and other details are provided for general
          guidance and are maintained by our editorial team. While we aim for accuracy, this
          information may change and should not be treated as a substitute for verifying details
          directly with the college in question before making admissions decisions.
        </p>

        <h2>Counselling Services</h2>
        <p>
          Our counselling service is offered free of charge and is intended to provide general
          guidance. It does not guarantee admission to any institution, and any advice given
          reflects our team's best understanding at the time — final decisions remain yours to
          make.
        </p>

        <h2>Intellectual Property</h2>
        <p>
          All content on the Site — including text, graphics, logos, and blog articles — is owned
          by or licensed to us, unless otherwise noted. You may not reproduce, distribute, or
          create derivative works from this content without our prior written permission.
        </p>

        <h2>Third-Party Links</h2>
        <p>
          The Site may link to third-party websites (such as college websites or social media).
          We are not responsible for the content, accuracy, or practices of any third-party site.
        </p>

        <h2>Disclaimer of Warranties</h2>
        <p>
          The Site and its content are provided "as is" without warranties of any kind, express or
          implied. We do not warrant that the Site will be uninterrupted, error-free, or that
          college information is complete or fully up to date at all times.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, we shall not be liable for any indirect,
          incidental, or consequential damages arising from your use of the Site or reliance on
          information provided through it.
        </p>

        <h2>Changes to These Terms</h2>
        <p>
          We may update these Terms from time to time. Continued use of the Site after changes
          are posted constitutes acceptance of the updated Terms.
        </p>

        <h2>Governing Law</h2>
        <p>
          These Terms are governed by the laws of India, without regard to conflict of law
          principles.
        </p>

        <h2>Contact Us</h2>
        <p>
          Questions about these Terms can be sent to{" "}
          <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a> or{" "}
          {siteConfig.contact.phone}.
        </p>
      </div>
    </div>
  );
}