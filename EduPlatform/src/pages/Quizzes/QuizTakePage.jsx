import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import {toast} from "react-toastify";
import { getQuizById } from "../../Services/quizService";
import { submitQuiz } from "../../Services/quizService";
import { Loader2, ChevronRight, ChevronLeft } from "lucide-react";

export default function QuizTakePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const questionRef = useRef(null);

  useEffect(() => {
    if (!id) return;
    getQuizById(id)
      .then((res) => setQuiz(res.data?.data ?? null))
      .catch(() => toast.error("Quiz not found"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!quiz?.questions?.length || !questionRef.current) return;
    gsap.fromTo(
      questionRef.current,
      { x: 20, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.35, ease: "power2.out" }
    );
  }, [currentIndex, quiz?.questions?.length]);

  const questions = quiz?.questions ?? [];
  const question = questions[currentIndex];
  const total = questions.length;

  const getSelected = (qIndex) => {
    const a = answers.find((x) => x.questionIndex === qIndex);
    return a?.selectedAnswer ?? null;
  };

  const setSelected = (qIndex, selectedAnswer) => {
    setAnswers((prev) => {
      const rest = prev.filter((x) => x.questionIndex !== qIndex);
      return [...rest, { questionIndex: qIndex, selectedAnswer }];
    });
  };

  const handleSubmit = async () => {
    const unanswered = questions.length - answers.length;
    if (unanswered > 0 && !toast.warn(`You have ${unanswered} unanswered question(s). Submit anyway?`)) return;
    setSubmitting(true);
    try {
      await submitQuiz(id, answers);
      navigate(`/quiz/${id}/result`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Submit failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !quiz) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="max-w-lg mx-auto text-center py-12 text-[var(--color-text-muted)]">
        No questions in this quiz.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-[var(--color-text)] truncate">{quiz.title}</h1>
        <span className="text-sm text-[var(--color-text-muted)]">
          {currentIndex + 1} / {total}
        </span>
      </div>

      <div
        ref={questionRef}
        className="rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-border)] p-6 mb-6"
      >
        <p className="font-medium text-[var(--color-text)] mb-4">{question.question}</p>
        <ul className="space-y-2">
          {(question.options || []).map((opt, i) => {
            const isSelected = getSelected(currentIndex) === opt;
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => setSelected(currentIndex, opt)}
                  className={`w-full text-left px-4 py-3 rounded-[var(--radius)] border transition-colors ${
                    isSelected
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)]/20 text-[var(--color-text)]"
                      : "border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)]/50"
                  }`}
                >
                  {opt}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className="p-2 rounded-[var(--radius)] bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setCurrentIndex((i) => Math.min(total - 1, i + 1))}
            disabled={currentIndex === total - 1}
            className="p-2 rounded-[var(--radius)] bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        {currentIndex === total - 1 ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="px-5 py-2 rounded-[var(--radius)] bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-hover)] disabled:opacity-50 flex items-center gap-2"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Submit quiz
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setCurrentIndex((i) => Math.min(total - 1, i + 1))}
            className="px-5 py-2 rounded-[var(--radius)] bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-hover)]"
          >
            Next
          </button>
        )}
      </div>

      {/* Question dots */}
      <div className="flex flex-wrap gap-1 mt-6">
        {questions.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrentIndex(i)}
            className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
              i === currentIndex
                ? "bg-[var(--color-primary)] text-white"
                : getSelected(i)
                ? "bg-[var(--color-primary)]/40 text-[var(--color-text)]"
                : "bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)]/50"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
