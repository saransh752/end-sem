import axios from 'axios'

const GNEWS_KEY = import.meta.env.VITE_GNEWS_API_KEY
const BASE_URL = 'https://gnews.io/api/v4'

// GNews category mapping (space uses search endpoint)
const CATEGORY_MAP = {
  technology: 'technology',
  science: 'science',
  world: 'general',
  business: 'business',
  space: null, // use search endpoint
}

/**
 * Fetch top headlines by category
 */
export async function fetchNewsByCategory(category) {
  if (!GNEWS_KEY) throw new Error('GNews API key missing')

  let url, params

  if (category === 'space') {
    // Use search endpoint for "space" category
    url = `${BASE_URL}/search`
    params = {
      q: 'space OR NASA OR astronaut OR rocket OR satellite',
      lang: 'en',
      max: 10,
      apikey: GNEWS_KEY,
    }
  } else {
    url = `${BASE_URL}/top-headlines`
    params = {
      category: CATEGORY_MAP[category] || 'general',
      lang: 'en',
      max: 10,
      apikey: GNEWS_KEY,
    }
  }

  const res = await axios.get(url, { params, timeout: 10000 })
  const articles = res.data.articles || []

  // Normalize article format
  return articles.map(a => ({
    title: a.title || 'No Title',
    description: a.description || '',
    content: a.content || a.description || '',
    url: a.url,
    image: a.image || null,
    publishedAt: a.publishedAt,
    source: { name: a.source?.name || 'Unknown', url: a.source?.url || '' },
    author: a.source?.name || 'Unknown',
    category,
  }))
}

/**
 * Search articles by query
 */
export async function searchNews(query) {
  if (!GNEWS_KEY) throw new Error('GNews API key missing')
  const res = await axios.get(`${BASE_URL}/search`, {
    params: { q: query, lang: 'en', max: 10, apikey: GNEWS_KEY },
    timeout: 10000,
  })
  return (res.data.articles || []).map(a => ({
    title: a.title || 'No Title',
    description: a.description || '',
    content: a.content || a.description || '',
    url: a.url,
    image: a.image || null,
    publishedAt: a.publishedAt,
    source: { name: a.source?.name || 'Unknown', url: a.source?.url || '' },
    author: a.source?.name || 'Unknown',
    category: 'search',
  }))
}
