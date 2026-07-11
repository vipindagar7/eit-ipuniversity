import { cache } from "react";
import { connectDB } from "@/lib/db";
import Settings, { type ISettings } from "@/models/Settings";
import { siteConfig } from "@/lib/data";

/**
 * Returns the site's admin-editable settings (contact number, WhatsApp,
 * feature toggles) as a plain object safe to pass into Client Components.
 * Creates the singleton document with sensible defaults the first time
 * it's called, so the site never breaks before an admin has visited
 * /admin/settings.
 *
 * Wrapped in React's `cache()` so calling this from both a layout and a
 * page in the same request only hits MongoDB once.
 */
export const getSettings = cache(async (): Promise<ISettings> => {
  await connectDB();

  let doc = await Settings.findOne().lean();

  if (!doc) {
    const created = await Settings.create({
      contactPhone: siteConfig.contact.phone,
      contactEmail: siteConfig.contact.email,
    });
    doc = created.toObject();
  }

  return JSON.parse(JSON.stringify(doc));
});
