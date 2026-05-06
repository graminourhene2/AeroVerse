# 🌐 AeroVerse — Web Application

This module contains the **frontend** (React) and **backend** (Flask) of the AeroVerse platform, handling user authentication, account management, educational content delivery, and API communication with the Unity client and CV pipeline.

---

## 📁 Structure

```
app/
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/        # Reusable components (Navbar, Cards, Modals...)
│       ├── pages/             # Login, Dashboard, Admin, Profile
│       └── assets/            # Styles, images
│
└── backend/
    ├── routes/                # auth.py, users.py, content.py, progress.py
    ├── models/                # User, Module, Progress, Asset models
    ├── services/              # openai_service.py, auth_service.py
    ├── config/                # config.py, database.py
    ├── app.py                 # Flask entry point
    └── requirements.txt
```

---

## 🔧 Backend — Flask REST API

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |
| GET | `/api/users/` | List all users (admin only) |
| GET | `/api/modules/` | Get all educational modules |
| POST | `/api/progress/save` | Save student progress |
| GET | `/api/progress/:userId` | Get student progress |
| POST | `/api/tutor/ask` | Send question to AI tutor |
| GET | `/api/assets/` | Get 3D asset metadata |

### Tech Stack

- **Framework:** Flask 2.x
- **Database:** PostgreSQL 14+ via SQLAlchemy
- **Auth:** JWT (PyJWT + bcrypt)
- **AI:** OpenAI API (GPT-4)
- **Migrations:** Flask-Migrate (Alembic)

### Setup

```bash
cd app/backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
flask db upgrade
flask run
```

---

## 🎨 Frontend — React

### Pages

| Page | Description |
|------|-------------|
| `/login` | Authentication screen |
| `/dashboard` | Student home with progress overview |
| `/modules` | Browse educational modules |
| `/admin` | Admin panel (accounts, content, monitoring) |
| `/profile` | User settings and preferences |

### Tech Stack

- **Framework:** React 18
- **HTTP Client:** Axios
- **Styling:** TailwindCSS
- **State:** React Context API
- **Design Source:** Figma wireframes

### Setup

```bash
cd app/frontend
npm install
npm start
```

---

## 🗃️ Database Schema (Overview)

```
users           — id, name, email, password_hash, role, created_at
modules         — id, title, description, language, difficulty, content_url
progress        — id, user_id, module_id, score, completed, updated_at
assets_3d       — id, name, category, file_path, polygon_count, metadata
quiz_results    — id, user_id, module_id, answers, score, taken_at
```
