<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Django-5.x-092E20?logo=django&logoColor=white" alt="Django" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/OpenAI-GPT--4-412991?logo=openai&logoColor=white" alt="OpenAI" />
  <img src="https://img.shields.io/badge/JWT-Auth-000000?logo=jsonwebtokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT License" />
</p>

<h1 align="center">🚀 ResumeAI — AI-Powered Resume Builder</h1>

<p align="center">
  <strong>Build ATS-optimized, beautifully designed resumes in minutes with the power of AI.</strong>
  <br />
  Real-time preview • AI content improvement • ATS scoring • PDF export
</p>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI-Powered Content** | Improve bullet points, generate professional summaries, and enhance descriptions with OpenAI GPT-4 |
| 📊 **ATS Score Analysis** | Get instant ATS compatibility scores with actionable recommendations and missing keyword suggestions |
| 🎨 **3 Professional Templates** | Choose from **Modern** (two-column), **Classic** (traditional), and **Minimal** (clean) designs |
| 👁️ **Real-time Preview** | See your resume update live as you type — what you see is what you get |
| 📄 **PDF Export** | Download your polished resume as a beautifully formatted PDF, ready to submit |
| 🔐 **JWT Authentication** | Secure user auth with access/refresh token rotation and blacklisting |
| 🌓 **Dark/Light Mode** | Automatic system preference detection with manual toggle |
| 📱 **Fully Responsive** | Works seamlessly on desktop, tablet, and mobile devices |

---

## 🛠️ Tech Stack

### Frontend
- **React 19** with Vite 8 for lightning-fast builds
- **Tailwind CSS v4** for utility-first styling
- **Redux Toolkit** for global state management
- **React Router v7** with lazy-loaded routes and protected routing
- **Lucide React** for beautiful, consistent icons
- **Axios** with JWT interceptor for API calls
- **react-hot-toast** for elegant notifications

### Backend
- **Django 5** with Django REST Framework
- **SimpleJWT** for token-based authentication (access + refresh + blacklist)
- **OpenAI API** (GPT-4) for AI text improvement, ATS analysis, and summary generation
- **WeasyPrint** for server-side PDF generation with HTML/CSS templates
- **PostgreSQL** (primary) / **SQLite** (auto-fallback for development)
- **django-cors-headers** for cross-origin request handling

---

## 📁 Project Structure

```
AI-Resume-Builder/
├── backend/                    # Django REST API
│   ├── backend/                # Django project settings
│   │   ├── settings.py         # Configuration with env variables
│   │   ├── urls.py             # Root URL router
│   │   └── wsgi.py
│   ├── users/                  # Authentication & user management
│   │   ├── models.py           # Custom User model
│   │   ├── serializers.py      # Register, Login, Profile serializers
│   │   ├── views.py            # Auth views (register/login/logout/profile)
│   │   └── urls.py
│   ├── resumes/                # Resume CRUD
│   │   ├── models.py           # Resume, Experience, Education, Project
│   │   ├── serializers.py      # Nested serializers with writable relations
│   │   ├── views.py            # List/Create/Detail endpoints
│   │   └── urls.py
│   ├── ai/                     # AI-powered features
│   │   ├── services.py         # OpenAI integration layer
│   │   ├── models.py           # AISuggestion tracking model
│   │   ├── views.py            # Improve, ATS Score, Generate Summary
│   │   └── urls.py
│   ├── pdf_generator/          # PDF export
│   │   ├── services.py         # WeasyPrint rendering
│   │   ├── views.py            # PDF download endpoint
│   │   └── templates/pdf/      # HTML templates (modern, classic, minimal)
│   ├── requirements.txt
│   └── manage.py
│
├── frontend/                   # React SPA
│   ├── src/
│   │   ├── pages/              # Route-level components
│   │   │   ├── Landing.jsx     # Marketing landing page
│   │   │   ├── Login.jsx       # Auth — login
│   │   │   ├── Signup.jsx      # Auth — registration
│   │   │   ├── Dashboard.jsx   # Resume management dashboard
│   │   │   ├── ResumeBuilder.jsx   # Multi-section form + live preview
│   │   │   ├── ResumePreview.jsx   # Full-page preview + ATS score
│   │   │   └── Profile.jsx     # User profile & password change
│   │   ├── components/
│   │   │   ├── common/         # Navbar, Sidebar, Modal, FormInput, Loader
│   │   │   ├── resume/         # ResumeCard, TemplateCard, ResumePreviewPanel
│   │   │   └── ai/             # AIButton
│   │   ├── redux/              # Redux Toolkit slices (auth, resume)
│   │   ├── services/           # API service modules (auth, resume, ai, pdf)
│   │   ├── context/            # ThemeContext (dark/light mode)
│   │   ├── routes/             # AppRouter with protected routes
│   │   ├── utils/              # Constants, helpers, validators
│   │   ├── index.css           # Design system (tokens, animations, components)
│   │   ├── main.jsx            # App entry point
│   │   └── App.jsx             # Root component with providers
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18 and **npm** ≥ 9
- **Python** ≥ 3.10
- **PostgreSQL** (optional — auto-falls back to SQLite)
- **OpenAI API Key** (for AI features)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/AI-Resume-Builder.git
cd AI-Resume-Builder
```

### 2️⃣ Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv

# Windows
.\venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env  # or create manually (see below)

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start the server
python manage.py runserver
```

### 3️⃣ Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend runs at **http://localhost:5173** and proxies API requests to **http://localhost:8000**.

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

```env
# Django
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (PostgreSQL — leave blank to auto-fallback to SQLite)
DB_ENGINE=auto          # 'auto', 'sqlite', or 'postgresql'
DB_NAME=resumebuilder_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

# OpenAI (required for AI features)
OPENAI_API_KEY=sk-your-openai-api-key

# JWT
ACCESS_TOKEN_LIFETIME_MINUTES=15
REFRESH_TOKEN_LIFETIME_DAYS=7
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=ResumeAI
```

---

## 📡 API Endpoints

### Authentication (`/api/auth/`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register/` | Register new user → returns JWT tokens |
| `POST` | `/api/auth/login/` | Login → returns JWT tokens |
| `POST` | `/api/auth/logout/` | Blacklist refresh token |
| `POST` | `/api/auth/refresh/` | Refresh access token |
| `GET/PUT` | `/api/auth/profile/` | Get or update user profile |
| `POST` | `/api/auth/change-password/` | Change password |

### Resumes (`/api/resumes/`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/resumes/` | List all user's resumes |
| `POST` | `/api/resumes/` | Create new resume (with nested experiences, educations, projects) |
| `GET` | `/api/resumes/:id/` | Get resume details |
| `PUT` | `/api/resumes/:id/` | Update resume |
| `DELETE` | `/api/resumes/:id/` | Delete resume |

### AI Features (`/api/ai/`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/ai/improve/` | Improve text using AI (accepts `text`, `context`, `resume_id`) |
| `POST` | `/api/ai/ats-score/` | Get ATS compatibility score for a resume |
| `POST` | `/api/ai/generate-summary/` | Generate professional summary from resume data |

### PDF Export (`/api/pdf/`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/pdf/:id/` | Download resume as PDF |

---

## 🎨 Resume Templates

<table>
  <tr>
    <td align="center"><strong>Modern</strong></td>
    <td align="center"><strong>Classic</strong></td>
    <td align="center"><strong>Minimal</strong></td>
  </tr>
  <tr>
    <td>Two-column layout with colored sidebar, clean typography, and skill bars</td>
    <td>Traditional single-column format with serif fonts, perfect for conservative industries</td>
    <td>Ultra-clean design with maximum whitespace, ideal for tech and creative roles</td>
  </tr>
</table>

---

## 🤖 AI Features in Detail

### Text Improvement
Pass any resume text (bullet points, descriptions) to the AI, which returns enhanced versions with:
- Strong action verbs
- Quantified achievements
- Professional tone

### ATS Score Analysis
Analyzes your entire resume and returns:
- **Score** (0–100) — overall ATS compatibility
- **Recommendations** — actionable improvement suggestions
- **Strengths** — what you're doing well
- **Missing Keywords** — industry-standard keywords to add

### Summary Generation
Automatically generates a compelling professional summary based on your experiences, education, skills, and projects.

---

## 🧪 Running in Production

### Backend

```bash
# Collect static files
python manage.py collectstatic --noinput

# Run with Gunicorn
gunicorn backend.wsgi:application --bind 0.0.0.0:8000
```

### Frontend

```bash
# Build for production
npm run build

# Preview the build
npm run preview
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ and AI
  <br />
  <strong>ResumeAI</strong> — Your next job starts here.
</p>
