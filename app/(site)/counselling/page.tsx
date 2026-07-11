import { buildMetadata } from "@/lib/seo";
import { CounsellingForm } from "@/components/forms/CounsellingForm";

export const metadata = buildMetadata({
  title: "Free College Counselling",
  description:
    "Get free, unbiased counselling from our academic experts to choose the right college and course for your future.",
  path: "/counselling",
});

export default function CounsellingPage() {
  return (
    <div className="container max-w-lg py-12">
      <h1 className="font-display text-3xl font-semibold text-indigo-900 dark:text-white">
        Get Free Counselling
      </h1>
      <p className="mt-2 text-slate-600 dark:text-slate-300">
        Fill this out and a counsellor will reach out within 24 hours. You'll also get an
        instant confirmation email.
      </p>
      <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-indigo-900/30">
        <CounsellingForm />
      </div>
    </div>
  );
}
