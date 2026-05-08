import mongoose, { Schema, Document, Model } from "mongoose";

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  role: string;
  phone?: string;
  email?: string;
  location?: string;
  experience?: string;
  keywords: string[];
  fileUrl: string;
  public_id: string;
  fileType: string; // e.g., 'pdf', 'docx'
  isProcessed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema = new Schema<IResume>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    location: { type: String },
    experience: { type: String },
    keywords: [{ type: String }],
    fileUrl: { type: String, required: true },
    public_id: { type: String, required: true },
    fileType: { type: String },
    isProcessed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Resume: Model<IResume> =
  mongoose.models.Resume || mongoose.model<IResume>("Resume", ResumeSchema);
export default Resume;