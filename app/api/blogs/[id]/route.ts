import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import slugify from "slugify";
import { sanitizeMongoInput, isValidObjectId } from "@/lib/sanitizeMongoInput";
import { sanitizeRichText } from "@/lib/sanitizeRichText";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isValidObjectId(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  await connectDB();
  const blog = await Blog.findById(id).lean();
  if (!blog) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(blog);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isValidObjectId(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const rawBody = await req.json();
  const body = sanitizeMongoInput(rawBody);
  await connectDB();

  const existing = await Blog.findById(id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (body.slug) body.slug = slugify(body.slug, { lower: true });
  if (body.content) body.content = sanitizeRichText(body.content);

  if (body.publishedAt) {
    body.publishedAt = new Date(body.publishedAt);
  } else if (body.status === "published" && existing.status !== "published") {
    body.publishedAt = new Date();
  }

  const updated = await Blog.findByIdAndUpdate(id, body, { new: true });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isValidObjectId(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  await connectDB();
  await Blog.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
