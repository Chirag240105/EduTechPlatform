export const BASE_URL = "http://localhost:3010";

const API_PATH = {
  AUTH: {
    SIGNUP: "/api/auth/signup",
    LOGIN: "/api/auth/login",
    PROFILE: "/api/auth/profile",
    UPDATE_USER: "/api/auth/updateUser",
    CHANGE_PASSWORD: "/api/auth/change-password",
  },
  DOCUMENT: {
    LIST: "/api/document",
    GET: (id) => `/api/document/${id}`,
    UPLOAD: "/api/document/uploads",
    DELETE: (id) => `/api/document/${id}`,
  },
  FLASHCARD: {
    LIST: "/api/flashcard",
    BY_DOCUMENT: (documentId) => `/api/flashcard/${documentId}`,
    REVIEW: (cardId) => `/api/flashcard/${cardId}/review`,
    TOGGLE_STAR: (cardId) => `/api/flashcard/${cardId}/star`,
    DELETE_SET: (id) => `/api/flashcard/set/${id}`,
  },
  QUIZ: {
    BY_DOCUMENT: (documentId) => `/api/quiz/document/${documentId}`,
    GET: (id) => `/api/quiz/${id}`,
    SUBMIT: (id) => `/api/quiz/${id}/submit`,
    DELETE: (id) => `/api/quiz/${id}`,
  },
  AI: {
    GENERATE_FLASHCARDS: "/api/ai/generate-flashcard",
    GENERATE_QUIZ: "/api/ai/generate-quiz",
    GENERATE_SUMMARY: "/api/ai/generate-summary",
    CHAT: "/api/ai/chat",
    EXPLAIN_CONCEPT: "/api/ai/explain-concept",
    CHAT_HISTORY: "/api/ai/chat-history",
  },
  PROGRESS: {
    GET: "/api/progress/get-progress",
  },
};

export default API_PATH;
