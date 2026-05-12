"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  UploadCloud,
  FileText,
  Loader2,
  Sparkles,
  MapPin,
  Briefcase,
  User,
  Phone,
  Mail,
  Tag,
  User2,
  CheckCircle2,
  XCircle,
  X,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PRIMARY = "#0530AD";

const CLOUDINARY_FOLDER = "HireMatrix";

// Theme-aware reusable styles
const CARD =
  "backdrop-blur-xl border shadow-2xl transition-colors duration-300 bg-white/80 border-black/10 dark:bg-[#0B1120]/80 dark:border-white/10";

const INPUT =
  "w-full rounded-2xl border px-5 py-4 outline-none transition-all duration-300 backdrop-blur-md bg-white/70 border-black/10 text-black placeholder:text-black/45 focus:border-[#0530AD] focus:ring-2 focus:ring-[#0530AD]/20 dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder:text-white/40";

const LABEL =
  "mb-3 flex items-center gap-2 text-sm font-medium text-black/80 dark:text-white/80";

const TEXT =
  "text-black dark:text-white";

const MUTED =
  "text-black/65 dark:text-white/65";

// Toast Component
function Toast({
  type = "success",
  message = "",
  show = false,
  onClose,
}: {
  type: "success" | "error";
  message: string;
  show: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className={`fixed left-1/2 top-6 z-999 flex min-w-[300px] -translate-x-1/2 items-center gap-2 rounded-2xl px-6 py-4 shadow-2xl backdrop-blur-xl ${type === "success"
              ? "border border-green-400/20 bg-green-500 text-white"
              : "border border-red-400/20 bg-red-500 text-white"
            }`}
        >
          {type === "success" ? (
            <CheckCircle2 className="h-6 w-6" />
          ) : (
            <XCircle className="h-6 w-6" />
          )}

          <span className="font-medium">{message}</span>

          <button
            className="ml-auto text-white/80 transition hover:text-white"
            onClick={onClose}
            aria-label="Close toast"
          >
            ×
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function UploadPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [form, setForm] = useState({
    name: "",
    role: "",
    phone: "",
    email: "",
    LinkedIn: "",
    location: "",
    experience: "",
    keywords: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  // REDIRECT IF NOT LOGGED IN
  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/");
    }
  }, [isLoaded, user, router]);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast.show) {
      const t = setTimeout(() => {
        setToast((prev) => ({
          ...prev,
          show: false,
        }));
      }, 3000);

      return () => clearTimeout(t);
    }
  }, [toast.show]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <Loader2
          className="h-10 w-10 animate-spin"
          style={{ color: PRIMARY }}
        />
      </div>
    );
  }

  if (!user) return null;

  // INPUT CHANGE
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // FILE DROP
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    setDragActive(false);

    if (e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  // FILE SELECT
  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  // REMOVE FILE
  const handleRemoveFile = () => {
    setFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // REPLACE FILE
  const handleReplaceFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  // UPLOAD
  const handleUpload = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const requiredFields = [
      { key: "name", label: "Candidate Name" },
      { key: "role", label: "Role / Position" },
      { key: "phone", label: "Phone Number" },
      { key: "email", label: "Email Address" },
      { key: "location", label: "Location" },
      { key: "experience", label: "Experience" },
      { key: "keywords", label: "Skills / Keywords" },
    ];

    for (const field of requiredFields) {
      if (
        !form[field.key as keyof typeof form] ||
        !String(
          form[field.key as keyof typeof form]
        ).trim()
      ) {
        setToast({
          show: true,
          message: `Please fill out the "${field.label}" field.`,
          type: "error",
        });

        return;
      }
    }

    if (!file) {
      setToast({
        show: true,
        message: "Please upload a resume",
        type: "error",
      });

      return;
    }

    setLoading(true);

    try {
      // SIGNATURE
      const sigRes = await fetch(
        "/api/resumes/upload-signature",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            folder: CLOUDINARY_FOLDER,
          }),
        }
      );

      const { timestamp, signature } =
        await sigRes.json();

      // CLOUDINARY UPLOAD
      const data = new FormData();

      data.append("file", file);

      data.append(
        "api_key",
        process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!
      );

      data.append("timestamp", timestamp);

      data.append("signature", signature);

      data.append("folder", CLOUDINARY_FOLDER);

      setUploadProgress(30);

      const cloud = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
        {
          method: "POST",
          body: data,
        }
      );

      const cloudData = await cloud.json();

      setUploadProgress(70);

      // SAVE TO DB
      await fetch("/api/resumes", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          ...form,

          uploadedBy: user.fullName,

          uploadedById: user.id,

          keywords: form.keywords
            .split(",")
            .map((keyword) => keyword.trim())
            .filter(Boolean),

          fileUrl: cloudData.secure_url,

          public_id: cloudData.public_id,

          fileType: cloudData.format,
        }),
      });

      setUploadProgress(100);

      setToast({
        show: true,
        message: "Resume uploaded successfully!",
        type: "success",
      });

      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
    } catch (err) {
      console.error(err);

      setToast({
        show: true,
        message: "Upload failed",
        type: "error",
      });
    }

    setLoading(false);
  };

  return (
    <>
      {/* TOAST */}
      <Toast
        type={toast.type}
        message={toast.message}
        show={toast.show}
        onClose={() =>
          setToast((prev) => ({
            ...prev,
            show: false,
          }))
        }
      />

      <main className="relative min-h-screen overflow-hidden bg-[#f8fafc] dark:bg-[#020817] px-4 py-16 transition-colors duration-300">        {/* GLOW */}
        <div
          className="absolute left-[-120px] top-[-120px] h-[300px] w-[300px] rounded-full blur-3xl"
          style={{ background: "#0530AD22" }}
        />

        <div
          className="absolute bottom-[-120px] right-[-120px] h-[300px] w-[300px] rounded-full blur-3xl"
          style={{ background: "#0530AD18" }}
        />

        <div className="relative z-10 mx-auto max-w-5xl">
          {/* TITLE */}
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className={`mb-12 text-center ${TEXT}`}
          >
            <div
              className="mb-7 flex justify-center"
            >
              <div
                className="inline-flex items-center gap-3 rounded-full border border-blue-200 bg-gradient-to-r from-[#e3f2fd99] to-[#f1f5fd77] px-6 py-2.5 shadow-lg backdrop-blur-md transition hover:scale-105 hover:border-blue-400/60 hover:shadow-xl"
                style={{
                  color: PRIMARY,
                  boxShadow: "0 4px 18px 0 rgba(5,48,173,0.10)",
                }}
              >
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100"
                  style={{
                    boxShadow: "0 2px 8px #60a5fa33",
                  }}
                >
                  <Sparkles
                    className="h-4 w-4 "
                    style={{ color: PRIMARY }}
                  />
                </span>
                <span className="ml-1 text-base font-semibold tracking-wide text-blue-800 dark:text-blue-300" style={{ letterSpacing: '0.03em' }}>
                  Upload Candidate Resume
                </span>
              </div>
            </div>

            <h1
              className="mx-auto w-fit bg-gradient-to-br  bg-clip-text py-2 text-5xl font-extrabold tracking-tight text-transparent drop-shadow-lg transition-colors duration-300"
              style={{
                letterSpacing: "0.02em",
                textShadow:
                  "0 8px 36px rgba(60, 130, 246, .11), 0 1.5px 0 #2563eb22",
              }}
            >
              <span className="pr-3 text-[#0530AD]">Smart</span>
              <span className="inline-block px-2 py-0.5 rounded-lg text-[#0530AD]">
                Resume Upload
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl rounded-xl bg-white/70 px-6 py-4 text-lg text-slate-700 shadow-inner transition-colors duration-300 dark:bg-[#112157aa] dark:text-blue-100">
              <span className="font-semibold text-blue-600 dark:text-blue-200 tracking-wide">
                Store
              </span>{" "}
              and{" "}
              <span className="font-semibold text-blue-600 dark:text-blue-200 tracking-wide">
                organize
              </span>{" "}
              resumes with an{" "}
              <span className="rounded  px-2 py-0.5 font-medium text-[#0530AD] ">
                elegant recruiter workflow
              </span>{" "}
              powered by <span className="font-bold text-blue-800 dark:text-blue-300 underline decoration-wavy underline-offset-4">HireMatrix</span>.
            </p>


          </motion.div>

          {/* FORM */}
          <motion.div
            initial={{
              opacity: 0,
              y: 40,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className={`${CARD} rounded-[32px] p-8`}
          >
            <form
              onSubmit={handleUpload}
              className="space-y-8"
            >
              {/* GRID */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <InputField
                  icon={<User color={PRIMARY} />}
                  name="name"
                  placeholder="Candidate Name"
                  value={form.name}
                  onChange={handleChange}
                  required={true}
                />

                <InputField
                  icon={<Briefcase color={PRIMARY} />}
                  name="role"
                  placeholder="Role / Position"
                  value={form.role}
                  onChange={handleChange}
                  required={true}
                />

                <InputField
                  icon={<Phone color={PRIMARY} />}
                  name="phone"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  required={true}
                />

                <InputField
                  icon={<Mail color={PRIMARY} />}
                  name="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  required={true}
                />

                <InputField
                  icon={<User2 color={PRIMARY} />}
                  name="LinkedIn"
                  placeholder="LinkedIn"
                  value={form.LinkedIn}
                  onChange={handleChange}
                  required={false}
                />

                <InputField
                  icon={<MapPin color={PRIMARY} />}
                  name="location"
                  placeholder="Location"
                  value={form.location}
                  onChange={handleChange}
                  required={true}
                />

                <InputField
                  icon={<Briefcase color={PRIMARY} />}
                  name="experience"
                  placeholder="Experience"
                  value={form.experience}
                  onChange={handleChange}
                  required={true}
                />
              </div>

              {/* KEYWORDS */}
              <div>
                <label className={LABEL}>
                  <Tag
                    className="h-4 w-4"
                    style={{ color: PRIMARY }}
                  />

                  Skills / Keywords
                </label>

                <input
                  type="text"
                  name="keywords"
                  value={form.keywords}
                  onChange={handleChange}
                  placeholder="React, Node.js, MongoDB, UI/UX..."
                  className={INPUT}
                  required
                />

                <p className={`mt-2 text-sm ${MUTED}`}>
                  Separate skills with commas
                </p>
              </div>

              {/* FILE UPLOAD */}
              <div>
                <label className={LABEL}>
                  Resume File
                </label>

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() =>
                    setDragActive(false)
                  }
                  onDrop={handleDrop}
                  className={`relative rounded-3xl border-2 border-dashed p-10 text-center transition-all duration-300 ${dragActive
                      ? "border-[#0530AD] bg-[#0530AD11]"
                      : "border-black/10 bg-white/70 dark:border-white/10 dark:bg-white/5"
                    }`}
                  style={{
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileSelect}
                    className="absolute inset-0 cursor-pointer opacity-0"
                    ref={fileInputRef}
                    required={!file}
                  />

                  <div className="flex flex-col items-center">
                    <div
                      className="mb-5 flex h-20 w-20 items-center justify-center rounded-full"
                      style={{
                        background: "#0530AD18",
                      }}
                    >
                      <UploadCloud
                        className="h-10 w-10"
                        style={{ color: PRIMARY }}
                      />
                    </div>

                    <h3
                      className={`text-2xl font-bold ${TEXT}`}
                    >
                      Drag & Drop Resume
                    </h3>

                    <p className={`mt-2 ${MUTED}`}>
                      PDF, DOC, DOCX Supported
                    </p>

                    {file && (
                      <div className="relative mt-5 flex items-center gap-3 rounded-2xl border border-[#0530AD22] bg-[#0530AD0D] px-5 py-3 backdrop-blur-md">
                        <FileText
                          style={{ color: PRIMARY }}
                        />

                        <span
                          className={`break-all text-sm ${TEXT}`}
                        >
                          {file.name}
                        </span>

                        <button
                          type="button"
                          title="Replace file"
                          onClick={handleReplaceFile}
                          className="ml-3 flex items-center rounded px-1 py-1 text-blue-500 transition hover:text-blue-700 dark:hover:text-blue-300"
                        >
                          <RefreshCw className="h-4 w-4" />

                          <span className="sr-only">
                            Replace
                          </span>
                        </button>

                        <button
                          type="button"
                          title="Remove file"
                          onClick={handleRemoveFile}
                          className="ml-1 flex items-center rounded px-1 py-1 text-red-500 transition hover:text-red-700 dark:hover:text-red-300"
                        >
                          <X className="h-4 w-4" />

                          <span className="sr-only">
                            Remove
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {file && (
                  <div className="mt-2 flex justify-center gap-3 sm:hidden">
                    <button
                      type="button"
                      onClick={handleReplaceFile}
                      className="flex items-center gap-1 rounded px-2 py-1 text-sm text-blue-500 transition hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Replace file
                    </button>

                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="flex items-center gap-1 rounded px-2 py-1 text-sm text-red-500 transition hover:text-red-700 dark:hover:text-red-300"
                    >
                      <X className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* PROGRESS */}
              {loading && (
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className={MUTED}>
                      Uploading...
                    </span>

                    <span style={{ color: PRIMARY }}>
                      {uploadProgress}%
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                    <div
                      style={{
                        width: `${uploadProgress}%`,
                        background:
                          "linear-gradient(90deg, #0530AD, #001B59 90%)",
                      }}
                      className="h-full rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              )}

              {/* BUTTON */}
              <button
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#0530AD] to-[#001B59] px-8 py-4 text-lg font-semibold text-white shadow-2xl shadow-blue-700/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-blue-700/40 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Uploading Resume...
                  </>
                ) : (
                  <>
                    <UploadCloud className="h-5 w-5" />
                    Upload Resume
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </main>
    </>
  );
}

// INPUT COMPONENT
function InputField({
  icon,
  name,
  placeholder,
  value,
  onChange,
  required = false,
}: {
  icon: React.ReactNode;
  name: string;
  placeholder: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className={LABEL}>
        <span style={{ color: "#0530AD" }}>
          {icon}
        </span>

        {placeholder}

        {required && (
          <span className="ml-1 text-red-400 dark:text-red-300">
            *
          </span>
        )}
      </label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={INPUT}
        required={required}
      />
    </div>
  );
}