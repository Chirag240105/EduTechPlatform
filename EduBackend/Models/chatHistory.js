import mongoose from "mongoose";

const chatHistorySchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required : true
    },
    documentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
        required : true
    },
    messages:[{
        role:{
            type: String,
            enum: ['user', 'assistant'],
            required: true
        },
        content:{
            type: String,
            required: true,
        },
        timestamps:{
            type: Date,
            default: Date.now()
        },
        releventChunks:{
            type: [Number],
            default: []
        }
    }]
}, {timestamps: true})

chatHistorySchema.index({userId: 1, documentId: 1})

export const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);