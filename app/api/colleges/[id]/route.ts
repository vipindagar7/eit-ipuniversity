import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import College from "@/models/College";
import slugify from "slugify";
import { sanitizeMongoInput, isValidObjectId } from "@/lib/sanitizeMongoInput";
import { sanitizeRichText } from "@/lib/sanitizeRichText";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isValidObjectId(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  await connectDB();
  const college = await College.findById(id).lean();
  if (!college) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(college);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isValidObjectId(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const rawBody = await req.json();
  const body = sanitizeMongoInput(rawBody);
  await connectDB();

  if (body.slug) body.slug = slugify(body.slug, { lower: true });
  if (body.description) body.description = sanitizeRichText(body.description);

  const updated = await College.findByIdAndUpdate(id, body, { new: true });
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isValidObjectId(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  await connectDB();
  await College.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
