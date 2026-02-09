const mongoose = require('mongoose')

const resumeAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    fileName: {
      type: String,
      required: [true, 'File name is required'],
    },
    fileUrl: {
      type: String,
      required: [true, 'File URL is required'],
    },
    atsScore: {
      type: Number,
      required: [true, 'ATS score is required'],
      min: 0,
      max: 100,
    },
    analysis: {
      strengths: [{
        type: String,
        trim: true,
      }],
      weaknesses: [{
        type: String,
        trim: true,
      }],
      missingKeywords: [{
        type: String,
        trim: true,
      }],
      improvements: [{
        area: {
          type: String,
          required: true,
        },
        suggestion: {
          type: String,
          required: true,
        },
        priority: {
          type: String,
          enum: ['Low', 'Medium', 'High'],
          required: true,
        },
      }],
    },
    parsedContent: {
      skills: [{
        type: String,
        trim: true,
      }],
      experience: [{
        type: String,
        trim: true,
      }],
      education: [{
        type: String,
        trim: true,
      }],
    },
  },
  {
    timestamps: true,
  }
)

// Index for user's resume history
resumeAnalysisSchema.index({ userId: 1, createdAt: -1 })

module.exports = mongoose.model('ResumeAnalysis', resumeAnalysisSchema)
