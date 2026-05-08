import React, { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiRefreshCw, FiSearch, FiExternalLink, FiX, FiTrendingUp, FiStar } from 'react-icons/fi'
import { useNews } from '../context/NewsContext'
import { useTheme } from '../context/ThemeContext'
import { generateArticleSummary } from '../api/aiApi'
import { CardSkeleton } from '../components/LoadingSkeleton'
import ErrorState from '../components/ErrorState'
import toast from 'react-hot-toast'

const CATEGORY_COLORS = {
  technology: 'cyan', science: 'purple', world: 'blue', business: 'orange', space: 'green', search: 'gray'
}
const CATEGORY_ICONS = {
  technology: '💻', science: '🔬', world: '🌍', business: '📈', space: '🚀'
}

function ArticleCard({ article, index, onSummarize }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const color = CATEGORY_COLORS[article.category] || 'cyan'
  const [summary, setSummary] = useState(null)
  const [summarizing, setSummarizing] = useState(false)

  const handleSummarize = async () => {
    if (summary || summarizing) return
    setSummarizing(true)
    const result = await generateArticleSummary(article)
    setSummary(result || 'Could not generate summary.')
    setSummarizing(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -2 }}
      className="glass-card overflow-hidden flex flex-col h-full"
    >
      {/* Article Image */}
      {article.image && (
        <div className="relative overflow-hidden" style={{ height: '160px' }}>
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            onError={e => { e.target.style.display = 'none' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <span className={`absolute top-3 left-3 text-xs px-2 py-1 rounded-full font-medium ${
            color === 'cyan' ? 'bg-cyan-500/80 text-white' :
            color === 'purple' ? 'bg-purple-500/80 text-white' :
            color === 'green' ? 'bg-green-500/80 text-white' :
            color === 'orange' ? 'bg-orange-500/80 text-white' :
            'bg-blue-500/80 text-white'
          }`}>
            {CATEGORY_ICONS[article.category]} {article.category}
          </span>
        </div>
      )}

      <div className="p-4 flex flex-col flex-1">
        {/* No-image category badge */}
        {!article.image && (
          <span className={`text-xs px-2 py-1 rounded-full font-medium inline-block mb-2 w-fit ${
            color === 'cyan' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
            color === 'purple' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
            color === 'green' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
            'bg-blue-500/20 text-blue-400 border border-blue-500/30'
          }`}>
            {CATEGORY_ICONS[article.category]} {article.category}
          </span>
        )}

        {/* Title */}
        <h3 className={`font-semibold text-sm leading-snug mb-2 line-clamp-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {article.title}
        </h3>

        {/* Description */}
        <p className={`text-xs leading-relaxed mb-3 line-clamp-3 flex-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {article.description || 'No description available.'}
        </p>

        {/* AI Summary */}
        {summary && (
          <div className="mb-3 p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
            <p className="text-xs text-cyan-300 font-medium mb-1">🤖 AI Summary</p>
            <p className="text-xs text-gray-300 leading-relaxed">{summary}</p>
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span className="font-medium truncate max-w-[120px]">{article.source?.name}</span>
          <span>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : ''}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <a href={article.url} target="_blank" rel="noopener noreferrer"
            className="btn-neon text-xs flex-1 justify-center">
            <FiExternalLink className="w-3 h-3" /> Read More
          </a>
          <button onClick={handleSummarize} disabled={summarizing || !!summary}
            className="btn-secondary text-xs px-3 disabled:opacity-50 whitespace-nowrap">
            {summarizing ? '...' : summary ? '✓' : '🤖 AI'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function FeaturedArticle({ article }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  if (!article) return null
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="glass-card overflow-hidden mb-6 relative">
      <div className="flex flex-col lg:flex-row">
        {article.image && (
          <div className="lg:w-2/5 h-48 lg:h-auto overflow-hidden">
            <img src={article.image} alt={article.title}
              className="w-full h-full object-cover"
              onError={e => { e.target.style.display = 'none' }} />
          </div>
        )}
        <div className="flex-1 p-6">
          <div className="flex items-center gap-2 mb-3">
            <FiStar className="w-4 h-4 text-yellow-400" />
            <span className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">Featured Story</span>
          </div>
          <h2 className={`text-lg font-bold leading-snug mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>{article.title}</h2>
          <p className={`text-sm leading-relaxed mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{article.description}</p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500">{article.source?.name}</span>
            <span className="text-xs text-gray-600">{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : ''}</span>
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="btn-neon text-xs ml-auto">
              <FiExternalLink className="w-3 h-3" /> Read Full Story
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function NewsPage() {
  const { categories, activeCategory, setActiveCategory, loading, errors, loadCategory, getDisplayedArticles,
    searchQuery, setSearchQuery, sortBy, setSortBy, featuredArticle, articlesByCategory } = useNews()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [localSearch, setLocalSearch] = useState('')

  // Load initial category on mount
  useEffect(() => {
    categories.forEach(cat => loadCategory(cat))
  }, []) // eslint-disable-line

  const handleRefresh = () => {
    toast.success(`Refreshing ${activeCategory} news...`, { icon: '📰' })
    loadCategory(activeCategory, true)
  }

  const handleSearch = useCallback((e) => {
    const val = e.target.value
    setLocalSearch(val)
    setSearchQuery(val)
  }, [setSearchQuery])

  const clearSearch = () => { setLocalSearch(''); setSearchQuery('') }

  const articles = getDisplayedArticles()
  const isLoading = loading[searchQuery.length > 2 ? 'search' : activeCategory]
  const error = errors[activeCategory]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Orbitron, sans-serif', background: 'linear-gradient(135deg,#00d4ff,#9b59ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            NEWS DASHBOARD
          </h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Live news · AI summaries · 15-min cache</p>
        </div>
        <div className="flex gap-2">
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className={`text-sm px-3 py-2 rounded-lg border outline-none cursor-pointer ${isDark ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-white border-gray-200 text-gray-700'}`}>
            <option value="latest">Sort: Latest</option>
            <option value="source">Sort: Source</option>
          </select>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleRefresh} className="btn-neon">
            <FiRefreshCw className="w-4 h-4" /> Refresh
          </motion.button>
        </div>
      </motion.div>

      {/* Search Bar */}
      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={localSearch} onChange={handleSearch} placeholder="Search news articles..."
          className={`w-full pl-10 pr-10 py-3 rounded-xl border outline-none text-sm transition-all ${isDark ? 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-cyan-400/40 focus:bg-white/8' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-cyan-400'}`} />
        {localSearch && (
          <button onClick={clearSearch} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
            <FiX className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => {
          const isActive = activeCategory === cat && !searchQuery
          return (
            <motion.button key={cat} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => { setActiveCategory(cat); clearSearch(); loadCategory(cat) }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${isActive
                ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 shadow-neon-blue'
                : isDark ? 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20 hover:text-white' : 'bg-white text-gray-600 border-gray-200 hover:text-gray-900'}`}>
              {CATEGORY_ICONS[cat]} {cat.charAt(0).toUpperCase() + cat.slice(1)}
              {(articlesByCategory?.[cat] || []).length > 0 && (
                <span className="ml-1.5 text-xs opacity-60">({(articlesByCategory?.[cat] || []).length})</span>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Trending banner */}
      {!searchQuery && articles.length > 0 && (
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs ${isDark ? 'bg-orange-500/10 border border-orange-500/20 text-orange-300' : 'bg-orange-50 border border-orange-200 text-orange-700'}`}>
          <FiTrendingUp className="w-3.5 h-3.5" />
          <span className="font-medium">Trending:</span>
          <span className="truncate">{articles[0]?.title}</span>
        </div>
      )}

      {/* Featured Article */}
      {!searchQuery && <FeaturedArticle article={featuredArticle} />}

      {/* Error */}
      {error && <ErrorState message={error} onRetry={() => loadCategory(activeCategory, true)} compact />}

      {/* Articles Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => <CardSkeleton key={i} lines={3} hasImage />)}
        </div>
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.map((article, i) => (
            <ArticleCard key={`${article.url}-${i}`} article={article} index={i} />
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <div className="text-4xl mb-4">📰</div>
          <p className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>No articles found</p>
          <p className="text-sm text-gray-500 mt-1">
            {searchQuery ? `No results for "${searchQuery}"` : 'Click Refresh to load news'}
          </p>
          <button onClick={handleRefresh} className="btn-neon mt-4">
            <FiRefreshCw className="w-4 h-4" /> Load News
          </button>
        </div>
      )}
    </div>
  )
}
