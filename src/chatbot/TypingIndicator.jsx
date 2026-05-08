import React from 'react'

export default function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-cyan-500/20 border border-cyan-500/40 text-lg">
        🛸
      </div>
      <div className="chat-bubble-ai px-4 py-3 flex items-center gap-1">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="w-2 h-2 bg-cyan-400 rounded-full inline-block"
            style={{
              animation: 'bounce 1.2s infinite',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
        <style>{`
          @keyframes bounce {
            0%, 60%, 100% { transform: translateY(0); opacity: 0.6; }
            30% { transform: translateY(-6px); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  )
}
