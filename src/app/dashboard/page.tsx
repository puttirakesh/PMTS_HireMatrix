import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/src/lib/db";
import Resume from "@/src/models/Resume";
import ResumeCard, { ResumeCardResume } from "@/src/components/resumes/ResumeCard";
import { Plus, FileText, Sparkles } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  await dbConnect();

  const dbResumes = await Resume.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .lean();

  const resumes: ResumeCardResume[] = dbResumes.map((resume) => ({
    ...resume,
    _id: resume._id.toString(),
    userId: resume.userId.toString(),
    createdAt: resume.createdAt?.toISOString(),
    updatedAt: resume.updatedAt?.toISOString(),
  }));

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-violet-600 mb-2">
              <Sparkles className="w-5 h-5" />
              <span className="uppercase tracking-[2px] text-sm font-medium">Dashboard</span>
            </div>
            <h1 className="text-5xl font-bold tracking-tighter text-slate-900">
              Your Résumés
            </h1>
            <p className="text-slate-600 mt-3 text-lg max-w-md">
              Manage and organize your candidate profiles with elegance
            </p>
          </div>

          <a
            href="/upload"
            className="btn btn-primary shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 transition-all duration-300 flex items-center gap-3 group px-8 h-14 text-base font-medium"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            Upload New Résumé
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <p className="text-sm text-slate-500">Total Résumés</p>
            <p className="text-4xl font-semibold mt-1 text-slate-900">{resumes.length}</p>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <p className="text-sm text-slate-500">This Month</p>
            <p className="text-4xl font-semibold mt-1 text-emerald-600">12</p>
          </div>
        </div>

        {resumes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white/70 backdrop-blur-xl rounded-3xl border border-slate-100 shadow-sm">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <FileText className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-700 mb-2">No résumés yet</h3>
            <p className="text-slate-500 max-w-sm text-center mb-8">
              Upload your first candidate profile to get started.
            </p>
            <a
              href="/dashboard/upload"
              className="btn btn-primary btn-lg shadow-lg shadow-violet-500/30 hover:shadow-xl"
            >
              <Plus className="w-5 h-5 mr-2" />
              Upload Your First Résumé
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <ResumeCard key={resume._id} resume={resume} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}