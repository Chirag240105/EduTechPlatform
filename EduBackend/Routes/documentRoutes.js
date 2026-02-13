import express from 'express';
import { protect } from '../Middlewares/AuthMiddleware.js';
import { deleteDocument, getDocument, getDocuments, uploadDocument } from '../Controllers/documentController.js';
import upload from '../Config/utils/multer.js';

const router = express.Router();

router.use(protect);

router.post('/uploads', upload.single('file'), uploadDocument);
router.get('/', getDocuments);
router.get('/:id', getDocument);
router.delete('/:id', deleteDocument);

export default router;