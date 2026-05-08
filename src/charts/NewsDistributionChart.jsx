import React, { useState, useCallback } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, Sector } from 'recharts'
import { useNews } from '../context/NewsContext'
import { useTheme } from '../context/ThemeContext'

const COLORS = ['#00d4ff', '#9b59ff', '#00ffcc', '#ff6b35', '#ffd700']

const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props
  return (
    <g>
      <text x={cx} y={cy - 12} textAnchor="middle" fill="#fff" fontSize={14} fontWeight={700}>{payload.name}</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="#9b9bb4" fontSize={12}>{value} articles</text>
      <text x={cx} y={cy + 30} textAnchor="middle" fill="#00d4ff" fontSize={11}>{(percent * 100).toFixed(1)}%</text>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 8} startAngle={startAngle} endAngle={endAngle} fill={fill} />
      <Sector cx={cx} cy={cy} innerRadius={outerRadius + 12} outerRadius={outerRadius + 16} startAngle={startAngle} endAngle={endAngle} fill={fill} opacity={0.5} />
    </g>
  )
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div style={{
      background: 'rgba(4,8,16,0.95)', border: '1px solid rgba(0,212,255,0.3)',
      borderRadius: 10, padding: '10px 14px', color: 'white', fontSize: 12,
    }}>
      <p style={{ color: d.payload.fill || '#00d4ff', fontWeight: 700 }}>{d.name}</p>
      <p style={{ color: '#9b9bb4' }}>{d.value} articles</p>
    </div>
  )
}

export default function NewsDistributionChart() {
  const { categoryDistribution, setActiveCategory } = useNews()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [activeIndex, setActiveIndex] = useState(0)

  const data = categoryDistribution.filter(d => d.value > 0)

  const handleClick = useCallback((_, index) => {
    setActiveIndex(index)
    if (data[index]) setActiveCategory(data[index].category)
  }, [data, setActiveCategory])

  if (!data.length) {
    return (
      <div className="glass-card p-5 flex items-center justify-center h-64">
        <p className="text-gray-400 text-sm">Load news to see distribution</p>
      </div>
    )
  }

  const colored = data.map((d, i) => ({ ...d, fill: COLORS[i % COLORS.length] }))

  return (
    <div className="glass-card p-5">
      <div className="mb-4">
        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>News Distribution</h3>
        <p className="text-xs text-gray-400 mt-0.5">Click a slice to filter articles by category</p>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={colored}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={95}
            dataKey="value"
            onClick={handleClick}
            cursor="pointer"
            isAnimationActive={true}
            animationBegin={0}
            animationDuration={600}
          >
            {colored.map((entry, i) => (
              <Cell key={i} fill={entry.fill} stroke="rgba(0,0,0,0.2)" strokeWidth={1} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => <span style={{ color: isDark ? '#9b9bb4' : '#6b7280', fontSize: 12 }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
