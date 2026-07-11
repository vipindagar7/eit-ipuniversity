import sanitizeHtml from "sanitize-html";

/**
 * Sanitizes rich-text HTML (from the Tiptap editor) before it's saved to
 * MongoDB. Even though only an authenticated admin can submit this content,
 * this is still a required layer: if that admin session is ever
 * compromised (stolen cookie, XSS elsewhere, phished credentials), a
 * malicious <script> or onerror= payload saved here would run in every
 * visitor's browser — that's stored XSS, one of the most damaging classes
 * of web vulnerability. Sanitizing at write-time means the stored data is
 * safe to render with dangerouslySetInnerHTML regardless of what produced it.
 *
 * The allowlist matches exactly what the RichTextEditor's toolbar can
 * produce (headings, formatting, links, tables, color/highlight via style
 * attributes) — nothing more.
 */
export function sanitizeRichText(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "h1", "h2", "h3", "h4",
      "p", "br", "strong", "b", "em", "i", "u", "s", "mark",
      "ul", "ol", "li", "blockquote",
      "a",
      "table", "thead", "tbody", "tr", "th", "td",
      "span",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      span: ["style"],
      mark: ["style"],
      td: ["colspan", "rowspan"],
      th: ["colspan", "rowspan"],
    },
    // Only these URL schemes are allowed in href/src — blocks javascript:,
    // data:, vbscript:, and similar script-execution vectors.
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: {},
    // Only allow the `color` and `background-color` CSS properties through
    // (used by the editor's text color / highlight tools) — nothing else,
    // so no CSS-based attacks (e.g. `expression()`, background url() exfil).
    allowedStyles: {
      "*": {
        color: [/^#[0-9a-f]{3,6}$/i, /^rgb\(/, /^rgba\(/],
        "background-color": [/^#[0-9a-f]{3,6}$/i, /^rgb\(/, /^rgba\(/],
      },
    },
    // Force every link to carry safe rel attributes regardless of what was submitted.
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer nofollow" }, true),
    },
    disallowedTagsMode: "discard",
  });
}
