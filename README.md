# ThreadCounty

**AI-Powered Textile Technology Platform**

ThreadCounty helps textile manufacturers, students, researchers, and quality control professionals analyze fabric structures using Artificial Intelligence and Computer Vision.

![ThreadCounty](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![Python](https://img.shields.io/badge/Python-FastAPI-3776AB?style=flat-square&logo=python)
![Supabase](https://img.shields.io/badge/Supabase-Database-3FCF8E?style=flat-square&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss)

## Live Demo

- **Website:** Deploy to [Vercel](https://vercel.com) (see Deployment section)
- **API:** Deploy to [Railway](https://railway.app) or [Render](https://render.com)

## Features

- **Responsive Landing Page** — Hero, features, workflow, testimonials, FAQ, contact
- **Secure Authentication** — Sign up, login, forgot password, email verification via Supabase Auth
- **Fabric Image Upload** — Drag & drop, preview, validation, progress tracking
- **AI Analysis Reports** — Thread density, warp/weft counts, fabric type, confidence score, AI suggestions
- **Upload History** — Search, filter, download, and delete previous reports
- **User Dashboard** — Stats, recent reports, storage usage, activity timeline, notifications
- **Admin Dashboard** — User management, upload oversight, platform analytics, contact messages
- **Pricing Page** — Free, Student, Professional, Enterprise plans
- **Dark/Light Mode** — System-aware theme switching
- **Modern UI** — ShadCN UI, Framer Motion animations, fully responsive

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS, ShadCN UI, Framer Motion |
| Backend | Python, FastAPI, Uvicorn |
| Database | Supabase (PostgreSQL + Auth + Storage) |
| Deployment | Vercel (frontend), Railway/Render (backend) |

## Project Structure

```
textile/
├── frontend/          # Next.js application
│   ├── src/
│   │   ├── app/       # Pages and routes
│   │   ├── components/# UI components
│   │   ├── lib/       # Utilities, API client, Supabase
│   │   └── types/     # TypeScript types
│   └── package.json
├── backend/           # Python FastAPI server
│   ├── app/
│   │   ├── api/       # API route handlers
│   │   ├── core/      # Config, auth, logging
│   │   └── services/  # AI analysis service
│   └── requirements.txt
├── supabase/
│   └── migrations/    # Database schema SQL
└── docs/              # API & database documentation
```

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- Supabase account ([supabase.com](https://supabase.com))

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/threadcounty.git
cd threadcounty
```

### 2. Set Up Supabase

1. Create a new Supabase project
2. Go to **SQL Editor** and run `supabase/migrations/001_initial_schema.sql`
3. Go to **Settings → API** and copy your URL and keys
4. Enable **Email Auth** in Authentication settings

### 3. Configure Environment Variables

**Frontend** (`frontend/.env.local`):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Backend** (`backend/.env`):

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret
CORS_ORIGINS=http://localhost:3000
ENVIRONMENT=development
```

### 4. Run the Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 5. Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Create an Admin User

After signing up, promote your account to admin in Supabase SQL Editor:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
```

## Deployment

### Frontend (Vercel)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set root directory to `frontend`
4. Add environment variables
5. Deploy

### Backend (Railway)

1. Create new project in [Railway](https://railway.app)
2. Connect GitHub repo, set root to `backend`
3. Add environment variables
4. Railway auto-detects the `Procfile`

### Backend (Render)

1. Create Web Service in [Render](https://render.com)
2. Set build command: `pip install -r requirements.txt`
3. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

## API Documentation

See [docs/API.md](docs/API.md) for full API reference.

## Database Schema

See [docs/DATABASE.md](docs/DATABASE.md) for schema details and ERD.

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | Marketing homepage |
| Login | `/login` | User authentication |
| Sign Up | `/signup` | Account creation |
| Forgot Password | `/forgot-password` | Password reset |
| Dashboard | `/dashboard` | User overview |
| Upload | `/upload` | Fabric image upload |
| Report | `/reports/[id]` | AI analysis results |
| History | `/history` | Previous analyses |
| Profile | `/profile` | Account settings |
| Admin | `/admin` | Admin dashboard |
| Pricing | `/pricing` | Subscription plans |
| About | `/about` | Company info |
| Contact | `/contact` | Contact form |
| FAQ | `/faq` | Help center |

## License

MIT License — see [LICENSE](LICENSE) for details.
