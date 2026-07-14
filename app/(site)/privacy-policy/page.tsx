import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/data";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: `How ${siteConfig.name} collects, uses, and protects your information.`,
  path: "/privacy-policy",
});

const lastUpdated = "July 2026";

export default function PrivacyPolicyPage() {
  return (
    <div className="container max-w-2xl py-12">
      <h1 className="font-display text-3xl font-semibold text-indigo-900 dark:text-white">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Last updated: {lastUpdated}</p>

      <div className="prose-blog mt-8">
        <p>
          This Privacy Policy explains how {siteConfig.name} ("the Site", "we", "us", "our")
          collects, uses, and protects information when you visit {siteConfig.url} or use our
          counselling and college comparison services.
        </p>

        <h2>Information We Collect</h2>
        <p>When you submit our counselling form, we collect:</p>
        <ul>
          <li>Your name, email address, and phone number</li>
          <li>The course or program you're interested in</li>
          <li>Any additional message you choose to include</li>
          <li>The page you submitted the form from</li>
        </ul>
        <p>
          We do not require account creation to browse colleges, read blog articles, or use
          the counselling form.
        </p>

        <h2>How We Use Your Information</h2>
        <ul>
          <li>To contact you about the counselling request you submitted</li>
          <li>To send a confirmation email acknowledging your request</li>
          <li>To improve our content and college comparison data</li>
          <li>To maintain a record of enquiries for our counselling team</li>
        </ul>
        <p>We do not sell, rent, or trade your personal information to third parties.</p>

        <h2>Third-Party Services</h2>
        <p>We use the following third-party services to operate the Site:</p>
        <ul>
          <li>
            <strong>Email delivery</strong> — to send confirmation emails when you submit the
            counselling form.
          </li>
          <li>
            <strong>Google Sheets</strong> — as a backup record of counselling form submissions,
            accessible only to our team.
          </li>
          <li>
            <strong>Database hosting (MongoDB)</strong> — to store college listings, blog content,
            and form submissions securely.
          </li>
        </ul>
        <p>Each of these providers processes data under their own privacy and security practices.</p>

        <h2>Cookies &amp; Local Storage</h2>
        <p>
          We use your browser's local storage to remember your light/dark theme preference. This
          is not a tracking cookie and is not shared with any third party — it stays on your
          device and is only used to render the Site the way you last set it.
        </p>

        <h2>Data Retention</h2>
        <p>
          We retain counselling form submissions for as long as necessary to respond to your
          enquiry and maintain our records. You can request deletion of your information at any
          time by contacting us using the details below.
        </p>

        <h2>Your Rights</h2>
        <p>You may contact us at any time to:</p>
        <ul>
          <li>Request a copy of the personal information we hold about you</li>
          <li>Ask us to correct inaccurate information</li>
          <li>Request that we delete your information</li>
          <li>Withdraw consent for us to contact you</li>
        </ul>

        <h2>Children's Privacy</h2>
        <p>
          Our counselling services are intended for prospective students and their guardians. We
          do not knowingly collect information from children under 13 without appropriate consent.
        </p>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Changes will be posted on this page
          with an updated "Last updated" date.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy or how your information is handled,
          reach out to us at{" "}
          <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a> or{" "}
          {siteConfig.contact.phone}.
        </p>
      </div>
    </div>
  );
}