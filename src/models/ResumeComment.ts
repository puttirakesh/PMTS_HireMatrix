import mongoose, {
  Schema,
  Document,
  Model,
} from "mongoose";

// =========================
// INTERFACE
// =========================

export interface IResumeComment
  extends Document {

  resumeId: mongoose.Types.ObjectId;

  userId: string;

  userName: string;

  userImage?: string;

  message: string;

  likes?: number;

  createdAt: Date;

  updatedAt: Date;
}

// =========================
// SCHEMA
// =========================

const ResumeCommentSchema =
  new Schema<IResumeComment>(
    {
      // RESUME
      resumeId: {
        type: Schema.Types.ObjectId,

        ref: "Resume",

        required: true,

        index: true,
      },

      // USER
      userId: {
        type: String,

        required: true,

        index: true,
      },

      userName: {
        type: String,

        required: true,

        trim: true,
      },

      // OPTIONAL USER IMAGE
      userImage: {
        type: String,
      },

      // COMMENT
      message: {
        type: String,

        required: true,

        trim: true,

        minlength: 1,

        maxlength: 1000,
      },

      // FUTURE FEATURE
      likes: {
        type: Number,

        default: 0,
      },
    },

    {
      timestamps: true,
    }
  );

// =========================
// INDEXES
// =========================

// FAST FETCH COMMENTS
ResumeCommentSchema.index({
  resumeId: 1,
  createdAt: -1,
});

// FAST USER COMMENT LOOKUP
ResumeCommentSchema.index({
  userId: 1,
  createdAt: -1,
});

// =========================
// MODEL
// =========================

const ResumeComment: Model<IResumeComment> =
  mongoose.models.ResumeComment ||
  mongoose.model<IResumeComment>(
    "ResumeComment",
    ResumeCommentSchema
  );

export default ResumeComment;