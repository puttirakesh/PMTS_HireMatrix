"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export interface ResumeCardResume {
  _id: string;
  userId: string;
  userName?: string; // who shared/uploaded
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

export interface ResumeCardProps {
  resume: ResumeCardResume;
  canDelete?: boolean;
}

export default function ResumeCard({ resume, canDelete = true }: ResumeCardProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const [comments, setComments] = useState<ResumeComment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [commentUpdating, setCommentUpdating] = useState(false);

  useEffect(() => {
    // Fetch comments for this resume
    const fetchComments = async () => {
      setLoadingComments(true);
      try {
        const res = await fetch(`/api/resumes/${resume._id}/comments`);
        const data = await res.json();
        setComments(Array.isArray(data) ? data : []);
      } catch (err) {
        setComments([]);
      }
      setLoadingComments(false);
    };

    fetchComments();
  }, [resume._id]);

  const handleDelete = async () => {
    if (!confirm("Delete this résumé?")) return;
    await fetch(`/api/resumes/${resume._id}`, { method: "DELETE" });
    router.refresh();
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!session?.user) return;
    setCommentSubmitting(true);
    try {
      const res = await fetch(`/api/resumes/${resume._id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: commentText.trim(),
        }),
      });
      const newComment = await res.json();
      setComments((prev) => [newComment, ...prev]);
      setCommentText("");
    } catch {
      // handle error as needed
    }
    setCommentSubmitting(false);
  };

  const startEditingComment = (comment: ResumeComment) => {
    setEditingCommentId(comment._id);
    setEditingText(comment.message);
  };

  const cancelEditingComment = () => {
    setEditingCommentId(null);
    setEditingText("");
  };

  const handleCommentUpdate = async (commentId: string) => {
    if (!editingText.trim()) return;
    setCommentUpdating(true);
    try {
      const res = await fetch(`/api/resumes/${resume._id}/comments/${commentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: editingText.trim() }),
      });
      const updatedComment = await res.json();
      if (res.ok) {
        setComments((prev) =>
          prev.map((comment) =>
            comment._id === commentId ? { ...comment, ...updatedComment } : comment
          )
        );
        cancelEditingComment();
      }
    } catch {
      // handle error as needed
    }
    setCommentUpdating(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5 hover:shadow-lg transition-shadow group">
      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-col max-w-[80%]">
          <h3 className="font-semibold text-lg text-slate-800 truncate">
            {resume.name}
          </h3>
          <span className="text-xs text-slate-400 mt-0.5">
            Shared by: <span className="font-medium text-indigo-700">{resume.userName || "Unknown"}</span>
          </span>
        </div>
        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
          {resume.fileType?.toUpperCase() || "PDF"}
        </span>
      </div>
      <p className="text-slate-600 text-sm mb-2">{resume.role}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
        {resume.email ? (
          <p className="text-xs text-slate-500 break-all">
            <span className="font-semibold text-slate-700">Email:</span>{" "}
            <a href={`mailto:${resume.email}`} className="text-indigo-600 hover:text-indigo-800">
              {resume.email}
            </a>
          </p>
        ) : null}
        {resume.phone ? (
          <p className="text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Phone:</span>{" "}
            <a href={`tel:${resume.phone}`} className="text-indigo-600 hover:text-indigo-800">
              {resume.phone}
            </a>
          </p>
        ) : null}
        {resume.location ? (
          <p className="text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Location:</span> {resume.location}
          </p>
        ) : null}
        {resume.experience ? (
          <p className="text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Experience:</span> {resume.experience} years
          </p>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {resume.keywords?.map((tag) => (
          <span
            key={tag}
            className="inline-block bg-slate-100 text-slate-600 rounded-full px-2.5 py-0.5 text-xs font-medium"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex justify-between items-center pt-3 border-t border-slate-100 mb-3">
        <a
          href={resume.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center space-x-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <span>View</span>
        </a>
        {canDelete ? (
          <button
            onClick={handleDelete}
            className="text-sm text-red-500 hover:text-red-700 flex items-center space-x-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Delete</span>
          </button>
        ) : (
          <span className="text-xs text-slate-400">Shared by another user</span>
        )}
      </div>

      {/* Comments Section */}
      <div className="mt-2">
        <div className="font-semibold text-slate-700 mb-2">Comments</div>
        {/* Comment Form */}
        {session?.user ? (
          <form onSubmit={handleCommentSubmit} className="flex gap-2 mb-4">
            <input
              type="text"
              className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={commentSubmitting}
            />
            <button
              type="submit"
              disabled={commentSubmitting || !commentText.trim()}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {commentSubmitting ? "Posting..." : "Post"}
            </button>
          </form>
        ) : (
          <div className="text-xs text-gray-400 mb-3">Log in to comment</div>
        )}

        {/* Existing Comments */}
        <div className="max-h-40 overflow-y-auto">
          {loadingComments ? (
            <div className="text-xs text-gray-400">Loading comments...</div>
          ) : comments.length === 0 ? (
            <div className="text-xs text-gray-400">No comments yet</div>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="mb-2 flex items-start gap-2">
                <div className="shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-semibold text-indigo-700 text-xs uppercase">
                  {comment.userName ? comment.userName[0] : "U"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">{comment.userName}</span>
                    <span className="text-xs text-slate-400">{new Date(comment.createdAt).toLocaleString()}</span>
                  </div>
                  {editingCommentId === comment._id ? (
                    <div className="mt-1">
                      <textarea
                        className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                        rows={2}
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        disabled={commentUpdating}
                      />
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => handleCommentUpdate(comment._id)}
                          disabled={commentUpdating || !editingText.trim()}
                          className="text-xs px-2 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                        >
                          {commentUpdating ? "Saving..." : "Save"}
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditingComment}
                          disabled={commentUpdating}
                          className="text-xs px-2 py-1 rounded border border-slate-300 text-slate-600 hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-slate-700">{comment.message}</div>
                  )}
                  {session?.user?.id === comment.userId && editingCommentId !== comment._id ? (
                    <button
                      type="button"
                      onClick={() => startEditingComment(comment)}
                      className="text-xs text-indigo-600 hover:text-indigo-800 mt-1"
                    >
                      Edit
                    </button>
                  ) : null}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}