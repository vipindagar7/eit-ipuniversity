import mongoose, { Schema } from "mongoose";

export interface ISettings {
  _id?: string;
  contactPhone: string;
  whatsappNumber?: string;
  contactEmail: string;
  officeHours?: string;
  showFloatingContactBar: boolean;
  showCounsellingWidgetOnHome: boolean;
  announcementText?: string; // optional short banner, e.g. admissions deadline
}

const SettingsSchema = new Schema<ISettings>(
  {
    contactPhone: { type: String, required: true, default: "+91-00000-00000" },
    whatsappNumber: { type: String },
    contactEmail: { type: String, required: true, default: "admissions@yourdomain.com" },
    officeHours: { type: String, default: "Mon–Sat, 9:00 AM – 6:00 PM" },
    showFloatingContactBar: { type: Boolean, default: true },
    showCounsellingWidgetOnHome: { type: Boolean, default: true },
    announcementText: { type: String },
  },
  { timestamps: true }
);

// Single-document collection — every read/write targets the first (and only) record.
export default (mongoose.models.Settings as mongoose.Model<ISettings>) ||
  mongoose.model<ISettings>("Settings", SettingsSchema);
