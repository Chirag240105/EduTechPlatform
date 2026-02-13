import { Document } from "../Models/document.js";
import { FlashCard } from "../Models/flashcard.js";
import { Quiz } from "../Models/quiz.js";
import { ChatHistory } from "../Models/chatHistory.js";
import { generateWithAI } from "../Config/utils/geminiService.js";

const getDocumentContext = async (documentId, userId, maxChars = 8000) => {
  const document = await Document.findOne({
    _id: documentId,
    userId,
  });
  if (!document) return null;
  if (!document.extractedText?.trim()) return null;
  return document.extractedText.slice(0, maxChars);
};

export const generateFlashcards = async (req, res) => {
  try {
    const { documentId } = req.body;
    if (!documentId) {
      return res.status(400).json({
        success: false,
        message: "Document ID is required",
      });
    }

    const context = await getDocumentContext(documentId, req.user._id);
    if (!context) {
      return res.status(404).json({
        success: false,
        message: "Document not found or has no extractable text",
      });
    }

    const prompt = `You are an educational assistant. Generate flashcards from the following document content.

Return ONLY a valid JSON array. Each item must have: question (string), answer (string), difficulty ("easy"|"medium"|"hard").
Generate 6-10 flashcards. No other text, only the JSON array.

DOCUMENT:
${context}

Example format: [{"question":"...","answer":"...","difficulty":"medium"},...]`;

    const raw = await generateWithAI(prompt);
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    const cardsData = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

    const cards = cardsData.map((c) => ({
      question: c.question || String(c.q || ""),
      answers: c.answer || c.answers || "",
      difficulty: ["easy", "medium", "hard"].includes(c.difficulty) ? c.difficulty : "medium",
    }));

    const flashcardSet = await FlashCard.create({
      userId: req.user._id,
      documentId,
      cards,
    });

    res.status(201).json({
      success: true,
      message: "Flashcards generated successfully",
      data: flashcardSet,
    });
  } catch (error) {
    console.error("Generate flashcards error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate flashcards",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const genarateQuiz = async (req, res) => {
  try {
    const { documentId } = req.body;
    if (!documentId) {
      return res.status(400).json({
        success: false,
        message: "Document ID is required",
      });
    }

    const context = await getDocumentContext(documentId, req.user._id);
    if (!context) {
      return res.status(404).json({
        success: false,
        message: "Document not found or has no extractable text",
      });
    }

    const prompt = `You are an educational assistant. Generate a quiz from the following document.

Return ONLY a valid JSON object with:
- title: string (quiz title)
- questions: array of {question: string, options: string[4], correctAnswer: string, difficulty: "easy"|"medium"|"hard"}
Generate 5-10 questions. No other text, only the JSON.

DOCUMENT:
${context}

Example: {"title":"...","questions":[{"question":"...","options":["A","B","C","D"],"correctAnswer":"A","difficulty":"medium"}]}`;

    const raw = await generateWithAI(prompt);
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { title: "Quiz", questions: [] };
    const questions = Array.isArray(parsed.questions) ? parsed.questions : [];

    const quizQuestions = questions.map((q) => ({
      question: q.question || "",
      options: Array.isArray(q.options) && q.options.length === 4 ? q.options : ["A", "B", "C", "D"],
      correctAnswer: q.correctAnswer || q.options?.[0] || "",
      difficulty: ["easy", "medium", "hard"].includes(q.difficulty) ? q.difficulty : "medium",
    }));

    const quiz = await Quiz.create({
      userId: req.user._id,
      documentId,
      title: parsed.title || "Generated Quiz",
      questions: quizQuestions,
      totalQuestions: quizQuestions.length,
    });

    res.status(201).json({
      success: true,
      message: "Quiz generated successfully",
      data: quiz,
    });
  } catch (error) {
    console.error("Generate quiz error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate quiz",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const generateSummary = async (req, res) => {
  try {
    const { documentId } = await req.body;
    if (!documentId) {
      return res.status(400).json({
        success: false,
        message: "Document ID is required",
      });
    }

    const context = await getDocumentContext(documentId, req.user._id);
    if (!context) {
      return res.status(404).json({
        success: false,
        message: "Document not found or has no extractable text",
      });
    }

    const prompt = `Summarize the following document in a clear, structured way. Use bullet points and sections. Keep it concise but comprehensive.

DOCUMENT:
${context}

SUMMARY:`;

    const summary = await generateWithAI(prompt);

    res.status(200).json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error("Generate summary error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate summary",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const chat = async (req, res) => {
  try {
    const { documentId, message } = req.body;
    if (!documentId || !message) {
      return res.status(400).json({
        success: false,
        message: "Document ID and message are required",
      });
    }

    const context = await getDocumentContext(documentId, req.user._id);
    if (!context) {
      return res.status(404).json({
        success: false,
        message: "Document not found or has no extractable text",
      });
    }

    let chatHistory = await ChatHistory.findOne({
      userId: req.user._id,
      documentId,
    });

    if (!chatHistory) {
      chatHistory = await ChatHistory.create({
        userId: req.user._id,
        documentId,
        messages: [],
      });
    }

    const recentMessages =await chatHistory.messages.slice(-10).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const historyStr = recentMessages
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n");

    const prompt = `You are an AI tutor. Answer questions strictly based on the document. If the answer is not in the document, say so.

DOCUMENT:
${context}

${historyStr ? `Previous conversation:\n${historyStr}\n\n` : ""}
User: ${message}

Assistant:`;

    const assistantReply = await generateWithAI(prompt);

    chatHistory.messages.push(
      { role: "user", content: message },
      { role: "assistant", content: assistantReply }
    );
    await chatHistory.save();

    res.status(200).json({
      success: true,
      response: assistantReply,
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process chat",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const explainConcept = async (req, res) => {
  try {
    const { documentId, concept } = req.body;
    if (!documentId || !concept) {
      return res.status(400).json({
        success: false,
        message: "Document ID and concept are required",
      });
    }

    const context = await getDocumentContext(documentId, req.user._id);
    if (!context) {
      return res.status(404).json({
        success: false,
        message: "Document not found or has no extractable text",
      });
    }

    const prompt = `You are an AI tutor. Explain the concept "${concept}" using only information from the document below. Be clear and educational.

DOCUMENT:
${context}

Explanation of "${concept}":`;

    const explanation = await generateWithAI(prompt);

    res.status(200).json({
      success: true,
      explanation,
    });
  } catch (error) {
    console.error("Explain concept error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to explain concept",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const { documentId } = req.query;
    if (!documentId) {
      return res.status(400).json({
        success: false,
        message: "Document ID is required",
      });
    }

    const chatHistory = await ChatHistory.findOne({
      userId: req.user._id,
      documentId,
    });

    res.status(200).json({
      success: true,
      data: chatHistory || { messages: [] },
    });
  } catch (error) {
    console.error("Get chat history error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch chat history",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
