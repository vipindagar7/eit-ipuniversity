"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LogoUpload } from "@/components/admin/LogoUpload";
import { bannerPlacements } from "@/lib/data";

type BannerFormValues = {
  _id?: string;
  title: string;
  description?: string;
  image?: string;
  linkUrl?: string;
  linkText?: string;
  placement: string;
  order: number;
  isActive: boolean;
};

const empty: BannerFormValues = {
  title: "",
  placement: bannerPlacements[0].value,
  order: 0,
  isActive: true,
};

export function BannerForm({ initial }: { initial?: Partial<BannerFormValues> }) {
  const router = useRouter();
  const [values, setValues] = useState<BannerFormValues>({ ...empty, ...initial });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof BannerFormValues>(key: K, value: BannerFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!values.image) {
      setError("Please upload a banner image.");
      return;
    }

    setSaving(true);
    setError(null);

    const isEdit = Boolean(values._id);
    const url = isEdit ? `/api/banners/${values._id}` : "/api/banners";
    const method = isEdit ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Failed to save banner");
      router.push("/admin/banners");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid max-w-xl gap-4">
      <div>
        <Label>Banner image</Label>
        <p className="mb-1 text-xs text-slate-400 dark:text-slate-500">
          Wide images work best — this isn't cropped to a square.
        </p>
        <div className="mt-2">
          <LogoUpload
            value={values.image}
            onChange={(url) => update("image", url)}
            folder="banners"
            label="banner image"
            square={false}
          />
        </div>
      </div>

      <div>
        <Label>Title</Label>
        <Input value={values.title} onChange={(e) => update("title", e.target.value)} required />
      </div>

      <div>
        <Label>Description (optional)</Label>
        <Textarea
          value={values.description || ""}
          onChange={(e) => update("description", e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Link URL (optional)</Label>
          <Input
            value={values.linkUrl || ""}
            onChange={(e) => update("linkUrl", e.target.value)}
            placeholder="/colleges/some-college or https://..."
          />
        </div>
        <div>
          <Label>Link text (optional)</Label>
          <Input
            value={values.linkText || ""}
            onChange={(e) => update("linkText", e.target.value)}
            placeholder="Learn more"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Placement</Label>
          <select
            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-indigo-900/40 dark:text-white"
            value={values.placement}
            onChange={(e) => update("placement", e.target.value)}
          >
            {bannerPlacements.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Order</Label>
          <Input
            type="number"
            value={values.order}
            onChange={(e) => update("order", Number(e.target.value))}
          />
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            Lower shows first when multiple banners share a placement.
          </p>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
        <input
          type="checkbox"
          checked={values.isActive}
          onChange={(e) => update("isActive", e.target.checked)}
        />
        Active (visible on the public site)
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={saving} className="w-fit">
        {saving ? "Saving..." : "Save Banner"}
      </Button>
    </form>
  );
}
