"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LogoUpload } from "@/components/admin/LogoUpload";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { courseCategories } from "@/lib/data";

type CollegeFormValues = {
  _id?: string;
  name: string;
  city: string;
  state: string;
  courses: string[];
  affiliation?: string;
  approvedBy?: string;
  establishedYear?: number;
  feesRange?: string;
  rating?: number;
  highlights: string[];
  description: string;
  logo?: string;
  logoDark?: string;
  coverImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  isFeatured: boolean;
  isPublished: boolean;
};

const empty: CollegeFormValues = {
  name: "",
  city: "",
  state: "",
  courses: [],
  highlights: [],
  description: "",
  isFeatured: false,
  isPublished: true,
};

export function CollegeForm({ initial }: { initial?: Partial<CollegeFormValues> }) {
  const router = useRouter();
  const [values, setValues] = useState<CollegeFormValues>({ ...empty, ...initial });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof CollegeFormValues>(key: K, value: CollegeFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const isEdit = Boolean(values._id);
    const url = isEdit ? `/api/colleges/${values._id}` : "/api/colleges";
    const method = isEdit ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Failed to save college");
      router.push("/admin/colleges");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid max-w-2xl gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>College name</Label>
          <Input value={values.name} onChange={(e) => update("name", e.target.value)} required />
        </div>
        <div>
          <Label>City</Label>
          <Input value={values.city} onChange={(e) => update("city", e.target.value)} required />
        </div>
        <div>
          <Label>State</Label>
          <Input value={values.state} onChange={(e) => update("state", e.target.value)} required />
        </div>
        <div>
          <Label>Established year</Label>
          <Input
            type="number"
            value={values.establishedYear || ""}
            onChange={(e) => update("establishedYear", Number(e.target.value))}
          />
        </div>
        <div>
          <Label>Fees range</Label>
          <Input
            placeholder="e.g. ₹4L - ₹6L / year"
            value={values.feesRange || ""}
            onChange={(e) => update("feesRange", e.target.value)}
          />
        </div>
        <div>
          <Label>Editorial rating (0-5)</Label>
          <Input
            type="number"
            step="0.1"
            min={0}
            max={5}
            value={values.rating || ""}
            onChange={(e) => update("rating", Number(e.target.value))}
          />
        </div>
        <div>
          <Label>Affiliation</Label>
          <Input value={values.affiliation || ""} onChange={(e) => update("affiliation", e.target.value)} />
        </div>
        <div>
          <Label>Approved by</Label>
          <Input value={values.approvedBy || ""} onChange={(e) => update("approvedBy", e.target.value)} />
        </div>
      </div>

      <div>
        <Label>Courses offered</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {courseCategories.map((c) => {
            const active = values.courses.includes(c.slug);
            return (
              <button
                type="button"
                key={c.slug}
                onClick={() =>
                  update(
                    "courses",
                    active ? values.courses.filter((s) => s !== c.slug) : [...values.courses, c.slug]
                  )
                }
                className={`rounded-full border px-3 py-1.5 text-xs ${
                  active
                    ? "border-indigo-700 bg-indigo-700 text-white"
                    : "border-slate-200 text-slate-600 dark:border-white/10 dark:text-slate-300"
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <Label>Highlights (one per line)</Label>
        <Textarea
          value={values.highlights.join("\n")}
          onChange={(e) => update("highlights", e.target.value.split("\n").filter(Boolean))}
          placeholder={"NBA accredited\n100% placement assistance"}
        />
      </div>

      <div>
        <Label>Description</Label>
        <RichTextEditor value={values.description} onChange={(html) => update("description", html)} />
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <div>
          <Label>Logo (light theme)</Label>
          <p className="mb-1 text-xs text-slate-400 dark:text-slate-500">
            Shown when the site is in light mode — usually a logo with dark text/marks.
          </p>
          <div className="mt-2">
            <LogoUpload
              value={values.logo}
              onChange={(url) => update("logo", url)}
              folder="college-logos-light"
              label="light-theme logo"
            />
          </div>
        </div>

        <div>
          <Label>Logo (dark theme)</Label>
          <p className="mb-1 text-xs text-slate-400 dark:text-slate-500">
            Shown when the site is in dark mode — usually a logo with light/white text or marks.
            Falls back to the light-theme logo if left empty.
          </p>
          <div className="mt-2">
            <LogoUpload
              value={values.logoDark}
              onChange={(url) => update("logoDark", url)}
              folder="college-logos-dark"
              label="dark-theme logo"
            />
          </div>
        </div>

        <div>
          <Label>Cover image</Label>
          <div className="mt-2">
            <LogoUpload
              value={values.coverImage}
              onChange={(url) => update("coverImage", url)}
              folder="college-covers"
              label="cover image"
            />
          </div>
        </div>
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

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={values.isFeatured}
            onChange={(e) => update("isFeatured", e.target.checked)}
          />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={values.isPublished}
            onChange={(e) => update("isPublished", e.target.checked)}
          />
          Published (visible on public site)
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={saving} className="w-fit">
        {saving ? "Saving..." : "Save College"}
      </Button>
    </form>
  );
}
