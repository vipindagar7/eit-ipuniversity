"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { counsellingSchema, type CounsellingFormValues } from "@/lib/validation";
import { counsellingInterests } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export function CounsellingForm() {
  const pathname = usePathname();
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CounsellingFormValues>({
    resolver: zodResolver(counsellingSchema),
  });

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

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-8 text-center">
        <CheckCircle2 className="text-green-600" size={40} />
        <p className="font-display text-lg text-indigo-900">Request received!</p>
        <p className="text-sm text-slate-600">
          Check your email for confirmation. Our counsellor will call you within 24 hours.
        </p>
        <Button variant="outline" onClick={() => setSubmitted(false)}>
          Submit another request
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div>
        <Label htmlFor="name">Full name</Label>
        <Input id="name" placeholder="Your full name" {...register("name")} />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <Label htmlFor="phone">Phone number</Label>
        <Input id="phone" type="tel" placeholder="10-digit mobile number" {...register("phone")} />
        {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
      </div>

      <div>
        <Label htmlFor="interestedIn">Interested in</Label>
        <select
          id="interestedIn"
          className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-400 dark:border-white/10 dark:bg-indigo-900/40 dark:text-white"
          {...register("interestedIn")}
          defaultValue=""
        >
          <option value="" disabled>
            Select a course
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

      <div>
        <Label htmlFor="message">Message (optional)</Label>
        <Textarea id="message" placeholder="Any specific questions?" {...register("message")} />
      </div>

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      <Button type="submit" disabled={isSubmitting} size="lg">
        {isSubmitting ? "Submitting..." : "Request Free Counselling"}
      </Button>
    </form>
  );
}
