import express from 'express';
import { protect } from '../Middlewares/AuthMiddleware.js';
import { chat, explainConcept, genarateQuiz, generateFlashcards, generateSummary, getChatHistory } from '../Controllers/aiController.js';

const router = express.Router(); 
router.post('/generate-flashcard',protect ,generateFlashcards);
router.post('/generate-quiz',protect ,genarateQuiz);
router.post('/generate-summary',protect ,generateSummary);
router.post('/chat',protect ,chat);
router.post('/explain-concept',protect ,explainConcept);
router.get('/chat-history',protect ,getChatHistory);

export default router