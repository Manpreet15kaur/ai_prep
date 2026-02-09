const mongoose = require('mongoose')

const savedQuestionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InterviewQuestion',
    },
    customQuestion: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
    },
    topic: {
      type: String,
      required: [true, 'Topic is required'],
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: [true, 'Difficulty is required'],
    },
    bookmarked: {
      type: Boolean,
      default: false,
      index: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

// Compound index for user queries
savedQuestionSchema.index({ userId: 1, createdAt: -1 })
savedQuestionSchema.index({ userId: 1, bookmarked: 1 })
savedQuestionSchema.index({ userId: 1, role: 1, difficulty: 1 })

// Virtual for getting the actual question text
savedQuestionSchema.virtual('question').get(function () {
  return this.customQuestion || (this.questionId ? this.questionId.question : '')
})

// Ensure virtuals are included in JSON
savedQuestionSchema.set('toJSON', { virtuals: true })
savedQuestionSchema.set('toObject', { virtuals: true })

module.exports = mongoose.model('SavedQuestion', savedQuestionSchema)
