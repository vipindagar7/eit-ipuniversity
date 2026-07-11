"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import FontFamily from "@tiptap/extension-font-family";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import {
  Bold,
  Italic,
  UnderlineIcon,
  List,
  ListOrdered,
  Quote,
  Link2,
  Link2Off,
  Table as TableIcon,
  Trash2,
  Rows3,
  Columns3,
  Palette,
  Highlighter,
  Ban,
} from "lucide-react";
import { useState } from "react";

const FONT_OPTIONS = [
  { label: "Default font", value: "" },
  { label: "Serif", value: "Georgia, serif" },
  { label: "Sans", value: "Inter, sans-serif" },
  { label: "Monospace", value: "'Courier New', monospace" },
];

const HEADING_OPTIONS = [
  { label: "Paragraph", level: 0 },
  { label: "Heading 1", level: 1 },
  { label: "Heading 2", level: 2 },
  { label: "Heading 3", level: 3 },
  { label: "Heading 4", level: 4 },
] as const;

const TEXT_COLORS = [
  { label: "Default", value: "" },
  { label: "Indigo", value: "#22315C" },
  { label: "Brass", value: "#A87B22" },
  { label: "Red", value: "#DC2626" },
  { label: "Green", value: "#16A34A" },
  { label: "Blue", value: "#2563EB" },
  { label: "Slate", value: "#5B6472" },
];

const HIGHLIGHT_COLORS = [
  { label: "Yellow", value: "#FEF08A" },
  { label: "Green", value: "#BBF7D0" },
  { label: "Blue", value: "#BFDBFE" },
  { label: "Pink", value: "#FBCFE8" },
  { label: "Brass", value: "#EBD19B" },
];

/**
 * Strips Word/Google Docs paste cruft (mso-* styles, class names, empty
 * spans, conditional comments) while keeping the semantic tags — headings,
 * bold/italic/underline, lists, links, tables — so pasted content matches
 * the rest of the editor instead of dragging in foreign fonts and spacing.
 */
function cleanPastedHtml(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<o:p>[\s\S]*?<\/o:p>/gi, "")
    .replace(/<\/?o:[^>]*>/gi, "")
    .replace(/ class="[^"]*"/gi, "")
    .replace(/ style="[^"]*"/gi, "")
    .replace(/ lang="[^"]*"/gi, "")
    .replace(/<span[^>]*>(\s*)<\/span>/gi, "$1")
    .replace(/<span>/gi, "")
    .replace(/<\/span>/gi, "");
}

export function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const [showTableMenu, setShowTableMenu] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);
  const [showHighlightMenu, setShowHighlightMenu] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      FontFamily,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer nofollow", target: "_blank" },
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose-blog min-h-[220px] rounded-b-md border border-t-0 border-slate-200 bg-white p-4 focus:outline-none dark:border-white/10 dark:bg-indigo-900/20",
      },
      transformPastedHTML: cleanPastedHtml,
    },
  });

  if (!editor) return null;

  const btn = (active: boolean) =>
    `rounded p-1.5 ${active ? "bg-indigo-700 text-white" : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10"}`;

  function setLink() {
    const previousUrl = editor!.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL (leave blank to remove)", previousUrl || "");
    if (url === null) return; // cancelled
    if (url === "") {
      editor!.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor!.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  function currentHeadingLevel(): number {
    for (const level of [1, 2, 3, 4] as const) {
      if (editor!.isActive("heading", { level })) return level;
    }
    return 0;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1 rounded-t-md border border-slate-200 bg-slate-50 p-1.5 dark:border-white/10 dark:bg-white/5">
        <select
          className="rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 dark:border-white/10 dark:bg-indigo-900/40 dark:text-slate-300"
          value={currentHeadingLevel()}
          onChange={(e) => {
            const level = Number(e.target.value);
            if (level === 0) editor.chain().focus().setParagraph().run();
            else editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 }).run();
          }}
          title="Text style"
        >
          {HEADING_OPTIONS.map((h) => (
            <option key={h.label} value={h.level}>
              {h.label}
            </option>
          ))}
        </select>

        <span className="mx-1 h-5 w-px bg-slate-200 dark:bg-white/10" aria-hidden />

        <button type="button" className={btn(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold">
          <Bold size={16} />
        </button>
        <button type="button" className={btn(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic">
          <Italic size={16} />
        </button>
        <button type="button" className={btn(editor.isActive("underline"))} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline">
          <UnderlineIcon size={16} />
        </button>

        <span className="mx-1 h-5 w-px bg-slate-200 dark:bg-white/10" aria-hidden />

        {/* Text color */}
        <div className="relative">
          <button type="button" className={btn(false)} onClick={() => setShowColorMenu((v) => !v)} title="Text color">
            <Palette size={16} />
          </button>
          {showColorMenu && (
            <div className="absolute left-0 top-full z-10 mt-1 w-40 rounded-md border border-slate-200 bg-white p-2 shadow-lg dark:border-white/10 dark:bg-indigo-900 dark:shadow-black/40">
              <div className="grid grid-cols-4 gap-1.5">
                {TEXT_COLORS.filter((c) => c.value).map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    title={c.label}
                    className="h-6 w-6 rounded-full border border-slate-200 dark:border-white/20"
                    style={{ backgroundColor: c.value }}
                    onClick={() => {
                      editor.chain().focus().setColor(c.value).run();
                      setShowColorMenu(false);
                    }}
                  />
                ))}
              </div>
              <button
                type="button"
                className="mt-2 flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-left text-xs text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-white/10"
                onClick={() => {
                  editor.chain().focus().unsetColor().run();
                  setShowColorMenu(false);
                }}
              >
                <Ban size={13} /> Default color
              </button>
            </div>
          )}
        </div>

        {/* Highlight */}
        <div className="relative">
          <button
            type="button"
            className={btn(editor.isActive("highlight"))}
            onClick={() => setShowHighlightMenu((v) => !v)}
            title="Highlight"
          >
            <Highlighter size={16} />
          </button>
          {showHighlightMenu && (
            <div className="absolute left-0 top-full z-10 mt-1 w-40 rounded-md border border-slate-200 bg-white p-2 shadow-lg dark:border-white/10 dark:bg-indigo-900 dark:shadow-black/40">
              <div className="grid grid-cols-4 gap-1.5">
                {HIGHLIGHT_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    title={c.label}
                    className="h-6 w-6 rounded-full border border-slate-200 dark:border-white/20"
                    style={{ backgroundColor: c.value }}
                    onClick={() => {
                      editor.chain().focus().toggleHighlight({ color: c.value }).run();
                      setShowHighlightMenu(false);
                    }}
                  />
                ))}
              </div>
              <button
                type="button"
                className="mt-2 flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-left text-xs text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-white/10"
                onClick={() => {
                  editor.chain().focus().unsetHighlight().run();
                  setShowHighlightMenu(false);
                }}
              >
                <Ban size={13} /> Remove highlight
              </button>
            </div>
          )}
        </div>

        <span className="mx-1 h-5 w-px bg-slate-200 dark:bg-white/10" aria-hidden />

        <button type="button" className={btn(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet list">
          <List size={16} />
        </button>
        <button type="button" className={btn(editor.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered list">
          <ListOrdered size={16} />
        </button>
        <button type="button" className={btn(editor.isActive("blockquote"))} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Quote">
          <Quote size={16} />
        </button>

        <span className="mx-1 h-5 w-px bg-slate-200 dark:bg-white/10" aria-hidden />

        <button type="button" className={btn(editor.isActive("link"))} onClick={setLink} title="Add/edit link">
          <Link2 size={16} />
        </button>
        {editor.isActive("link") && (
          <button type="button" className={btn(false)} onClick={() => editor.chain().focus().unsetLink().run()} title="Remove link">
            <Link2Off size={16} />
          </button>
        )}

        <span className="mx-1 h-5 w-px bg-slate-200 dark:bg-white/10" aria-hidden />

        <div className="relative">
          <button
            type="button"
            className={btn(editor.isActive("table"))}
            onClick={() => setShowTableMenu((v) => !v)}
            title="Table"
          >
            <TableIcon size={16} />
          </button>
          {showTableMenu && (
            <div className="absolute left-0 top-full z-10 mt-1 w-52 rounded-md border border-slate-200 bg-white p-1 shadow-lg dark:border-white/10 dark:bg-indigo-900 dark:shadow-black/40">
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/10"
                onClick={() => {
                  editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
                  setShowTableMenu(false);
                }}
              >
                <TableIcon size={14} /> Insert 3×3 table
              </button>
              {editor.isActive("table") && (
                <>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/10"
                    onClick={() => editor.chain().focus().addRowAfter().run()}
                  >
                    <Rows3 size={14} /> Add row
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/10"
                    onClick={() => editor.chain().focus().addColumnAfter().run()}
                  >
                    <Columns3 size={14} /> Add column
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    onClick={() => {
                      editor.chain().focus().deleteTable().run();
                      setShowTableMenu(false);
                    }}
                  >
                    <Trash2 size={14} /> Delete table
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <span className="mx-1 h-5 w-px bg-slate-200 dark:bg-white/10" aria-hidden />

        <select
          className="rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 dark:border-white/10 dark:bg-indigo-900/40 dark:text-slate-300"
          onChange={(e) => {
            const value = e.target.value;
            if (value) editor.chain().focus().setFontFamily(value).run();
            else editor.chain().focus().unsetFontFamily().run();
          }}
          defaultValue=""
          title="Font"
        >
          {FONT_OPTIONS.map((f) => (
            <option key={f.label} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
