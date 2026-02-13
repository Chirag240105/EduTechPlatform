import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title:{
        type: String,
        required: [true, 'Please provide a document title'],
        trim: true
    },
    fileName: {
        type: String,
        required: true
    },
    filePath:{
        type: String,
        required: true
    },
    fileSize:{
        type: Number,
        required: true
    },
    extractedText:{
        type: String,
        required: true,
    },
    chunks:[{
        content:{
            type: String,
            required: true
        },
        pageNumber:{
            type: Number,
            default: 0
        },
        chunkIndex:{
            type: Number,
            required: true
        } 
    }],
    uploadData:{
        type: Date,
        default: Date.now()
    },
    lastAccessed:{
        type: Date,
        default: Date.now()
    },
    status:{
        type: String,
        enum:['processing', 'ready', 'failed'],
        default: 'processing'
    },
}, {timestamps: true})


documentSchema.index({userId: 1, uploadData: -1})
export const Document = mongoose.model('Document', documentSchema);