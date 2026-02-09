const InterviewQuestion = require('../models/InterviewQuestion')
const SavedQuestion = require('../models/SavedQuestion')
const aiService = require('../services/aiService')

/**
 * @desc    Generate AI interview questions
 * @route   POST /api/questions/generate
 * @access  Private
 */
exports.generateQuestions = async (req, res, next) => {
  try {
    const { role, topics, difficulty, techStack } = req.body

    // Validate input
    if (!role || !topics || !difficulty) {
      return res.status(400).json({
        success: false,
        error: 'Please provide role, topics, and difficulty',
      })
    }

    // Call AI service to generate questions
    const generatedQuestions = await aiService.generateQuestions({
      role,
      topics,
      difficulty,
      techStack: techStack || [],
    })

    // Save generated questions to database
    const savedQuestions = await InterviewQuestion.insertMany(generatedQuestions)

    // Auto-save to user's vault
    const vaultEntries = savedQuestions.map((q) => ({
      userId: req.user._id,
      questionId: q._id,
      role: q.role,
      topic: q.topic,
      difficulty: q.difficulty,
    }))

    await SavedQuestion.insertMany(vaultEntries)

    res.status(201).json({
      success: true,
      questions: savedQuestions,
      savedCount: vaultEntries.length,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Get all available roles
 * @route   GET /api/questions/roles
 * @access  Private
 */
exports.getRoles = async (req, res, next) => {
  try {
    const roles = [
      'Frontend Developer',
      'Backend Developer',
      'Full Stack Developer',
      'Data Analyst',
      'DevOps Engineer',
      'UI/UX Designer',
      'Mobile App Developer',
      'AI/ML Engineer',
      'Product Manager',
    ]

    res.json({
      success: true,
      data: roles,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Get all available topics
 * @route   GET /api/questions/topics
 * @access  Private
 */
exports.getTopics = async (req, res, next) => {
  try {
    const topics = [
      'DSA',
      'System Design',
      'DevOps',
      'UI/UX',
      'Machine Learning',
      'Cloud',
      'APIs',
      'Databases',
    ]

    res.json({
      success: true,
      data: topics,
    })
  } catch (error) {
    next(error)
  }
}
