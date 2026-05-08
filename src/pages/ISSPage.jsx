import React, { useEffect, useState, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { FiRefreshCw, FiMapPin, FiZap, FiUsers, FiClock, FiNavigation } from 'react-icons/fi'
import { useISS } from '../context/ISSContext'
import { useTheme } from '../context/ThemeContext'
import { StatSkeleton, ChartSkeleton } from '../components/LoadingSkeleton'
import ErrorState from '../components/ErrorState'

const ISSMap = lazy(() => import('../map/ISSMap'))

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
}

function StatCard({ icon: Icon, label, value, unit, colorClass, borderClass, index }) {
  return (
    <motion.div custom={index} variants={cardVariants} initial="hidden" animate="visible"
      className={`glass-card p-5 ${borderClass}`}>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 bg-white/5`}>
        <Icon className={`w-5 h-5 ${colorClass}`} />
      </div>
      <div className={`text-2xl font-bold font-mono mb-1 ${colorClass}`}>{value}</div>
      <div className="text-xs text-gray-400 uppercase tracking-wider">{label}</div>
      {unit && <div className="text-xs text-gray-500 mt-0.5">{unit}</div>}
    </motion.div>
  )
}

function AstronautCard({ astronaut, index }) {
  const isChinese = astronaut.craft === 'Tiangong'
  const initials = astronaut.name.split(' ').map(n => n[0]).join('').slice(0, 2)
  return (
    <motion.div custom={index} variants={cardVariants} initial="hidden" animate="visible"
      className="glass-card p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 border ${isChinese ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'}`}>
        {initials}
      </div>
      <div className="min-w-0">
        <p className="font-medium text-sm truncate text-white">{astronaut.name}</p>
        <p className={`text-xs ${isChinese ? 'text-purple-400' : 'text-cyan-400'}`}>{astronaut.craft}</p>
      </div>
    </motion.div>
  )
}

export default function ISSPage() {
  const { issPosition, positions, currentSpeed, locationName, astronauts, loading, error, lastUpdated, refresh } = useISS()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [timeSince, setTimeSince] = useState('')

  useEffect(() => {
    const tick = () => {
      if (!lastUpdated) return
      const sec = Math.floor((Date.now() - lastUpdated) / 1000)
      setTimeSince(sec < 60 ? `${sec}s ago` : `${Math.floor(sec / 60)}m ago`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [lastUpdated])

  if (loading && !issPosition) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <StatSkeleton key={i} />)}</div>
        <ChartSkeleton height={400} />
      </div>
    )
  }

  if (error && !issPosition) return <ErrorState message={error} onRetry={refresh} />

  const lat = issPosition ? parseFloat(issPosition.lat).toFixed(4) : 'N/A'
  const lon = issPosition ? parseFloat(issPosition.lon).toFixed(4) : 'N/A'

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Orbitron, sans-serif', background: 'linear-gradient(135deg,#00d4ff,#9b59ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ISS LIVE TRACKER
          </h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>International Space Station — Real-time position monitoring</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-mono flex items-center gap-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            <FiClock className="w-3 h-3" /> Updated {timeSince}
          </span>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={refresh} className="btn-neon">
            <FiRefreshCw className="w-4 h-4" /> Refresh
          </motion.button>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard index={0} icon={FiMapPin} label="Latitude" value={`${lat}°`} colorClass="text-cyan-400" borderClass="stat-card-blue" />
        <StatCard index={1} icon={FiNavigation} label="Longitude" value={`${lon}°`} colorClass="text-purple-400" borderClass="stat-card-purple" />
        <StatCard index={2} icon={FiZap} label="Speed" value={currentSpeed > 0 ? currentSpeed.toLocaleString() : '~27,600'} unit="km/h" colorClass="text-cyan-300" borderClass="stat-card-cyan" />
        <StatCard index={3} icon={FiUsers} label="In Space" value={astronauts.length} colorClass="text-green-400" borderClass="stat-card-green" />
      </div>

      {locationName && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card px-5 py-3 flex items-center gap-3">
          <FiMapPin className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Currently over:</span>
          <span className="text-sm font-semibold text-cyan-400">{locationName}</span>
          <span className={`text-xs font-mono ml-auto ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{positions.length} positions tracked</span>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="glass-card overflow-hidden" style={{ height: '480px' }}>
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-gray-400">Loading map...</div>}>
          <ISSMap />
        </Suspense>
      </motion.div>

      {astronauts.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="flex items-center gap-3 mb-4">
            <FiUsers className="w-5 h-5 text-cyan-400" />
            <h2 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>People in Space ({astronauts.length})</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {astronauts.map((a, i) => <AstronautCard key={a.name} astronaut={a} index={i} />)}
          </div>
        </motion.div>
      )}
    </div>
  )
}
