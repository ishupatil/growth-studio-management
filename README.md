# AI Social Media Growth Team

Full-stack SaaS app with CrewAI multi-agent system.
Frontend + Backend both deployed on Render.com for free.

## Services

Service 1: growthteam-backend (Flask + CrewAI + Groq)
Service 2: growthteam-frontend (Next.js)

## Setup

### 1. Get Free API Keys
- Supabase: supabase.com (free account)
- Groq: console.groq.com (free, no credit card)

### 2. Run Supabase SQL schema (paste SQL above)

### 3. Deploy to Render.com
1. Push this repo to GitHub
2. Go to render.com → New → Blueprint
3. Connect your GitHub repo
4. Render reads render.yaml and creates both services
5. Add environment variables in Render dashboard:
   Backend: GROQ_API_KEY, API_SECRET_KEY
   Frontend: all 5 variables listed above

### 6. Done — both services live on Render.com free tier

## How CrewAI Multi-Agent Flow Works

1. User submits Instagram form on frontend
2. Next.js API route sends data to Flask backend
3. Flask creates InstagramGrowthCrew instance
4. CrewAI runs 4 agents sequentially:
   Agent 1 (Audit) → passes context to →
   Agent 2 (Strategy) → passes context to →
   Agent 3 (Content) → passes context to →
   Agent 4 (Captions + Tips)
5. Each agent uses Llama 3.1 via Groq API (free)
6. Combined output returned to frontend
7. User saves plan to Supabase
