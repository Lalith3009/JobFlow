export function localAnalyze(desc, resume) {
  const d = (desc || '').toLowerCase(), r = (resume || '').toLowerCase();
  const skills = ['javascript', 'typescript', 'python', 'java', 'react', 'node', 'aws', 'docker', 'sql', 'postgres', 'git', 'agile', 'css', 'html', 'api', 'rest', 'graphql'];
  const jSkills = skills.filter(s => d.includes(s)), mSkills = skills.filter(s => r.includes(s));
  const matched = jSkills.filter(s => mSkills.includes(s)), missing = jSkills.filter(s => !mSkills.includes(s));
  const score = jSkills.length ? Math.round((matched.length / jSkills.length) * 100) : 50;
  return {
    matchScore: score,
    matchLevel: score >= 70 ? 'Strong Match' : score >= 50 ? 'Good Match' : 'Fair Match',
    summary: resume ? `Based on keywords, you match ${matched.length} of ${jSkills.length} identified skills in this description.` : 'Please upload a resume for a personalized score.',
    experienceLevel: d.includes('senior') ? 'Senior' : d.includes('junior') ? 'Entry' : 'Mid-Level',
    skills: { matched, missing },
    actionItems: [
      { action: 'Tailor your resume to highlight matching skills', priority: 'high' },
      { action: 'Add missing keywords from the job description', priority: 'medium' },
      { action: 'Research the company culture and values', priority: 'low' },
    ],
    interviewTopics: missing.length > 0 ? missing.slice(0, 3) : ['Company background', 'Role expectations', 'Team structure'],
    resumeKeywords: jSkills.slice(0, 5),
    recommendations: ['Tailor your resume keywords', 'Highlight relevant projects', 'Research the company values']
  };
}
