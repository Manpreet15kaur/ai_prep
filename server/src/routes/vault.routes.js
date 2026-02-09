const express = require('express')
const router = express.Router()
const vaultController = require('../controllers/vaultController')
const { protect } = require('../middleware/auth.middleware')

// All routes require authentication
router.use(protect)

// CRUD operations
router.get('/', vaultController.getAllQuestions)
router.post('/', vaultController.createQuestion)
router.get('/:id', vaultController.getQuestion)
router.put('/:id', vaultController.updateQuestion)
router.delete('/:id', vaultController.deleteQuestion)

// Special operations
router.patch('/:id/bookmark', vaultController.toggleBookmark)

module.exports = router
