import express from "express";
import { protect } from "../Middlewares/AuthMiddleware.js";
import {
  getQuizzesByDocument,
  getQuizById,
  submitQuiz,
  deleteQuiz,
} from "../Controllers/quizController.js";

const router = express.Router();
router.use(protect);

router.get("/document/:documentId", getQuizzesByDocument);
router.get("/:id", getQuizById);
router.post("/:id/submit", submitQuiz);
router.delete("/:id", deleteQuiz);

export default router;
