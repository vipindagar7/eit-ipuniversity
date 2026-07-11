export type TocHeading = { id: string; text: string; level: 2 | 3 };

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/<[^>]*>/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/**
 * Walks the stored HTML for <h2>/<h3> tags, gives each a stable id (slug of
 * its text, de-duplicated), and returns both the rewritten HTML and a flat
 * list of headings to render as a table of contents.
 */
export function addHeadingIds(html: string): { html: string; headings: TocHeading[] } {
  const headings: TocHeading[] = [];
  const seen = new Map<string, number>();

  const rewritten = html.replace(
    /<(h2|h3)([^>]*)>([\s\S]*?)<\/\1>/gi,
    (_match, tag: "h2" | "h3", attrs: string, inner: string) => {
      const text = inner.replace(/<[^>]*>/g, "").trim();
      let id = slugify(text) || "section";

      const count = seen.get(id) ?? 0;
      seen.set(id, count + 1);
      if (count > 0) id = `${id}-${count}`;

      headings.push({ id, text, level: tag === "h2" ? 2 : 3 });

      // Preserve any existing attributes, just add/override the id.
      const cleanedAttrs = attrs.replace(/\sid="[^"]*"/i, "");
      return `<${tag}${cleanedAttrs} id="${id}">${inner}</${tag}>`;
    }
  );

  return { html: rewritten, headings };
}
