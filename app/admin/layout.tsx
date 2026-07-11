import { Providers } from "@/components/admin/Providers";
import { Sidebar } from "@/components/admin/Sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <Providers>
      <div className="flex bg-slate-50 dark:bg-indigo-950">
        {session && <Sidebar />}
        <div className="flex-1 overflow-x-hidden">
          <div className="p-6 md:p-8">{children}</div>
        </div>
      </div>
    </Providers>
  );
}
