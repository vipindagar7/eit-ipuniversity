import mongoose, { Schema } from "mongoose";

export interface IAdmin {
  _id?: string;
  email: string;
  passwordHash: string;
  name: string;
}

const AdminSchema = new Schema<IAdmin>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
  },
  { timestamps: true }
);

// Always read/write through the live `mongoose` object rather than destructured
// `models`/`model` bindings — under Next.js dev (webpack) module interop, a
// destructured `models` can be a stale snapshot, so the "already registered"
// check silently fails and mongoose.model() throws OverwriteModelError on
// every Fast Refresh / re-import.
export default (mongoose.models.Admin as mongoose.Model<IAdmin>) ||
  mongoose.model<IAdmin>("Admin", AdminSchema);
