"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { counsellingSchema, type CounsellingFormValues } from "@/lib/validation";
import { counsellingInterests } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle2, GraduationCap } from "lucide-react";

export function InlineCounsellingCard({
  title = "Get Free Counselling",
  subtitle = "Talk to a real counsellor — no cost, no obligation.",
}: {
  title?: string;
  subtitle?: string;
}) {
  const pathname = usePathname();
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CounsellingFormValues>({ resolver: zodResolver(counsellingSchema) });

  async function onSubmit(values: CounsellingFormValues) {
    setServerError(null);
    try {
      const res = await fetch("/api/counselling", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, source: pathname }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setSubmitted(true);
      reset();
    } catch (err: any) {
      setServerError(err.message || "Something went wrong. Please try again.");
    }
  }

  return (
    <div className="rounded-xl border border-brass-200 bg-gradient-to-br from-brass-50 to-white p-6 dark:border-white/10 dark:from-indigo-900/60 dark:to-indigo-900/20 sm:p-8">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-700 text-white">
          <GraduationCap size={20} />
        </div>
        <div>
          <p className="font-display text-lg text-indigo-900 dark:text-white">{title}</p>
          <p className="text-sm text-slate-600 dark:text-slate-300">{subtitle}</p>
        </div>
      </div>

      {submitted ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-6 text-center dark:border-green-900 dark:bg-green-900/20">
          <CheckCircle2 className="text-green-600 dark:text-green-400" size={32} />
          <p className="text-sm font-medium text-indigo-900 dark:text-white">Request received!</p>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Check your email — we'll call within 24 hours.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 sm:grid-cols-2">
          <div>
            <Input placeholder="Full name" {...register("name")} />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
          </div>
          <div>
            <Input placeholder="Phone number" type="tel" {...register("phone")} />
            {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
          </div>
          <div>
            <Input placeholder="Email" type="email" {...register("email")} />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>
          <div>
            <select
              className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-indigo-900/40 dark:text-white"
              {...register("interestedIn")}
              defaultValue=""
            >
              <option value="" disabled>
                Interested in
              </option>
              {counsellingInterests.map((label) => (
                <option key={label} value={label}>
                  {label}
                </option>
              ))}
            </select>
            {errors.interestedIn && (
              <p className="mt-1 text-xs text-red-600">{errors.interestedIn.message}</p>
            )}
          </div>

          {serverError && <p className="text-sm text-red-600 sm:col-span-2">{serverError}</p>}

          <Button type="submit" disabled={isSubmitting} className="sm:col-span-2">
            {isSubmitting ? "Submitting..." : "Request Free Counselling"}
          </Button>
        </form>
      )}
    </div>
  );
}
