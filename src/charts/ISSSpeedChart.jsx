import React from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Area, AreaChart, Legend,
} from 'recharts'
import { useISS } from '../context/ISSContext'
import { useTheme } from '../context/ThemeContext'
import { ChartSkeleton } from '../components/LoadingSkeleton'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'rgba(4,8,16,0.95)',
      border: '1px solid rgba(0,212,255,0.3)',
      borderRadius: 10,
      padding: '10px 14px',
      color: 'white',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 12,
    }}>
      <p style={{ color: '#9b9bb4', marginBottom: 4 }}>{label}</p>
      <p style={{ color: '#00d4ff', fontWeight: 700 }}>
        {payload[0]?.value?.toLocaleString()} km/h
      </p>
    </div>
  )
}

export default function ISSSpeedChart() {
  const { speedHistory, loading } = useISS()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  if (loading || speedHistory.length === 0) {
    return <ChartSkeleton height={240} />
  }

  const avgSpeed = speedHistory.length > 0
    ? Math.round(speedHistory.reduce((s, r) => s + r.speed, 0) / speedHistory.length)
    : 27600

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>ISS Speed History</h3>
          <p className="text-xs text-gray-400 mt-0.5">Last {speedHistory.length} measurements (km/h)</p>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold font-mono text-cyan-400">
            {speedHistory[speedHistory.length - 1]?.speed?.toLocaleString() || '—'} km/h
          </div>
          <div className="text-xs text-gray-500">Current speed</div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={speedHistory} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
          <defs>
            <linearGradient id="speedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
          <XAxis
            dataKey="time"
            tick={{ fill: isDark ? '#6b7280' : '#9ca3af', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: isDark ? '#6b7280' : '#9ca3af', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={v => `${(v / 1000).toFixed(0)}k`}
            domain={['auto', 'auto']}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            y={avgSpeed}
            stroke="rgba(155,89,255,0.4)"
            strokeDasharray="4 4"
            label={{ value: 'Avg', fill: '#9b59ff', fontSize: 10, position: 'insideTopRight' }}
          />
          <Area
            type="monotone"
            dataKey="speed"
            stroke="#00d4ff"
            strokeWidth={2}
            fill="url(#speedGradient)"
            dot={false}
            activeDot={{ r: 5, fill: '#00d4ff', stroke: '#001a20', strokeWidth: 2 }}
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
