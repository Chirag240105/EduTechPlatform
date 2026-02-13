import { Quiz } from "../Models/quiz.js";

export const getQuizzesByDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const quizzes = await Quiz.find({
      userId: req.user._id,
      documentId,
    })
      .select("-questions.correctAnswer")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      userId: req.user._id,
    })
      .populate("documentId", "title")
      .select("-questions.correctAnswer");

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    res.status(200).json({
      success: true,
      data: quiz,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

export const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body;
    const quizId = req.params.id;

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "Answers must be an array of { questionIndex, selectedAnswer }",
      });
    }

    const quiz = await Quiz.findOne({
      _id: quizId,
      userId: req.user._id,
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    if (quiz.completedAt) {
      return res.status(400).json({
        success: false,
        message: "Quiz has already been submitted",
      });
    }

    const userAnswers = [];
    let correctCount = 0;

    for (const a of answers) {
      const qIndex = a.questionIndex ?? a.question_index;
      const selected = a.selectedAnswer ?? a.selected_answer;
      const question = quiz.questions[qIndex];

      if (!question) continue;

      const isCorrect = question.correctAnswer === selected;
      if (isCorrect) correctCount++;

      userAnswers.push({
        questionIndex: qIndex,
        selectedAnswer: selected,
        isCorrect,
      });
    }

    quiz.userAnswer = userAnswers;
    quiz.score = correctCount;
    quiz.completedAt = new Date();
    await quiz.save();

    res.status(200).json({
      success: true,
      message: "Quiz submitted successfully",
      data: {
        score: correctCount,
        totalQuestions: quiz.totalQuestions,
        percentage: Math.round((correctCount / quiz.totalQuestions) * 100),
        completedAt: quiz.completedAt,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    await quiz.deleteOne();

    res.status(200).json({
      success: true,
      message: "Quiz deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};
