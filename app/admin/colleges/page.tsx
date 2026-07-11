import Link from "next/link";
import { connectDB } from "@/lib/db";
import College from "@/models/College";
import { Button } from "@/components/ui/button";
import { CollegeReorderList } from "@/components/admin/CollegeReorderList";
import { Plus } from "lucide-react";

export default async function AdminCollegesPage() {
  await connectDB();
  const colleges = await College.find().sort({ rank: 1 }).lean();

  const plain = JSON.parse(JSON.stringify(colleges));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-indigo-900 dark:text-white">Colleges</h1>
        <Button asChild>
          <Link href="/admin/colleges/new">
            <Plus size={16} className="mr-1" /> Add College
          </Link>
        </Button>
      </div>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Drag to reorder — this order is exactly what visitors see on the public /colleges page,
        independent of rating.
      </p>

      <div className="mt-6">
        <CollegeReorderList initialColleges={plain} />
      </div>
    </div>
  );
}
