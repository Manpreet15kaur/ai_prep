// Resume Parser - Extract structured data from Resume

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

export function parseResume(resumeText) {
  const resumeLower = resumeText.toLowerCase();
  
  const result = {
    skills: [],
    tools: [],
    projects: [],
    certifications: [],
    education: null,
    experience_years: null,
    domains: []
  };

  // Extract skills
  result.skills = extractSkills(resumeText);
  
  // Extract projects
  result.projects = extractProjects(resumeText);
  
  // Extract certifications
  result.certifications = extractCertifications(resumeText);
  
  // Extract education
  result.education = extractEducation(resumeText);
  
  // Extract experience
  result.experience_years = extractExperience(resumeText);
  
  // Extract domains
  result.domains = extractDomains(resumeText);
  
  return result;
}

function extractSkills(text) {
  const textLower = text.toLowerCase();
  const found = [];
  
  TECH_SKILLS.forEach(skill => {
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(textLower)) {
      found.push(normalizeSkill(skill));
    }
  });
  
  return [...new Set(found)];
}

function extractProjects(text) {
  const projects = [];
  const lines = text.split('\n');
  
  // Look for project sections
  let inProjectSection = false;
  let currentProject = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lineLower = line.toLowerCase();
    
    // Detect project section start
    if (lineLower.includes('project') && (lineLower.includes(':') || line.length < 50)) {
      inProjectSection = true;
      continue;
    }
    
    // Detect project title (usually short line after project section)
    if (inProjectSection && line.length > 0 && line.length < 100 && !line.includes('.')) {
      if (currentProject) {
        projects.push(currentProject);
      }
      currentProject = {
        title: line,
        description: '',
        tech_stack: [],
        domain: null
      };
      continue;
    }
    
    // Add to current project description
    if (currentProject && line.length > 0) {
      currentProject.description += ' ' + line;
      
      // Extract tech stack from description
      const techs = extractSkills(line);
      currentProject.tech_stack.push(...techs);
    }
    
    // End project section
    if (lineLower.includes('experience') || lineLower.includes('education') || lineLower.includes('certification')) {
      if (currentProject) {
        projects.push(currentProject);
        currentProject = null;
      }
      inProjectSection = false;
    }
  }
  
  if (currentProject) {
    projects.push(currentProject);
  }
  
  // Deduplicate tech stacks
  projects.forEach(project => {
    project.tech_stack = [...new Set(project.tech_stack)];
    project.domain = extractDomainFromText(project.description);
  });
  
  return projects;
}

function extractCertifications(text) {
  const certPatterns = [
    /aws certified/i,
    /azure certified/i,
    /google cloud certified/i,
    /oracle certified/i,
    /cisco certified/i,
    /pmp/i,
    /scrum master/i,
    /csm/i
  ];
  
  const found = [];
  certPatterns.forEach(pattern => {
    const match = text.match(pattern);
    if (match) {
      found.push(match[0].toLowerCase());
    }
  });
  
  return found;
}

function extractEducation(text) {
  const textLower = text.toLowerCase();
  
  if (textLower.includes('phd') || textLower.includes('doctorate')) {
    return 'phd';
  }
  if (textLower.includes('master') || textLower.includes('ms') || textLower.includes('msc') || textLower.includes('mba')) {
    return 'masters';
  }
  if (textLower.includes('bachelor') || textLower.includes('bs') || textLower.includes('bsc') || textLower.includes('be') || textLower.includes('btech') || textLower.includes('b.tech')) {
    return 'bachelors';
  }
  
  return null;
}

function extractExperience(text) {
  // Look for total experience mentions
  const expRegex = /(\d+)\+?\s*(years?|yrs?)\s*(of)?\s*(total)?\s*experience/i;
  const match = text.match(expRegex);
  
  if (match) {
    return parseInt(match[1]);
  }
  
  // Count years from experience section
  const yearRegex = /\b(20\d{2}|19\d{2})\b/g;
  const years = text.match(yearRegex);
  
  if (years && years.length >= 2) {
    const sortedYears = years.map(y => parseInt(y)).sort();
    const experienceYears = new Date().getFullYear() - sortedYears[0];
    return Math.min(experienceYears, 50); // Cap at 50 years
  }
  
  return null;
}

function extractDomains(text) {
  const domains = ['fintech', 'healthcare', 'ecommerce', 'e-commerce', 'saas', 'edtech', 'ai', 'ml', 'blockchain', 'iot'];
  const textLower = text.toLowerCase();
  return domains.filter(domain => textLower.includes(domain));
}

function extractDomainFromText(text) {
  const domains = ['fintech', 'healthcare', 'ecommerce', 'saas', 'edtech'];
  const textLower = text.toLowerCase();
  
  for (const domain of domains) {
    if (textLower.includes(domain)) {
      return domain;
    }
  }
  
  return null;
}

function normalizeSkill(skill) {
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
