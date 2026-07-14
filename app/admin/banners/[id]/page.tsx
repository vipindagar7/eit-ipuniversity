import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import Banner from "@/models/Banner";
import { BannerForm } from "@/components/admin/BannerForm";

export default async function EditBannerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const banner = await Banner.findById(id).lean();
  if (!banner) notFound();

  const plain = JSON.parse(JSON.stringify(banner));

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-indigo-900 dark:text-white">Edit Banner</h1>
      <div className="mt-6">
        <BannerForm initial={plain} />
      </div>
    </div>
  );
}
