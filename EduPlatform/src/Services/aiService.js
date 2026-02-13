import axiosInstances from "../utils/axiosInstances";
import API_PATH from "../utils/APIpath";

export const generateFlashcards = (documentId) =>
  axiosInstances.post(API_PATH.AI.GENERATE_FLASHCARDS, { documentId });

export const generateQuiz = (documentId) =>
  axiosInstances.post(API_PATH.AI.GENERATE_QUIZ, { documentId });

export const generateSummary = (documentId) =>
  axiosInstances.post(API_PATH.AI.GENERATE_SUMMARY, { documentId });

export const chat = (documentId, message) =>
  axiosInstances.post(API_PATH.AI.CHAT, { documentId, message });

export const explainConcept = (documentId, concept) =>
  axiosInstances.post(API_PATH.AI.EXPLAIN_CONCEPT, { documentId, concept });

export const getChatHistory = (documentId) =>
  axiosInstances.get(API_PATH.AI.CHAT_HISTORY, {
    params: { documentId },
  });
