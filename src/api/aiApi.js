import axios from 'axios'

const POLLINATIONS_URL = 'https://text.pollinations.ai/openai'

/**
 * Generate a chat completion using Pollinations AI (free, no token required).
 */
export async function generateChatResponse(systemPrompt, userMessage) {
  try {
    const res = await axios.post(
      POLLINATIONS_URL,
      {
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        model: 'openai',
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    )

    return res.data.choices[0].message.content.trim()
  } catch (err) {
    if (err.response && err.response.data && err.response.data.error) {
      throw new Error(err.response.data.error.message || 'API Error')
    }
    throw new Error(err.message || 'Failed to connect to AI service.')
  }
}

/**
 * Generate a short AI summary for a news article.
 */
export async function generateArticleSummary(article) {
  try {
    const prompt = `Summarize this news article in 2 sentences maximum. Be concise and factual.\n\nTitle: ${article.title}\nContent: ${article.description || article.content || ''}`
    
    const res = await axios.post(
      POLLINATIONS_URL,
      {
        messages: [
          { role: 'system', content: 'You are a news summarizer.' },
          { role: 'user', content: prompt }
        ],
        model: 'openai',
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 20000,
      }
    )
    
    return res.data.choices[0].message.content.trim()
  } catch {
    return null
  }
}
