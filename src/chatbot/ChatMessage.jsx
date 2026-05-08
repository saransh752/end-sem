import React from 'react'
import ReactMarkdown from 'react-markdown'
import { FiUser } from 'react-icons/fi'

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
        isUser
          ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300'
          : 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300'
      }`}>
        {isUser ? <FiUser className="w-4 h-4" /> : '🛸'}
      </div>

      {/* Bubble */}
      <div className={`max-w-[78%] px-4 py-3 text-sm leading-relaxed ${
        isUser ? 'chat-bubble-user text-purple-100' : 'chat-bubble-ai text-gray-200'
      }`}>
        {isUser ? (
          <p>{message.content}</p>
        ) : (
          <div className="markdown-content">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
        <div className={`text-xs mt-2 opacity-50 ${isUser ? 'text-right' : 'text-left'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  )
}
