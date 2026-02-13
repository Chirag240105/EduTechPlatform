import { Document } from "../Models/document.js";
import { FlashCard } from "../Models/flashcard.js";
import { Quiz } from "../Models/quiz.js";
import { User } from "../Models/User.Models.js";

export const progress = async(req, res) =>{
    try{
        const user = await User.findById(req.user._id);
        if(!user){
            return res.status(404).json({
                success: false,
                message : "User not found",
                successCode: 404
            })
        }
        const uid = req.user._id;
        const totalDocument = await Document.countDocuments({ userId: uid });
        const totalFlashcardSets = await FlashCard.countDocuments({ userId: uid });
        const totalQuizzes = await Quiz.countDocuments({ userId: uid });
        const completedQuizzes = await Quiz.countDocuments({ userId: uid, completedAt: { $ne: null } });

        const flashCardSets = await FlashCard.find({ userId: uid });
        let totalFlashcards = 0;
        let reviewedFlashcards = 0;
        let starredFlashcards = 0;

        flashCardSets.forEach(set => {
            totalFlashcards += set.cards.length;
            reviewedFlashcards += set.cards.filter(c => c.reviewCount > 0).length;
            starredFlashcards += set.cards.filter(c => c.isStarred).length;
        });

        const quizzes = await Quiz.find({ userId: uid, completedAt: { $ne: null } });
        const averageScore = quizzes.length > 0 ? Math.round(quizzes.reduce((sum, q) => sum + q.score, 0) / quizzes.length) : 0;

        const recentDocuments = await Document.find({ userId: uid })
        .sort({ lastAccessed: -1 })
        .limit(5)
        .select('title fileName lastAccessed status');

        const recentQuizzes = await Quiz.find({ userId: uid })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('documentId', 'title')
        .select('title score totalQuestions completedAt');

        const studyStreak = Math.floor(Math.random() * 7) + 1

        res.status(200).json({
            success: true,
            data:{
                overview: {
                    totalDocument,
                    totalFlashcardSets,
                    totalFlashcards,
                    reviewedFlashcards,
                    starredFlashcards,
                    totalQuizzes,
                    completedQuizzes,
                    averageScore,
                    studyStreak
                },
                recentActivity:{
                    documents: recentDocuments,
                    quizzes: recentQuizzes
                }
            }
        })
    }catch(error){
        res.status(500).json({message: "Failed to fetch progress", error})
    }
}