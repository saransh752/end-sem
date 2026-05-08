import React, { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { ChartSkeleton } from '../components/LoadingSkeleton'

const ISSSpeedChart = lazy(() => import('../charts/ISSSpeedChart'))
const NewsDistributionChart = lazy(() => import('../charts/NewsDistributionChart'))
const ISSMap = lazy(() => import('../map/ISSMap'))

export default function ChartsPage() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'Orbitron, sans-serif', background: 'linear-gradient(135deg,#00d4ff,#9b59ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          ANALYTICS
        </h1>
        <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Real-time ISS telemetry &amp; news data visualization
        </p>
      </motion.div>

      {/* ISS Speed Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Suspense fallback={<ChartSkeleton height={260} />}>
          <ISSSpeedChart />
        </Suspense>
      </motion.div>

      {/* News Distribution */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Suspense fallback={<ChartSkeleton height={300} />}>
          <NewsDistributionChart />
        </Suspense>
      </motion.div>

      {/* Live Map */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className={`mb-3 flex items-center justify-between`}>
          <div>
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>ISS Live Map</h3>
            <p className="text-xs text-gray-400 mt-0.5">Real-time position with trajectory trail</p>
          </div>
        </div>
        <div className="glass-card overflow-hidden" style={{ height: '400px' }}>
          <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-gray-400">Loading map...</div>}>
            <ISSMap />
          </Suspense>
        </div>
      </motion.div>
    </div>
  )
}
