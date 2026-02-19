import dotenv from 'dotenv';
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url';
dotenv.config();
import express from 'express';
import connectDB from './Config/Db.js';
import router from './Routes/AuthRoutes.js';
import documentRoute from './Routes/documentRoutes.js';
import aiRoute from './Routes/aiRoutes.js';
import flashcardRoute from './Routes/flashcardRoutes.js';
import quizRoute from './Routes/quizRoutes.js';
import progress from './Routes/ProgressRoutes.js'
import { log } from 'console';
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);

const app = express();


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors({
    origin: process.env.CORS_ORIGIN || process.env.URL || "*",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}))

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/auth", router)
app.use("/api/document", documentRoute)
app.use("/api/ai", aiRoute)
app.use("/api/flashcard", flashcardRoute)
app.use("/api/quiz", quizRoute)
app.use("/api/progress", progress)
const port = process.env.PORT || 4000;
connectDB();
app.listen(port, (req, res) => {
    console.log(`Server is running on port || ${port}`);
    
})