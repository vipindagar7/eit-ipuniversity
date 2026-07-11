import mongoose, { Schema } from "mongoose";

export interface ILead {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  interestedIn: string; // course category label
  message?: string;
  source?: string; // e.g. page URL the form was submitted from
  syncedToSheet: boolean;
  emailSent: boolean;
  status: "new" | "contacted" | "converted" | "closed";
  createdAt?: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    interestedIn: { type: String, required: true },
    message: { type: String },
    source: { type: String },
    syncedToSheet: { type: Boolean, default: false },
    emailSent: { type: Boolean, default: false },
    status: { type: String, enum: ["new", "contacted", "converted", "closed"], default: "new" },
  },
  { timestamps: true }
);

export default (mongoose.models.Lead as mongoose.Model<ILead>) ||
  mongoose.model<ILead>("Lead", LeadSchema);
