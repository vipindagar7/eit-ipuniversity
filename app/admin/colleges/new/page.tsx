import { CollegeForm } from "@/components/admin/CollegeForm";

export default function NewCollegePage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-indigo-900 dark:text-white">Add College</h1>
      <div className="mt-6">
        <CollegeForm />
      </div>
    </div>
  );
}
