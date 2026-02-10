// Improvement Engine - Generate actionable suggestions based on gaps

export class ImprovementEngine {
  
  static generateImprovements(matchResults, scoreBreakdown) {
    const improvements = [];
    
    // Skills improvements
    improvements.push(...this.generateSkillsImprovements(matchResults.skills, scoreBreakdown.skillsScore));
    
    // Keywords improvements
    improvements.push(...this.generateKeywordsImprovements(matchResults.keywords, scoreBreakdown.keywordsScore));
    
    // Projects improvements
    improvements.push(...this.generateProjectsImprovements(matchResults.projects, scoreBreakdown.projectsScore));
    
    // Certifications improvements
    improvements.push(...this.generateCertificationsImprovements(matchResults.certifications, scoreBreakdown.certificationsScore));
    
    // Education improvements
    improvements.push(...this.generateEducationImprovements(matchResults.education, scoreBreakdown.educationScore));
    
    // Sort by priority and impact
    return improvements.sort((a, b) => {
      const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }
  
  static generateSkillsImprovements(skillsMatch, currentScore) {
    const improvements = [];
    
    // Missing mandatory skills (HIGH priority)
    if (skillsMatch.mandatory?.missing?.length > 0) {
      const missingSkills = skillsMatch.mandatory.missing.slice(0, 5);
      const potentialIncrease = this.calculateSkillImpact(missingSkills.length, 'mandatory');
      
      improvements.push({
        area: 'Mandatory Skills',
        suggestion: `Add these critical skills: ${missingSkills.join(', ')}`,
        priority: 'High',
        impact: `+${potentialIncrease}% ATS score`,
        actionable: `Include ${missingSkills[0]} in your skills section and demonstrate usage in projects`
      });
    }
    
    // Missing preferred skills (MEDIUM priority)
    if (skillsMatch.preferred?.missing?.length > 0) {
      const missingSkills = skillsMatch.preferred.missing.slice(0, 3);
      const potentialIncrease = this.calculateSkillImpact(missingSkills.length, 'preferred');
      
      improvements.push({
        area: 'Preferred Skills',
        suggestion: `Add these recommended skills: ${missingSkills.join(', ')}`,
        priority: 'Medium',
        impact: `+${potentialIncrease}% ATS score`,
        actionable: `Learn and add ${missingSkills[0]} to strengthen your profile`
      });
    }
    
    // Partial matches that could be exact (MEDIUM priority)
    if (skillsMatch.mandatory?.partial?.length > 0) {
      improvements.push({
        area: 'Skill Terminology',
        suggestion: 'Use exact skill names from job description',
        priority: 'Medium',
        impact: '+3-5% ATS score',
        actionable: 'Replace similar skill names with exact JD terminology'
      });
    }
    
    return improvements;
  }
  
  static generateKeywordsImprovements(keywordsMatch, currentScore) {
    const improvements = [];
    
    if (keywordsMatch.missing?.length > 0) {
      const missingKeywords = keywordsMatch.missing.slice(0, 5);
      const potentialIncrease = Math.round((missingKeywords.length / (keywordsMatch.matched.length + keywordsMatch.missing.length)) * 20);
      
      improvements.push({
        area: 'Keywords',
        suggestion: `Include these keywords: ${missingKeywords.join(', ')}`,
        priority: 'Medium',
        impact: `+${potentialIncrease}% ATS score`,
        actionable: `Naturally incorporate "${missingKeywords[0]}" in your experience or summary section`
      });
    }
    
    return improvements;
  }
  
  static generateProjectsImprovements(projectsMatch, currentScore) {
    const improvements = [];
    
    // No relevant projects (HIGH priority)
    if (projectsMatch.relevant?.length === 0) {
      improvements.push({
        area: 'Projects',
        suggestion: 'Add projects demonstrating required technologies',
        priority: 'High',
        impact: '+15-20% ATS score',
        actionable: 'Create or highlight a project using the required tech stack'
      });
    }
    
    // Project gaps (MEDIUM priority)
    if (projectsMatch.gaps?.length > 0) {
      improvements.push({
        area: 'Project Coverage',
        suggestion: projectsMatch.gaps[0],
        priority: 'Medium',
        impact: '+8-12% ATS score',
        actionable: 'Add a project that addresses this gap'
      });
    }
    
    // Low relevance projects (LOW priority)
    const lowRelevanceProjects = projectsMatch.relevant?.filter(p => p.relevance < 50) || [];
    if (lowRelevanceProjects.length > 0) {
      improvements.push({
        area: 'Project Relevance',
        suggestion: 'Enhance project descriptions to highlight relevant technologies',
        priority: 'Low',
        impact: '+3-5% ATS score',
        actionable: 'Emphasize how projects used required skills and technologies'
      });
    }
    
    return improvements;
  }
  
  static generateCertificationsImprovements(certificationsMatch, currentScore) {
    const improvements = [];
    
    if (certificationsMatch.missing?.length > 0) {
      const missingCerts = certificationsMatch.missing;
      const potentialIncrease = Math.round((missingCerts.length / (certificationsMatch.matched.length + certificationsMatch.missing.length)) * 5);
      
      improvements.push({
        area: 'Certifications',
        suggestion: `Obtain these certifications: ${missingCerts.join(', ')}`,
        priority: 'Low',
        impact: `+${potentialIncrease}% ATS score`,
        actionable: `Consider getting ${missingCerts[0]} certification`
      });
    }
    
    return improvements;
  }
  
  static generateEducationImprovements(educationMatch, currentScore) {
    const improvements = [];
    
    if (educationMatch && !educationMatch.matched) {
      improvements.push({
        area: 'Education',
        suggestion: 'Education level below job requirement',
        priority: 'High',
        impact: '+2-3% ATS score',
        actionable: 'Highlight relevant coursework, certifications, or equivalent experience'
      });
    }
    
    return improvements;
  }
  
  static calculateSkillImpact(missingCount, priority) {
    const baseImpact = {
      'mandatory': 8,
      'preferred': 5,
      'optional': 2
    };
    
    return Math.min(25, baseImpact[priority] * missingCount);
  }
}
