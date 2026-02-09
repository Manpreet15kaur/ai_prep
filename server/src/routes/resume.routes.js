const express = require('express')
const router = express.Router()
const resumeController = require('../controllers/resumeController')
const { protect } = require('../middleware/auth.middleware')
const { uploadResume } = require('../middleware/upload.middleware')

// All routes require authentication
router.use(protect)

// Resume operations
router.post('/upload', uploadResume, resumeController.uploadResume)
router.post('/analyze', resumeController.analyzeResume)
router.get('/history', resumeController.getAnalysisHistory)
router.get('/:id', resumeController.getAnalysis)

module.exports = router
