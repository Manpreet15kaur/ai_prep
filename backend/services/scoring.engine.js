// Scoring Engine - Deterministic weighted scoring

export class ScoringEngine {
  
  static WEIGHTS = {
    skills: 0.50,      // 50%
    keywords: 0.20,    // 20%
    projects: 0.20,    // 20%
    education: 0.05,   // 5%
    certifications: 0.05  // 5%
  };
  
  static SKILL_WEIGHTS = {
    mandatory: 3,
    preferred: 2,
    optional: 1
  };
  
  // Calculate overall ATS score
  static calculateATSScore(matchResults) {
    const skillsScore = this.calculateSkillsScore(matchResults.skills);
    const keywordsScore = this.calculateKeywordsScore(matchResults.keywords);
    const projectsScore = this.calculateProjectsScore(matchResults.projects);
    const educationScore = this.calculateEducationScore(matchResults.education);
    const certificationsScore = this.calculateCertificationsScore(matchResults.certifications);
    
    const atsScore = Math.round(
      (skillsScore * this.WEIGHTS.skills) +
      (keywordsScore * this.WEIGHTS.keywords) +
      (projectsScore * this.WEIGHTS.projects) +
      (educationScore * this.WEIGHTS.education) +
      (certificationsScore * this.WEIGHTS.certifications)
    );
    
    return {
      atsScore: Math.min(100, Math.max(0, atsScore)),
      breakdown: {
        skillsScore: Math.round(skillsScore),
        keywordsScore: Math.round(keywordsScore),
        projectsScore: Math.round(projectsScore),
        educationScore: Math.round(educationScore),
        certificationsScore: Math.round(certificationsScore)
      }
    };
  }
  
  // Calculate skills score with weighted priorities
  static calculateSkillsScore(skillsMatch) {
    let totalWeight = 0;
    let earnedWeight = 0;
    
    // Mandatory skills (weight 3)
    if (skillsMatch.mandatory) {
      const mandatoryTotal = skillsMatch.mandatory.total || 0;
      const mandatoryMatched = (skillsMatch.mandatory.exact?.length || 0) +
                               (skillsMatch.mandatory.normalized?.length || 0) +
                               (skillsMatch.mandatory.partial?.length || 0);
      
      totalWeight += mandatoryTotal * this.SKILL_WEIGHTS.mandatory;
      
      // Exact matches get full weight
      earnedWeight += (skillsMatch.mandatory.exact?.length || 0) * this.SKILL_WEIGHTS.mandatory * 1.0;
      
      // Normalized matches get 90% weight
      earnedWeight += (skillsMatch.mandatory.normalized?.length || 0) * this.SKILL_WEIGHTS.mandatory * 0.9;
      
      // Partial matches get 60% weight
      earnedWeight += (skillsMatch.mandatory.partial?.length || 0) * this.SKILL_WEIGHTS.mandatory * 0.6;
    }
    
    // Preferred skills (weight 2)
    if (skillsMatch.preferred) {
      const preferredTotal = skillsMatch.preferred.total || 0;
      
      totalWeight += preferredTotal * this.SKILL_WEIGHTS.preferred;
      
      earnedWeight += (skillsMatch.preferred.exact?.length || 0) * this.SKILL_WEIGHTS.preferred * 1.0;
      earnedWeight += (skillsMatch.preferred.normalized?.length || 0) * this.SKILL_WEIGHTS.preferred * 0.9;
      earnedWeight += (skillsMatch.preferred.partial?.length || 0) * this.SKILL_WEIGHTS.preferred * 0.6;
    }
    
    // Optional skills (weight 1)
    if (skillsMatch.optional) {
      const optionalTotal = skillsMatch.optional.total || 0;
      
      totalWeight += optionalTotal * this.SKILL_WEIGHTS.optional;
      
      earnedWeight += (skillsMatch.optional.exact?.length || 0) * this.SKILL_WEIGHTS.optional * 1.0;
      earnedWeight += (skillsMatch.optional.normalized?.length || 0) * this.SKILL_WEIGHTS.optional * 0.9;
      earnedWeight += (skillsMatch.optional.partial?.length || 0) * this.SKILL_WEIGHTS.optional * 0.6;
    }
    
    if (totalWeight === 0) return 0;
    
    return (earnedWeight / totalWeight) * 100;
  }
  
  // Calculate keywords score (simple ratio)
  static calculateKeywordsScore(keywordsMatch) {
    const matched = keywordsMatch.matched?.length || 0;
    const total = (keywordsMatch.matched?.length || 0) + (keywordsMatch.missing?.length || 0);
    
    if (total === 0) return 100; // No keywords required
    
    return (matched / total) * 100;
  }
  
  // Calculate projects score based on relevance
  static calculateProjectsScore(projectsMatch) {
    const relevantProjects = projectsMatch.relevant || [];
    
    if (relevantProjects.length === 0) return 0;
    
    // Average relevance of all projects
    const avgRelevance = relevantProjects.reduce((sum, p) => sum + p.relevance, 0) / relevantProjects.length;
    
    return avgRelevance;
  }
  
  // Calculate education score
  static calculateEducationScore(educationMatch) {
    if (!educationMatch) return 100; // No education requirement
    
    return educationMatch.matched ? 100 : 50;
  }
  
  // Calculate certifications score
  static calculateCertificationsScore(certificationsMatch) {
    const matched = certificationsMatch.matched?.length || 0;
    const total = (certificationsMatch.matched?.length || 0) + (certificationsMatch.missing?.length || 0);
    
    if (total === 0) return 100; // No certifications required
    
    return (matched / total) * 100;
  }
  
  // Calculate selection probability (non-linear based on ATS score)
  static calculateSelectionProbability(atsScore) {
    let probability = 0;
    
    if (atsScore >= 80) {
      probability = 85 + (atsScore - 80) * 0.75;
    } else if (atsScore >= 60) {
      probability = 50 + (atsScore - 60) * 1.75;
    } else if (atsScore >= 40) {
      probability = 20 + (atsScore - 40) * 1.5;
    } else {
      probability = atsScore * 0.5;
    }
    
    return Math.round(Math.min(100, Math.max(0, probability)));
  }
}
