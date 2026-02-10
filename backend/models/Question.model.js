import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  topic: {
    type: String,
    required: true,
    trim: true
  },
  experienceLevel: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Mid-Level', 'Entry', 'Senior']
  },
  questionTypes: [{
    type: String,
    enum: ['MCQ', 'Coding', 'Conceptual', 'Scenario-based', 'HR/Behavioral']
  }],
  subTopics: [{
    type: String,
    trim: true
  }],
  programmingLanguage: {
    type: String,
    trim: true
  },
  question: {
    type: String,
    required: true
  },
  optionA: {
    type: String,
    default: ''
  },
  optionB: {
    type: String,
    default: ''
  },
  optionC: {
    type: String,
    default: ''
  },
  optionD: {
    type: String,
    default: ''
  },
  answer: {
    type: String,
    required: true
  },
  explanation: {
    type: String,
    default: ''
  },
  hints: {
    type: String
  }
}, {
  timestamps: true
});

// Index for faster queries
questionSchema.index({ userId: 1, createdAt: -1 });
questionSchema.index({ topic: 1, subTopics: 1 });

const Question = mongoose.model('Question', questionSchema);

export default Question;
