import mongoose, { Schema } from "mongoose";

export interface IBanner {
  _id?: string;
  title: string;
  description?: string;
  image: string;
  linkUrl?: string;
  linkText?: string;
  placement: string; // see bannerPlacements in lib/data.ts
  order: number; // lower = shown first when multiple banners share a placement
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const BannerSchema = new Schema<IBanner>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    image: { type: String, required: true },
    linkUrl: { type: String, trim: true },
    linkText: { type: String, trim: true },
    placement: { type: String, required: true, index: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default (mongoose.models.Banner as mongoose.Model<IBanner>) ||
  mongoose.model<IBanner>("Banner", BannerSchema);