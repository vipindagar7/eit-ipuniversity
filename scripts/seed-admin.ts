/**
 * Run once: npm run seed:admin
 * Reads ADMIN_EMAIL / ADMIN_PASSWORD from .env and creates (or updates)
 * the single admin account used to log into /admin.
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "../lib/db";
import Admin from "../models/Admin";

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env before seeding.");
  }

  await connectDB();
  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await Admin.findOneAndUpdate(
    { email: email.toLowerCase() },
    { email: email.toLowerCase(), passwordHash, name: "Admin" },
    { upsert: true, new: true }
  );

  console.log(`Admin ready: ${admin.email}`);
  console.log("Remember to remove ADMIN_PASSWORD from .env now that it's seeded.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
