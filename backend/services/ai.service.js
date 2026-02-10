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
  answerStyle = 'detailed',
  count = 3  // NEW: Number of questions to generate
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
- Question text should be clear and concise
- Include EXACTLY 4 options as separate fields: optionA, optionB, optionC, optionD
- In the answer field, state which option is correct (e.g., "B")
- In explanation field, explain WHY that option is correct
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

Generate ${count} interview questions for the following criteria:

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
    "optionA": "First option (for MCQ only, empty string otherwise)",
    "optionB": "Second option (for MCQ only, empty string otherwise)",
    "optionC": "Third option (for MCQ only, empty string otherwise)",
    "optionD": "Fourth option (for MCQ only, empty string otherwise)",
    "answer": "Correct answer (for MCQ: A, B, C, or D; for others: full answer text)",
    "explanation": "Step-by-step explanation here",
    "code": "Code snippet here (empty string if not applicable)",
    "hints": "Helpful hints here"
  }
]

IMPORTANT:
- For MCQ: question contains the question text, optionA/B/C/D contain the 4 options, answer contains just the letter (A, B, C, or D), explanation provides detailed reasoning, code is empty string
- For Coding: question contains problem statement with examples, optionA/B/C/D are empty strings, answer contains approach, explanation contains step-by-step breakdown, code contains complete solution
- For Conceptual: question is explanation-based, optionA/B/C/D are empty strings, answer provides explanation, explanation provides deeper insights, code is empty string or minimal example
- For Scenario: question presents scenario, optionA/B/C/D are empty strings, answer provides solution steps, explanation provides detailed reasoning, code contains relevant examples if applicable`;

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
      max_tokens: count > 5 ? 4000 : 3000,  // Increase tokens for more questions
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
      optionA: q.optionA || "",  // NEW: MCQ option A
      optionB: q.optionB || "",  // NEW: MCQ option B
      optionC: q.optionC || "",  // NEW: MCQ option C
      optionD: q.optionD || "",  // NEW: MCQ option D
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
// RESUME ANALYSIS WITH DETERMINISTIC SCORING
// =======================
export const analyzeResume = async ({ resumeText, jobDescription }) => {
  try {
    const prompt = `You are an expert ATS (Applicant Tracking System) analyzer. Analyze this resume against the job description.

JOB DESCRIPTION:
${jobDescription}

RESUME:
${resumeText}

Extract and categorize ALL relevant information for deterministic scoring. Return ONLY valid JSON (no markdown):

{
  "skills": {
    "exactMatches": ["skill1", "skill2"],
    "partialMatches": [{"resume": "React.js", "jd": "React", "similarity": 0.9}],
    "missing": ["skill3", "skill4"]
  },
  "keywords": {
    "matched": ["keyword1", "keyword2"],
    "missing": ["keyword3", "keyword4"]
  },
  "projects": {
    "relevant": [{"name": "project", "relevance": 0.8, "reason": "why relevant"}],
    "gaps": ["missing project type or domain"]
  },
  "education": {
    "hasRequired": true,
    "details": "education info"
  },
  "certifications": {
    "matched": ["cert1"],
    "missing": ["cert2"]
  },
  "improvements": [
    {"area": "Skills", "suggestion": "Add Docker, Kubernetes", "priority": "High", "impact": "Would increase ATS score by 10%"}
  ]
}

CRITICAL INSTRUCTIONS:
1. Extract ALL skills, keywords, technologies from BOTH resume and job description
2. Compare case-insensitively and consider synonyms (JS=JavaScript, K8s=Kubernetes)
3. Classify matches as exact (100%), partial (50-90%), or missing (0%)
4. Evaluate project relevance to job requirements (0-100%)
5. Check education and certification requirements
6. Provide specific, actionable improvements with impact estimates
7. Be thorough and precise - this will be used for deterministic scoring`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert ATS analyzer. Extract precise, structured data for deterministic scoring. Always return valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: MODEL_NAME,
      temperature: 0.3,  // Lower temperature for more consistent extraction
      max_tokens: 3500,
      response_format: { type: "json_object" }
    });

    const text = completion.choices[0]?.message?.content || "";

    // Extract JSON from response
    let jsonText = text.trim();
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    }

    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('AI Response:', text);
      throw new Error("Invalid AI response format");
    }

    const extracted = JSON.parse(jsonMatch[0]);
    
    // DETERMINISTIC SCORING CALCULATION
    const scoring = calculateATSScore(extracted);
    
    return {
      ...scoring,
      rawExtraction: extracted,  // Keep raw data for transparency
      improvements: extracted.improvements || []
    };

  } catch (error) {
    console.error("Groq AI Error:", error.message);
    throw new Error("Failed to analyze resume. Please try again.");
  }
};

// Deterministic ATS Scoring Function
function calculateATSScore(data) {
  const weights = {
    skills: 0.50,      // 50%
    projects: 0.20,    // 20%
    keywords: 0.20,    // 20%
    education: 0.05,   // 5%
    certifications: 0.05  // 5%
  };

  // 1. SKILLS SCORE (50%)
  const exactMatches = data.skills?.exactMatches?.length || 0;
  const partialMatches = data.skills?.partialMatches?.length || 0;
  const missingSkills = data.skills?.missing?.length || 0;
  const totalSkills = exactMatches + partialMatches + missingSkills;
  
  let skillsScore = 0;
  if (totalSkills > 0) {
    const partialScore = partialMatches * 0.7;  // Partial matches count as 70%
    skillsScore = ((exactMatches + partialScore) / totalSkills) * 100;
  }

  // 2. PROJECTS SCORE (20%)
  const relevantProjects = data.projects?.relevant || [];
  const projectsScore = relevantProjects.length > 0
    ? relevantProjects.reduce((sum, p) => sum + (p.relevance || 0), 0) / relevantProjects.length
    : 0;

  // 3. KEYWORDS SCORE (20%)
  const matchedKeywords = data.keywords?.matched?.length || 0;
  const missingKeywords = data.keywords?.missing?.length || 0;
  const totalKeywords = matchedKeywords + missingKeywords;
  const keywordsScore = totalKeywords > 0 ? (matchedKeywords / totalKeywords) * 100 : 0;

  // 4. EDUCATION SCORE (5%)
  const educationScore = data.education?.hasRequired ? 100 : 50;

  // 5. CERTIFICATIONS SCORE (5%)
  const matchedCerts = data.certifications?.matched?.length || 0;
  const missingCerts = data.certifications?.missing?.length || 0;
  const totalCerts = matchedCerts + missingCerts;
  const certificationsScore = totalCerts > 0 ? (matchedCerts / totalCerts) * 100 : 100;  // 100 if no certs required

  // WEIGHTED TOTAL
  const atsScore = Math.round(
    (skillsScore * weights.skills) +
    (projectsScore * weights.projects) +
    (keywordsScore * weights.keywords) +
    (educationScore * weights.education) +
    (certificationsScore * weights.certifications)
  );

  // Calculate selection probability (non-linear based on ATS score)
  let selectionProbability = 0;
  if (atsScore >= 80) selectionProbability = 85 + (atsScore - 80) * 0.75;
  else if (atsScore >= 60) selectionProbability = 50 + (atsScore - 60) * 1.75;
  else if (atsScore >= 40) selectionProbability = 20 + (atsScore - 40) * 1.5;
  else selectionProbability = atsScore * 0.5;

  return {
    atsScore: Math.min(100, Math.max(0, atsScore)),
    selectionProbability: Math.round(Math.min(100, Math.max(0, selectionProbability))),
    breakdown: {
      skillsScore: Math.round(skillsScore),
      projectsScore: Math.round(projectsScore),
      keywordsScore: Math.round(keywordsScore),
      educationScore: Math.round(educationScore),
      certificationsScore: Math.round(certificationsScore)
    },
    matchedSkills: data.skills?.exactMatches || [],
    partialSkills: data.skills?.partialMatches || [],
    missingSkills: data.skills?.missing || [],
    matchedKeywords: data.keywords?.matched || [],
    missingKeywords: data.keywords?.missing || [],
    projectRelevance: data.projects?.relevant || [],
    projectGaps: data.projects?.gaps || [],
    matchedCertifications: data.certifications?.matched || [],
    missingCertifications: data.certifications?.missing || []
  };
}
