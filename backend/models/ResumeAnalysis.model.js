import mongoose from 'mongoose';

const resumeAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobDescription: {
    type: String,
    required: true
  },
  resumeText: {
    type: String,
    required: true
  },
  atsScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  matchedKeywords: [{
    type: String
  }],
  missingKeywords: [{
    type: String
  }],
  missingSkills: [{
    type: String
  }],
  weakSections: [{
    section: String,
    feedback: String
  }],
  improvements: [{
    area: String,
    suggestion: String,
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low']
    }
  }],
  fileName: {
    type: String
  }
}, {
  timestamps: true
});

// Index for faster queries
resumeAnalysisSchema.index({ userId: 1, createdAt: -1 });

const ResumeAnalysis = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);

export default ResumeAnalysis;
