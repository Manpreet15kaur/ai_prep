const express = require('express')
const router = express.Router()
const questionController = require('../controllers/questionController')
const { protect } = require('../middleware/auth.middleware')

// All routes require authentication
router.use(protect)

// Generate AI questions
router.post('/generate', questionController.generateQuestions)

// Get metadata
router.get('/roles', questionController.getRoles)
router.get('/topics', questionController.getTopics)

module.exports = router
