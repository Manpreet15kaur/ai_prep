import express from 'express';
import multer from 'multer';
import {
  analyzeResumeWithJD,
  getResumeHistory,
  getResumeAnalysis,
  deleteResumeAnalysis
} from '../controllers/resume.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// All routes are protected
router.use(protect);

router.post('/analyze', upload.single('resume'), analyzeResumeWithJD);
router.get('/history', getResumeHistory);
router.get('/:id', getResumeAnalysis);
router.delete('/:id', deleteResumeAnalysis);

export default router;
