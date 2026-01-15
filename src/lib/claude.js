
const API_ENDPOINT = '/api/analyze';

export async function analyzeJobWithClaude(jobData, resumeText) {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jobDescription: jobData.description || '',
        resumeText: resumeText || '',
        jobTitle: jobData.title || '',
        company: jobData.company || ''
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Analysis failed');
    }

    const data = await response.json();
    return data.analysis;

  } catch (error) {
    console.error('Claude analysis error:', error);
    throw error;
  }
}

export function localAnalysis(jobDescription, resumeText) {
  const desc = (jobDescription || '').toLowerCase();
  const resume = (resumeText || '').toLowerCase();

  const skills = [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'rust', 'php',
    'react', 'angular', 'vue', 'svelte', 'next.js', 'node.js', 'express', 'django', 'flask',
    'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'firebase', 'dynamodb',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins', 'ci/cd',
    'git', 'github', 'agile', 'scrum', 'html', 'css', 'tailwind', 'sass',
    'rest', 'graphql', 'api', 'microservices',
    'machine learning', 'deep learning', 'ai', 'tensorflow', 'pytorch',
    'data science', 'data analysis', 'pandas', 'numpy'
  ];

  const jobSkills = skills.filter(s => desc.includes(s));
  const mySkills = skills.filter(s => resume.includes(s));
  const matched = jobSkills.filter(s => mySkills.includes(s));
  const missing = jobSkills.filter(s => !mySkills.includes(s));

  const score = jobSkills.length > 0 
    ? Math.round((matched.length / jobSkills.length) * 100) 
    : 50;

  let level = 'Mid-Level';
  if (desc.includes('senior') || desc.includes('lead') || desc.includes('sr.')) {
    level = 'Senior';
  } else if (desc.includes('junior') || desc.includes('entry') || desc.includes('jr.')) {
    level = 'Entry-Level';
  } else if (desc.includes('principal') || desc.includes('staff') || desc.includes('architect')) {
    level = 'Staff/Principal';
  }

  let yearsRequired = null;
  const expMatch = desc.match(/(\d+)\+?\s*years?/i);
  if (expMatch) yearsRequired = parseInt(expMatch[1]);

  const matchLevel = score >= 75 ? 'Strong Match' 
    : score >= 55 ? 'Good Match' 
    : score >= 35 ? 'Fair Match' 
    : 'Needs Work';

  return {
    matchScore: score,
    matchLevel,
    summary: `Based on keyword analysis, you match ${matched.length} of ${jobSkills.length} key skills for this ${level} position.`,
    experienceLevel: level,
    yearsRequired,
    skills: {
      matched,
      missing: missing.slice(0, 10),
      bonus: []
    },
    strengths: matched.length > 0 
      ? [`Strong ${matched[0]} skills`, `Experience with ${matched.slice(0, 3).join(', ')}`]
      : ['Consider tailoring your resume'],
    concerns: missing.length > 0 
      ? [`Missing experience with ${missing[0]}`, `Consider learning ${missing.slice(0, 2).join(' and ')}`]
      : [],
    recommendations: [
      'Tailor your resume keywords to match the job description',
      'Quantify your achievements with metrics',
      'Include relevant projects or experience'
    ],
    interviewTips: [
      'Research the company culture and recent news',
      'Prepare STAR method responses for behavioral questions',
      `Be ready to discuss your ${matched[0] || 'relevant'} experience`
    ],
    keywordsToAdd: missing.slice(0, 5),
    isLocalAnalysis: true
  };
}
