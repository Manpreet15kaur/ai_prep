// Matching Engine - Deterministic skill and keyword matching

export class MatchingEngine {
  
  // Match skills with strict logic
  static matchSkills(resumeSkills, jdSkills) {
    const matches = {
      exact: [],
      normalized: [],
      partial: [],
      missing: []
    };
    
    const resumeSkillsLower = resumeSkills.map(s => s.toLowerCase());
    
    jdSkills.forEach(jdSkill => {
      const jdSkillLower = jdSkill.toLowerCase();
      const jdSkillNormalized = this.normalizeSkill(jdSkillLower);
      
      // Check exact match
      if (resumeSkillsLower.includes(jdSkillLower)) {
        matches.exact.push({
          jd: jdSkill,
          resume: jdSkill,
          score: 1.0
        });
      }
      // Check normalized match
      else if (resumeSkillsLower.some(rs => this.normalizeSkill(rs) === jdSkillNormalized)) {
        const resumeMatch = resumeSkills.find(rs => this.normalizeSkill(rs.toLowerCase()) === jdSkillNormalized);
        matches.normalized.push({
          jd: jdSkill,
          resume: resumeMatch,
          score: 0.9
        });
      }
      // Check partial match
      else if (this.isPartialMatch(jdSkillLower, resumeSkillsLower)) {
        const partialMatch = this.findPartialMatch(jdSkillLower, resumeSkills);
        matches.partial.push({
          jd: jdSkill,
          resume: partialMatch.skill,
          score: partialMatch.score
        });
      }
      // No match
      else {
        matches.missing.push(jdSkill);
      }
    });
    
    return matches;
  }
  
  // Normalize skill variations
  static normalizeSkill(skill) {
    const normalizations = {
      'reactjs': 'react',
      'react.js': 'react',
      'nodejs': 'node.js',
      'node': 'node.js',
      'vuejs': 'vue',
      'vue.js': 'vue',
      'nextjs': 'next.js',
      'next': 'next.js',
      'springboot': 'spring boot',
      'spring-boot': 'spring boot',
      'postgresql': 'postgres',
      'mongodb': 'mongo',
      'javascript': 'js',
      'typescript': 'ts'
    };
    
    return normalizations[skill] || skill;
  }
  
  // Check if partial match exists
  static isPartialMatch(jdSkill, resumeSkills) {
    // Check if JD skill is contained in resume skill or vice versa
    return resumeSkills.some(rs => {
      const rsLower = rs.toLowerCase();
      return (
        (jdSkill.includes(rsLower) && rsLower.length >= 3) ||
        (rsLower.includes(jdSkill) && jdSkill.length >= 3)
      );
    });
  }
  
  // Find partial match with score
  static findPartialMatch(jdSkill, resumeSkills) {
    for (const rs of resumeSkills) {
      const rsLower = rs.toLowerCase();
      
      // JD skill contains resume skill (e.g., "spring boot" contains "spring")
      if (jdSkill.includes(rsLower) && rsLower.length >= 3) {
        return {
          skill: rs,
          score: 0.6
        };
      }
      
      // Resume skill contains JD skill (e.g., "react native" contains "react")
      if (rsLower.includes(jdSkill) && jdSkill.length >= 3) {
        return {
          skill: rs,
          score: 0.6
        };
      }
    }
    
    return { skill: null, score: 0 };
  }
  
  // Match certifications (exact only)
  static matchCertifications(resumeCerts, jdCerts) {
    const matched = [];
    const missing = [];
    
    jdCerts.forEach(jdCert => {
      const found = resumeCerts.some(rc => 
        rc.toLowerCase().includes(jdCert.toLowerCase()) ||
        jdCert.toLowerCase().includes(rc.toLowerCase())
      );
      
      if (found) {
        matched.push(jdCert);
      } else {
        missing.push(jdCert);
      }
    });
    
    return { matched, missing };
  }
  
  // Match education level
  static matchEducation(resumeEdu, jdEdu) {
    if (!jdEdu) return { matched: true, score: 1.0 };
    if (!resumeEdu) return { matched: false, score: 0 };
    
    const eduLevels = {
      'phd': 3,
      'masters': 2,
      'bachelors': 1
    };
    
    const resumeLevel = eduLevels[resumeEdu] || 0;
    const jdLevel = eduLevels[jdEdu] || 0;
    
    if (resumeLevel >= jdLevel) {
      return { matched: true, score: 1.0 };
    } else {
      return { matched: false, score: 0.5 };
    }
  }
  
  // Match project relevance (strict logic)
  static matchProjects(resumeProjects, jdData) {
    const relevantProjects = [];
    const gaps = [];
    
    const jdTechStack = [
      ...jdData.mandatory_skills,
      ...jdData.preferred_skills,
      ...jdData.optional_skills
    ];
    
    resumeProjects.forEach(project => {
      // Calculate tech overlap
      const techOverlap = project.tech_stack.filter(tech => 
        jdTechStack.some(jdTech => 
          tech.toLowerCase() === jdTech.toLowerCase() ||
          this.normalizeSkill(tech.toLowerCase()) === this.normalizeSkill(jdTech.toLowerCase())
        )
      );
      
      // Calculate domain overlap
      const domainMatch = jdData.domain_keywords.some(domain => 
        project.domain && project.domain.toLowerCase().includes(domain.toLowerCase())
      );
      
      // Calculate role overlap
      const roleMatch = jdData.role_keywords.some(role => 
        project.description.toLowerCase().includes(role.toLowerCase())
      );
      
      // Calculate relevance score (strict logic)
      let relevanceScore = 0;
      let factors = 0;
      
      if (techOverlap.length > 0) {
        relevanceScore += (techOverlap.length / Math.max(jdTechStack.length, 1)) * 100;
        factors++;
      }
      
      if (domainMatch) {
        relevanceScore += 100;
        factors++;
      }
      
      if (roleMatch) {
        relevanceScore += 100;
        factors++;
      }
      
      if (factors > 0) {
        relevanceScore = relevanceScore / factors;
        
        relevantProjects.push({
          name: project.title,
          relevance: Math.round(relevanceScore),
          reason: this.buildRelevanceReason(techOverlap, domainMatch, roleMatch),
          tech_overlap: techOverlap
        });
      }
    });
    
    // Identify gaps
    if (relevantProjects.length === 0) {
      gaps.push('No projects demonstrate experience with required technologies');
    }
    
    const coveredTech = new Set(relevantProjects.flatMap(p => p.tech_overlap));
    const uncoveredTech = jdData.mandatory_skills.filter(skill => !coveredTech.has(skill));
    
    if (uncoveredTech.length > 0) {
      gaps.push(`No projects showcase: ${uncoveredTech.join(', ')}`);
    }
    
    return { relevantProjects, gaps };
  }
  
  static buildRelevanceReason(techOverlap, domainMatch, roleMatch) {
    const reasons = [];
    
    if (techOverlap.length > 0) {
      reasons.push(`Uses ${techOverlap.length} required technologies: ${techOverlap.slice(0, 3).join(', ')}`);
    }
    
    if (domainMatch) {
      reasons.push('Matches target domain');
    }
    
    if (roleMatch) {
      reasons.push('Aligns with role requirements');
    }
    
    return reasons.join('. ');
  }
}
