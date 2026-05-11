"use client";

import { useEffect, useState, useRef } from "react";
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
  Pencil,
  Loader2,
  UploadCloud,
  FileText,
  Plus,
  ArrowLeft,
} from "lucide-react";
import { motion } from "framer-motion";

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
  onResumeUpdated?: (updatedResume: ResumeCardResume) => void;
  onResumeDeleted?: (deletedId: string) => void;
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function ResumeCard({
  resume,
  canDelete = false,
  onResumeUpdated,
  onResumeDeleted,
}: ResumeCardProps) {
  const router = useRouter();
  const { user } = useUser();

  // Comments state
  const [comments, setComments] = useState<ResumeComment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentError, setCommentError] = useState("");
  const [expandedComments, setExpandedComments] = useState(false);

  // Edit Page modal state
  const [editMode, setEditMode] = useState<boolean>(false);
  const [updating, setUpdating] = useState(false);
  const [newFile, setNewFile] = useState<File | null>(null);
  // Used to persist alert for required edit before leaving
  const [preventExit, setPreventExit] = useState(false);

  const [editForm, setEditForm] = useState({
    name: resume.name || "",
    role: resume.role || "",
    phone: resume.phone || "",
    email: resume.email || "",
    location: resume.location || "",
    experience: resume.experience || "",
    keywords: resume.keywords?.join(", ") || "",
  });

  useEffect(() => {
    if (!resume._id || !resume.fileUrl) {
      router.refresh();
    }
  }, [resume._id, resume.fileUrl, router]);

  const CLOUDINARY_FOLDER = "HireMatrix";
  const MAX_VISIBLE_KEYWORDS = 5;
  const [showAllKeywords, setShowAllKeywords] = useState(false);

  // --- Body scroll lock for editMode ---
  useEffect(() => {
    if (editMode) {
      // Lock background scroll
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "calc(var(--scrollbar-width, 0px))";
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    // On mount, set --scrollbar-width css var just once if not present
    if (typeof window !== "undefined" && !document.body.style.getPropertyValue("--scrollbar-width")) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.setProperty("--scrollbar-width", `${scrollbarWidth}px`);
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [editMode]);

  // Comments fetching
  useEffect(() => {
    let isMounted = true;
    async function fetchComments() {
      try {
        setLoadingComments(true);
        setCommentError("");
        const res = await fetch(`/api/resumes/${resume._id}/comments`);
        if (!res.ok) throw new Error("Failed to fetch comments");
        const data = (await res.json()) as ResumeComment[];
        if (isMounted) setComments(Array.isArray(data) ? data : []);
      } catch (error) {
        if (isMounted)
          setCommentError(getErrorMessage(error, "Failed loading comments"));
      } finally {
        if (isMounted) setLoadingComments(false);
      }
    }
    fetchComments();
    return () => {
      isMounted = false;
    };
  }, [resume._id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this resume permanently?")) return;
    try {
      const res = await fetch(`/api/resumes/${resume._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Unable to delete resume");
      onResumeDeleted?.(resume._id);
    } catch (error) {
      alert(getErrorMessage(error, "Failed deleting resume"));
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      setCommentSubmitting(true);
      setCommentError(""); // Clear old errors for this action
      const res = await fetch(`/api/resumes/${resume._id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: commentText }),
      });
      if (!res.ok) throw new Error("Unable to post comment");
      const data = (await res.json()) as ResumeComment;
      setComments((prev) => [data, ...prev]);
      setCommentText("");
      // Expand comments & scroll into view if just posted
      setExpandedComments(true);
      setTimeout(() => {
        const commentsPanel = document.getElementById(`comments-content-${resume._id}`);
        if (commentsPanel) {
          commentsPanel.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 200);
    } catch (error) {
      setCommentError(getErrorMessage(error, "Failed posting comment"));
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleCommentDelete = async (commentId: string) => {
    try {
      setCommentError("");
      const res = await fetch(
        `/api/resumes/${resume._id}/comments/${commentId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Unable to delete comment");
      setComments((prev) => prev.filter((comment) => comment._id !== commentId));
    } catch (error) {
      setCommentError(getErrorMessage(error, "Failed deleting comment"));
    }
  };

  const userOwnsResume = user?.id === resume.userId;
  const gmailUrl = resume.email
    ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(resume.email)}`
    : "";

  async function uploadReplacementFile(file: File) {
    const sigRes = await fetch("/api/resumes/upload-signature", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folder: CLOUDINARY_FOLDER }),
    });
    const { timestamp, signature } = await sigRes.json();
    const data = new FormData();
    data.append("file", file);
    data.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
    data.append("timestamp", timestamp);
    data.append("signature", signature);
    data.append("folder", CLOUDINARY_FOLDER);

    const cloud = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
      { method: "POST", body: data }
    );
    return await cloud.json();
  }

  async function handleUpdateResume() {
    try {
      setUpdating(true);
      let updatedFileUrl = resume.fileUrl;
      let updatedPublicId = resume.public_id;
      let updatedFileType = resume.fileType;

      // File replacement
      if (newFile) {
        const uploaded = await uploadReplacementFile(newFile);
        updatedFileUrl = uploaded.secure_url + `?updated=${Date.now()}`;
        updatedPublicId = uploaded.public_id;
        updatedFileType = uploaded.format;
      }

      const res = await fetch(`/api/resumes/${resume._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editForm.name,
          role: editForm.role,
          phone: editForm.phone,
          email: editForm.email,
          location: editForm.location,
          experience: editForm.experience,
          keywords: editForm.keywords
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean),
          fileUrl: updatedFileUrl,
          public_id: updatedPublicId,
          fileType: updatedFileType,
        }),
      });

      if (!res.ok) throw new Error("Failed to update resume");
      const updatedResume = await res.json();
      onResumeUpdated?.(updatedResume);
      setEditMode(false);
      setPreventExit(false);
      alert("Resume updated successfully!");
    } catch (error) {
      alert(getErrorMessage(error, "Update failed"));
    } finally {
      setUpdating(false);
    }
  }

  // Try block navigation if edit mode is enabled (back, ESC, click outside)
  useEffect(() => {
    if (!editMode) return;

    // Prevent browser from navigating away (refresh, close, etc)
    const beforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", beforeUnload);

    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
    };
  }, [editMode]);

  // Optionally: block ESC key and field click when editing, and block navigation
  useEffect(() => {
    if (!editMode) return;
    // Prevent browser back
    const onPopState = (e: PopStateEvent) => {
      if (editMode) {
        setPreventExit(true);
        window.history.pushState(null, "");
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, [editMode]);

  // Reset alert if user returns to form
  useEffect(() => {
    if (!editMode) setPreventExit(false);
  }, [editMode]);

  // --- EDIT PAGE FORM as a beautiful full-page overlay, extra rounded, soft shadows, and all ---
  if (editMode) {
    return (
      <div
        className="fixed inset-0 z-50 bg-gradient-to-tr from-blue-100/80 via-blue-50/80 to-blue-200/80 flex justify-center items-start overflow-auto"
        style={{
          minHeight: "100vh",
          width: "100vw",
          // All children are contained, no vertical restriction here
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.97 }}
          className="w-full max-w-2xl mx-auto rounded-[2.5rem] border border-blue-100 shadow-2xl shadow-blue-200/40 bg-gradient-to-b from-blue-50 via-white to-blue-100 p-0 overflow-visible relative my-14 flex flex-col"
          style={{
            minHeight: "70vh",
            maxHeight: "none",
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Sticky header */}
          <div className="flex items-center justify-between px-10 pt-9 pb-4 border-b-2 border-blue-100 bg-white/80 sticky top-0 z-10 rounded-t-[2.4rem]">
            <div className="flex items-center gap-4">
              <span className="rounded-full shadow ring-2 ring-blue-100 bg-blue-50 flex items-center justify-center h-12 w-12">
                <User2 className="h-8 w-8 text-blue-600" />
              </span>
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">
                  Edit Resume: <span className="text-blue-700">{resume.name}</span>
                </h2>
                <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
                  <Sparkles className="h-4 w-4 text-blue-400" />
                  <span>
                    Shared by{" "}
                    <span className="font-semibold text-blue-600">
                      {resume.userName || "Unknown"}
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <button
              disabled={updating}
              onClick={() => setPreventExit(true)}
              className="ml-3 flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-blue-700 rounded-xl bg-white shadow-lg border border-blue-100 ring-1 ring-inset ring-blue-100/15 active:bg-blue-50 transition"
              tabIndex={-1}
              aria-label="Back"
            >
              <ArrowLeft className="h-6 w-6" />
              Back
            </button>
          </div>

          {/* Required warning if trying to back/exit */}
          {preventExit && (
            <div className="flex items-center gap-3 bg-yellow-50 p-4 px-10 border-b-2 border-yellow-200 sticky top-[84px] z-10 rounded-b-2xl shadow-yellow-100/40 shadow">
              <span className="text-yellow-800 font-semibold text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-yellow-400" />
                Please save your changes to exit editing.
              </span>
              <button
                className="ml-auto font-medium underline text-blue-700 text-sm hover:text-blue-900"
                onClick={() => setPreventExit(false)}
              >
                Continue Editing
              </button>
            </div>
          )}

          {/* Beautiful scrollable edit form */}
          {!preventExit && (
            <div className="flex-1 relative overflow-auto px-10 py-10 bg-gradient-to-br from-white/90 to-blue-50/80 rounded-b-[2.4rem]">
              <form
                className="grid grid-cols-1 gap-8"
                style={{
                  background: "rgba(251,252,255,0.98)",
                  borderRadius: "2rem",
                  boxShadow: "0 4px 24px 0 rgba(77,141,245,0.065)",
                  minHeight: "0",
                  padding: "2rem 1.5rem"
                }}
                onSubmit={e => {
                  e.preventDefault();
                  handleUpdateResume();
                }}
                autoComplete="off"
                spellCheck={false}
              >
                {/* Editable Details Section */}
                <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label className="block mb-1 text-base font-bold text-gray-700">Full Name</label>
                    <input
                      value={editForm.name}
                      onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                      placeholder="Name"
                      className="rounded-2xl border border-blue-200 focus:ring-2 focus:ring-blue-200 p-4 w-full text-base bg-white/80 shadow transition focus:bg-blue-50"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="block mb-1 text-base font-bold text-gray-700">Role</label>
                    <input
                      value={editForm.role}
                      onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                      placeholder="Role"
                      className="rounded-2xl border border-blue-200 focus:ring-2 focus:ring-blue-200 p-4 w-full text-base bg-white/80 shadow transition focus:bg-blue-50"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="block mb-1 text-base font-bold text-gray-700">Phone</label>
                    <input
                      value={editForm.phone}
                      onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                      placeholder="Phone"
                      className="rounded-2xl border border-blue-200 focus:ring-2 focus:ring-blue-200 p-4 w-full text-base bg-white/80 shadow transition focus:bg-blue-50"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="block mb-1 text-base font-bold text-gray-700">Email</label>
                    <input
                      value={editForm.email}
                      onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                      placeholder="Email"
                      className="rounded-2xl border border-blue-200 focus:ring-2 focus:ring-blue-200 p-4 w-full text-base bg-white/80 shadow transition focus:bg-blue-50"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="block mb-1 text-base font-bold text-gray-700">Location</label>
                    <input
                      value={editForm.location}
                      onChange={e => setEditForm({ ...editForm, location: e.target.value })}
                      placeholder="Location"
                      className="rounded-2xl border border-blue-200 focus:ring-2 focus:ring-blue-200 p-4 w-full text-base bg-white/80 shadow transition focus:bg-blue-50"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="block mb-1 text-base font-bold text-gray-700">Experience</label>
                    <input
                      value={editForm.experience}
                      onChange={e => setEditForm({ ...editForm, experience: e.target.value })}
                      placeholder="Experience"
                      className="rounded-2xl border border-blue-200 focus:ring-2 focus:ring-blue-200 p-4 w-full text-base bg-white/80 shadow transition focus:bg-blue-50"
                    />
                  </div>
                </div>

                {/* Keywords Section */}
                <div className="w-full flex flex-col gap-2">
                  <label className="block mb-1 text-base font-bold text-gray-700">
                    Skills/Keywords <span className="font-normal text-gray-400">(comma separated)</span>
                  </label>
                  <textarea
                    value={editForm.keywords}
                    onChange={e => setEditForm({ ...editForm, keywords: e.target.value })}
                    placeholder="Keywords (e.g. React, Node.js, UI/UX, SQL...)"
                    className="w-full rounded-2xl border border-blue-200 focus:ring-2 focus:ring-blue-200 px-4 py-3 text-base bg-white/80 shadow transition focus:bg-blue-50"
                    rows={2}
                  />
                </div>

                {/* File Upload Section */}
                <div className="flex flex-col gap-2">
                  <label className="block text-base font-bold text-gray-700 mb-1">
                    Replace Resume File
                    <span className="ml-2 text-xs font-normal text-gray-400">(optional)</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-dashed border-blue-200 p-5 transition hover:bg-blue-50 bg-blue-100/60 shadow-inner">
                    <UploadCloud className="h-6 w-6 text-blue-600" />
                    <span className="text-base text-blue-700 font-semibold">
                      Upload new PDF/DOCX
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={e => {
                        if (e.target.files?.[0]) setNewFile(e.target.files[0]);
                      }}
                    />
                  </label>
                  {newFile && (
                    <div className="mt-3 flex items-center gap-2 text-base text-blue-700 font-semibold rounded-xl bg-blue-50/80 py-2 px-3 shadow-sm">
                      <FileText className="h-4 w-4" />
                      {newFile.name}
                    </div>
                  )}
                  {!newFile && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-500 italic rounded-xl bg-gray-100/60 py-2 px-3">
                      <FileText className="h-4 w-4" />
                      Current File:{" "}
                      <a
                        href={resume.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline font-medium"
                      >
                        {resume.fileType ? resume.fileType.toUpperCase() : "PDF/DOC"}
                      </a>
                    </div>
                  )}
                </div>

                {/* Save Changes Button */}
                <button
                  type="submit"
                  disabled={updating}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 py-4 text-lg font-extrabold text-white shadow-xl hover:shadow-blue-300/60 hover:from-blue-700 hover:to-blue-600 transition hover:scale-[1.025] disabled:opacity-60 focus:outline-none"
                >
                  {updating ?
                    (<><Loader2 className="h-5 w-5 animate-spin" /> Updating...</>) :
                    (<><Pencil className="h-5 w-5" /> Save Changes</>)
                  }
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  // --- DEFAULT (non-edit) Resume Card ---
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: "0 4px 18px 0 rgba(77,141,245,0.07)" }}
      className="
        relative overflow-visible
        rounded-2xl
        border border-gray-200
        bg-white
        shadow-md
        transition-all duration-300
        flex flex-col
        h-full min-h-[480px]
      "
      style={{
        minWidth: 340,
        maxWidth: 420,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="relative z-10 p-7 flex flex-col flex-1 h-full">
        {/* TOP: Name, Role, FileType, Edit */}
        <div className="flex flex-col gap-2 mb-2">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1 flex gap-2 items-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-500">
                <User2 className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-2xl font-bold text-gray-900">
                  {resume.name}
                </h2>
                <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                  <Briefcase className="h-4 w-4" />
                  {resume.role}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="rounded-full border border-blue-200 bg-blue-50 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-blue-600">
                {resume.fileType || "FILE"}
              </div>
              {userOwnsResume && (
                <button
                  onClick={() => setEditMode(true)}
                  className="
                    flex items-center gap-2
                    rounded-xl
                    border border-blue-200
                    bg-blue-50
                    px-4 py-2
                    text-sm font-medium
                    text-blue-600
                    transition
                    hover:bg-blue-100
                  "
                  aria-label="Edit Resume"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </button>
              )}
            </div>
          </div>
          {/* Shared By and Date in same row */}
          <div className="flex items-center gap-5 mt-1 text-sm text-gray-500 flex-wrap">
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

        {/* DETAILS */}
        <div className="mt-4 space-y-3 text-sm">
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
              {resume.experience} years
            </div>
          )}
        </div>

        {/* SKILLS/TAGS w/ +more */}
        {resume.keywords?.length > 0 && (
          <div className="mt-6">
            <div className="flex flex-wrap gap-2">
              {(showAllKeywords
                ? resume.keywords
                : resume.keywords.slice(0, MAX_VISIBLE_KEYWORDS)
              ).map((tag, idx) => (
                <span
                  key={tag + idx}
                  className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                >
                  {tag}
                </span>
              ))}
              {!showAllKeywords &&
                resume.keywords.length > MAX_VISIBLE_KEYWORDS && (
                  <button
                    type="button"
                    onClick={() => setShowAllKeywords(true)}
                    className="rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-semibold text-blue-600 flex items-center gap-1 hover:bg-blue-50"
                    aria-label="Show more skills"
                  >
                    <Plus className="h-4 w-4" /> +{resume.keywords.length - MAX_VISIBLE_KEYWORDS} more
                  </button>
                )}
              {showAllKeywords &&
                resume.keywords.length > MAX_VISIBLE_KEYWORDS && (
                  <button
                    type="button"
                    onClick={() => setShowAllKeywords(false)}
                    className="ml-1 px-3 py-1 rounded-full border border-blue-200 bg-white text-xs font-semibold text-blue-600 hover:bg-blue-50"
                    aria-label="Show fewer skills"
                  >
                    Show less
                  </button>
                )}
            </div>
          </div>
        )}

        {/* Action Row: Open Resume, Mail, Delete - always one line */}
        <div className="mt-7 flex flex-row items-center gap-3 flex-nowrap">
          {/* Always show External Link */}
          {!!resume.fileUrl && (
            <a
              href={resume.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[90px] inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:scale-[1.02] hover:bg-blue-700 whitespace-nowrap"
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
              className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-5 py-3 text-sm font-medium text-blue-600 transition hover:bg-blue-50 hover:border-blue-300"
            >
              <Mail className="h-4 w-4" />
              Mail
            </a>
          )}
          {canDelete && userOwnsResume && (
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-medium text-red-500 transition hover:bg-red-100"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          )}
        </div>

        {/* COMMENTS */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <button
            onClick={() => setExpandedComments((prev) => !prev)}
            className="flex w-full items-center justify-between text-left text-blue-600 font-semibold hover:text-blue-800 transition"
            aria-expanded={expandedComments}
            aria-controls={`comments-content-${resume._id}`}
          >
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-blue-500" />
              <span className="font-semibold">Recruiter Discussion</span>
            </div>
            <span className="text-sm text-gray-500">
              {loadingComments ? "..." : `${comments.length} comment${comments.length !== 1 ? "s" : ""}`}
            </span>
          </button>
          <div
            id={`comments-content-${resume._id}`}
            style={{
              transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1)",
              overflow: expandedComments ? "visible" : "hidden",
              maxHeight: expandedComments
                ? Math.max(350, Math.max(200, comments.length * 110) + 200)
                : 0,
              opacity: expandedComments ? 1 : 0,
              pointerEvents: expandedComments ? "auto" : "none",
              minHeight: expandedComments
                ? Math.max(200, Math.min(comments.length * 84 + 200, 900))
                : 0,
            }}
            aria-hidden={!expandedComments}
          >
            <div className="pt-5">
              {user && (
                <form
                  onSubmit={handleCommentSubmit}
                  className="flex gap-3"
                >
                  <input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add recruiter note..."
                    className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-400 transition"
                  />
                  <button
                    disabled={commentSubmitting}
                    className="rounded-xl bg-blue-600 px-5 py-3 text-white transition hover:bg-blue-700 disabled:opacity-60"
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
                  <p className="text-sm text-gray-400">
                    Loading comments...
                  </p>
                ) : comments.length === 0 ? (
                  <p className="text-sm text-gray-400">
                    No recruiter notes yet.
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div
                      key={comment._id}
                      className="rounded-xl border border-gray-200 bg-gray-50 p-4"
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
                        {new Intl.DateTimeFormat("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }).format(new Date(comment.createdAt))}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Spacer to give room if comments are open or grow */}
        <div
          className="flex-shrink-0 transition-all"
          style={{
            minHeight: expandedComments
              ? Math.min(comments.length * 70, 320)
              : 0,
            transition: "min-height .3s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      </div>
    </motion.article>
  );
}