import fs from "fs";
import { Document } from "../Models/document.js";
import { PDFParse } from "pdf-parse";
import { FlashCard } from "../Models/flashcard.js";
import { Quiz } from "../Models/quiz.js";

const chunkText = (text, chunkSize = 1000) => {
  const chunks = [];
  let index = 0;

  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push({
      content: text.slice(i, i + chunkSize),
      chunkIndex: index++,
      pageNumber: 0,
    });
  }
  return chunks;
};

export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "PDF file is required",
      });
    }

    const filePath = req.file.path;
    const fileBuffer = fs.readFileSync(filePath);

   
    const parser = new PDFParse({ data: fileBuffer });
    const pdfData = await parser.getText();
    const extractedText = pdfData.text;

    if (!extractedText || !extractedText.trim()) {
      return res.status(400).json({
        success: false,
        message: "Unable to extract text from PDF",
      });
    }

    const chunks = chunkText(extractedText);

    const document = await Document.create({
      userId: req.user._id,
      title: req.body.title || req.file.originalname,
      fileName: req.file.originalname,
      filePath,
      fileSize: req.file.size,
      extractedText,
      chunks,
      status: "ready",
    });

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      data: document,
    });

  } catch (error) {
    console.error("Upload document Error:", error);
    res.status(500).json({ message: "Document upload failed" });
  }
};

export const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ userId: req.user._id })
      .select("-extractedText -chunks")
      .sort({ createdAt: -1 });

  res.status(200).json({
      success: true,
      count: documents.length,
      data: documents,
    });
  } catch (error) {
    console.log("Get document error : ", error);
    res.status(500).json({ message: "Failed to fetch documents" });
  }
};

export const getDocument = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
        statusCode: 404,
      });
    }
    
const flashcardCount = await FlashCard.countDocuments({documentId: document._id, userId: req.user._id})
const quizCount = await Quiz.countDocuments({documentId: document._id, userId: req.user._id})
  document.lastAccessed = Date.now();
  await document.save(); 

  const documenData = document.toObject();
  documenData.flashcardCount = flashcardCount;
  documenData.quizCount = quizCount;


  res.status(200).json({
      success: true,
      data: documenData
    });
  } catch (error) {
    console.error("Get Document error:", error);
    res.status(500).json({
      message: "Failed to fetch document",
    });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
        statusCode: 404,
      });
    }
    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }

    await document.deleteOne();
    res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error("Delete document error : ", error);
    res.status(500).json({ message: "Failed to delete document" });
  }
};