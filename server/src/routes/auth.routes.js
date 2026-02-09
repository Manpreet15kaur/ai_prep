const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const { protect } = require('../middleware/auth.middleware')

// Public routes
router.post('/signup', authController.signup)
router.post('/login', authController.login)

// Protected routes
router.use(protect) // All routes below require authentication

router.post('/logout', authController.logout)
router.get('/me', authController.getCurrentUser)
router.put('/profile', authController.updateProfile)

module.exports = router
