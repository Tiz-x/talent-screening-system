// The mapping for qualifications (Section 3.10.1)
const QUAL_SCORE: Record<string, number> = {
  'OND': 40,
  'HND': 60,
  'BSC': 80,
  'MSC': 100
};

export function calculateScore(vacancy: any, profile: any) {
  const weights = vacancy.weights as { qual: number; skills: number; exp: number; certs: number };

  // 1. KNOCKOUT STAGE (Section 3.10)
  const applicantQualScore = QUAL_SCORE[profile.qualification] || 0;
  const requiredQualScore = QUAL_SCORE[vacancy.minQualification] || 0;

  if (applicantQualScore < requiredQualScore) {
    return {
      knockedOut: true,
      reason: `Minimum qualification (${vacancy.minQualification}) not met`,
      totalScore: 0,
      breakdown: null
    };
  }

  // 2. WEIGHTED SCORING STAGE
  
  // Qualification Score (0-100)
  const qualScore = applicantQualScore;

  // Skills Score (0-100)
  const requiredSkills = vacancy.requiredSkills as string[];
  const applicantSkills = profile.skills as string[];
  
  let matchedSkills = 0;
  requiredSkills.forEach((reqSkill) => {
    if (applicantSkills.map(s => s.toLowerCase()).includes(reqSkill.toLowerCase())) {
      matchedSkills++;
    }
  });
  
  const skillsScore = requiredSkills.length === 0 
    ? 100 
    : (matchedSkills / requiredSkills.length) * 100;

  // Experience Score (0-100, capped at 100)
  const expScore = Math.min((profile.experienceYrs / vacancy.requiredYears) * 100, 100);

  // Certifications Score (0-100) - Mocked for now as we haven't built certs into the profile yet
  const certsScore = 100; 

  // 3. CALCULATE TOTAL
  const totalScore = (
    (weights.qual * qualScore) +
    (weights.skills * skillsScore) +
    (weights.exp * expScore) +
    (weights.certs * certsScore)
  ) / 100;

  return {
    knockedOut: false,
    totalScore: Number(totalScore.toFixed(2)),
    breakdown: {
      qualScore,
      skillsScore: Number(skillsScore.toFixed(2)),
      expScore: Number(expScore.toFixed(2)),
      certsScore
    }
  };
}