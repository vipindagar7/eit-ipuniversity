import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import College from "@/models/College";
import slugify from "slugify";
import { sanitizeMongoInput } from "@/lib/sanitizeMongoInput";
import { sanitizeRichText } from "@/lib/sanitizeRichText";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const colleges = await College.find().sort({ rank: 1 }).lean();
  return NextResponse.json(colleges);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rawBody = await req.json();
  const body = sanitizeMongoInput(rawBody);
  await connectDB();

  const slug = body.slug ? slugify(body.slug, { lower: true }) : slugify(body.name, { lower: true });

  // New colleges default to the back of the ranking; admin re-orders via drag-and-drop.
  const count = await College.countDocuments();

  const college = await College.create({
    ...body,
    description: sanitizeRichText(body.description || ""),
    slug,
    rank: body.rank ?? count,
  });
  return NextResponse.json(college, { status: 201 });
}
