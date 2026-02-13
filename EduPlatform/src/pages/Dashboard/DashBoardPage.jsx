import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import toast from "react-hot-toast";
import { getProgress } from "../../Services/progressService";
import { getDocuments } from "../../Services/documentService";
import { uploadDocument } from "../../Services/documentService";
import {
  FileText,
  Layers,
  HelpCircle,
  TrendingUp,
  Upload,
  Loader2,
  FileStack,
  Award,
} from "lucide-react";

const statCards = [
  { key: "totalDocument", label: "Documents", icon: FileText, color: "from-violet-500/20 to-purple-600/10", iconColor: "text-violet-400" },
  { key: "totalFlashcardSets", label: "Flashcard sets", icon: Layers, color: "from-cyan-500/20 to-blue-600/10", iconColor: "text-cyan-400" },
  { key: "totalFlashcards", label: "Flashcards", icon: FileStack, color: "from-emerald-500/20 to-teal-600/10", iconColor: "text-emerald-400" },
  { key: "completedQuizzes", label: "Quizzes done", icon: HelpCircle, color: "from-amber-500/20 to-orange-600/10", iconColor: "text-amber-400" },
  { key: "averageScore", label: "Avg score", icon: TrendingUp, color: "from-rose-500/20 to-pink-600/10", iconColor: "text-rose-400" },
  { key: "studyStreak", label: "Day streak", icon: Award, color: "from-indigo-500/20 to-indigo-600/10", iconColor: "text-indigo-400" },
];

export default function DashBoardPage() {
  const [progress, setProgress] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const cardsRef = useRef([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [progRes, docsRes] = await Promise.all([
          getProgress().catch(() => ({ data: { data: null } })),
          getDocuments().catch(() => ({ data: { data: [] } })),
        ]);
        setProgress(progRes.data?.data ?? null);
        setDocuments(docsRes.data?.data ?? []);
      } catch (e) {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (loading || !cardsRef.current.length) return;
    gsap.fromTo(
      cardsRef.current,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.06, ease: "power2.out" }
    );
  }, [loading]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Choose a PDF file");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (uploadTitle.trim()) formData.append("title", uploadTitle.trim());
      await uploadDocument(formData);
      toast.success("Document uploaded");
      setUploadTitle("");
      setFile(null);
      const res = await getDocuments();
      setDocuments(res.data?.data ?? []);
      const progRes = await getProgress().catch(() => ({}));
      if (progRes.data?.data) setProgress(progRes.data.data);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const overview = progress?.overview ?? {};
  const recentDocs = progress?.recentActivity?.documents ?? documents.slice(0, 5);
  const recentQuizzes = progress?.recentActivity?.quizzes ?? [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl md:text-3xl font-bold text-[var(--color-text)]">Dashboard</h1>
        <p className="text-[var(--color-text-muted)] mt-1">Your learning overview</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" ref={(el) => { if (el) cardsRef.current = el.children; }}>
        {statCards.map(({ key, label, icon: Icon, color, iconColor }) => (
          <div
            key={key}
            className={`rounded-[var(--radius-lg)] p-4 md:p-5 bg-gradient-to-br ${color} border border-white/5`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--color-text-muted)]">{label}</span>
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <p className="mt-2 text-2xl font-bold text-[var(--color-text)]">
              {key === "averageScore" ? `${overview[key] ?? 0}%` : overview[key] ?? 0}
            </p>
          </div>
        ))}
      </div>

      {/* Upload */}
      <section className="rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-border)] p-4 md:p-6">
        <h2 className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload document
        </h2>
        <form onSubmit={handleUpload} className="mt-4 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Title (optional)"
            value={uploadTitle}
            onChange={(e) => setUploadTitle(e.target.value)}
            className="flex-1 min-w-0 px-3 py-2 rounded-[var(--radius)] bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
          />
          <label className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-[var(--radius)] bg-[var(--color-bg)] border border-[var(--color-border)] cursor-pointer hover:border-[var(--color-primary)] transition-colors text-sm text-[var(--color-text-muted)]">
            <Upload className="w-4 h-4" />
            {file ? file.name : "Choose PDF"}
            <input
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>
          <button
            type="submit"
            disabled={uploading}
            className="px-4 py-2 rounded-[var(--radius)] bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-hover)] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Upload"}
          </button>
        </form>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent documents */}
        <section className="rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-border)] p-4 md:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">Recent documents</h2>
            <Link to="/documents" className="text-sm text-[var(--color-primary)] hover:underline">View all</Link>
          </div>
          <ul className="mt-4 space-y-2">
            {recentDocs.length === 0 ? (
              <li className="text-[var(--color-text-muted)] text-sm py-4">No documents yet. Upload a PDF above.</li>
            ) : (
              recentDocs.map((doc) => (
                <li key={doc._id}>
                  <Link
                    to={`/document/${doc._id}`}
                    className="block px-3 py-2 rounded-[var(--radius)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text)] text-sm"
                  >
                    {doc.title || doc.fileName}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </section>

        {/* Recent quizzes */}
        <section className="rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-border)] p-4 md:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">Recent quizzes</h2>
            <Link to="/quizzes" className="text-sm text-[var(--color-primary)] hover:underline">View all</Link>
          </div>
          <ul className="mt-4 space-y-2">
            {recentQuizzes.length === 0 ? (
              <li className="text-[var(--color-text-muted)] text-sm py-4">No quiz attempts yet.</li>
            ) : (
              recentQuizzes.map((q) => (
                <li key={q._id}>
                  <Link
                    to={`/quiz/${q._id}/result`}
                    className="block px-3 py-2 rounded-[var(--radius)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text)] text-sm flex justify-between">
                    <span>{q.title}</span>
                    <span className="text-[var(--color-text-muted)]">{q.score}/{q.totalQuestions}</span>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
