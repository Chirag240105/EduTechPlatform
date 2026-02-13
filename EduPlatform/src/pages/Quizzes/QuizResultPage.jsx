import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { gsap } from "gsap";
import { getQuizById } from "../../Services/quizService";
import { Loader2, Award, Check, X, RotateCcw } from "lucide-react";

export default function QuizResultPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const resultRef = useRef(null);

  useEffect(() => {
    if (!id) return;
    getQuizById(id)
      .then((res) => setQuiz(res.data?.data ?? null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!quiz || !resultRef.current) return;
    gsap.fromTo(
      resultRef.current,
      { scale: 0.95, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.2)" }
    );
  }, [quiz]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="max-w-lg mx-auto text-center py-12 text-[var(--color-text-muted)]">
        Quiz not found.
      </div>
    );
  }

  const total = quiz.totalQuestions ?? 0;
  const score = quiz.score ?? 0;
  const percentage = total ? Math.round((score / total) * 100) : 0;
  const userAnswers = quiz.userAnswer ?? [];
  const questions = quiz.questions ?? [];

  return (
    <div className="max-w-2xl mx-auto">
      <div ref={resultRef} className="rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-border)] p-6 md:p-8 mb-8">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center mb-4">
            <Award className="w-8 h-8 text-[var(--color-primary)]" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">{quiz.title}</h1>
          <p className="text-[var(--color-text-muted)] mt-1">Quiz completed</p>
          <div className="mt-6 text-4xl font-bold text-[var(--color-text)]">
            {score} <span className="text-lg font-normal text-[var(--color-text-muted)]">/ {total}</span>
          </div>
          <p className={`text-lg font-semibold mt-2 ${
            percentage >= 70 ? "text-[var(--color-success)]" : percentage >= 50 ? "text-[var(--color-warning)]" : "text-[var(--color-error)]"
          }`}>
            {percentage}%
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            to={`/quiz/${id}/take`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius)] bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)]"
          >
            <RotateCcw className="w-4 h-4" /> Retake
          </Link>
          <Link
            to="/quizzes"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius)] bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]"
          >
            All quizzes
          </Link>
        </div>
      </div>

      {questions.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">Review</h2>
          <ul className="space-y-4">
            {questions.map((q, i) => {
              const ua = userAnswers.find((a) => a.questionIndex === i);
              const isCorrect = ua?.isCorrect ?? false;
              return (
                <li
                  key={i}
                  className="rounded-[var(--radius)] bg-[var(--color-surface)] border border-[var(--color-border)] p-4"
                >
                  <div className="flex items-start gap-3">
                    <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                      isCorrect ? "bg-[var(--color-success)]/20 text-[var(--color-success)]" : "bg-[var(--color-error)]/20 text-[var(--color-error)]"
                    }`}>
                      {isCorrect ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium text-[var(--color-text)]">{q.question}</p>
                      <p className="text-sm text-[var(--color-text-muted)] mt-1">
                        Your answer: {ua?.selectedAnswer ?? "—"}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
