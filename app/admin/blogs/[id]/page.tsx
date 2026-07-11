import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import { BlogForm } from "@/components/admin/BlogForm";

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const blog = await Blog.findById(id).lean();
  if (!blog) notFound();

  const plain = JSON.parse(JSON.stringify(blog));

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-indigo-900 dark:text-white">Edit Post</h1>
      <div className="mt-6">
        <BlogForm initial={plain} />
      </div>
    </div>
  );
}
