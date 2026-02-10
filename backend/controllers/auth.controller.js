import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/User.model.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'savedQuestions',
        select: 'topic questionTypes createdAt'
      })
      .populate({
        path: 'resumeAnalyses',
        select: 'atsScore createdAt',
        options: { sort: { createdAt: -1 } }
      });

    // Calculate stats
    const totalQuestions = user.savedQuestions.length;
    const latestResumeScore = user.resumeAnalyses.length > 0 
      ? user.resumeAnalyses[0].atsScore 
      : 0;

    // Calculate readiness score based on questions saved
    const readinessScore = Math.min(100, Math.floor((totalQuestions / 100) * 100));

    // Calculate study streak (simplified - based on consecutive days with activity)
    const studyStreak = calculateStudyStreak(user.savedQuestions);

    // Calculate total study hours (estimate: 10 minutes per question)
    const totalHours = Math.floor(totalQuestions * 0.17); // 10 min = 0.17 hours

    // Group questions by topic for progress tracking
    const topicProgress = {};
    user.savedQuestions.forEach(q => {
      const topic = q.topic || 'General';
      if (!topicProgress[topic]) {
        topicProgress[topic] = 0;
      }
      topicProgress[topic]++;
    });

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        stats: {
          readinessScore,
          questionsCompleted: totalQuestions,
          studyStreak,
          resumeScore: latestResumeScore,
          totalHours,
          topicProgress
        },
        savedQuestions: user.savedQuestions,
        resumeAnalyses: user.resumeAnalyses
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user data',
      error: error.message
    });
  }
};

// Helper function to calculate study streak
function calculateStudyStreak(questions) {
  if (questions.length === 0) return 0;

  const dates = questions
    .map(q => {
      const date = new Date(q.createdAt);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    })
    .filter((value, index, self) => self.indexOf(value) === index) // unique dates
    .sort((a, b) => b - a); // sort descending

  if (dates.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTime = today.getTime();

  // Check if most recent activity is today or yesterday
  const daysDiff = Math.floor((todayTime - dates[0]) / (1000 * 60 * 60 * 24));
  if (daysDiff > 1) return 0; // Streak broken

  let streak = 1;
  for (let i = 0; i < dates.length - 1; i++) {
    const diff = Math.floor((dates[i] - dates[i + 1]) / (1000 * 60 * 60 * 24));
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
