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
  selectionProbability: {
    type: Number,
    min: 0,
    max: 100
  },
  breakdown: {
    skillsScore: Number,
    projectsScore: Number,
    keywordsScore: Number,
    educationScore: Number,
    certificationsScore: Number
  },
  matchedSkills: [{
    type: String
  }],
  partialSkills: [{
    resume: String,
    jd: String,
    similarity: Number
  }],
  missingSkills: [{
    type: String
  }],
  matchedKeywords: [{
    type: String
  }],
  missingKeywords: [{
    type: String
  }],
  projectRelevance: [{
    name: String,
    relevance: Number,
    reason: String
  }],
  projectGaps: [{
    type: String
  }],
  improvements: [{
    area: String,
    suggestion: String,
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low']
    },
    impact: String
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
