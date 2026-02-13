import express from 'express';
import { protect } from '../Middlewares/AuthMiddleware.js';
import { deleteFlashcardSet, getAllFlashcardSets, getFlashcards, reviewFlashcard, toggleStarFlashCard } from '../Controllers/flashcardController.js';

const router = express.Router();
router.use(protect);

router.get('/', getAllFlashcardSets);
router.get('/:documentId', getFlashcards);
router.post('/:cardId/review', reviewFlashcard);
router.put('/:cardId/star', toggleStarFlashCard);
router.delete('/set/:id', deleteFlashcardSet);

export default router;