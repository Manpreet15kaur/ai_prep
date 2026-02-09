import Question from '../models/Question.model.js';
import User from '../models/User.model.js';
import { generateQuestions } from '../services/ai.service.js';
import { TOPIC_SUBTOPICS, CODING_TOPICS, PROGRAMMING_LANGUAGES, ANSWER_STYLES } from '../utils/topicMappings.js';

// @desc    Get sub-topics for a given topic
// @route   GET /api/questions/subtopics/:topic
// @access  Public
export const getSubTopics = async (req, res) => {
  try {
    const { topic } = req.params;
    
    const subTopics = TOPIC_SUBTOPICS[topic] || [];
    const requiresLanguage = CODING_TOPICS.includes(topic);
    
    res.status(200).json({
      success: true,
      topic,
      subTopics,
      requiresLanguage,
      availableLanguages: requiresLanguage ? PROGRAMMING_LANGUAGES : [],
      answerStyles: ANSWER_STYLES
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sub-topics',
      error: error.message
    });
  }
};

// @desc    Get all available topics with metadata
// @route   GET /api/questions/topics
// @access  Public
export const getAllTopics = async (req, res) => {
  try {
    const topics = Object.keys(TOPIC_SUBTOPICS).map(topic => ({
      name: topic,
      hasSubTopics: TOPIC_SUBTOPICS[topic].length > 0,
      requiresLanguage: CODING_TOPICS.includes(topic),
      subTopicsCount: TOPIC_SUBTOPICS[topic].length
    }));
    
    res.status(200).json({
      success: true,
      topics,
      programmingLanguages: PROGRAMMING_LANGUAGES,
      answerStyles: ANSWER_STYLES
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching topics',
      error: error.message
    });
  }
};

// @desc    Generate AI questions
// @route   POST /api/questions/generate
// @access  Private
export const generateAIQuestions = async (req, res) => {
  try {
    const { 
      topics,  // CHANGED: Now accepts array of topics
      experienceLevel, 
      questionTypes,
      subTopics,
      programmingLanguage,
      answerStyle
    } = req.body;

    // CHANGED: Validate topics array
    if (!topics || !Array.isArray(topics) || topics.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one topic is required'
      });
    }

    if (!experienceLevel || !questionTypes || questionTypes.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Experience level and question types are required'
      });
    }

    // Call AI service to generate questions with enhanced parameters
    const generatedQuestions = await generateQuestions({
      topics,  // CHANGED: Pass topics array
      experienceLevel,
      questionTypes,
      subTopics: subTopics || [],
      programmingLanguage: programmingLanguage || null,
      answerStyle: answerStyle || 'detailed'
    });

    res.status(200).json({
      success: true,
      message: 'Questions generated successfully',
      questions: generatedQuestions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating questions',
      error: error.message
    });
  }
};

// @desc    Save question to user profile
// @route   POST /api/questions/save
// @access  Private
export const saveQuestion = async (req, res) => {
  try {
    const { 
      topic, 
      experienceLevel, 
      questionTypes, 
      question, 
      answer, 
      hints,
      subTopics,
      programmingLanguage
    } = req.body;

    if (!topic || !experienceLevel || !question || !answer) {
      return res.status(400).json({
        success: false,
        message: 'Required fields are missing'
      });
    }

    // Create question
    const newQuestion = await Question.create({
      userId: req.user.id,
      topic,
      experienceLevel,
      questionTypes,
      question,
      answer,
      hints,
      subTopics: subTopics || [],
      programmingLanguage: programmingLanguage || null
    });

    // Add to user's saved questions
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { savedQuestions: newQuestion._id } }
    );

    res.status(201).json({
      success: true,
      message: 'Question saved successfully',
      question: newQuestion
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error saving question',
      error: error.message
    });
  }
};

// @desc    Get all saved questions for user
// @route   GET /api/questions
// @access  Private
export const getSavedQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: questions.length,
      questions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching questions',
      error: error.message
    });
  }
};

// @desc    Update a question
// @route   PUT /api/questions/:id
// @access  Private
export const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Check ownership
    if (question.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this question'
      });
    }

    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Question updated successfully',
      question: updatedQuestion
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating question',
      error: error.message
    });
  }
};

// @desc    Delete a question
// @route   DELETE /api/questions/:id
// @access  Private
export const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Check ownership
    if (question.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this question'
      });
    }

    await Question.findByIdAndDelete(req.params.id);

    // Remove from user's saved questions
    await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { savedQuestions: req.params.id } }
    );

    res.status(200).json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting question',
      error: error.message
    });
  }
};
