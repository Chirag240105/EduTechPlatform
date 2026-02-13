import { FlashCard } from "../Models/flashcard.js"


export const getAllFlashcardSets = async(req, res) =>{
    try{
        const flashcardSet = await FlashCard.find({
            userId: req.user._id
        })
        .populate('documentId', 'title')
        .sort({createdAt: -1})
        res.status(200).json({
            success: true,
            count: flashcardSet.length,
            data: flashcardSet
        })
    }catch(err){
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: err.message
        })

    }
    
}
export const getFlashcards = async(req, res) =>{
    try{
        const flashcards = await FlashCard.findOne({
            userId: req.user._id,
            documentId: req.params.documentId
        })
        .populate('documentId', 'title')
        .sort({createdAt : -1});

        if (!flashcards) {
            return res.status(200).json({
                success: true,
                count: 0,
                data: null
            });
        }

        res.status(200).json({
            success: true,
            count: flashcards.cards.length,
            data: flashcards
        })
    }catch(err){
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: err.message
        })
    }
}
export const reviewFlashcard = async(req, res) =>{
    try{
        const flashcardSet = await FlashCard.findOne({
            userId: req.user._id,
            'cards._id': req.params.cardId
        })
        if(!flashcardSet){
            return res.status(404).json({
                success: false,
                message: "Flashcard not found",
                successCode: 404
            })
        }

        const cardIndex = flashcardSet.cards.findIndex(card => card._id.toString() === req.params.cardId);
        if(cardIndex === -1){
            return res.status(404).json({
                success: false,
                message: "Card not found in the set.",
                successCode: 404
            })   
        }

        flashcardSet.cards[cardIndex].lastReviewed = new Date();
        flashcardSet.cards[cardIndex].reviewCount += 1;

        await flashcardSet.save();

        res.status(200).json({
            success: true,
            message: "Flashcard reviewed successfully",
            data : flashcardSet,
        })


    }catch(err){
          res.status(500).json({
            success: false,
            message: "Server Error",
            error: err.message
        })
    }

}
export const toggleStarFlashCard = async(req, res) =>{
    try{
        const flashcardSet = await FlashCard.findOne({userId: req.user._id,
            'cards._id': req.params.cardId 
        })
        if(!flashcardSet){
            return res.status(404).json({
                success: false,
                message: 'Flashcard not found',
                successCode: 404
            })
        }
        const cardIndex = flashcardSet.cards.findIndex(card => card._id.toString() === req.params.cardId)

        if(cardIndex === -1){
            return res.status(404).json({
                success: false,
                message: "Card not found",
                statusCode: 404
            })
        }

        flashcardSet.cards[cardIndex].isStarred = !flashcardSet.cards[cardIndex].isStarred;
        await flashcardSet.save();

        res.status(200).json({
            success: true,
            data: flashcardSet,
            message: `Flashcard ${flashcardSet.cards[cardIndex].isStarred ? "starred" : "unstarred"}`
        })
    }catch(err){
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: err.message
        });
    }
}
export const deleteFlashcardSet = async(req, res) =>{
    try{
        const flashcardSet = await FlashCard.findOne({
            userId: req.user._id,
            _id: req.params.id
        })
        if(!flashcardSet){
            return res.status(404).json({
                success: false,
                message: 'FlashcardSet not found',
                successCode: 404
            })
        }

        await flashcardSet.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Flashcard set deleted',
        })
    }catch(err){
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: err.message
        });
    }
}