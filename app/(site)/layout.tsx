import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FloatingContactBar } from "@/components/site/FloatingContactBar";
import { getSettings } from "@/lib/settings";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <>
      {settings.announcementText && (
        <div className="bg-indigo-900 py-2 text-center text-xs font-medium text-brass-200">
          {settings.announcementText}
        </div>
      )}
      <Header phone={settings.contactPhone} />
      <main id="main-content" className="pb-16 sm:pb-0">
        {children}
      </main>
      <Footer phone={settings.contactPhone} email={settings.contactEmail} />
      {settings.showFloatingContactBar && (
        <FloatingContactBar phone={settings.contactPhone} whatsapp={settings.whatsappNumber} />
      )}
    </>
  );
}
