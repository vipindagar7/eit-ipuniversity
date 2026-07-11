import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Settings from "@/models/Settings";
import { sanitizeMongoInput } from "@/lib/sanitizeMongoInput";

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rawBody = await req.json();
  const body = sanitizeMongoInput(rawBody);
  await connectDB();

  const existing = await Settings.findOne();

  const updated = existing
    ? await Settings.findByIdAndUpdate(existing._id, body, { new: true })
    : await Settings.create(body);

  return NextResponse.json(updated);
}
