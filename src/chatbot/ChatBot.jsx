import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMessageSquare, FiX, FiSend, FiTrash2, FiMinimize2 } from 'react-icons/fi'
import { generateChatResponse } from '../api/aiApi'
import { buildChatContext } from '../utils/chatContext'
import { useISS } from '../context/ISSContext'
import { useNews } from '../context/NewsContext'
import ChatMessage from './ChatMessage'
import TypingIndicator from './TypingIndicator'

const STORAGE_KEY = 'iss-dashboard-chat'
const MAX_MESSAGES = 30

const SUGGESTED = [
  'Where is ISS right now?',
  'What is the ISS speed?',
  'How many astronauts are in space?',
  'Summarize latest space news',
]

function loadMessages() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState(loadMessages)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const endRef = useRef(null)
  const inputRef = useRef(null)
  const { issPosition, positions, currentSpeed, locationName, astronauts, speedHistory } = useISS()
  const { articlesByCategory } = useNews()
  const recentArticles = Object.values(articlesByCategory).flat().slice(0, 20)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, isTyping])
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_MESSAGES))) } catch {}
  }, [messages])
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 300) }, [open])

  const sendMessage = useCallback(async (text) => {
    const userMsg = text.trim()
    if (!userMsg || isTyping) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg, timestamp: Date.now() }])
    setIsTyping(true)
    try {
      const systemPrompt = buildChatContext({ issPosition, currentSpeed, locationName, astronauts, positions, speedHistory, recentArticles })
      const responseText = await generateChatResponse(systemPrompt, userMsg)
      const aiText = responseText || "I couldn't generate a response. Please try again."
      setIsTyping(false)
      setMessages(prev => [...prev, { role: 'assistant', content: '', timestamp: Date.now(), streaming: true }])
      let i = 0
      const id = setInterval(() => {
        i = Math.min(i + 4, aiText.length)
        setMessages(prev => {
          const updated = [...prev]
          const last = updated[updated.length - 1]
          if (last?.streaming) updated[updated.length - 1] = { ...last, content: aiText.slice(0, i) }
          return updated
        })
        if (i >= aiText.length) {
          clearInterval(id)
          setMessages(prev => {
            const updated = [...prev]
            const last = updated[updated.length - 1]
            if (last?.streaming) updated[updated.length - 1] = { ...last, content: aiText, streaming: false }
            return updated
          })
        }
      }, 15)
    } catch (err) {
      setIsTyping(false)
      const msg = err.message || 'Failed to get AI response. Check your connection.'
      setMessages(prev => [...prev, { role: 'assistant', content: msg, timestamp: Date.now() }])
    }
  }, [isTyping, issPosition, currentSpeed, locationName, astronauts, positions, speedHistory, recentArticles])

  const clearChat = () => { setMessages([]); localStorage.removeItem(STORAGE_KEY) }

  return (
    <>
      <motion.button
        initial={{ scale: 0 }} animate={{ scale: 1 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg,#00d4ff,#9b59ff)', boxShadow: '0 0 30px rgba(0,212,255,0.4),0 4px 20px rgba(0,0,0,0.4)' }}
        aria-label="Open AI chatbot"
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><FiX className="w-6 h-6 text-white" /></motion.span>
            : <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><FiMessageSquare className="w-6 h-6 text-white" /></motion.span>
          }
        </AnimatePresence>
        {!open && <span className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: 'linear-gradient(135deg,#00d4ff,#9b59ff)' }} />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }} transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] sm:w-[420px] flex flex-col"
            style={{ height: '580px', maxHeight: 'calc(100vh - 120px)', background: 'rgba(4,8,20,0.97)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '20px', boxShadow: '0 0 40px rgba(0,212,255,0.15),0 20px 60px rgba(0,0,0,0.6)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-base">🛸</div>
                <div>
                  <div className="text-sm font-semibold text-white">ISS AI Assistant</div>
                  <div className="text-xs text-cyan-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> Mistral-7B · Dashboard-only
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {messages.length > 0 && (
                  <button onClick={clearChat} className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors" title="Clear chat">
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                  <FiMinimize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
              {messages.length === 0 && (
                <div className="text-center py-6">
                  <div className="text-3xl mb-3">🛸</div>
                  <p className="text-sm text-gray-300 font-medium mb-1">ISS Command Center AI</p>
                  <p className="text-xs text-gray-500 mb-4">Ask me about ISS tracking or dashboard news</p>
                  <div className="space-y-2">
                    {SUGGESTED.map(q => (
                      <button key={q} onClick={() => sendMessage(q)}
                        className="block w-full text-left text-xs px-3 py-2 rounded-lg border border-white/10 text-gray-400 hover:text-cyan-400 hover:border-cyan-400/30 hover:bg-cyan-400/5 transition-all">
                        💬 {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((msg, i) => <ChatMessage key={i} message={msg} />)}
              {isTyping && <TypingIndicator />}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="flex-shrink-0 px-4 py-3 border-t border-white/10">
              <div className="flex gap-2 items-end">
                <textarea
                  ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) } }}
                  placeholder="Ask about ISS or news..." rows={1} disabled={isTyping}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 resize-none focus:outline-none focus:border-cyan-400/40 transition-all disabled:opacity-50"
                  style={{ minHeight: '40px', maxHeight: '100px' }}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => sendMessage(input)} disabled={!input.trim() || isTyping}
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 disabled:opacity-40"
                  style={{ background: 'linear-gradient(135deg,#00d4ff,#9b59ff)' }}
                >
                  <FiSend className="w-4 h-4 text-white" />
                </motion.button>
              </div>
              <p className="text-xs text-gray-600 mt-2 text-center">Answers only from ISS & news dashboard data</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
