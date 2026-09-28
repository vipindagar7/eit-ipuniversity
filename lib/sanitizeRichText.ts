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
      "h1", "h2", "h3", "h4", "h5", "h6",
      "p", "br", "hr", "strong", "b", "em", "i", "u", "s", "mark", "sub", "sup",
      "ul", "ol", "li", "blockquote", "pre", "code",
      "a", "img",
      "table", "thead", "tbody", "tr", "th", "td",
      "div", "span", "figure", "figcaption",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "style"],
      span: ["style"],
      div: ["style"],
      p: ["style"],
      mark: ["style"],
      td: ["colspan", "rowspan", "style"],
      th: ["colspan", "rowspan", "style"],
    },
    // Only these URL schemes are allowed in href/src — blocks javascript:,
    // data:, vbscript:, and similar script-execution vectors. data: is
    // allowed only for <img src> (e.g. small inline/base64 images), never
    // for links.
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: {
      img: ["http", "https", "data"],
    },
    // Only allow a small, safe set of CSS properties through — used by the
    // editor's text color / highlight / font tools and by hand-typed HTML —
    // nothing that enables CSS-based attacks (e.g. `expression()`,
    // background url() exfil, position-based clickjacking).
    allowedStyles: {
      "*": {
        color: [/^#[0-9a-f]{3,6}$/i, /^rgb\(/, /^rgba\(/],
        "background-color": [/^#[0-9a-f]{3,6}$/i, /^rgb\(/, /^rgba\(/],
        "font-family": [/^[a-zA-Z0-9\s,'"-]+$/],
        "font-weight": [/^(normal|bold|[1-9]00)$/],
        "text-align": [/^(left|right|center|justify)$/],
      },
    },
    // Force every link to carry safe rel attributes regardless of what was submitted.
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer nofollow" }, true),
    },
    disallowedTagsMode: "discard",
  });
}