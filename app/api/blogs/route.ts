import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import slugify from "slugify";
import { sanitizeMongoInput } from "@/lib/sanitizeMongoInput";
import { sanitizeRichText } from "@/lib/sanitizeRichText";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const blogs = await Blog.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(blogs);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rawBody = await req.json();
  const body = sanitizeMongoInput(rawBody);
  await connectDB();

  const slug = body.slug ? slugify(body.slug, { lower: true }) : slugify(body.title, { lower: true });

  const publishedAt =
    body.publishedAt ? new Date(body.publishedAt) : body.status === "published" ? new Date() : undefined;

  const blog = await Blog.create({
    ...body,
    content: sanitizeRichText(body.content || ""),
    slug,
    publishedAt,
  });

  return NextResponse.json(blog, { status: 201 });
}
