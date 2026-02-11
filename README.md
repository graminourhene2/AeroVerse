# 🚀 AeroVerse — VR Aerospace Education & Outreach Platform

<div align="center">

![AeroVerse Banner](docs/assets/banner.png)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Unity](https://img.shields.io/badge/Unity-2021.3_LTS-black?logo=unity)](https://unity.com)
[![Python](https://img.shields.io/badge/Python-3.9+-blue?logo=python)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-2.x-lightgrey?logo=flask)](https://flask.palletsprojects.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue?logo=postgresql)](https://postgresql.org)

**AeroVerse** is an innovative educational platform combining Virtual Reality (VR), Artificial Intelligence (AI), and Computer Vision to deliver immersive, interactive aerospace learning experiences.

[📋 Specification](#-project-overview) • [🗂️ Structure](#-repository-structure) • [⚙️ Setup](#-getting-started) • [📅 Sprints](#-sprint-tracker) • [👥 Team](#-team)

</div>

---

## 📋 Project Overview

AeroVerse transforms theoretical aerospace knowledge into practical exploration through:

- 🏛️ **Virtual Aerospace Museum** — Navigate 3D environments and interact with aerospace components
- 🤖 **AI Tutor** — Ask questions in French or English powered by OpenAI GPT-4
- 🔬 **Computer Vision** — Capture real aerospace components and get instant AI-powered identification
- 🚀 **Rocket Assembly Simulation** — Hands-on simulation with real-time feedback
- 📚 **Educational Modules** — Structured content with quizzes on rockets, satellites, and space missions

**Institution:** National School of Computer Science, University of Manouba  
**Academic Year:** 2025 / 2026  
**Project ID:** 232 — Version 01

---

## 🗂️ Repository Structure

```
AeroVerse/
│
├── 📁 app/                        # Web Application (Frontend + Backend)
│   ├── frontend/                  # React-based user interface
│   │   └── src/
│   │       ├── components/        # Reusable UI components
│   │       ├── pages/             # Application pages
│   │       └── assets/            # Images, fonts, styles
│   └── backend/                   # Flask REST API
│       ├── routes/                # API endpoints
│       ├── models/                # Database models
│       ├── services/              # Business logic
│       └── config/                # Configuration files
│
├── 📁 unity/                      # Unity 3D Application
│   └── Assets/
│       ├── Scripts/               # C# scripts
│       │   ├── Player/            # Navigation & camera controls
│       │   ├── UI/                # Interface managers
│       │   ├── Hotspots/          # Interactive hotspot system
│       │   ├── Modules/           # Educational module logic
│       │   └── Assembly/          # Rocket assembly simulation
│       ├── Scenes/                # Unity scenes
│       ├── Prefabs/               # Reusable GameObjects
│       ├── Materials/             # Shaders and materials
│       └── Models/                # 3D aerospace models
│
├── 📁 computer-vision/            # CV & AI Pipeline
│   ├── models/                    # Trained ML models
│   ├── pipeline/                  # Image processing pipeline
│   ├── api/                       # CV API endpoints
│   ├── training/                  # Model training scripts
│   └── tests/                     # CV module tests
│
├── 📁 docs/                       # Project documentation
│   ├── specification/             # Specification book (LaTeX)
│   ├── wireframes/                # UI/UX wireframes
│   ├── uml/                       # UML diagrams
│   └── api/                       # API documentation
│
└── 📁 .github/
    ├── ISSUE_TEMPLATE/            # Bug & feature templates
    └── workflows/                 # CI/CD pipelines
```

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    Unity Client                      │
│         (3D Museum + Simulation + UI)                │
└────────────────────┬────────────────────────────────┘
                     │ REST API
         ┌───────────▼───────────┐
         │    Flask Backend       │
         │  (Auth + API + Logic)  │
         └───┬───────────────┬───┘
             │               │
    ┌─────────▼────┐  ┌──────▼──────────┐
    │  PostgreSQL   │  │  OpenAI API     │
    │  (User data,  │  │  (AI Tutor /    │
    │   progress)   │  │   NLP)          │
    └──────────────┘  └─────────────────┘
             │
    ┌─────────▼──────────────┐
    │  Computer Vision API   │
    │  (Python + OpenCV +    │
    │   TensorFlow)          │
    └────────────────────────┘
```

---

## 👥 Team

| Name | Role |
|------|------|
| **Ms. Aroua Hedhli** | Supervisor / Product Owner |
| **Nour Mrabet** | Scrum Master |
| **Wiem Ben El Haj Salah Bouhdid** | Developer |
| **Nourhene Grami** | Developer |

---

## 📅 Sprint Tracker

| Sprint | Focus | Dates | Status |
|--------|-------|-------|--------|
| Sprint 1 | Core navigation + User management | 06/01 → 19/01/26 | ✅ Done |
| Sprint 2 | Hotspots + Educational modules | 20/01 → 09/02/26 | ✅ Done |
| Sprint 3 | AI Tutor integration + Quizzes | 10/02 → 02/03/26 | 🔄 In Progress |
| Sprint 4 | Rocket assembly simulation | 03/03 → 23/03/26 | 📋 Planned |
| Sprint 5 | Computer vision integration | 24/03 → 13/04/26 | 📋 Planned |
| Sprint 6 | Testing + Security + Performance | 14/04 → 04/05/26 | 📋 Planned |
| Sprint 7 | Finalization + Deployment | 05/05 → 25/05/26 | 📋 Planned |

---

## ⚙️ Getting Started

### Prerequisites

- Unity **2021.3 LTS**
- Python **3.9+**
- Node.js **18+**
- PostgreSQL **14+**
- Git

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/AeroVerse.git
cd AeroVerse
```

### 2. Backend Setup

```bash
cd app/backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # Fill in your credentials
flask db upgrade
flask run
```

### 3. Frontend Setup

```bash
cd app/frontend
npm install
cp .env.example .env            # Fill in your API URL
npm start
```

### 4. Computer Vision Setup

```bash
cd computer-vision
pip install -r requirements.txt
python api/server.py
```

### 5. Unity Setup

1. Open **Unity Hub** → Add Project → select `unity/` folder
2. Use Unity version **2021.3 LTS**
3. Open `Assets/Scenes/MainMuseum.unity` to start

---

## 🔑 Environment Variables

Create `.env` files based on the `.env.example` templates provided in each module.

**Backend `.env` key variables:**
```
FLASK_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/aeroverse
OPENAI_API_KEY=your_openai_key_here
SECRET_KEY=your_secret_key_here
CV_API_URL=http://localhost:5001
```

---

## 📄 License

This project is developed as part of an academic project at the National School of Computer Science, University of Manouba.

---

<div align="center">
Made with ❤️ by the AeroVerse Team — ENSI 2025/2026
</div>
