import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import College from "@/models/College";
import { isValidObjectId } from "@/lib/sanitizeMongoInput";

/**
 * Body: { order: string[] } — an array of college _ids in the new desired
 * order. This is the single source of truth for public /colleges ranking.
 * The admin can put ANY college first, second, etc. regardless of rating.
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { order }: { order: unknown } = await req.json();

  if (!Array.isArray(order) || order.length === 0 || order.length > 1000) {
    return NextResponse.json({ error: "order must be a non-empty array of ids" }, { status: 400 });
  }
  // Every entry must actually look like a Mongo ObjectId — rejects anything
  // else outright rather than letting a malformed id anywhere near bulkWrite.
  if (!order.every((id): id is string => typeof id === "string" && isValidObjectId(id))) {
    return NextResponse.json({ error: "order contains an invalid id" }, { status: 400 });
  }

  await connectDB();

  const bulkOps = order.map((id, index) => ({
    updateOne: {
      filter: { _id: id },
      update: { $set: { rank: index } },
    },
  }));

  await College.bulkWrite(bulkOps);

  return NextResponse.json({ success: true });
}
