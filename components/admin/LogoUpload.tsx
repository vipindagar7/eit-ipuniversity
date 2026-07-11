"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, Loader2, X, ImageOff } from "lucide-react";
import { cropImageToSquare } from "@/lib/cropImageToSquare";

export function LogoUpload({
  value,
  onChange,
  folder = "logos",
  label = "logo",
  square = true,
}: {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  /** false skips the 1:1 crop — use for wide images like blog/cover banners */
  square?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    setUploading(true);

    try {
      const blob = square ? await cropImageToSquare(file, 512) : file;

      const formData = new FormData();
      formData.append("file", blob, square ? "logo.png" : file.name);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Upload failed");
      }

      const data = await res.json();
      onChange(data.url);
    } catch (err: any) {
      setError(err.message || "Something went wrong uploading the logo");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        <div
          className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5 ${
            square ? "h-24 w-24" : "h-24 w-40"
          }`}
        >
          {value ? (
            <Image src={value} alt={`${label} preview`} fill className="object-cover" />
          ) : (
            <ImageOff className="text-slate-300 dark:text-slate-600" size={24} />
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-indigo-950/70">
              <Loader2 className="animate-spin text-indigo-700 dark:text-brass-300" size={20} />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-indigo-400 disabled:opacity-50 dark:border-white/10 dark:bg-indigo-900/40 dark:text-slate-200 dark:hover:border-brass-400"
          >
            <Upload size={15} /> {value ? `Replace ${label}` : `Upload ${label}`}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-600 dark:text-slate-500 dark:hover:text-red-400"
            >
              <X size={13} /> Remove
            </button>
          )}
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {square
              ? "Automatically cropped to a 1:1 square. PNG, JPEG, or WEBP, up to 5MB."
              : "Uploaded as-is (no cropping). PNG, JPEG, or WEBP, up to 5MB."}
          </p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
