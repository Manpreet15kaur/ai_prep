// JD Parser - Extract structured data from Job Description

const MANDATORY_KEYWORDS = ['must', 'required', 'mandatory', 'essential', 'need', 'needs'];
const PREFERRED_KEYWORDS = ['should', 'preferred', 'desirable', 'ideal', 'plus'];
const OPTIONAL_KEYWORDS = ['nice to have', 'bonus', 'optional', 'advantage'];

// Common tech skills database
const TECH_SKILLS = [
  'javascript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'swift', 'kotlin', 'go', 'rust',
  'react', 'angular', 'vue', 'svelte', 'nextjs', 'nuxt', 'gatsby',
  'nodejs', 'express', 'django', 'flask', 'spring', 'springboot', 'laravel',
  'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch', 'cassandra',
  'docker', 'kubernetes', 'jenkins', 'gitlab', 'github actions', 'terraform',
  'aws', 'azure', 'gcp', 'heroku', 'vercel', 'netlify',
  'git', 'jira', 'confluence', 'slack', 'figma', 'postman',
  'html', 'css', 'sass', 'tailwind', 'bootstrap', 'material-ui',
  'sql', 'nosql', 'graphql', 'rest', 'api', 'microservices',
  'agile', 'scrum', 'kanban', 'ci/cd', 'devops', 'testing', 'jest', 'mocha', 'pytest'
];

const CERTIFICATIONS = [
  'aws certified', 'azure certified', 'gcp certified', 'pmp', 'scrum master', 'csm',
  'oracle certified', 'cisco certified', 'comptia', 'ceh', 'cissp'
];

export function parseJobDescription(jdText) {
  const jdLower = jdText.toLowerCase();
  const lines = jdText.split('\n').filter(line => line.trim().length > 0);
  
  const result = {
    mandatory_skills: [],
    preferred_skills: [],
    optional_skills: [],
    tools: [],
    certifications: [],
    domain_keywords: [],
    role_keywords: [],
    experience_required: null,
    education_required: null,
    raw_requirements: []
  };

  // Extract skills by priority
  lines.forEach(line => {
    const lineLower = line.toLowerCase();
    
    // Skip HR fluff
    if (isHRFluff(lineLower)) return;
    
    // Classify requirement priority
    const isMandatory = MANDATORY_KEYWORDS.some(kw => lineLower.includes(kw));
    const isPreferred = PREFERRED_KEYWORDS.some(kw => lineLower.includes(kw));
    const isOptional = OPTIONAL_KEYWORDS.some(kw => lineLower.includes(kw));
    
    // Extract tech skills from line
    const foundSkills = extractSkillsFromText(line);
    
    if (foundSkills.length > 0) {
      if (isMandatory) {
        result.mandatory_skills.push(...foundSkills);
      } else if (isPreferred) {
        result.preferred_skills.push(...foundSkills);
      } else if (isOptional) {
        result.optional_skills.push(...foundSkills);
      } else {
        // Default to preferred if no keyword found
        result.preferred_skills.push(...foundSkills);
      }
    }
  });

  // Extract certifications
  result.certifications = extractCertifications(jdText);
  
  // Extract experience requirement
  result.experience_required = extractExperience(jdText);
  
  // Extract education requirement
  result.education_required = extractEducation(jdText);
  
  // Extract domain keywords
  result.domain_keywords = extractDomainKeywords(jdText);
  
  // Extract role keywords
  result.role_keywords = extractRoleKeywords(jdText);
  
  // Remove duplicates
  result.mandatory_skills = [...new Set(result.mandatory_skills)];
  result.preferred_skills = [...new Set(result.preferred_skills)];
  result.optional_skills = [...new Set(result.optional_skills)];
  
  return result;
}

function isHRFluff(text) {
  const fluffPatterns = [
    'we are', 'we offer', 'our company', 'our mission', 'our vision',
    'competitive salary', 'great benefits', 'work-life balance',
    'equal opportunity', 'diversity', 'inclusive', 'culture'
  ];
  return fluffPatterns.some(pattern => text.includes(pattern));
}

function extractSkillsFromText(text) {
  const textLower = text.toLowerCase();
  const found = [];
  
  TECH_SKILLS.forEach(skill => {
    // Exact match or word boundary match
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(textLower)) {
      found.push(normalizeSkill(skill));
    }
  });
  
  return found;
}

function extractCertifications(text) {
  const textLower = text.toLowerCase();
  const found = [];
  
  CERTIFICATIONS.forEach(cert => {
    if (textLower.includes(cert)) {
      found.push(cert);
    }
  });
  
  return found;
}

function extractExperience(text) {
  const expRegex = /(\d+)\+?\s*(years?|yrs?)\s*(of)?\s*experience/i;
  const match = text.match(expRegex);
  return match ? parseInt(match[1]) : null;
}

function extractEducation(text) {
  const textLower = text.toLowerCase();
  
  if (textLower.includes('phd') || textLower.includes('doctorate')) {
    return 'phd';
  }
  if (textLower.includes('master') || textLower.includes('ms') || textLower.includes('msc')) {
    return 'masters';
  }
  if (textLower.includes('bachelor') || textLower.includes('bs') || textLower.includes('bsc') || textLower.includes('be') || textLower.includes('btech')) {
    return 'bachelors';
  }
  
  return null;
}

function extractDomainKeywords(text) {
  const domains = ['fintech', 'healthcare', 'ecommerce', 'saas', 'edtech', 'ai', 'ml', 'blockchain', 'iot'];
  const textLower = text.toLowerCase();
  return domains.filter(domain => textLower.includes(domain));
}

function extractRoleKeywords(text) {
  const roles = ['frontend', 'backend', 'fullstack', 'full stack', 'devops', 'data', 'mobile', 'cloud', 'security'];
  const textLower = text.toLowerCase();
  return roles.filter(role => textLower.includes(role));
}

function normalizeSkill(skill) {
  // Normalize common variations
  const normalizations = {
    'reactjs': 'react',
    'react.js': 'react',
    'nodejs': 'node.js',
    'node': 'node.js',
    'vuejs': 'vue',
    'vue.js': 'vue',
    'nextjs': 'next.js',
    'springboot': 'spring boot',
    'postgresql': 'postgres',
    'mongodb': 'mongo'
  };
  
  return normalizations[skill.toLowerCase()] || skill.toLowerCase();
}
