const fs = require('fs')
const path = require('path')
const pdfParse = require('pdf-parse')

/**
 * Extract text from PDF or DOCX file
 * @param {string} fileUrl - Path to file
 * @returns {Promise<string>} Extracted text
 */
exports.extractText = async (fileUrl) => {
  try {
    const filePath = path.join(__dirname, '../../', fileUrl)
    const ext = path.extname(filePath).toLowerCase()

    if (ext === '.pdf') {
      return await extractFromPDF(filePath)
    } else if (ext === '.docx' || ext === '.doc') {
      return await extractFromDOCX(filePath)
    } else {
      throw new Error('Unsupported file format')
    }
  } catch (error) {
    console.error('Error extracting text:', error)
    throw error
  }
}

/**
 * Extract text from PDF
 * @private
 */
async function extractFromPDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath)
  const data = await pdfParse(dataBuffer)
  return data.text
}

/**
 * Extract text from DOCX
 * @private
 * TODO: Implement DOCX parsing (use mammoth or docx-parser)
 */
async function extractFromDOCX(filePath) {
  // Placeholder - implement with mammoth or similar library
  // const mammoth = require('mammoth')
  // const result = await mammoth.extractRawText({ path: filePath })
  // return result.value
  
  return 'DOCX parsing not yet implemented'
}
