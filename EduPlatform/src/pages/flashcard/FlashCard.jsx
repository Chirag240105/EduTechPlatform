import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { gsap } from "gsap";
import toast from "react-hot-toast";
import { getFlashcardsByDocument } from "../../Services/flashCardService";
import { reviewFlashcard, toggleStarFlashcard } from "../../Services/flashCardService";
import { ChevronLeft, ChevronRight, Star, Loader2, RotateCcw } from "lucide-react";

export default function FlashCard() {
  const { documentId } = useParams();
  const [set, setSet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [starringId, setStarringId] = useState(null);
  const cardRef = useRef(null);

  const load = async () => {
    if (!documentId) return;
    try {
      const res = await getFlashcardsByDocument(documentId);
      const data = res.data?.data;
      if (data?.cards?.length) setSet(data);
      else setSet(null);
    } catch (e) {
      toast.error("Failed to load flashcards");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [documentId]);

  useEffect(() => {
    setFlipped(false);
  }, [index]);

  useEffect(() => {
    if (!set?.cards?.length || !cardRef.current) return;
    gsap.fromTo(cardRef.current, { scale: 0.96, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" });
  }, [index, set?.cards?.length]);

  const cards = set?.cards ?? [];
  const card = cards[index];
  const total = cards.length;

  const handleReview = async () => {
    if (!card?._id) return;
    try {
      await reviewFlashcard(card._id);
    } catch (e) {
      console.log("Error in reviewing card :",e);
      
    }
  };

  const handleStar = async (e) => {
    e.stopPropagation();
    if (!card?._id) return;
    setStarringId(card._id);
    try {
      await toggleStarFlashcard(card._id);
      setSet((prev) => {
        if (!prev) return prev;
        const next = { ...prev, cards: [...prev.cards] };
        const i = next.cards.findIndex((c) => c._id === card._id);
        if (i !== -1) next.cards[i] = { ...next.cards[i], isStarred: !next.cards[i].isStarred };
        return next;
      });
    } catch (err) {
      toast.error("Failed to update star");
    } finally {
      setStarringId(null);
    }
  };

  const goNext = () => {
    if (flipped && card?._id) handleReview();
    setIndex((i) => (i + 1) % total);
  };

  const goPrev = () => {
    setIndex((i) => (i - 1 + total) % total);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  if (!set || !total) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <p className="text-[var(--color-text-muted)] mb-4">No flashcards for this document.</p>
        <Link
          to={`/document/${documentId}`}
          className="text-[var(--color-primary)] hover:underline"
        >
          Generate flashcards from document
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/flashcard"
          className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] text-sm"
        >
          <ChevronLeft className="w-4 h-4" /> Back to sets
        </Link>
        <span className="text-sm text-[var(--color-text-muted)]">
          {index + 1} / {total}
        </span>
      </div>

      <div
        ref={cardRef}
        className="relative aspect-[4/3] max-h-[360px] rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden cursor-pointer select-none perspective-1000"
        onClick={() => setFlipped((f) => !f)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setFlipped((f) => !f)}
      >
        <div
          className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center transition-transform duration-500 transform-gpu"
          style={{
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            backfaceVisibility: "hidden",
          }}
        >
          <p className="text-[var(--color-text-muted)] text-sm mb-2">Question</p>
          <p className="text-lg md:text-xl font-medium text-[var(--color-text)]">
            {card.question}
          </p>
        </div>
        <div
          className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[var(--color-surface-hover)] transition-transform duration-500 transform-gpu"
          style={{
            transform: flipped ? "rotateY(0deg)" : "rotateY(-180deg)",
            backfaceVisibility: "hidden",
          }}
        >
          <p className="text-[var(--color-text-muted)] text-sm mb-2">Answer</p>
          <p className="text-lg md:text-xl font-medium text-[var(--color-text)]">
            {card.answers}
          </p>
          <button
            type="button"
            onClick={handleStar}
            disabled={starringId === card._id}
            className="absolute top-3 right-3 p-2 rounded-[var(--radius)] hover:bg-[var(--color-surface)]"
            aria-label={card.isStarred ? "Unstar" : "Star"}
          >
            {starringId === card._id ? (
              <Loader2 className="w-5 h-5 animate-spin text-[var(--color-primary)]" />
            ) : (
              <Star
                className={`w-5 h-5 ${card.isStarred ? "fill-amber-400 text-amber-400" : "text-[var(--color-text-muted)]"}`}
              />
            )}
          </button>
        </div>
      </div>

      <p className="text-center text-sm text-[var(--color-text-muted)] mt-2">
        Tap card to flip
      </p>

      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          type="button"
          onClick={goPrev}
          className="p-3 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)] transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          type="button"
          onClick={goNext}
          className="p-3 rounded-full bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] transition-colors flex items-center gap-2"
        >
          Next <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
