import { cache } from "react";
import { connectDB } from "@/lib/db";
import Banner from "@/models/Banner";

/**
 * Returns active banners for a placement, sorted by admin-set order.
 * Wrapped in React's cache() so multiple components requesting the same
 * placement within one request don't each hit MongoDB separately.
 */
export const getActiveBanners = cache(async (placement: string) => {
  await connectDB();
  const banners = await Banner.find({ placement, isActive: true }).sort({ order: 1 }).lean();
  return JSON.parse(JSON.stringify(banners));
});
