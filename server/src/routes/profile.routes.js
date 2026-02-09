const express = require('express')
const router = express.Router()
const profileController = require('../controllers/profileController')
const { protect } = require('../middleware/auth.middleware')

// All routes require authentication
router.use(protect)

// Profile statistics and progress
router.get('/stats', profileController.getStats)
router.get('/progress', profileController.getProgress)
router.get('/activity', profileController.getActivity)
router.get('/achievements', profileController.getAchievements)

module.exports = router
