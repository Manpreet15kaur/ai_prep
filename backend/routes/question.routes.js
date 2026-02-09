import express from 'express';
import {
  generateAIQuestions,
  saveQuestion,
  getSavedQuestions,
  updateQuestion,
  deleteQuestion,
  getSubTopics,
  getAllTopics
} from '../controllers/question.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/topics', getAllTopics);
router.get('/subtopics/:topic', getSubTopics);

// Protected routes
router.use(protect);

router.post('/generate', generateAIQuestions);
router.post('/save', saveQuestion);
router.get('/', getSavedQuestions);
router.put('/:id', updateQuestion);
router.delete('/:id', deleteQuestion);

export default router;
