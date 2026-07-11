"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { LogoUpload } from "@/components/admin/LogoUpload";
import { blogCategories } from "@/lib/data";

/** "2026-07-01T14:30:00.000Z" -> "2026-07-01T14:30" for a datetime-local input */
function toDatetimeLocal(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
    d.getMinutes()
  )}`;
}

/** "2026-07-01T14:30" (local time, from the input) -> ISO string */
function fromDatetimeLocal(local?: string) {
  if (!local) return undefined;
  return new Date(local).toISOString();
}

type BlogFormValues = {
  _id?: string;
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: string;
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  status: "draft" | "published";
  publishedAt?: string; // datetime-local string, e.g. "2026-07-01T10:30"
};

const empty: BlogFormValues = {
  title: "",
  excerpt: "",
  content: "",
  category: blogCategories[0],
  tags: [],
  status: "draft",
};

export function BlogForm({ initial }: { initial?: Partial<BlogFormValues> }) {
  const router = useRouter();
  const [values, setValues] = useState<BlogFormValues>({
    ...empty,
    ...initial,
    publishedAt: toDatetimeLocal(initial?.publishedAt),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof BlogFormValues>(key: K, value: BlogFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function save(status?: "draft" | "published") {
    setSaving(true);
    setError(null);

    const payload = {
      ...values,
      status: status || values.status,
      publishedAt: fromDatetimeLocal(values.publishedAt),
    };
    const isEdit = Boolean(values._id);
    const url = isEdit ? `/api/blogs/${values._id}` : "/api/blogs";
    const method = isEdit ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save post");
      router.push("/admin/blogs");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid max-w-2xl gap-4">
      <div>
        <Label>Title</Label>
        <Input value={values.title} onChange={(e) => update("title", e.target.value)} required />
      </div>

      <div>
        <Label>Slug (leave blank to auto-generate from title)</Label>
        <Input value={values.slug || ""} onChange={(e) => update("slug", e.target.value)} placeholder="how-to-choose-a-college" />
      </div>

      <div>
        <Label>Category</Label>
        <select
          className="flex h-10 w-full max-w-xs rounded-md border border-slate-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-indigo-900/40 dark:text-white"
          value={values.category}
          onChange={(e) => update("category", e.target.value)}
        >
          {blogCategories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label>Cover image</Label>
        <div className="mt-2">
          <LogoUpload
            value={values.coverImage}
            onChange={(url) => update("coverImage", url)}
            folder="blog-covers"
            label="cover image"
            square={false}
          />
        </div>
      </div>

      <div>
        <Label>Published date</Label>
        <Input
          type="datetime-local"
          value={values.publishedAt || ""}
          onChange={(e) => update("publishedAt", e.target.value)}
        />
        <p className="mt-1 text-xs text-slate-400">
          Leave blank to use the moment you publish. Set an earlier date/time to backdate a post —
          useful for importing older articles or keeping a consistent posting history.
        </p>
      </div>

      <div>
        <Label>Excerpt (shown in cards & meta description fallback)</Label>
        <Textarea
          value={values.excerpt}
          onChange={(e) => update("excerpt", e.target.value)}
          maxLength={300}
          required
        />
      </div>

      <div>
        <Label>Content</Label>
        <RichTextEditor value={values.content} onChange={(html) => update("content", html)} />
      </div>

      <div>
        <Label>Tags (comma separated)</Label>
        <Input
          value={values.tags.join(", ")}
          onChange={(e) => update("tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>SEO meta title</Label>
          <Input value={values.metaTitle || ""} onChange={(e) => update("metaTitle", e.target.value)} />
        </div>
        <div>
          <Label>SEO meta description</Label>
          <Input
            value={values.metaDescription || ""}
            onChange={(e) => update("metaDescription", e.target.value)}
            maxLength={160}
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <Button variant="outline" disabled={saving} onClick={() => save("draft")}>
          Save Draft
        </Button>
        <Button disabled={saving} onClick={() => save("published")}>
          {saving ? "Publishing..." : "Publish"}
        </Button>
      </div>
    </div>
  );
}
