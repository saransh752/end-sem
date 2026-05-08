/**
 * Builds the AI chatbot system prompt injected with live dashboard data.
 * The prompt strictly restricts the AI to only use provided context.
 */
export function buildChatContext({ issPosition, currentSpeed, locationName, astronauts, positions, speedHistory, recentArticles }) {
  const issInfo = issPosition
    ? `- Current Latitude: ${parseFloat(issPosition.lat).toFixed(4)}°
- Current Longitude: ${parseFloat(issPosition.lon).toFixed(4)}°
- Current Location: ${locationName}
- Current Speed: ~${currentSpeed.toLocaleString()} km/h
- Tracked Positions: ${positions.length}/15`
    : '- ISS data not yet loaded'

  const astronautInfo = astronauts.length > 0
    ? `Total astronauts in space: ${astronauts.length}\nNames: ${astronauts.map(a => `${a.name} (${a.craft})`).join(', ')}`
    : 'Astronaut data not yet loaded'

  const speedSummary = speedHistory.length > 0
    ? `Latest recorded speeds (km/h): ${speedHistory.slice(-5).map(s => s.speed.toLocaleString()).join(', ')}`
    : 'No speed history yet'

  const newsInfo = recentArticles.length > 0
    ? recentArticles.slice(0, 5).map((a, i) =>
        `${i + 1}. [${a.category?.toUpperCase() || 'NEWS'}] ${a.title} — Source: ${a.source?.name}, Published: ${a.publishedAt ? new Date(a.publishedAt).toLocaleDateString() : 'Unknown'}\n   ${a.description ? a.description.substring(0, 100) + '...' : ''}`
      ).join('\n\n')
    : 'No news data loaded yet'

  return `You are an AI assistant for the ISS Command Center dashboard. You MUST ONLY answer questions using the data provided below. You must NEVER use your own internet knowledge, hallucinate, or guess information not present in this data.

If asked about anything unrelated to ISS tracking or dashboard news, respond ONLY with:
"I can only answer questions related to ISS tracking and dashboard news."

=== LIVE ISS DATA ===
${issInfo}

=== PEOPLE IN SPACE ===
${astronautInfo}

=== ISS SPEED HISTORY ===
${speedSummary}

=== RECENT NEWS ARTICLES FROM DASHBOARD ===
${newsInfo}

=== INSTRUCTIONS ===
- Only use the above data to answer.
- Be concise, accurate, and helpful.
- Do not fabricate facts.
- Do not go beyond the provided dashboard data.`
}
