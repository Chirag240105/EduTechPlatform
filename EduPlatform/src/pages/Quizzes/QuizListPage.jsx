import React, { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { gsap } from "gsap";
import {toast} from "react-toastify";
import { getDocuments } from "../../Services/documentService";
import { getQuizzesByDocument } from "../../Services/quizService";
import { deleteQuiz } from "../../Services/quizService";
import { HelpCircle, FileText, Trash2, Loader2, Play, Award } from "lucide-react";

export default function QuizListPage() {
  const [searchParams] = useSearchParams();
  const documentId = searchParams.get("document");
  const [documents, setDocuments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const listRef = useRef(null);

  useEffect(() => {
    const loadDocs = async () => {
      try {
        const res = await getDocuments();
        setDocuments(res.data?.data ?? []);
      } catch (_) {
        setDocuments([]);
      }
    };
    loadDocs();
  }, []);

  const quizFun = async() =>{
     if (!documentId) {
      setQuizzes([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    await getQuizzesByDocument(documentId)
      .then((res) => {
        if (!cancelled) setQuizzes(res.data?.data ?? []);
      })
      .catch(() => {
        if (!cancelled) toast.error("Failed to load quizzes");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }

  useEffect(() => {
  quizFun()
  }, [documentId]);

  useEffect(() => {
    if (!loading && listRef.current?.children?.length) {
      gsap.fromTo(
        listRef.current.children,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, stagger: 0.04, ease: "power2.out" }
      );
    }
  }, [loading, quizzes.length]);

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Delete this quiz?")) return;
    setDeletingId(id);
    try {
      await deleteQuiz(id);
      setQuizzes((prev) => prev.filter((q) => q._id !== id));
      toast.success("Quiz deleted");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const selectedDoc = documents.find((d) => d._id === documentId);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-[var(--color-text)] mb-6 flex items-center gap-2">
        <HelpCircle className="w-7 h-7 text-[var(--color-primary)]" />
        Quizzes
      </h1>

      {/* Document filter */}
      <section className="mb-8">
        <h2 className="text-sm font-medium text-[var(--color-text-muted)] mb-3">By document</h2>
        <div className="flex flex-wrap gap-2">
          {documents.map((doc) => (
            <Link
              key={doc._id}
              to={`/quizzes?document=${doc._id}`}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius)] border text-sm transition-colors ${
                documentId === doc._id
                  ? "bg-[var(--color-primary)]/20 border-[var(--color-primary)] text-[var(--color-primary)]"
                  : "bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)]/50"
              }`}
            >
              <FileText className="w-4 h-4" />
              {doc.title || doc.fileName}
            </Link>
          ))}
          {documents.length === 0 && (
            <p className="text-[var(--color-text-muted)] text-sm">No documents. Upload from Dashboard.</p>
          )}
        </div>
      </section>

      {documentId && (
        <>
          <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">
            {selectedDoc ? (selectedDoc.title || selectedDoc.fileName) : "Quizzes"}
          </h2>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-10 h-10 animate-spin text-[var(--color-primary)]" />
            </div>
          ) : (
            <ul ref={listRef} className="space-y-3">
              {quizzes.length === 0 ? (
                <li className="rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-border)] p-8 text-center text-[var(--color-text-muted)]">
                  No quizzes for this document. Generate one from the document page.
                </li>
              ) : (
                quizzes.map((q) => (
                  <li key={q._id}>
                    <div className="flex items-center gap-3 p-4 rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-border)]">
                      <div className="flex-shrink-0 w-10 h-10 rounded-[var(--radius)] bg-[var(--color-primary)]/20 flex items-center justify-center">
                        <HelpCircle className="w-5 h-5 text-[var(--color-primary)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[var(--color-text)]">{q.title}</p>
                        <p className="text-sm text-[var(--color-text-muted)]">
                          {q.totalQuestions} questions
                          {q.completedAt != null && ` · Score: ${q.score}/${q.totalQuestions}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {q.completedAt ? (
                          <Link
                            to={`/quiz/${q._id}/result`}
                            className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius)] bg-[var(--color-surface-hover)] text-[var(--color-text)] hover:bg-[var(--color-primary)]/20 text-sm"
                          >
                            <Award className="w-4 h-4" /> Result
                          </Link>
                        ) : (
                          <Link
                            to={`/quiz/${q._id}/take`}
                            className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius)] bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] text-sm"
                          >
                            <Play className="w-4 h-4" /> Take
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={(e) => handleDelete(q._id, e)}
                          disabled={deletingId === q._id}
                          className="p-2 rounded-[var(--radius)] text-[var(--color-text-muted)] hover:bg-[var(--color-error)]/20 hover:text-[var(--color-error)]"
                          aria-label="Delete quiz"
                        >
                          {deletingId === q._id ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Trash2 className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
