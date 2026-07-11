import Link from "next/link";
import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Plus, Pencil } from "lucide-react";

export default async function AdminBlogsPage() {
  await connectDB();
  const blogs = await Blog.find().sort({ createdAt: -1 }).lean();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-indigo-900 dark:text-white">Blogs</h1>
        <Button asChild>
          <Link href="/admin/blogs/new">
            <Plus size={16} className="mr-1" /> New Post
          </Link>
        </Button>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-indigo-900/30">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500 dark:bg-white/5 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog: any) => (
              <tr key={blog._id} className="border-t border-slate-100 dark:border-white/10">
                <td className="px-4 py-3 font-medium text-indigo-900 dark:text-white">{blog.title}</td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{blog.category}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      blog.status === "published"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300"
                    }`}
                  >
                    {blog.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{formatDate(blog.updatedAt)}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/blogs/${blog._id}`} className="text-slate-400 hover:text-indigo-700 dark:text-slate-500 dark:hover:text-white">
                    <Pencil size={16} />
                  </Link>
                </td>
              </tr>
            ))}
            {blogs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                  No posts yet. Create your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
