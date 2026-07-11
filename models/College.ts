import mongoose, { Schema } from "mongoose";

export interface ICollege {
  _id?: string;
  name: string;
  slug: string;
  logo?: string; // logo shown in light theme
  logoDark?: string; // logo shown in dark theme — falls back to `logo` if not set
  coverImage?: string;
  city: string;
  state: string;
  courses: string[]; // course category slugs, see lib/data.ts courseCategories
  affiliation?: string;
  approvedBy?: string;
  establishedYear?: number;
  feesRange?: string;
  rating?: number; // 0-5, editorial rating shown to users
  rank: number; // MANUAL admin-controlled ranking — lower = shown first
  highlights: string[]; // short bullet points e.g. "NBA accredited"
  description: string;
  metaTitle?: string;
  metaDescription?: string;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const CollegeSchema = new Schema<ICollege>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    logo: { type: String },
    logoDark: { type: String },
    coverImage: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    courses: { type: [String], default: [] },
    affiliation: { type: String },
    approvedBy: { type: String },
    establishedYear: { type: Number },
    feesRange: { type: String },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    // Sparse-friendly sequential integer the admin sets by dragging
    // colleges up/down in the admin panel. This is what drives the
    // public /colleges ranking — entirely at the admin's discretion,
    // independent of `rating`.
    rank: { type: Number, required: true, default: 0, index: true },
    highlights: { type: [String], default: [] },
    description: { type: String, required: true },
    metaTitle: { type: String },
    metaDescription: { type: String, maxlength: 160 },
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default (mongoose.models.College as mongoose.Model<ICollege>) ||
  mongoose.model<ICollege>("College", CollegeSchema);
