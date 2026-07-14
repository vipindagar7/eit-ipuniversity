import { ChevronDown } from "lucide-react";
import { admissionFaqs, type FaqItem } from "@/lib/data";

/** JSON-LD so Google can show these as FAQ rich snippets in search results. */
function faqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.list ? `${item.answer} ${item.list.join(", ")}` : item.answer,
      },
    })),
  };
}

export function FAQSection({
  items = admissionFaqs,
  title = "Frequently Asked Questions",
}: {
  items?: FaqItem[];
  title?: string;
}) {
  const jsonLd = faqJsonLd(items);

  return (
    <section className="border-t border-slate-200 py-16 dark:border-white/10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container max-w-3xl">
        <h2 className="font-display text-2xl font-semibold text-indigo-900 dark:text-white md:text-3xl">
          {title}
        </h2>

        <div className="mt-8 divide-y divide-slate-200 dark:divide-white/10">
          {items.map((item, i) => (
            <details key={i} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-indigo-900 marker:content-none dark:text-white">
                {item.question}
                <ChevronDown
                  size={18}
                  className="shrink-0 text-slate-400 transition-transform group-open:rotate-180"
                />
              </summary>
              <div className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                <p>{item.answer}</p>
                {item.list && (
                  <ul className="mt-2 list-disc pl-5">
                    {item.list.map((entry) => (
                      <li key={entry}>{entry}</li>
                    ))}
                  </ul>
                )}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
