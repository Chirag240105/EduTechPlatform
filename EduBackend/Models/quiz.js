import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    documentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
        required: true
    },
    title:{
        type: String,
        trim: true,
        required: true
    },
    questions:[{
        question:{
        type: String,
        required: true
    },
    options:{
        type: [String],
        required: true,
        validate: [v => Array.isArray(v) && v.length === 4, 'Options must have exactly 4 items']
    },
    correctAnswer : {
        type: String,
        required: true
    },
    difficulty:{
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default : 'medium'
    }
}],
userAnswer: [{
    questionIndex: {
        type: Number,
        required: true
    },
    selectedAnswer: {
        type: String,
        required: true
    },
    isCorrect:{
        type: Boolean,
        required: true
    },
    answeredAt:{
        type : Date,
        default: Date.now
    }
}],
score:{
    type: Number,
    default: 0
},
totalQuestions:{
    type: Number,
    required: true
},
completedAt:{
    type: Date,
    default: null
}
}, {timestamps: true});
quizSchema.index({userId: 1, documentId: 1});

export const Quiz = mongoose.model('Quiz', quizSchema);