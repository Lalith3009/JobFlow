export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { jobDescription, resumeText, jobTitle, company } = req.body;
  const KEY = process.env.CLAUDE_API_KEY;
  
  if (!KEY) return res.status(500).json({ error: 'API key not configured' });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: `Analyze how well this candidate matches the job. Return ONLY valid JSON.

Job Title: ${jobTitle || 'Not specified'}
Company: ${company || 'Not specified'}
Job Description: ${jobDescription || 'Not provided'}

Candidate Resume: ${resumeText || 'Not provided'}

Return this exact JSON format:
{
  "matchScore": <number 0-100>,
  "matchLevel": "<Strong Match|Good Match|Fair Match|Needs Work>",
  "summary": "<2-3 sentence summary of the candidate's fit>",
  "experienceLevel": "<Entry-Level|Mid-Level|Senior|Staff>",
  "skills": {
    "matched": ["skill1", "skill2"],
    "missing": ["skill1", "skill2"]
  },
  "actionItems": [
    {"action": "<specific thing to do>", "priority": "<high|medium|low>"},
    {"action": "<specific thing to do>", "priority": "<high|medium|low>"},
    {"action": "<specific thing to do>", "priority": "<high|medium|low>"}
  ],
  "interviewTopics": ["<topic to prepare for>", "<topic to prepare for>", "<topic to prepare for>"],
  "resumeKeywords": ["<keyword to add>", "<keyword to add>", "<keyword to add>"],
  "recommendations": ["tip1", "tip2", "tip3"]
}

Guidelines:
- skills.matched and skills.missing should be SHORT labels (1-3 words max, e.g. "React", "Node.js", "System Design")
- actionItems should be specific and actionable (e.g. "Build a portfolio project using their tech stack" not "Learn more skills")
- interviewTopics should be concrete subjects the candidate should study
- resumeKeywords are exact terms from the job posting to weave into the resume`
        }]
      })
    });

    if (!response.ok) {
      console.error('Claude API error:', await response.text());
      return res.status(500).json({ error: 'Claude API error' });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';
    const match = text.match(/\{[\s\S]*\}/);
    
    if (match) {
      return res.status(200).json({ analysis: JSON.parse(match[0]) });
    }
    
    return res.status(500).json({ error: 'Could not parse response' });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ error: err.message });
  }
}
