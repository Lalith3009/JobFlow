export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { jobDescription, resumeText, jobTitle, company, location } = req.body;
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
          content: `Write a professional cover letter tailored to this specific job. The letter should be personalized, compelling, and highlight relevant experience from the resume. Do NOT include placeholder brackets like [Your Name] - write it as a complete, ready-to-use letter.

Job Title: ${jobTitle || 'Not specified'}
Company: ${company || 'Not specified'}
Location: ${location || 'Not specified'}
Job Description: ${jobDescription || 'Not provided'}

Candidate Resume: ${resumeText || 'Not provided'}

Write a professional, warm, and specific cover letter (3-4 paragraphs). Focus on:
1. Why the candidate is excited about this specific role and company
2. Key relevant experience and achievements from the resume
3. How the candidate's skills align with the job requirements
4. A confident closing with call to action

Return ONLY the cover letter text, no additional commentary.`
        }]
      })
    });

    if (!response.ok) {
      console.error('Claude API error:', await response.text());
      return res.status(500).json({ error: 'Claude API error' });
    }

    const data = await response.json();
    const coverLetter = data.content?.[0]?.text || '';

    if (coverLetter) {
      return res.status(200).json({ coverLetter });
    }

    return res.status(500).json({ error: 'Could not generate cover letter' });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ error: err.message });
  }
}
