import React, { useState, Suspense, lazy } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { ISSProvider } from './context/ISSContext'
import { NewsProvider } from './context/NewsContext'
import Navbar from './components/Navbar'
import StarBackground from './components/StarBackground'
import ChatBot from './chatbot/ChatBot'

// Lazy-load pages for performance
const Dashboard = lazy(() => import('./pages/Dashboard'))
const ISSPage = lazy(() => import('./pages/ISSPage'))
const NewsPage = lazy(() => import('./pages/NewsPage'))
const ChartsPage = lazy(() => import('./pages/ChartsPage'))

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
}

function PageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400 font-mono">Loading...</p>
      </div>
    </div>
  )
}

function AppContent() {
  const [activePage, setActivePage] = useState('dashboard')
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard onNavigate={setActivePage} />
      case 'iss':       return <ISSPage />
      case 'news':      return <NewsPage />
      case 'charts':    return <ChartsPage />
      default:          return <Dashboard onNavigate={setActivePage} />
    }
  }

  return (
    <div className={`min-h-screen relative ${isDark ? 'bg-space-900' : 'bg-slate-100'}`}
      style={{ background: isDark ? 'linear-gradient(135deg,#020408 0%,#080f1f 60%,#0d1830 100%)' : '#f0f4ff' }}>

      {/* Star background (dark mode only) */}
      {isDark && <StarBackground />}

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: isDark ? 'rgba(8,15,31,0.95)' : 'rgba(255,255,255,0.95)',
            color: isDark ? '#e2e8f0' : '#1a202c',
            border: `1px solid ${isDark ? 'rgba(0,212,255,0.2)' : 'rgba(0,0,0,0.1)'}`,
            borderRadius: '12px',
            backdropFilter: 'blur(16px)',
            fontSize: '14px',
          },
        }}
      />

      {/* Navbar */}
      <Navbar activePage={activePage} onNavigate={setActivePage} />

      {/* Main content */}
      <main className="relative z-10 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Suspense fallback={<PageFallback />}>
                {renderPage()}
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Floating AI Chatbot */}
      <ChatBot />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <ISSProvider>
        <NewsProvider>
          <AppContent />
        </NewsProvider>
      </ISSProvider>
    </ThemeProvider>
  )
}
