# ThreadCounty - AI-Powered Textile Analysis Platform

ThreadCounty is a next-generation textile technology platform that helps textile manufacturers, students, researchers, and quality control professionals analyze fabric structures using Artificial Intelligence and Computer Vision.

The platform simplifies textile inspection by allowing users to upload fabric images and receive automated thread density analysis, weave information, AI insights, and downloadable reports through a modern web application.

---

## 🔗 Links

- **Live Hosted Website:** https://thread-county-frontend.vercel.app/

---

## ✨ Features

### 🔐 Authentication & User Management
- Secure Sign Up and Login via Supabase Auth
- "Forgot Password" functionality
- "Remember Me" sessions
- User Profile management (Update info, upload profile picture, change password)

### 📊 User Dashboard
- **Welcome Section & Analytics:** View total uploads, storage usage, and activity timeline.
- **Image Upload Module:** Drag & drop upload for JPG/PNG/JPEG. Includes file size validation, image preview, and progress tracking.
- **On-the-fly Image Compression:** Automatically optimizes images before upload to save bandwidth and storage.
- **Upload History:** View, search (including **Voice Search**), filter, and manage past analyses.

### 🤖 AI Analysis & Reports
- **Fabric Analysis:** View thread density, warp count, weft count, fabric type, and confidence score.
- **AI Suggestions:** Get actionable insights based on the fabric structure.
- **Report Management:** Download reports as PDFs or share them via a unique link.
- **Fabric Comparison Tool:** Compare two different fabric analysis reports side-by-side.

### 🛠️ Admin Dashboard
- **Comprehensive Management:** Dedicated secure route (`/admin`) for administrators.
- **User Management:** View total users, manage individual user profiles, view their uploads, and update their subscription plans.
- **Content Moderation:** View and delete uploaded images or reports across the platform.
- **Platform Statistics:** View global analytics and metrics.

### 🌟 Bonus Features Implemented
- **Progressive Web App (PWA) & Offline Support:** Installable on mobile and desktop devices.
- **Voice Search:** Use native browser speech recognition to search upload history.
- **OCR Integration (Care Label Reader):** Extracts text from fabric care labels entirely in the browser using `tesseract.js`.
- **Multi-Language Support:** Seamlessly translate the entire platform into dozens of languages via Google Translate widget.
- **Blog Section:** A dedicated, modern blog page to showcase industry news and updates.
- **Analytics Dashboard:** Advanced charting and data visualization for user activity.
- **Lazy Loading:** Optimized performance using Next.js automatic lazy loading.

---

## 💻 Tech Stack

### Frontend
- **Framework:** React.js, Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, ShadCN UI
- **Animations:** Framer Motion
- **Hosting:** Vercel

### Backend
- **Framework:** Python, FastAPI
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage bucket (`fabric-images`)
- **Hosting:** Render

---

## 🗄️ Database Schema

The platform utilizes Supabase (PostgreSQL). Below are the core tables:

### 1. `profiles`
- `id` (UUID, Primary Key, references `auth.users`)
- `email` (String)
- `full_name` (String)
- `role` (String: 'user' or 'admin')
- `subscription_plan` (String: 'free', 'student', 'professional', 'enterprise')
- `avatar_url` (String)
- `storage_used_mb` (Float)
- `storage_limit_mb` (Float)
- `created_at` (Timestamp)

### 2. `uploads`
- `id` (UUID, Primary Key)
- `user_id` (UUID, references `profiles(id)`)
- `file_name` (String)
- `file_url` (String)
- `file_size_bytes` (Integer)
- `content_type` (String)
- `created_at` (Timestamp)

### 3. `reports`
- `id` (UUID, Primary Key)
- `upload_id` (UUID, references `uploads(id)`)
- `user_id` (UUID, references `profiles(id)`)
- `thread_density` (Float)
- `warp_count` (Integer)
- `weft_count` (Integer)
- `fabric_type` (String)
- `confidence_score` (Float)
- `ai_suggestions` (Array of Strings)
- `created_at` (Timestamp)

### 4. `activity_logs` & `notifications`
- Track user actions and system notifications.

---

## 📡 API Documentation

The backend is built with FastAPI. Complete interactive API documentation (Swagger UI) is available at `/docs` on the backend server.

### Key Endpoints
- **Authentication:** Handled client-side via Supabase JS client.
- **Users API:**
  - `GET /users/me`: Fetch current user profile.
  - `PATCH /users/me`: Update profile details.
  - `POST /users/me/avatar`: Upload and update profile picture.
- **Uploads API:**
  - `POST /analyze`: Accepts an image file, uploads it to Supabase Storage, runs mock AI analysis, and generates a report.
- **Reports API:**
  - `GET /reports`: Fetch all reports for the user (supports search & filters).
  - `GET /reports/{id}`: Fetch a specific report.
  - `DELETE /reports/{id}`: Delete a report and its associated image.
  - `GET /reports/{id}/download`: Download report content.
- **Admin API:**
  - `GET /admin/users`: Fetch all platform users.
  - `GET /admin/users/{user_id}`: Fetch a specific user's details and uploads.
  - `PATCH /admin/users/{user_id}/role`: Update a user's role/subscription.
- **Contact API:**
  - `POST /contact`: Submit a contact form message.

---

## 🚀 Running Locally

### Prerequisites
- Node.js (v18+)
- Python 3.10+
- Supabase Project

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. Create a `.env.local` file with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. `npm run dev`

### Backend Setup
1. `cd backend`
2. Create a virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. Create a `.env` file:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_service_role_key
   ```
4. `uvicorn app.main:app --reload`

---

