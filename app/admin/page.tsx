import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import College from "@/models/College";
import Lead from "@/models/Lead";
import { Card, CardContent } from "@/components/ui/card";
import { Newspaper, Building2, Users, CheckCircle2 } from "lucide-react";

export default async function AdminDashboard() {
  await connectDB();

  const [totalBlogs, publishedBlogs, totalColleges, totalLeads, newLeads] = await Promise.all([
    Blog.countDocuments(),
    Blog.countDocuments({ status: "published" }),
    College.countDocuments(),
    Lead.countDocuments(),
    Lead.countDocuments({ status: "new" }),
  ]);

  const stats = [
    { label: "Published Blogs", value: publishedBlogs, sub: `${totalBlogs} total`, icon: Newspaper },
    { label: "Colleges Listed", value: totalColleges, sub: "manage ranking below", icon: Building2 },
    { label: "New Leads", value: newLeads, sub: `${totalLeads} total`, icon: Users },
    { label: "System Status", value: "OK", sub: "Mongo, Sheets, Mail", icon: CheckCircle2 },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-indigo-900 dark:text-white">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, sub, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
                <p className="mt-1 text-2xl font-semibold text-indigo-900 dark:text-white">{value}</p>
                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{sub}</p>
              </div>
              <Icon className="text-brass-500" size={28} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
