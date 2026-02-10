// ATS Engine - Main orchestrator for deterministic resume analysis

import { parseJobDescription } from './jd.parser.js';
import { parseResume } from './resume.parser.js';
import { MatchingEngine } from './matching.engine.js';
import { ScoringEngine } from './scoring.engine.js';
import { ImprovementEngine } from './improvement.engine.js';

export async function analyzeResumeATS({ resumeText, jobDescription }) {
  try {
    // STEP 1: Parse Job Description
    const jdData = parseJobDescription(jobDescription);
    
    // STEP 2: Parse Resume
    const resumeData = parseResume(resumeText);
    
    // STEP 3: Match Skills (by priority)
    const mandatoryMatch = MatchingEngine.matchSkills(resumeData.skills, jdData.mandatory_skills);
    const preferredMatch = MatchingEngine.matchSkills(resumeData.skills, jdData.preferred_skills);
    const optionalMatch = MatchingEngine.matchSkills(resumeData.skills, jdData.optional_skills);
    
    // STEP 4: Match Keywords
    const allJDKeywords = [
      ...jdData.mandatory_skills,
      ...jdData.preferred_skills,
      ...jdData.domain_keywords,
      ...jdData.role_keywords
    ];
    const keywordsMatch = MatchingEngine.matchSkills(resumeData.skills, allJDKeywords);
    
    // STEP 5: Match Projects
    const projectsMatch = MatchingEngine.matchProjects(resumeData.projects, jdData);
    
    // STEP 6: Match Certifications
    const certificationsMatch = MatchingEngine.matchCertifications(
      resumeData.certifications,
      jdData.certifications
    );
    
    // STEP 7: Match Education
    const educationMatch = MatchingEngine.matchEducation(
      resumeData.education,
      jdData.education_required
    );
    
    // STEP 8: Prepare match results
    const matchResults = {
      skills: {
        mandatory: {
          exact: mandatoryMatch.exact,
          normalized: mandatoryMatch.normalized,
          partial: mandatoryMatch.partial,
          missing: mandatoryMatch.missing,
          total: jdData.mandatory_skills.length
        },
        preferred: {
          exact: preferredMatch.exact,
          normalized: preferredMatch.normalized,
          partial: preferredMatch.partial,
          missing: preferredMatch.missing,
          total: jdData.preferred_skills.length
        },
        optional: {
          exact: optionalMatch.exact,
          normalized: optionalMatch.normalized,
          partial: optionalMatch.partial,
          missing: optionalMatch.missing,
          total: jdData.optional_skills.length
        }
      },
      keywords: {
        matched: [...keywordsMatch.exact, ...keywordsMatch.normalized].map(m => m.jd),
        missing: keywordsMatch.missing
      },
      projects: projectsMatch,
      certifications: certificationsMatch,
      education: educationMatch
    };
    
    // STEP 9: Calculate Scores
    const { atsScore, breakdown } = ScoringEngine.calculateATSScore(matchResults);
    
    // STEP 10: Calculate Selection Probability
    const selectionProbability = ScoringEngine.calculateSelectionProbability(atsScore);
    
    // STEP 11: Generate Improvements
    const improvements = ImprovementEngine.generateImprovements(matchResults, breakdown);
    
    // STEP 12: Build final result
    return {
      atsScore,
      selectionProbability,
      breakdown,
      
      // Matched Skills (Exact + Normalized)
      matchedSkills: [
        ...mandatoryMatch.exact.map(m => m.jd),
        ...preferredMatch.exact.map(m => m.jd),
        ...mandatoryMatch.normalized.map(m => m.jd),
        ...preferredMatch.normalized.map(m => m.jd)
      ],
      
      // Partial Skills
      partialSkills: [
        ...mandatoryMatch.partial.map(m => ({
          resume: m.resume,
          jd: m.jd,
          similarity: m.score
        })),
        ...preferredMatch.partial.map(m => ({
          resume: m.resume,
          jd: m.jd,
          similarity: m.score
        }))
      ],
      
      // Missing Skills (Mandatory + Preferred)
      missingSkills: [
        ...mandatoryMatch.missing,
        ...preferredMatch.missing
      ],
      
      // Matched Keywords
      matchedKeywords: matchResults.keywords.matched,
      
      // Missing Keywords
      missingKeywords: matchResults.keywords.missing,
      
      // Project Relevance
      projectRelevance: projectsMatch.relevant || [],
      
      // Project Gaps
      projectGaps: projectsMatch.gaps || [],
      
      // Matched Certifications
      matchedCertifications: certificationsMatch.matched,
      
      // Missing Certifications
      missingCertifications: certificationsMatch.missing,
      
      // Improvements
      improvements,
      
      // Explainability Data
      explainability: {
        jd_requirements: {
          mandatory_skills: jdData.mandatory_skills,
          preferred_skills: jdData.preferred_skills,
          optional_skills: jdData.optional_skills,
          certifications: jdData.certifications,
          education: jdData.education_required
        },
        resume_data: {
          skills_found: resumeData.skills,
          projects_found: resumeData.projects.length,
          certifications_found: resumeData.certifications,
          education_found: resumeData.education
        },
        scoring_logic: {
          skills_weight: '50%',
          projects_weight: '20%',
          keywords_weight: '20%',
          education_weight: '5%',
          certifications_weight: '5%'
        }
      }
    };
    
  } catch (error) {
    console.error('ATS Engine Error:', error);
    throw new Error('Failed to analyze resume. Please try again.');
  }
}
