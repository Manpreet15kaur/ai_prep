const ResumeAnalysis = require('../models/ResumeAnalysis')
const aiService = require('../services/aiService')
const pdfParser = require('../utils/pdfParser')

/**
 * @desc    Upload resume file
 * @route   POST /api/resume/upload
 * @access  Private
 */
exports.uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload a file',
      })
    }

    const fileUrl = `/uploads/resumes/${req.file.filename}`

    res.json({
      success: true,
      data: {
        fileUrl,
        fileName: req.file.originalname,
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Analyze resume with AI
 * @route   POST /api/resume/analyze
 * @access  Private
 */
exports.analyzeResume = async (req, res, next) => {
  try {
    const { fileUrl, jobDescription } = req.body

    if (!fileUrl) {
      return res.status(400).json({
        success: false,
        error: 'File URL is required',
      })
    }

    // Extract text from PDF/DOCX
    const resumeText = await pdfParser.extractText(fileUrl)

    // Call AI service for analysis
    const analysis = await aiService.analyzeResume(resumeText, jobDescription)

    // Save analysis to database
    const resumeAnalysis = await ResumeAnalysis.create({
      userId: req.user._id,
      fileName: fileUrl.split('/').pop(),
      fileUrl,
      atsScore: analysis.atsScore,
      analysis: {
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        missingKeywords: analysis.missingKeywords,
        improvements: analysis.improvements,
      },
      parsedContent: analysis.parsedContent,
    })

    res.status(201).json({
      success: true,
      analysis: resumeAnalysis,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Get resume analysis history
 * @route   GET /api/resume/history
 * @access  Private
 */
exports.getAnalysisHistory = async (req, res, next) => {
  try {
    const analyses = await ResumeAnalysis.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10)

    res.json({
      success: true,
      data: analyses,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Get specific resume analysis
 * @route   GET /api/resume/:id
 * @access  Private
 */
exports.getAnalysis = async (req, res, next) => {
  try {
    const analysis = await ResumeAnalysis.findOne({
      _id: req.params.id,
      userId: req.user._id,
    })

    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: 'Analysis not found',
      })
    }

    res.json({
      success: true,
      data: analysis,
    })
  } catch (error) {
    next(error)
  }
}
