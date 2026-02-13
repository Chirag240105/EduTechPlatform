import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import toast from "react-hot-toast";
import { getAllFlashcardSets } from "../../Services/flashCardService";
import { deleteFlashcardSet } from "../../Services/flashCardService";
import { Layers, Trash2, Loader2, BookOpen } from "lucide-react";

export default function FlashCardList() {
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const listRef = useRef(null);

  const load = async () => {
    try {
      const res = await getAllFlashcardSets();
      setSets(res.data?.data ?? []);
    } catch (e) {
      toast.error("Failed to load flashcards");
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
  }, [loading, sets.length]);

  const handleDelete = async (setId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Delete this flashcard set?")) return;
    setDeletingId(setId);
    try {
      await deleteFlashcardSet(setId);
      setSets((prev) => prev.filter((s) => s._id !== setId));
      toast.success("Set deleted");
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
      <h1 className="text-2xl font-bold text-[var(--color-text)] mb-6 flex items-center gap-2">
        <Layers className="w-7 h-7 text-[var(--color-primary)]" />
        Flashcard sets
      </h1>

      <ul ref={listRef} className="space-y-3">
        {sets.length === 0 ? (
          <li className="rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-border)] p-8 text-center text-[var(--color-text-muted)]">
            No flashcard sets. Generate from a document detail page.
          </li>
        ) : (
          sets.map((set) => (
            <li key={set._id}>
              <Link
                to={`/flashcard/${set.documentId?._id ?? set.documentId}`}
                className="flex items-center gap-3 p-4 rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 transition-colors group"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-[var(--radius)] bg-[var(--color-primary)]/20 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-[var(--color-primary)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[var(--color-text)]">
                    {set.documentId?.title ?? "Document"}
                  </p>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {set.cards?.length ?? 0} cards
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/document/${set.documentId?._id ?? set.documentId}`}
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-[var(--radius)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
                    aria-label="Open document"
                  >
                    <BookOpen className="w-5 h-5" />
                  </Link>
                  <button
                    type="button"
                    onClick={(e) => handleDelete(set._id, e)}
                    disabled={deletingId === set._id}
                    className="p-2 rounded-[var(--radius)] text-[var(--color-text-muted)] hover:bg-[var(--color-error)]/20 hover:text-[var(--color-error)]"
                    aria-label="Delete set"
                  >
                    {deletingId === set._id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
