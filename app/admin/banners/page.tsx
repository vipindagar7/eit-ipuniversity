import Link from "next/link";
import { connectDB } from "@/lib/db";
import Banner from "@/models/Banner";
import { bannerPlacements } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";

export default async function AdminBannersPage() {
  await connectDB();
  const banners = await Banner.find().sort({ placement: 1, order: 1 }).lean();

  function placementLabel(value: string) {
    return bannerPlacements.find((p) => p.value === value)?.label || value;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-indigo-900 dark:text-white">Banners</h1>
        <Button asChild>
          <Link href="/admin/banners/new">
            <Plus size={16} className="mr-1" /> Add Banner
          </Link>
        </Button>
      </div>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Promotional banners shown on the public site — image, text, and an optional link, placed
        wherever you assign them below.
      </p>

      <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-indigo-900/30">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500 dark:bg-white/5 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Placement</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner: any) => (
              <tr key={banner._id} className="border-t border-slate-100 dark:border-white/10">
                <td className="px-4 py-3 font-medium text-indigo-900 dark:text-white">{banner.title}</td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                  {placementLabel(banner.placement)}
                </td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{banner.order}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      banner.isActive
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300"
                    }`}
                  >
                    {banner.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/banners/${banner._id}`} className="text-slate-400 hover:text-indigo-700 dark:text-slate-500 dark:hover:text-white">
                    <Pencil size={16} />
                  </Link>
                </td>
              </tr>
            ))}
            {banners.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                  No banners yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
