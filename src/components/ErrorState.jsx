import React from 'react'
import { motion } from 'framer-motion'
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi'

/**
 * Error state card with retry button.
 */
export default function ErrorState({ message, onRetry, compact = false }) {
  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
        <FiAlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
        <span className="text-sm text-red-300">{message}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="ml-auto text-xs text-red-400 hover:text-red-200 flex items-center gap-1 transition-colors"
          >
            <FiRefreshCw className="w-3 h-3" /> Retry
          </button>
        )}
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-8 flex flex-col items-center justify-center gap-4 text-center"
    >
      <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
        <FiAlertTriangle className="w-7 h-7 text-red-400" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-200 mb-1">Something went wrong</h3>
        <p className="text-sm text-gray-400">{message}</p>
      </div>
      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="btn-neon"
        >
          <FiRefreshCw className="w-4 h-4" />
          Try Again
        </motion.button>
      )}
    </motion.div>
  )
}
