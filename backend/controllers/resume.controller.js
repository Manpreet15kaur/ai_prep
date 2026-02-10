import ResumeAnalysis from '../models/ResumeAnalysis.model.js';
import User from '../models/User.model.js';
import { analyzeResumeATS } from '../services/ats.engine.js';
import { extractTextFromPDF } from '../utils/pdfParser.js';

// @desc    Analyze resume with job description
// @route   POST /api/resume/analyze
// @access  Private
export const analyzeResumeWithJD = async (req, res) => {
  try {
    const { jobDescription } = req.body;

    if (!jobDescription) {
      return res.status(400).json({
        success: false,
        message: 'Job description is required'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Resume file is required'
      });
    }

    // Extract text from PDF
    const resumeText = await extractTextFromPDF(req.file.buffer);

    // Call ATS Engine for deterministic analysis
    const analysis = await analyzeResumeATS({
      resumeText,
      jobDescription
    });

    // Save analysis to database
    const resumeAnalysis = await ResumeAnalysis.create({
      userId: req.user.id,
      jobDescription,
      resumeText,
      fileName: req.file.originalname,
      ...analysis
    });

    // Add to user's resume analyses
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { resumeAnalyses: resumeAnalysis._id } }
    );

    res.status(201).json({
      success: true,
      message: 'Resume analyzed successfully',
      analysis: resumeAnalysis
    });
  } catch (error) {
    console.error('Resume Analysis Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error analyzing resume',
      error: error.message
    });
  }
};

// @desc    Get all resume analyses for user
// @route   GET /api/resume/history
// @access  Private
export const getResumeHistory = async (req, res) => {
  try {
    const analyses = await ResumeAnalysis.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .select('-resumeText'); // Exclude full resume text for performance

    res.status(200).json({
      success: true,
      count: analyses.length,
      analyses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching resume history',
      error: error.message
    });
  }
};

// @desc    Get single resume analysis
// @route   GET /api/resume/:id
// @access  Private
export const getResumeAnalysis = async (req, res) => {
  try {
    const analysis = await ResumeAnalysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found'
      });
    }

    // Check ownership
    if (analysis.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this analysis'
      });
    }

    res.status(200).json({
      success: true,
      analysis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching analysis',
      error: error.message
    });
  }
};

// @desc    Delete resume analysis
// @route   DELETE /api/resume/:id
// @access  Private
export const deleteResumeAnalysis = async (req, res) => {
  try {
    const analysis = await ResumeAnalysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found'
      });
    }

    // Check ownership
    if (analysis.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this analysis'
      });
    }

    await ResumeAnalysis.findByIdAndDelete(req.params.id);

    // Remove from user's resume analyses
    await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { resumeAnalyses: req.params.id } }
    );

    res.status(200).json({
      success: true,
      message: 'Analysis deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting analysis',
      error: error.message
    });
  }
};
