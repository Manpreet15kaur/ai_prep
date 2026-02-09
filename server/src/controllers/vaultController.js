const SavedQuestion = require('../models/SavedQuestion')

/**
 * @desc    Get all saved questions for user
 * @route   GET /api/vault
 * @access  Private
 */
exports.getAllQuestions = async (req, res, next) => {
  try {
    const { role, difficulty, search } = req.query

    // Build query
    const query = { userId: req.user._id }

    if (role && role !== 'All') query.role = role
    if (difficulty && difficulty !== 'All') query.difficulty = difficulty

    let questions = await SavedQuestion.find(query)
      .populate('questionId')
      .sort({ createdAt: -1 })

    // Apply search filter if provided
    if (search) {
      questions = questions.filter((q) => {
        const questionText = q.customQuestion || q.questionId?.question || ''
        return questionText.toLowerCase().includes(search.toLowerCase())
      })
    }

    res.json({
      success: true,
      data: questions,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Get single saved question
 * @route   GET /api/vault/:id
 * @access  Private
 */
exports.getQuestion = async (req, res, next) => {
  try {
    const question = await SavedQuestion.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate('questionId')

    if (!question) {
      return res.status(404).json({
        success: false,
        error: 'Question not found',
      })
    }

    res.json({
      success: true,
      data: question,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Create custom question
 * @route   POST /api/vault
 * @access  Private
 */
exports.createQuestion = async (req, res, next) => {
  try {
    const { customQuestion, role, topic, difficulty, notes } = req.body

    const question = await SavedQuestion.create({
      userId: req.user._id,
      customQuestion,
      role,
      topic,
      difficulty,
      notes,
    })

    res.status(201).json({
      success: true,
      data: question,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Update saved question
 * @route   PUT /api/vault/:id
 * @access  Private
 */
exports.updateQuestion = async (req, res, next) => {
  try {
    let question = await SavedQuestion.findOne({
      _id: req.params.id,
      userId: req.user._id,
    })

    if (!question) {
      return res.status(404).json({
        success: false,
        error: 'Question not found',
      })
    }

    question = await SavedQuestion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    res.json({
      success: true,
      data: question,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Delete saved question
 * @route   DELETE /api/vault/:id
 * @access  Private
 */
exports.deleteQuestion = async (req, res, next) => {
  try {
    const question = await SavedQuestion.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    })

    if (!question) {
      return res.status(404).json({
        success: false,
        error: 'Question not found',
      })
    }

    res.json({
      success: true,
      data: {},
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Toggle bookmark status
 * @route   PATCH /api/vault/:id/bookmark
 * @access  Private
 */
exports.toggleBookmark = async (req, res, next) => {
  try {
    const question = await SavedQuestion.findOne({
      _id: req.params.id,
      userId: req.user._id,
    })

    if (!question) {
      return res.status(404).json({
        success: false,
        error: 'Question not found',
      })
    }

    question.bookmarked = !question.bookmarked
    await question.save()

    res.json({
      success: true,
      data: question,
    })
  } catch (error) {
    next(error)
  }
}
