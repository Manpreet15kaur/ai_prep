import dotenv from "dotenv";
dotenv.config();

import Groq from "groq-sdk";

// Initialize Groq AI with API key from environment
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const MODEL_NAME = "llama-3.1-8b-instant"

// =======================
// QUESTION GENERATION
// =======================
export const generateQuestions = async ({ 
  topic, 
  experienceLevel, 
  questionTypes,
  subTopics = [],
  programmingLanguage = null,
  answerStyle = 'detailed'
}) => {
  try {
    // Build sub-topics section
    const subTopicsText = subTopics.length > 0 
      ? `\nSub-topics to focus on: ${subTopics.join(", ")}`
      : '';
    
    // Build programming language section
    const languageText = programmingLanguage 
      ? `\nProgramming Language: ${programmingLanguage} (use this language for all code examples and coding questions)`
      : '';
    
    // Build answer style instructions
    const answerStyleInstructions = {
      'short': 'Provide concise, brief answers (2-3 sentences)',
      'detailed': 'Provide comprehensive, detailed explanations',
      'with-examples': 'Include practical examples and code snippets in your answers',
      'interview-focused': 'Focus on interview-style answers with key points and follow-up questions'
    };
    
    const styleInstruction = answerStyleInstructions[answerStyle] || answerStyleInstructions['detailed'];

    // Build question type specific instructions
    const questionTypeInstructions = questionTypes.map(type => {
      switch(type) {
        case 'MCQ':
          return 'For MCQ questions: Include 4 options (A, B, C, D) with the correct answer clearly marked';
        case 'Coding':
          return `For Coding questions: Provide a problem statement, input/output examples, constraints, and a complete solution${programmingLanguage ? ` in ${programmingLanguage}` : ''}`;
        case 'Conceptual':
          return 'For Conceptual questions: Focus on theoretical understanding and core concepts';
        case 'Scenario-based':
          return 'For Scenario-based questions: Present real-world scenarios and ask for problem-solving approaches';
        default:
          return '';
      }
    }).filter(Boolean).join('\n- ');

    const prompt = `You are an expert interview preparation assistant.

Generate 3 interview questions for the following criteria:

Topic: ${topic}${subTopicsText}
Experience Level: ${experienceLevel}
Question Types: ${questionTypes.join(", ")}${languageText}

Requirements:
- Questions must be STRICTLY related to ${topic}${subTopics.length > 0 ? ` with focus on: ${subTopics.join(", ")}` : ''}
- Difficulty should match ${experienceLevel} level
- Generate ONLY the specified question types: ${questionTypes.join(", ")}
- ${styleInstruction}
- For each question, provide a detailed answer/solution
- Include helpful hints where applicable

Question Type Specific Instructions:
- ${questionTypeInstructions}

Return ONLY a valid JSON array in this exact format (no markdown, no extra text):
[
  {
    "question": "Question text here",
    "answer": "Detailed answer here",
    "hints": "Helpful hints here"
  }
]`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert interview preparation assistant. Generate high-quality, relevant interview questions with detailed answers. Always return valid JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: MODEL_NAME,
      temperature: 0.7,
      max_tokens: 3000
    });

    const text = completion.choices[0]?.message?.content || "";

    // Extract JSON from response (handle markdown code blocks)
    let jsonText = text.trim();
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    }
    
    const jsonMatch = jsonText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error('AI Response:', text);
      throw new Error("Invalid AI response format");
    }

    const questions = JSON.parse(jsonMatch[0]);

    return questions.map(q => ({
      topic,
      experienceLevel,
      questionTypes,
      subTopics,
      programmingLanguage,
      question: q.question,
      answer: q.answer,
      hints: q.hints || ""
    }));

  } catch (error) {
    console.error("Groq AI Error:", error.message);
    throw new Error("Failed to generate questions. Please try again.");
  }
};

// =======================
// RESUME ANALYSIS
// =======================
export const analyzeResume = async ({ resumeText, jobDescription }) => {
  try {
    const prompt = `You are an expert ATS (Applicant Tracking System) analyzer and career coach.

Analyze this resume against the job description and provide ATS scoring with clear keyword analysis:

JOB DESCRIPTION:
${jobDescription}

RESUME:
${resumeText}

Provide analysis in the following JSON format (return ONLY valid JSON, no markdown):
{
  "atsScore": 75,
  "matchedKeywords": ["keyword1", "keyword2", "keyword3"],
  "missingKeywords": ["missing1", "missing2", "missing3"],
  "missingSkills": ["skill1", "skill2"],
  "weakSections": [
    {"section": "section name", "feedback": "specific feedback"}
  ],
  "improvements": [
    {"area": "area name", "suggestion": "actionable suggestion", "priority": "High"}
  ]
}

IMPORTANT INSTRUCTIONS:
1. matchedKeywords: List ALL keywords/skills from the job description that ARE present in the resume
2. missingKeywords: List ALL important keywords/skills from the job description that are NOT found in the resume
3. missingSkills: Technical and soft skills mentioned in job description but absent in resume
4. Be thorough in keyword extraction - include technologies, tools, methodologies, certifications
5. Consider synonyms and variations (e.g., "JS" and "JavaScript" are the same)
6. Prioritize technical skills, tools, frameworks, and domain-specific terminology

Be specific, actionable, and focus on ATS optimization with clear keyword matching.`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert ATS (Applicant Tracking System) analyzer and career coach. Provide detailed, actionable feedback on resumes with precise keyword analysis. Always return valid JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: MODEL_NAME,
      temperature: 0.5,
      max_tokens: 3000
    });

    const text = completion.choices[0]?.message?.content || "";

    // Extract JSON from response (handle markdown code blocks)
    let jsonText = text.trim();
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    }

    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('AI Response:', text);
      throw new Error("Invalid AI response format");
    }

    const analysis = JSON.parse(jsonMatch[0]);
    
    // Ensure all required fields exist
    return {
      atsScore: analysis.atsScore || 0,
      matchedKeywords: analysis.matchedKeywords || [],
      missingKeywords: analysis.missingKeywords || [],
      missingSkills: analysis.missingSkills || [],
      weakSections: analysis.weakSections || [],
      improvements: analysis.improvements || []
    };

  } catch (error) {
    console.error("Groq AI Error:", error.message);
    throw new Error("Failed to analyze resume. Please try again.");
  }
};
