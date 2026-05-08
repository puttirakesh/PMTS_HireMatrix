import mongoose, {
  Schema,
  Document,
  Model,
} from "mongoose";

// =========================
// INTERFACE
// =========================

export interface IResume extends Document {
  userId: string;

  userName?: string;

  name: string;

  role: string;

  phone?: string;

  email?: string;

  linkedin?: string;

  location?: string;

  experience?: string;

  keywords: string[];

  fileUrl: string;

  public_id: string;

  fileType: string;

  fileSize?: number;

  resumeViews?: number;

  commentsCount?: number;

  isProcessed: boolean;

  createdAt: Date;

  updatedAt: Date;
}

// =========================
// SCHEMA
// =========================

const ResumeSchema = new Schema<IResume>(
  {
    // USER
    userId: {
      type: String,
      required: true,
      index: true,
    },

    userName: {
      type: String,
      trim: true,
    },

    // CANDIDATE INFO
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    linkedin: {
      type: String,
      trim: true,
      lowercase: true,
    },

    location: {
      type: String,
      trim: true,
      index: true,
    },

    experience: {
      type: String,
      trim: true,
    },

    // KEYWORDS / TAGS
    keywords: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    // FILE
    fileUrl: {
      type: String,
      required: true,
    },

    public_id: {
      type: String,
      required: true,
      index: true,
    },

    fileType: {
      type: String,
      trim: true,
    },

    fileSize: {
      type: Number,
      default: 0,
    },

    // ANALYTICS
    resumeViews: {
      type: Number,
      default: 0,
    },

    commentsCount: {
      type: Number,
      default: 0,
    },

    // STATUS
    isProcessed: {
      type: Boolean,
      default: false,
      index: true,
    },
  },

  {
    timestamps: true,
  }
);

// =========================
// TEXT SEARCH INDEX
// =========================

ResumeSchema.index({
  name: "text",
  role: "text",
  location: "text",
  keywords: "text",
  experience: "text",
});

// =========================
// COMPOUND INDEXES
// =========================

ResumeSchema.index({
  role: 1,
  location: 1,
});

ResumeSchema.index({
  createdAt: -1,
});

ResumeSchema.index({
  userId: 1,
  createdAt: -1,
});

// =========================
// MODEL
// =========================

const Resume: Model<IResume> =
  mongoose.models.Resume ||
  mongoose.model<IResume>(
    "Resume",
    ResumeSchema
  );

export default Resume;