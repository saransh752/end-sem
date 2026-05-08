import React, { lazy, Suspense, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiTarget, FiGlobe, FiZap, FiUsers, FiBarChart2, FiArrowRight } from 'react-icons/fi'
import { useISS } from '../context/ISSContext'
import { useNews } from '../context/NewsContext'
import { useTheme } from '../context/ThemeContext'
import { ChartSkeleton, StatSkeleton } from '../components/LoadingSkeleton'

const ISSSpeedChart = lazy(() => import('../charts/ISSSpeedChart'))
const NewsDistributionChart = lazy(() => import('../charts/NewsDistributionChart'))
const ISSMap = lazy(() => import('../map/ISSMap'))

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

function QuickStat({ icon: Icon, label, value, color, onClick }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  return (
    <motion.div variants={item} whileHover={{ y: -3, scale: 1.01 }} onClick={onClick}
      className="glass-card p-5 cursor-pointer group transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <FiArrowRight className="w-4 h-4 text-gray-600 group-hover:text-cyan-400 transition-colors" />
      </div>
      <div className={`text-2xl font-bold font-mono mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{value}</div>
      <div className="text-xs text-gray-400 uppercase tracking-wider">{label}</div>
    </motion.div>
  )
}

export default function Dashboard({ onNavigate }) {
  const { issPosition, currentSpeed, astronauts, positions, loading: issLoading } = useISS()
  const { articlesByCategory, categories, loadCategory } = useNews()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  // Pre-load first two news categories on dashboard mount
  useEffect(() => {
    loadCategory('technology')
    loadCategory('space')
  }, []) // eslint-disable-line

  const totalArticles = categories.reduce((sum, cat) => sum + (articlesByCategory[cat]?.length || 0), 0)

  return (
    <div className="space-y-8">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="text-center py-6 relative">
        {/* Orbit animation */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <div className="relative w-40 h-40 opacity-20">
            <div className="orbit-ring absolute" style={{ inset: 0, '--duration': '15s' }} />
            <div className="orbit-ring absolute" style={{ inset: '15px', '--duration': '25s', animationDirection: 'reverse' }} />
          </div>
        </div>

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            LIVE MISSION STATUS
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-3" style={{
            fontFamily: 'Orbitron, sans-serif',
            background: 'linear-gradient(135deg,#00d4ff 0%,#9b59ff 50%,#00ffcc 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            ISS COMMAND CENTER
          </h1>
          <p className={`text-base max-w-xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Real-time ISS tracking, live news, and AI-powered mission intelligence
          </p>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={container} initial="hidden" animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickStat icon={FiTarget} label="ISS Latitude"
          value={issPosition ? `${parseFloat(issPosition.lat).toFixed(2)}°` : '...'} color="bg-cyan-500/20 text-cyan-400"
          onClick={() => onNavigate('iss')} />
        <QuickStat icon={FiZap} label="ISS Speed (km/h)"
          value={currentSpeed > 0 ? `${(currentSpeed / 1000).toFixed(1)}k` : '~27.6k'} color="bg-purple-500/20 text-purple-400"
          onClick={() => onNavigate('iss')} />
        <QuickStat icon={FiUsers} label="People in Space"
          value={astronauts.length || '...'} color="bg-green-500/20 text-green-400"
          onClick={() => onNavigate('iss')} />
        <QuickStat icon={FiGlobe} label="News Articles"
          value={totalArticles || '—'} color="bg-orange-500/20 text-orange-400"
          onClick={() => onNavigate('news')} />
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Speed Chart - wider */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-3">
          <Suspense fallback={<ChartSkeleton height={240} />}>
            <ISSSpeedChart />
          </Suspense>
        </motion.div>

        {/* News Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="lg:col-span-2">
          <Suspense fallback={<ChartSkeleton height={240} />}>
            <NewsDistributionChart />
          </Suspense>
        </motion.div>
      </div>

      {/* Live Map */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Live ISS Position</h3>
            <p className="text-xs text-gray-400">Updates every 15 seconds · {positions.length} positions tracked</p>
          </div>
          <button onClick={() => onNavigate('iss')} className="btn-secondary text-xs">
            Full Tracker <FiArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="glass-card overflow-hidden" style={{ height: '360px' }}>
          <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Loading map...</div>}>
            <ISSMap />
          </Suspense>
        </div>
      </motion.div>

      {/* Bottom CTA row */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: FiTarget, title: 'ISS Tracker', desc: 'Live position, trajectory & astronauts', page: 'iss', gradient: 'from-cyan-500/20 to-blue-500/10' },
          { icon: FiGlobe, title: 'News Dashboard', desc: 'Tech, Science, Space & World news', page: 'news', gradient: 'from-purple-500/20 to-pink-500/10' },
          { icon: FiBarChart2, title: 'Analytics', desc: 'Charts, speed history & distribution', page: 'charts', gradient: 'from-green-500/20 to-teal-500/10' },
        ].map(card => (
          <motion.button key={card.page} whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.99 }}
            onClick={() => onNavigate(card.page)}
            className={`glass-card p-5 text-left bg-gradient-to-br ${card.gradient} group`}>
            <card.icon className="w-6 h-6 text-cyan-400 mb-3" />
            <div className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{card.title}</div>
            <div className="text-xs text-gray-400">{card.desc}</div>
            <div className="flex items-center gap-1 mt-3 text-xs text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
              Explore <FiArrowRight className="w-3 h-3" />
            </div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  )
}
