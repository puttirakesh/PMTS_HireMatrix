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
const GLASS = "backdrop-blur-lg bg-white/70 shadow-xl border border-black/10";
const CLOUDINARY_FOLDER = "HireMatrix";

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
          className={`fixed top-6 left-1/2 z-[99] -translate-x-1/2 rounded-xl px-6 py-4 flex items-center gap-2 shadow-lg min-w-[300px] ${
            type === "success"
              ? "bg-green-500/90 text-white"
              : "bg-red-500/90 text-white"
          }`}
        >
          {type === "success" ? (
            <CheckCircle2 className="w-6 h-6" />
          ) : (
            <XCircle className="w-6 h-6" />
          )}
          <span className="font-medium">{message}</span>
          <button
            className="ml-auto text-white/80 hover:text-white"
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

  // For file input ref (to trigger click if replacing)
  const fileInputRef = useRef<HTMLInputElement>(null);

  // TOAST STATE
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });

  // REDIRECT IF NOT LOGGED IN
  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/");
    }
  }, [isLoaded, user, router]);

  // Auto-dismiss toast after 3s
  useEffect(() => {
    if (toast.show) {
      const t = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [toast.show]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-black">
        <Loader2 className="h-10 w-10 animate-spin" style={{ color: PRIMARY }} />
      </div>
    );
  }

  if (!user) return null;

  // INPUT CHANGE
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // FILE DROP
  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>
  ) => {
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

  // Remove the selected file
  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Trigger file input click (for "Replace" option)
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

    // Validate required fields except "LinkedIn"
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
      if (!form[field.key as keyof typeof form] || !String(form[field.key as keyof typeof form]).trim()) {
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
      // 1. SIGNATURE
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

      const { timestamp, signature } = await sigRes.json();

      // 2. CLOUDINARY UPLOAD
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

      // 3. SAVE TO DB
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
      {/* Toast Notification */}
      <Toast
        type={toast.type}
        message={toast.message}
        show={toast.show}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />
      <main className="relative min-h-screen overflow-hidden bg-white px-4 py-16 text-black">
        {/* GLOW */}
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <div
              className="mb-5 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm"
              style={{
                border: `1.5px solid #0530AD22`,
                background: "#0530AD16",
                color: PRIMARY,
              }}
            >
              <Sparkles className="h-4 w-4" style={{ color: PRIMARY }} />
              Upload Candidate Resume
            </div>
            <h1 className="text-5xl font-extrabold md:text-6xl">
              Smart Resume
              <span
                className="bg-clip-text text-transparent"
                style={{
                  background: `linear-gradient(90deg, #0530AD, #001B59 90%)`,
                  WebkitBackgroundClip: "text",
                }}
              >
                {" "}Upload
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-black/50">
              Store and organize resumes with an elegant recruiter workflow powered by HireMatrix.
            </p>
          </motion.div>

          {/* FORM */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${GLASS} rounded-[32px] p-8`}
          >
            <form
              onSubmit={handleUpload}
              className="space-y-8"
            >
              {/* GRID */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* NAME */}
                <InputField
                  icon={<User color={PRIMARY} />}
                  name="name"
                  placeholder="Candidate Name"
                  value={form.name}
                  onChange={handleChange}
                  required={true}
                />
                {/* ROLE */}
                <InputField
                  icon={<Briefcase color={PRIMARY} />}
                  name="role"
                  placeholder="Role / Position"
                  value={form.role}
                  onChange={handleChange}
                  required={true}
                />
                {/* PHONE */}
                <InputField
                  icon={<Phone color={PRIMARY} />}
                  name="phone"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  required={true}
                />
                {/* EMAIL */}
                <InputField
                  icon={<Mail color={PRIMARY} />}
                  name="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  required={true}
                />
                {/* LINKEDIN */}
                <InputField
                  icon={<User2 color={PRIMARY} />}
                  name="LinkedIn"
                  placeholder="LinkedIn"
                  value={form.LinkedIn}
                  onChange={handleChange}
                  required={false}
                />
                {/* LOCATION */}
                <InputField
                  icon={<MapPin color={PRIMARY} />}
                  name="location"
                  placeholder="Location"
                  value={form.location}
                  onChange={handleChange}
                  required={true}
                />
                {/* EXPERIENCE */}
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
                <label className="mb-3 flex items-center gap-2 text-sm font-medium text-black/80">
                  <Tag className="h-4 w-4" style={{ color: PRIMARY }} />
                  Skills / Keywords
                </label>
                <input
                  type="text"
                  name="keywords"
                  value={form.keywords}
                  onChange={handleChange}
                  placeholder="React, Node.js, MongoDB, UI/UX..."
                  className={`w-full rounded-2xl border border-black/10 bg-white/70 px-5 py-4 text-black outline-none transition focus:border-[${PRIMARY}]`}
                  style={{
                    backdropFilter: "blur(8px)",
                  }}
                  required
                />
                <p className="mt-2 text-sm text-black/40">
                  Separate skills with commas
                </p>
              </div>

              {/* FILE UPLOAD */}
              <div>
                <label className="mb-4 block text-sm font-medium text-black/80">
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
                  className={`relative rounded-3xl border-2 border-dashed p-10 text-center transition-all ${
                    dragActive
                      ? "border-[#0530AD] bg-[#0530AD11]"
                      : "border-black/10 bg-white/70"
                  }`}
                  style={{ backdropFilter: "blur(8px)" }}
                >
                  {/* File input - controlled by ref, always present but hidden */}
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileSelect}
                    className="absolute inset-0 cursor-pointer opacity-0"
                    ref={fileInputRef}
                    required={!file}
                  />

                  <div className="flex flex-col items-center">
                    <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full" style={{ background: "#0530AD18" }}>
                      <UploadCloud className="h-10 w-10" style={{ color: PRIMARY }} />
                    </div>
                    <h3 className="text-2xl font-bold text-black">
                      Drag & Drop Resume
                    </h3>
                    <p className="mt-2 text-black/40">
                      PDF, DOC, DOCX Supported
                    </p>
                    {file && (
                      <div className="mt-5 flex items-center gap-3 rounded-2xl border border-[#0530AD22] bg-[#0530AD0D] px-5 py-3 relative">
                        <FileText className="" style={{ color: PRIMARY }} />
                        <span className="text-sm text-black break-all">{file.name}</span>
                        {/* Action buttons for replacing or removing the file */}
                        <button
                          type="button"
                          title="Replace file"
                          onClick={handleReplaceFile}
                          className="ml-3 text-blue-600 hover:text-blue-900 rounded transition-all flex items-center px-1 py-1"
                        >
                          <RefreshCw className="h-4 w-4" />
                          <span className="sr-only">Replace</span>
                        </button>
                        <button
                          type="button"
                          title="Remove file"
                          onClick={handleRemoveFile}
                          className="ml-1 text-red-500 hover:text-red-700 rounded transition-all flex items-center px-1 py-1"
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {file && (
                  <div className="mt-2 flex gap-3 sm:hidden justify-center">
                    <button
                      type="button"
                      onClick={handleReplaceFile}
                      className="flex items-center gap-1 text-blue-600 text-sm hover:text-blue-900 px-2 py-1 rounded transition"
                    >
                      <RefreshCw className="h-4 w-4" /> Replace file
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="flex items-center gap-1 text-red-500 text-sm hover:text-red-700 px-2 py-1 rounded transition"
                    >
                      <X className="h-4 w-4" /> Remove
                    </button>
                  </div>
                )}
              </div>

              {/* PROGRESS */}
              {loading && (
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-black/50">Uploading...</span>
                    <span style={{ color: PRIMARY }}>
                      {uploadProgress}%
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-black/10">
                    <div
                      style={{
                        width: `${uploadProgress}%`,
                        background: `linear-gradient(90deg, #0530AD, #001B59 90%)`,
                      }}
                      className="h-full rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              )}

              {/* BUTTON */}
              <button
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#0530AD] to-[#001B59] px-8 py-4 text-lg font-semibold text-white shadow-2xl shadow-blue-700/20 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
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
      <label className="mb-3 flex items-center gap-2 text-sm font-medium text-black/80">
        <span style={{ color: "#0530AD" }}>
          {icon}
        </span>
        {placeholder}
        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-black/10 bg-white/70 px-5 py-4 text-black outline-none transition"
        style={{
          backdropFilter: "blur(8px)",
        }}
        required={required}
      />
    </div>
  );
}