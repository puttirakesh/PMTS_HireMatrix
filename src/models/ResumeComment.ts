import mongoose, { Schema, Document, Model } from "mongoose";

export interface IResumeComment extends Document {
  resumeId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  userName: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const ResumeCommentSchema = new Schema<IResumeComment>(
  {
    resumeId: { type: Schema.Types.ObjectId, ref: "Resume", required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    userName: { type: String, required: true },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const ResumeComment: Model<IResumeComment> =
  mongoose.models.ResumeComment ||
  mongoose.model<IResumeComment>("ResumeComment", ResumeCommentSchema);

export default ResumeComment;
