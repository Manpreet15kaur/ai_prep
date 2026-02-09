const User = require('../models/User')
const SavedQuestion = require('../models/SavedQuestion')
const ResumeAnalysis = require('../models/ResumeAnalysis')

/**
 * @desc    Get user statistics
 * @route   GET /api/profile/stats
 * @access  Private
 */
exports.getStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    const questionCount = await SavedQuestion.countDocuments({ userId: req.user._id })
    const latestResume = await ResumeAnalysis.findOne({ userId: req.user._id })
      .sort({ createdAt: -1 })

    const stats = {
      readinessScore: user.stats.readinessScore,
      questionsCompleted: questionCount,
      studyStreak: user.stats.studyStreak,
      resumeScore: latestResume?.atsScore || 0,
      totalHours: user.stats.totalHours,
    }

    res.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Get progress by role
 * @route   GET /api/profile/progress
 * @access  Private
 */
exports.getProgress = async (req, res, next) => {
  try {
    const roleProgress = await SavedQuestion.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          role: '$_id',
          questions: '$count',
          progress: { $multiply: ['$count', 2] }, // Simple calculation
          _id: 0,
        },
      },
    ])

    res.json({
      success: true,
      data: roleProgress,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Get activity timeline
 * @route   GET /api/profile/activity
 * @access  Private
 */
exports.getActivity = async (req, res, next) => {
  try {
    // Get recent questions
    const recentQuestions = await SavedQuestion.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('createdAt role')

    // Get recent resume analyses
    const recentAnalyses = await ResumeAnalysis.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('createdAt atsScore')

    // Combine and format activities
    const activities = [
      ...recentQuestions.map((q) => ({
        date: q.createdAt,
        action: `Saved question for ${q.role}`,
        type: 'save',
      })),
      ...recentAnalyses.map((a) => ({
        date: a.createdAt,
        action: `Analyzed resume - Score: ${a.atsScore}`,
        type: 'resume',
      })),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10)

    res.json({
      success: true,
      data: activities,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Get user achievements
 * @route   GET /api/profile/achievements
 * @access  Private
 */
exports.getAchievements = async (req, res, next) => {
  try {
    const questionCount = await SavedQuestion.countDocuments({ userId: req.user._id })
    const user = await User.findById(req.user._id)

    const achievements = []

    // First Week
    const accountAge = Date.now() - new Date(user.createdAt).getTime()
    if (accountAge >= 7 * 24 * 60 * 60 * 1000) {
      achievements.push({
        id: 'first-week',
        name: 'First Week',
        unlocked: true,
      })
    }

    // 100 Questions
    if (questionCount >= 100) {
      achievements.push({
        id: '100-questions',
        name: '100 Questions',
        unlocked: true,
      })
    }

    // 30 Day Streak
    if (user.stats.studyStreak >= 30) {
      achievements.push({
        id: '30-day-streak',
        name: '30 Day Streak',
        unlocked: true,
      })
    }

    res.json({
      success: true,
      data: achievements,
    })
  } catch (error) {
    next(error)
  }
}
