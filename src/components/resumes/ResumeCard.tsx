"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  ExternalLink,
  Mail,
  MessageCircle,
  Phone,
  MapPin,
  Trash2,
  Send,
  Clock3,
  Briefcase,
  User2,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface ResumeCardResume {
  title: string;
  summary: string;
  skills: never[];
  _id: string;
  userId: string;
  userName?: string;
  name: string;
  role: string;
  phone?: string;
  email?: string;
  location?: string;
  experience?: string;
  keywords: string[];
  fileUrl: string;
  public_id: string;
  fileType?: string;
  isProcessed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ResumeComment {
  _id: string;
  resumeId: string;
  userId: string;
  userName: string;
  message: string;
  createdAt: string;
  updatedAt?: string;
}

interface ResumeCardProps {
  resume: ResumeCardResume;
  canDelete?: boolean;
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function ResumeCard({
  resume,
  canDelete = false,
}: ResumeCardProps) {
  const router = useRouter();
  const { user } = useUser();

  // Fetch states for comments
  const [comments, setComments] = useState<ResumeComment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentError, setCommentError] = useState("");
  const [expandedComments, setExpandedComments] = useState(false);

  useEffect(() => {
    if (!resume._id || !resume.fileUrl) {
      router.refresh();
    }
  }, [resume._id, resume.fileUrl, router]);

  useEffect(() => {
    let active = true;

    async function fetchComments() {
      try {
        setLoadingComments(true);

        const res = await fetch(`/api/resumes/${resume._id}/comments`);
        if (!res.ok) throw new Error("Failed to fetch comments");

        const data = (await res.json()) as ResumeComment[];
        if (active) setComments(Array.isArray(data) ? data : []);
      } catch (error) {
        if (active) setCommentError(getErrorMessage(error, "Failed loading comments"));
      } finally {
        if (active) setLoadingComments(false);
      }
    }

    fetchComments();
    return () => {
      active = false;
    };
  }, [resume._id]);

  const handleDelete = async () => {
    const confirmDelete = confirm("Delete this resume permanently?");
    if (!confirmDelete) return;
    try {
      const res = await fetch(`/api/resumes/${resume._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Unable to delete resume");

      router.refresh();
    } catch (error) {
      alert(getErrorMessage(error, "Failed deleting resume"));
    }
  };

  const handleCommentSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      setCommentSubmitting(true);
      const res = await fetch(`/api/resumes/${resume._id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: commentText }),
      });
      if (!res.ok) throw new Error("Unable to post comment");

      const data = (await res.json()) as ResumeComment;
      setComments((prev) => [data, ...prev]);
      setCommentText("");
    } catch (error) {
      setCommentError(getErrorMessage(error, "Failed posting comment"));
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleCommentDelete = async (commentId: string) => {
    try {
      const res = await fetch(`/api/resumes/${resume._id}/comments/${commentId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Unable to delete comment");
      setComments((prev) => prev.filter((comment) => comment._id !== commentId));
    } catch (error) {
      setCommentError(getErrorMessage(error, "Failed deleting comment"));
    }
  };

  const gmailUrl = resume.email
    ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(resume.email)}`
    : "";

  // =========================
  // MAIN CARD RENDER (Light and Clean)
  // =========================
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: "0 4px 18px 0 rgba(77,141,245,0.07)" }}
      className="
        relative overflow-hidden
        rounded-2xl
        border border-gray-200
        bg-white
        shadow-md
        transition-all duration-300
      "
    >
      <div className="relative z-10 p-7">
        {/* TOP */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-500">
                <User2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="truncate text-2xl font-bold text-gray-900">{resume.name}</h2>
                <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                  <Briefcase className="h-4 w-4" />
                  {resume.role}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Sparkles className="h-4 w-4 text-blue-400" />
                Shared by{" "}
                <span className="font-semibold text-blue-600">
                  {resume.userName || "Unknown"}
                </span>
              </span>
              {resume.createdAt && (
                <span className="flex items-center gap-1">
                  <Clock3 className="h-4 w-4 text-blue-400" />
                  {new Date(resume.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          <div className="rounded-full border border-blue-200 bg-blue-50 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-blue-600">
            {resume.fileType || "FILE"}
          </div>
        </div>

        {/* DETAILS */}
        <div className="mt-7 space-y-4 text-sm">
          {resume.email && (
            <a
              href={`mailto:${resume.email}`}
              className="flex items-center gap-3 text-gray-800 transition hover:text-blue-700 font-medium"
            >
              <Mail className="h-4 w-4 text-blue-500" />
              <span className="truncate">{resume.email}</span>
            </a>
          )}

          {resume.phone && (
            <a
              href={`tel:${resume.phone}`}
              className="flex items-center gap-3 text-gray-800 transition hover:text-blue-700 font-medium"
            >
              <Phone className="h-4 w-4 text-blue-500" />
              {resume.phone}
            </a>
          )}

          {resume.location && (
            <div className="flex items-center gap-3 text-gray-700 font-medium">
              <MapPin className="h-4 w-4 text-blue-500" />
              {resume.location}
            </div>
          )}

          {resume.experience && (
            <div className="flex items-center gap-3 text-gray-700 font-medium">
              <Briefcase className="h-4 w-4 text-blue-500" />
              {resume.experience} experience
            </div>
          )}
        </div>

        {/* TAGS */}
        {resume.keywords?.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {resume.keywords.map((tag) => (
              <span
                key={tag}
                className="
                  rounded-full
                  border border-blue-200
                  bg-blue-50
                  px-3 py-1
                  text-xs font-medium
                  text-blue-700
                "
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* ACTIONS */}
        <div className="mt-7 flex flex-wrap items-center gap-3">
          {!!resume.fileUrl && (
            <a
              href={resume.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center gap-2
                rounded-xl
                bg-blue-600
                px-5 py-3
                text-sm font-semibold
                text-white
                transition
                hover:scale-[1.02]
                hover:bg-blue-700
              "
            >
              <ExternalLink className="h-4 w-4" />
              Open Resume
            </a>
          )}
          {gmailUrl && (
            <a
              href={gmailUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center gap-2
                rounded-xl
                border border-blue-200
                bg-white
                px-5 py-3
                text-sm font-medium
                text-blue-600
                transition
                hover:bg-blue-50
                hover:border-blue-300
              "
            >
              <Mail className="h-4 w-4" />
              Mail
            </a>
          )}
          {canDelete && (
            <button
              onClick={handleDelete}
              className="
                inline-flex items-center gap-2
                rounded-xl
                border border-red-200
                bg-red-50
                px-5 py-3
                text-sm font-medium
                text-red-500
                transition
                hover:bg-red-100
              "
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          )}
        </div>

        {/* COMMENTS */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <button
            onClick={() => setExpandedComments(!expandedComments)}
            className="
              flex w-full items-center justify-between
              text-left
              text-blue-600
              font-semibold
              hover:text-blue-800
              transition
            "
          >
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-blue-500" />
              <span className="font-semibold">Recruiter Discussion</span>
            </div>
            <span className="text-sm text-gray-500">
              {comments.length} comments
            </span>
          </button>

          <AnimatePresence>
            {expandedComments && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                {user && (
                  <form
                    onSubmit={handleCommentSubmit}
                    className="mt-5 flex gap-3"
                  >
                    <input
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add recruiter note..."
                      className="
                        flex-1
                        rounded-xl
                        border border-gray-200
                        bg-white
                        px-4 py-3
                        text-sm text-gray-900
                        outline-none
                        placeholder:text-gray-400
                        focus:border-blue-400
                        transition
                      "
                    />
                    <button
                      disabled={commentSubmitting}
                      className="
                        rounded-xl
                        bg-blue-600
                        px-5 py-3
                        text-white
                        transition
                        hover:bg-blue-700
                        disabled:opacity-60
                      "
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                )}

                {commentError && (
                  <p className="mt-3 text-sm text-red-500">{commentError}</p>
                )}

                <div className="mt-5 space-y-4">
                  {loadingComments ? (
                    <p className="text-sm text-gray-400">Loading comments...</p>
                  ) : comments.length === 0 ? (
                    <p className="text-sm text-gray-400">No recruiter notes yet.</p>
                  ) : (
                    comments.map((comment) => (
                      <div
                        key={comment._id}
                        className="
                          rounded-xl
                          border border-gray-200
                          bg-gray-50
                          p-4
                        "
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-blue-600">
                              {comment.userName}
                            </p>
                            <p className="mt-1 text-sm text-gray-900">
                              {comment.message}
                            </p>
                          </div>
                          {user?.id === comment.userId && (
                            <button
                              onClick={() => handleCommentDelete(comment._id)}
                              className="text-red-500 transition hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        <p className="mt-3 text-xs text-gray-400">
                          {
                            new Intl.DateTimeFormat("en-IN", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            }).format(new Date(comment.createdAt))
                          }
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.article>
  );
}