const mongoose = require('mongoose')

const interviewQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Question is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      index: true,
    },
    topic: {
      type: String,
      required: [true, 'Topic is required'],
      index: true,
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: [true, 'Difficulty is required'],
      index: true,
    },
    techStack: [{
      type: String,
      trim: true,
    }],
    answer: {
      type: String,
      trim: true,
    },
    hints: [{
      type: String,
      trim: true,
    }],
    isGenerated: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes for efficient querying
interviewQuestionSchema.index({ role: 1, topic: 1, difficulty: 1 })
interviewQuestionSchema.index({ techStack: 1 })

module.exports = mongoose.model('InterviewQuestion', interviewQuestionSchema)
