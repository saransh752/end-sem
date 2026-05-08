import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiSun, FiMoon, FiTarget, FiMenu, FiX,
  FiRadio, FiBarChart2, FiGlobe
} from 'react-icons/fi'
import { useTheme } from '../context/ThemeContext'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: FiRadio },
  { id: 'iss',       label: 'ISS Tracker', icon: FiTarget },
  { id: 'news',      label: 'News Feed', icon: FiGlobe },
  { id: 'charts',    label: 'Analytics', icon: FiBarChart2 },
]

export default function Navbar({ activePage, onNavigate }) {
  const { theme, toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const isDark = theme === 'dark'

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: isDark
          ? 'rgba(4, 8, 16, 0.85)'
          : 'rgba(240,244,255,0.90)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: isDark
          ? '1px solid rgba(0,212,255,0.12)'
          : '1px solid rgba(0,0,0,0.08)',
        boxShadow: isDark
          ? '0 4px 30px rgba(0,0,0,0.4)'
          : '0 4px 20px rgba(0,0,0,0.08)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-3 group"
          >
            <div className="relative w-9 h-9 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 opacity-20 group-hover:opacity-30 transition-opacity" />
              <FiTarget className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="hidden sm:block">
              <div
                className="font-display font-bold text-lg leading-none"
                style={{
                  fontFamily: 'Orbitron, sans-serif',
                  background: 'linear-gradient(135deg, #00d4ff, #9b59ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                ISS COMMAND
              </div>
              <div className={`text-xs font-mono ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                LIVE MISSION CENTER
              </div>
            </div>
          </motion.button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(item => {
              const Icon = item.icon
              const isActive = activePage === item.id
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                      : isDark
                        ? 'text-gray-400 hover:text-white hover:bg-white/5'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-black/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </motion.button>
              )
            })}
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-3">
            {/* Live indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-green-400 font-mono font-medium">LIVE</span>
            </div>

            {/* Theme toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={`p-2 rounded-lg border transition-all duration-200 ${
                isDark
                  ? 'bg-white/5 border-white/10 text-yellow-400 hover:bg-yellow-400/10 hover:border-yellow-400/30'
                  : 'bg-black/5 border-black/10 text-gray-600 hover:bg-black/10'
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
            </motion.button>

            {/* Mobile menu */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white transition-colors"
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Open menu"
            >
              {menuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden border-t"
            style={{
              background: isDark ? 'rgba(4,8,16,0.97)' : 'rgba(240,244,255,0.97)',
              borderColor: isDark ? 'rgba(0,212,255,0.1)' : 'rgba(0,0,0,0.08)',
            }}
          >
            <div className="px-4 py-3 space-y-1">
              {NAV_ITEMS.map(item => {
                const Icon = item.icon
                const isActive = activePage === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => { onNavigate(item.id); setMenuOpen(false) }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-cyan-500/10 text-cyan-400'
                        : isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
