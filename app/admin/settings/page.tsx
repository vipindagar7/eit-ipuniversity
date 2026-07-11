import { getSettings } from "@/lib/settings";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-indigo-900 dark:text-white">Site Settings</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Controls the contact number and counselling widgets shown across the public site.
      </p>
      <div className="mt-6">
        <SettingsForm initial={settings} />
      </div>
    </div>
  );
}
