import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import User from '../models/User.model.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// @desc    Get user profile with stats
// @route   GET /api/user/profile
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('savedQuestions')
      .populate({
        path: 'resumeAnalyses',
        select: '-resumeText',
        options: { limit: 5, sort: { createdAt: -1 } }
      });

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        savedQuestionsCount: user.savedQuestions.length,
        resumeAnalysesCount: user.resumeAnalyses.length,
        recentAnalyses: user.resumeAnalyses
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/user/profile
router.put('/profile', async (req, res) => {
  try {
    const { name } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
});

export default router;
