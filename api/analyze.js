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
        max_tokens: 1500,
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
  "summary": "<2-3 sentence summary>",
  "experienceLevel": "<Entry-Level|Mid-Level|Senior|Staff>",
  "skills": {
    "matched": ["skill1", "skill2", "skill3"],
    "missing": ["skill1", "skill2", "skill3"]
  },
  "recommendations": ["tip1", "tip2", "tip3", "tip4"]
}`
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
