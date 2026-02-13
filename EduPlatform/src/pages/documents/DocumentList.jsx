import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import toast from "react-hot-toast";
import { getDocuments } from "../../Services/documentService";
import { deleteDocument } from "../../Services/documentService";
import { FileText, Trash2, Loader2 } from "lucide-react";

export default function DocumentList() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const listRef = useRef(null);

  const load = async () => {
    try {
      const res = await getDocuments();
      setDocuments(res.data?.data ?? []);
    } catch (e) {
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!loading && listRef.current?.children?.length) {
      gsap.fromTo(
        listRef.current.children,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, stagger: 0.04, ease: "power2.out" }
      );
    }
  }, [loading, documents.length]);

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Delete this document and its flashcards/quizzes?")) return;
    setDeletingId(id);
    try {
      await deleteDocument(id);
      setDocuments((prev) => prev.filter((d) => d._id !== id));
      toast.success("Document deleted");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Documents</h1>
      </div>

      <ul ref={listRef} className="space-y-3">
        {documents.length === 0 ? (
          <li className="rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-border)] p-8 text-center text-[var(--color-text-muted)]">
            No documents. Upload from the Dashboard.
          </li>
        ) : (
          documents.map((doc) => (
            <li key={doc._id}>
              <Link
                to={`/document/${doc._id}`}
                className="flex items-center gap-3 p-4 rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 transition-colors group"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-[var(--radius)] bg-[var(--color-primary)]/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[var(--color-primary)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[var(--color-text)] truncate">
                    {doc.title || doc.fileName}
                  </p>
                  <p className="text-sm text-[var(--color-text-muted)]">{doc.fileName}</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => handleDelete(doc._id, e)}
                  disabled={deletingId === doc._id}
                  className="p-2 rounded-[var(--radius)] text-[var(--color-text-muted)] hover:bg-[var(--color-error)]/20 hover:text-[var(--color-error)] transition-colors"
                  aria-label="Delete"
                >
                  {deletingId === doc._id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Trash2 className="w-5 h-5" />
                  )}
                </button>
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
