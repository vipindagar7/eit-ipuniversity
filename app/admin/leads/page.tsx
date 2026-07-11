import { connectDB } from "@/lib/db";
import Lead from "@/models/Lead";
import { formatDate } from "@/lib/utils";

export default async function AdminLeadsPage() {
  await connectDB();
  const leads = await Lead.find().sort({ createdAt: -1 }).limit(200).lean();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-indigo-900 dark:text-white">Counselling Leads</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Every submission is also synced to your Google Sheet as a backup.
      </p>

      <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-indigo-900/30">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500 dark:bg-white/5 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Interested In</th>
              <th className="px-4 py-3">Sync</th>
              <th className="px-4 py-3">Received</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead: any) => (
              <tr key={lead._id} className="border-t border-slate-100 dark:border-white/10">
                <td className="px-4 py-3 font-medium text-indigo-900 dark:text-white">{lead.name}</td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                  <div>{lead.email}</div>
                  <div>{lead.phone}</div>
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{lead.interestedIn}</td>
                <td className="px-4 py-3">
                  <span className={`mr-1 rounded-full px-2 py-0.5 text-xs ${lead.syncedToSheet ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"}`}>
                    Sheet {lead.syncedToSheet ? "✓" : "✕"}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${lead.emailSent ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"}`}>
                    Mail {lead.emailSent ? "✓" : "✕"}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{formatDate(lead.createdAt)}</td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                  No submissions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
