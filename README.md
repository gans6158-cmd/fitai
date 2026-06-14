# FitAI – AI Fitness & Body Transformation Platform

Full-stack fitness SaaS built with Next.js 15, FastAPI, and MongoDB Atlas.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, Recharts |
| Backend | FastAPI, Python, Motor (async MongoDB) |
| Database | MongoDB Atlas |
| Auth | JWT (python-jose) + bcrypt |
| AI | OpenAI GPT-4o-mini |
| Deploy | Vercel (frontend) + Render (backend) |

---

## Quick Start

### 1. MongoDB Atlas
1. Create a free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a database user and copy the connection string
3. Whitelist `0.0.0.0/0` in Network Access (for Render)

### 2. Backend (FastAPI)

```bash
cd fitai/backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt

# Create .env from example
copy .env.example .env
# Edit .env and fill in MONGODB_URL, SECRET_KEY, OPENAI_API_KEY

uvicorn app.main:app --reload
# API runs at http://localhost:8000
# Docs at http://localhost:8000/docs
```

### 3. Frontend (Next.js)

```bash
cd fitai/frontend
npm install

# Create .env.local
echo NEXT_PUBLIC_API_URL=http://localhost:8000 > .env.local

npm run dev
# App runs at http://localhost:3000
```

---

## Deployment

### Backend → Render

1. Push `fitai/backend` to a GitHub repo
2. New Web Service → connect repo
3. Build: `pip install -r requirements.txt`
4. Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add env vars: `MONGODB_URL`, `SECRET_KEY`, `OPENAI_API_KEY`

### Frontend → Vercel

1. Push `fitai/frontend` to a GitHub repo
2. Import project in Vercel
3. Add env var: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`
4. Deploy

---

## Environment Variables

### Backend `.env`
```
MONGODB_URL=mongodb+srv://...
SECRET_KEY=your-random-secret-32-chars+
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
OPENAI_API_KEY=sk-...          # optional, enables AI chat
```

### Frontend `.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Features

- **Auth** — Register, login, JWT, protected routes
- **Dashboard** — BMI, TDEE, protein target, fitness score, goal ETA
- **Weight Tracking** — Log/delete entries, line chart trend
- **Workout Tracking** — Log exercises/sets, analytics, volume tracking
- **Nutrition** — Log macros, calorie/protein progress bars, pie chart
- **Achievements** — 6 badges unlocked by activity milestones
- **AI Coach** — GPT-4o-mini chatbot with full user context

---

## MongoDB Collections

| Collection | Purpose |
|------------|---------|
| `users` | User profiles + hashed passwords |
| `weight_logs` | Daily weight entries |
| `workouts` | Workout sessions with exercises/sets |
| `nutrition_logs` | Food entries with macros |
| `chat_history` | AI conversation history |

---

## API Endpoints

```
POST /api/auth/register
POST /api/auth/login
GET  /api/users/me
PUT  /api/users/me
GET  /api/users/me/stats

GET  /api/weight
POST /api/weight
DEL  /api/weight/{id}

GET  /api/workouts
POST /api/workouts
GET  /api/workouts/analytics
DEL  /api/workouts/{id}

GET  /api/nutrition
POST /api/nutrition
GET  /api/nutrition/today
DEL  /api/nutrition/{id}

GET  /api/achievements

POST /api/chat
GET  /api/chat/history
```
