# 🛸 ISS Command Center

> **A production-quality futuristic dashboard** featuring live ISS tracking, a multi-category news feed with AI summaries, an AI chatbot restricted to dashboard data, and rich data visualizations — all in a NASA-style dark UI.

## ✨ Features

| Feature | Details |
|---|---|
| 🛸 **ISS Live Tracking** | Position updates every 15s · Leaflet map · Trajectory path · Haversine speed · Reverse geocoding |
| 📰 **News Dashboard** | GNews API · 5 categories · AI summaries · 15-min cache · Search & sort |
| 🤖 **AI Chatbot** | Mistral-7B via Hugging Face · Restricted to dashboard data · Streaming effect |
| 📊 **Charts** | Recharts speed AreaChart · News PieChart · Live ISS map |
| 🎨 **UI/UX** | Glassmorphism · Dark/Light mode · Framer Motion · Star background · Responsive |

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd iss-command-center
npm install
```

### 2. Environment Variables
Create `.env` (already included — **never commit this file**):
```env
VITE_GNEWS_API_KEY=your_gnews_api_key
VITE_AI_TOKEN=your_huggingface_token
```

### 3. Run Development Server
```bash
npm run dev
# Opens at http://localhost:3000
```

### 4. Build for Production
```bash
npm run build
npm run preview  # Test the production build locally
```

---

## 🗂️ Project Structure

```
src/
├── api/            # Axios API abstractions (ISS, News, AI)
├── chatbot/        # ChatBot, ChatMessage, TypingIndicator
├── charts/         # ISSSpeedChart, NewsDistributionChart
├── components/     # Navbar, StarBackground, LoadingSkeleton, ErrorState
├── context/        # ThemeContext, ISSContext, NewsContext
├── map/            # ISSMap (Leaflet + react-leaflet)
├── pages/          # Dashboard, ISSPage, NewsPage, ChartsPage
├── styles/         # index.css (global styles)
└── utils/          # haversine, cache, chatContext
```

---

## 🌐 Deployment to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy preview
vercel

# Deploy production
vercel --prod
```

**Vercel Environment Variables** — add in your Vercel dashboard:
```
VITE_GNEWS_API_KEY = your_key
VITE_AI_TOKEN = your_token
```

> ⚠️ Vercel automatically uses `vercel.json` in the root for build config and SPA routing.

---

## 🔌 APIs Used

| API | Endpoint | Purpose |
|---|---|---|
| Open Notify | `api.open-notify.org/iss-now.json` | ISS live position |
| Open Notify | `api.open-notify.org/astros.json` | Astronauts in space |
| Nominatim | `nominatim.openstreetmap.org/reverse` | Reverse geocoding |
| GNews | `gnews.io/api/v4/top-headlines` | News articles |
| Hugging Face | `api-inference.huggingface.co` | Mistral-7B AI chatbot |

---

## 🤖 AI Chatbot Rules

The chatbot is **strictly restricted** to:
- Current ISS position, speed, location
- Astronaut names and spacecraft
- News articles currently loaded in the dashboard

It will **never** use external knowledge or hallucinate. If asked off-topic questions, it responds:
> "I can only answer questions related to ISS tracking and dashboard news."

---

## 📦 Dependencies

```json
{
  "react": "^18",
  "react-dom": "^18",
  "framer-motion": "^11",
  "recharts": "^2",
  "leaflet": "^1.9",
  "react-leaflet": "^4",
  "react-hot-toast": "^2",
  "react-icons": "^5",
  "react-markdown": "^9",
  "axios": "^1"
}
```

---

## 🎨 Design System

- **Colors**: Neon blue `#00d4ff`, Neon purple `#9b59ff`, Neon cyan `#00ffcc`
- **Fonts**: Orbitron (headings), Inter (body), JetBrains Mono (data)
- **Cards**: Glassmorphism — `backdrop-blur`, semi-transparent borders
- **Animations**: Framer Motion page transitions, star twinkle, ISS orbit rings

---

## 📄 License

MIT — free to use and modify.
