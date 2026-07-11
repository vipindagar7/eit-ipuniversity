import { BlogForm } from "@/components/admin/BlogForm";

export default function NewBlogPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-indigo-900 dark:text-white">New Post</h1>
      <div className="mt-6">
        <BlogForm />
      </div>
    </div>
  );
}
