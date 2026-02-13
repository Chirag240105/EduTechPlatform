import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getDocument } from "../../Services/documentService";
import { generateSummary, chat, explainConcept, getChatHistory } from "../../Services/aiService";
import { generateFlashcards } from "../../Services/aiService";
import { generateQuiz } from "../../Services/aiService";
import {
  FileText,
  Loader2,
  Send,
  Sparkles,
  Layers,
  HelpCircle,
  MessageSquare,
  BookOpen,
} from "lucide-react";

export default function DocumentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [concept, setConcept] = useState("");
  const [explanation, setExplanation] = useState("");
  const [explainLoading, setExplainLoading] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [genFlashLoading, setGenFlashLoading] = useState(false);
  const [genQuizLoading, setGenQuizLoading] = useState(false);
  const chatEndRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const res = await getDocument(id);
        setDoc(res.data?.data ?? null);
      } catch (e) {
        toast.error("Document not found");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    if (!doc || !contentRef.current) return;
    gsap.fromTo(contentRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4 });
  }, [doc]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const loadChatHistory = async () => {
    if (!id) return;
    try {
      const res = await getChatHistory(id);
      const messages = res.data?.data?.messages ?? [];
      setChatHistory(messages);
    } catch (_) {}
  };

  const handleSummary = async () => {
    if (!id) return;
    setSummaryLoading(true);
    try {
      const res = await generateSummary(id);
      setSummary(res.data?.summary ?? "");
      toast.success("Summary generated");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to generate summary");
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleExplain = async (e) => {
    e.preventDefault();
    if (!id || !concept.trim()) {
      toast.error("Enter a concept");
      return;
    }
    setExplainLoading(true);
    setExplanation("");
    try {
      const res = await explainConcept(id, concept.trim());
      setExplanation(res.data?.explanation ?? "");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to explain");
    } finally {
      setExplainLoading(false);
    }
  };

  const handleChat = async (e) => {
    e.preventDefault();
    if (!id || !chatMessage.trim()) return;
    const msg = chatMessage.trim();
    setChatMessage("");
    setChatHistory((prev) => [...prev, { role: "user", content: msg }]);
    setChatLoading(true);
    try {
      const res = await chat(id, msg);
      setChatHistory((prev) => [...prev, { role: "assistant", content: res.data?.response ?? "" }]);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Chat failed");
      setChatHistory((prev) => prev.slice(0, -1));
    } finally {
      setChatLoading(false);
    }
  };

  const handleGenerateFlashcards = async () => {
    if (!id) return;
    setGenFlashLoading(true);
    try {
      await generateFlashcards(id);
      toast.success("Flashcards generated");
      navigate(`/flashcard/${id}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Generation failed");
    } finally {
      setGenFlashLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!id) return;
    setGenQuizLoading(true);
    try {
      const res = await generateQuiz(id);
      const quizId = res.data?.data?._id;
      if (quizId) {
        toast.success("Quiz created");
        navigate(`/quiz/${quizId}/take`);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Generation failed");
    } finally {
      setGenQuizLoading(false);
    }
  };

  if (loading || !doc) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto" ref={contentRef}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)] flex items-center gap-2">
          <FileText className="w-7 h-7 text-[var(--color-primary)]" />
          {doc.title || doc.fileName}
        </h1>
        <p className="text-[var(--color-text-muted)] text-sm mt-1">
          Flashcards: {doc.flashcardCount ?? 0} · Quizzes: {doc.quizCount ?? 0}
        </p>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Link
          to={`/flashcard/${id}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius)] bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)]"
        >
          <Layers className="w-4 h-4" /> Study flashcards
        </Link>
        <Link
          to={`/quizzes?document=${id}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius)] bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)]"
        >
          <HelpCircle className="w-4 h-4" /> Quizzes
        </Link>
        <button
          type="button"
          onClick={handleGenerateFlashcards}
          disabled={genFlashLoading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius)] bg-[var(--color-primary)]/20 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/30 disabled:opacity-50"
        >
          {genFlashLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Generate flashcards
        </button>
        <button
          type="button"
          onClick={handleGenerateQuiz}
          disabled={genQuizLoading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius)] bg-[var(--color-primary)]/20 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/30 disabled:opacity-50"
        >
          {genQuizLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Generate quiz
        </button>
      </div>

      {/* Summary */}
      <section className="rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-border)] p-4 md:p-6 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Summary
          </h2>
          <button
            type="button"
            onClick={handleSummary}
            disabled={summaryLoading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius)] bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-hover)] disabled:opacity-50"
          >
            {summaryLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Generate
          </button>
        </div>
        {summary ? (
          <div className="mt-4 prose prose-invert prose-sm max-w-none text-[var(--color-text)]">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{summary}</ReactMarkdown>
          </div>
        ) : (
          <p className="mt-4 text-[var(--color-text-muted)] text-sm">Click Generate to create a summary from the document.</p>
        )}
      </section>

      {/* Explain concept */}
      <section className="rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-border)] p-4 md:p-6 mb-6">
        <h2 className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5" />
          Explain concept
        </h2>
        <form onSubmit={handleExplain} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="e.g. recursion, binary search"
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            className="flex-1 min-w-0 px-3 py-2 rounded-[var(--radius)] bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]"
          />
          <button
            type="submit"
            disabled={explainLoading}
            className="px-4 py-2 rounded-[var(--radius)] bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-hover)] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {explainLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Explain"}
          </button>
        </form>
        {explanation && (
          <div className="mt-4 prose prose-invert prose-sm max-w-none text-[var(--color-text)]">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{explanation}</ReactMarkdown>
          </div>
        )}
      </section>

      {/* Chat */}
      <section className="rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-border)] p-4 md:p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Chat with document
          </h2>
          <button
            type="button"
            onClick={loadChatHistory}
            className="text-sm text-[var(--color-primary)] hover:underline"
          >
            Load history
          </button>
        </div>
        <div className="max-h-[320px] overflow-y-auto space-y-3 mb-4 min-h-[120px]">
          {chatHistory.length === 0 && (
            <p className="text-[var(--color-text-muted)] text-sm">Ask anything about this document.</p>
          )}
          {chatHistory.map((m, i) => (
            <div
              key={i}
              className={`p-3 rounded-[var(--radius)] text-sm ${
                m.role === "user"
                  ? "ml-4 bg-[var(--color-primary)]/20 text-[var(--color-text)]"
                  : "mr-4 bg-[var(--color-surface-hover)] text-[var(--color-text)]"
              }`}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
            </div>
          ))}
          {chatLoading && (
            <div className="flex items-center gap-2 text-[var(--color-text-muted)] text-sm">
              <Loader2 className="w-4 h-4 animate-spin" /> Thinking...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <form onSubmit={handleChat} className="flex gap-2">
          <input
            type="text"
            placeholder="Ask a question..."
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            disabled={chatLoading}
            className="flex-1 min-w-0 px-3 py-2 rounded-[var(--radius)] bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]"
          />
          <button
            type="submit"
            disabled={chatLoading}
            className="p-2 rounded-[var(--radius)] bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </section>
    </div>
  );
}
