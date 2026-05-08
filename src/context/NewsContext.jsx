import React, { createContext, useContext, useState, useCallback } from 'react'
import { fetchNewsByCategory, searchNews } from '../api/newsApi'
import { getCache, setCache } from '../utils/cache'
import toast from 'react-hot-toast'

const NewsContext = createContext()

const CATEGORIES = ['technology', 'science', 'world', 'business', 'space']
const CACHE_TTL_MINUTES = 15

export function NewsProvider({ children }) {
  const [articlesByCategory, setArticlesByCategory] = useState({})
  const [activeCategory, setActiveCategory] = useState('technology')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('latest') // 'latest' | 'source'
  const [loading, setLoading] = useState({})
  const [errors, setErrors] = useState({})

  // Fetch articles for a category (with caching)
  const loadCategory = useCallback(async (category, force = false) => {
    const cacheKey = `news-${category}`
    if (!force) {
      const cached = getCache(cacheKey, CACHE_TTL_MINUTES)
      if (cached) {
        setArticlesByCategory(prev => ({ ...prev, [category]: cached }))
        return cached
      }
    }

    setLoading(prev => ({ ...prev, [category]: true }))
    setErrors(prev => ({ ...prev, [category]: null }))

    try {
      const articles = await fetchNewsByCategory(category)
      setArticlesByCategory(prev => ({ ...prev, [category]: articles }))
      setCache(cacheKey, articles)
      setLoading(prev => ({ ...prev, [category]: false }))
      return articles
    } catch (err) {
      const msg = err.message || 'Failed to load news'
      setErrors(prev => ({ ...prev, [category]: msg }))
      setLoading(prev => ({ ...prev, [category]: false }))
      toast.error(`News error: ${msg}`)
      return []
    }
  }, [])

  // Search across all articles
  const handleSearch = useCallback(async (query) => {
    setSearchQuery(query)
    if (query.trim().length > 2) {
      setLoading(prev => ({ ...prev, search: true }))
      try {
        const results = await searchNews(query)
        setArticlesByCategory(prev => ({ ...prev, search: results }))
      } catch {
        toast.error('Search failed')
      }
      setLoading(prev => ({ ...prev, search: false }))
    }
  }, [])

  // Get currently displayed articles
  const getDisplayedArticles = useCallback(() => {
    const cat = searchQuery.trim().length > 2 ? 'search' : activeCategory
    let articles = articlesByCategory[cat] || []

    if (sortBy === 'source') {
      articles = [...articles].sort((a, b) =>
        (a.source?.name || '').localeCompare(b.source?.name || '')
      )
    } else {
      articles = [...articles].sort((a, b) =>
        new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0)
      )
    }
    return articles
  }, [articlesByCategory, activeCategory, searchQuery, sortBy])

  // Count articles per category for charts
  const categoryDistribution = CATEGORIES.map(cat => ({
    name: cat.charAt(0).toUpperCase() + cat.slice(1),
    value: (articlesByCategory[cat] || []).length,
    category: cat,
  }))

  // Featured article (first of active category)
  const featuredArticle = (articlesByCategory[activeCategory] || [])[0] || null

  return (
    <NewsContext.Provider value={{
      articlesByCategory,
      activeCategory,
      setActiveCategory,
      searchQuery,
      setSearchQuery: handleSearch,
      sortBy,
      setSortBy,
      loading,
      errors,
      loadCategory,
      getDisplayedArticles,
      categoryDistribution,
      featuredArticle,
      categories: CATEGORIES,
    }}>
      {children}
    </NewsContext.Provider>
  )
}

export function useNews() {
  return useContext(NewsContext)
}
