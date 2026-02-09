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
  topics,  // CHANGED: Now accepts array of topics
  experienceLevel, 
  questionTypes,
  subTopics = [],
  programmingLanguage = null,
  answerStyle = 'detailed'
}) => {
  try {
    // CHANGED: Build topics section for multiple topics
    const topicsText = topics.join(", ");
    
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

    // Build question type specific instructions with strict formatting rules
    const questionTypeInstructions = questionTypes.map(type => {
      switch(type) {
        case 'MCQ':
          return `MCQ FORMAT (STRICT):
- Question must end with "Choose the correct answer:"
- Must include EXACTLY 4 options labeled A), B), C), D)
- Each option on a new line
- In the answer field, clearly state which option is correct (e.g., "Correct Answer: B)")
- Answer must explain WHY that option is correct
- DO NOT include code in MCQ questions unless specifically testing code comprehension`;
        
        case 'Coding':
          return `CODING FORMAT (STRICT):
- Question must include:
  1. Problem Statement (clear description)
  2. Input Format (what input to expect)
  3. Output Format (what output to produce)
  4. Constraints (limits on input size, time complexity)
  5. Example Test Cases (at least 2 examples with input/output)
- Answer must include approach/algorithm explanation
- Explanation must include step-by-step breakdown
- Code must be complete working solution${programmingLanguage ? ` in ${programmingLanguage}` : ''}
- Include Time and Space Complexity analysis in explanation
- DO NOT format as MCQ - this is a coding problem`;
        
        case 'Conceptual':
          return `CONCEPTUAL FORMAT (STRICT):
- Question must be explanation-based (e.g., "Explain...", "What is...", "Describe...")
- Focus on theoretical understanding, definitions, and concepts
- Answer must provide clear explanations with examples where helpful
- DO NOT include code unless illustrating a concept
- DO NOT format as MCQ or coding problem`;
        
        case 'Scenario-based':
          return `SCENARIO-BASED FORMAT (STRICT):
- Question must present a real-world scenario or problem situation
- Should start with context (e.g., "You are working on...", "A client needs...")
- Ask how to approach or solve the scenario
- Answer must provide practical solution steps and considerations
- Can include code examples if relevant to the scenario
- DO NOT format as MCQ`;
        
        default:
          return '';
      }
    }).filter(Boolean).join('\n\n');

    const prompt = `You are an expert interview preparation assistant. You MUST return ONLY valid JSON with NO markdown, NO code fences, NO backticks.

Generate 3 interview questions for the following criteria:

Topics: ${topicsText}${subTopicsText}
Experience Level: ${experienceLevel}
Question Types: ${questionTypes.join(", ")}${languageText}

CRITICAL REQUIREMENTS:
- Questions must be STRICTLY related to: ${topicsText}${subTopics.length > 0 ? ` with focus on: ${subTopics.join(", ")}` : ''}
- Difficulty should match ${experienceLevel} level
- Generate ONLY the specified question types: ${questionTypes.join(", ")}
- Each question MUST follow its type's format EXACTLY - DO NOT MIX FORMATS
- ${styleInstruction} (applies to answer/explanation ONLY, not question format)
- Include helpful hints where applicable

STRICT FORMAT REQUIREMENTS FOR EACH QUESTION TYPE:

${questionTypeInstructions}

CRITICAL JSON OUTPUT RULES:
1. Return ONLY valid JSON - NO markdown, NO triple backticks, NO code fences
2. Escape all newlines as \\n in strings
3. Escape all quotes properly
4. Do NOT wrap JSON in markdown code blocks
5. Return NOTHING outside the JSON array

Return in this EXACT format (pure JSON only):
[
  {
    "question": "Question text here",
    "answer": "Answer text here",
    "explanation": "Step-by-step explanation here",
    "code": "Code snippet here (empty string if not applicable)",
    "hints": "Helpful hints here"
  }
]

IMPORTANT:
- For MCQ: question contains the MCQ with options, answer contains correct answer and why, explanation provides detailed reasoning, code is empty string
- For Coding: question contains problem statement with examples, answer contains approach, explanation contains step-by-step breakdown, code contains complete solution
- For Conceptual: question is explanation-based, answer provides explanation, explanation provides deeper insights, code is empty string or minimal example
- For Scenario: question presents scenario, answer provides solution steps, explanation provides detailed reasoning, code contains relevant examples if applicable`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert interview preparation assistant. Generate high-quality, relevant interview questions with detailed answers. CRITICAL: Return ONLY valid JSON with NO markdown formatting, NO code fences, NO backticks. Escape all newlines as \\n and quotes properly."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: MODEL_NAME,
      temperature: 0.7,
      max_tokens: 3000,
      response_format: { type: "json_object" }  // ADDED: Force JSON output
    });

    const text = completion.choices[0]?.message?.content || "";

    // ENHANCED: More robust JSON extraction
    let jsonText = text.trim();
    
    // Remove markdown code fences if present
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    }
    
    // Try to extract JSON array or object
    let jsonMatch = jsonText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      // Try to find JSON object that might contain questions array
      const objMatch = jsonText.match(/\{[\s\S]*\}/);
      if (objMatch) {
        const parsed = JSON.parse(objMatch[0]);
        if (parsed.questions && Array.isArray(parsed.questions)) {
          jsonMatch = [JSON.stringify(parsed.questions)];
        }
      }
    }
    
    if (!jsonMatch) {
      console.error('AI Response:', text);
      throw new Error("Invalid AI response format - no valid JSON found");
    }

    const questions = JSON.parse(jsonMatch[0]);

    // CHANGED: Map to include all fields including topics array
    return questions.map(q => ({
      topics,  // CHANGED: Store topics array
      experienceLevel,
      questionTypes,
      subTopics,
      programmingLanguage,
      question: q.question,
      answer: q.answer,
      explanation: q.explanation || "",  // NEW: Add explanation field
      code: q.code || "",  // NEW: Add code field
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
