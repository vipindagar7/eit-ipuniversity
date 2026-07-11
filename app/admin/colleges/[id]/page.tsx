import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import College from "@/models/College";
import { CollegeForm } from "@/components/admin/CollegeForm";

export default async function EditCollegePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const college = await College.findById(id).lean();
  if (!college) notFound();

  const plain = JSON.parse(JSON.stringify(college));

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-indigo-900 dark:text-white">Edit College</h1>
      <div className="mt-6">
        <CollegeForm initial={plain} />
      </div>
    </div>
  );
}
