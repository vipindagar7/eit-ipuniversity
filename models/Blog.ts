import mongoose, { Schema } from "mongoose";

export interface IBlog {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // HTML from Tiptap editor
  coverImage?: string;
  category: string;
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  status: "draft" | "published";
  author: string;
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String, required: true, maxlength: 300 },
    content: { type: String, required: true },
    coverImage: { type: String },
    category: { type: String, required: true },
    tags: { type: [String], default: [] },
    metaTitle: { type: String },
    metaDescription: { type: String, maxlength: 160 },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    author: { type: String, default: "Admin" },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

BlogSchema.index({ title: "text", excerpt: "text", tags: "text" });

export default (mongoose.models.Blog as mongoose.Model<IBlog>) ||
  mongoose.model<IBlog>("Blog", BlogSchema);
