# JobFlow

A full-stack job tracking application built with React and Supabase, featuring a Kanban board, AI-powered job analysis, resume management, and real-time sync across devices.

![React](https://img.shields.io/badge/React-18-blue)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)
![Claude AI](https://img.shields.io/badge/Claude-AI%20Powered-orange)

## Features

### Job Management
- **Kanban Board** - Drag-and-drop across 5 statuses: Wishlist, Applied, Interview, Offer, Rejected
- **Search & Filter** - Filter by title, company, or location; sort by date, company, or title
- **Job Details** - Track title, company, location, URL, salary, description, and more
- **Deadline Reminders** - Set follow-up dates with visual overdue indicators on job cards
- **Notes Timeline** - Add timestamped notes to each job application
- **Quick Duplicate** - Clone jobs for similar positions
- **Undo Actions** - Toast notifications with undo for status changes
- **Confetti** - Celebration animation when a job reaches Offer status

### AI Features
- **Job Match Analysis** - Claude AI scores job fit (0-100) with skills breakdown, action items, and interview topics
- **Cover Letter Generation** - AI-generated personalized cover letters based on your resume and the job description
- **Smart Caching** - Analysis results cached and invalidated when your resume changes
- **Fallback Analysis** - Local keyword-based analysis if the API is unavailable

### Resume Management
- **File Upload** - Support for PDF, DOCX, and TXT files
- **Text Extraction** - Automatic parsing with pdfjs-dist and mammoth
- **Revision Tracking** - Resume stored in Supabase with update history

### Analytics Dashboard
- **Key Metrics** - Total jobs, applications, interviews, and offers at a glance
- **Application Pipeline** - Visual distribution across all statuses
- **Weekly Activity** - 7-day chart of jobs added per day
- **Response Rate** - Track your interview + offer conversion rate

### UX & Theming
- **Dark / Light Mode** - Toggle theme with persistence across sessions
- **Keyboard Shortcuts** - `N` new job, `?` help, `1-4` navigate pages, `Esc` close modals
- **Mobile Responsive** - Collapsible sidebar, hamburger menu on mobile
- **Real-time Sync** - Changes sync instantly across devices via Supabase Realtime

### Settings & Export
- **Default Status** - Configure which status new jobs default to
- **Export to JSON** - Download all jobs as JSON
- **Export to CSV** - Download all jobs as formatted CSV

### Chrome Extension
- Save jobs with one click from any job site
- Syncs directly to your JobFlow dashboard

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 |
| Backend | Supabase (PostgreSQL + Auth + Realtime) |
| AI | Claude API (Anthropic) |
| Auth | Google OAuth via Supabase |
| Serverless | Vercel Edge Functions |
| File Parsing | pdfjs-dist, mammoth |
| Styling | CSS custom properties + JS style objects |

## Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to initialize (~2 minutes)

### 2. Set Up the Database

1. In the Supabase dashboard, go to **SQL Editor**
2. Paste the contents of `supabase/schema.sql` and run it

This creates four tables with row-level security:

| Table | Purpose |
|-------|---------|
| `jobs` | Job applications (title, company, status, notes, follow-up dates) |
| `resumes` | User resume text and metadata |
| `job_analyses` | Cached AI analysis results with resume hash tracking |
| `cover_letters` | Cached AI-generated cover letters |

### 3. Enable Google Auth

1. In Supabase, go to **Authentication** > **Providers** > enable **Google**
2. In [Google Cloud Console](https://console.cloud.google.com), create an OAuth 2.0 Client ID
3. Add authorized redirect URI: `https://YOUR-PROJECT-ID.supabase.co/auth/v1/callback`
4. Copy Client ID and Secret into Supabase Google provider settings

### 4. Get Your API Keys

**Supabase** - Project Settings > API:
- `Project URL` (e.g., `https://xxxxx.supabase.co`)
- `anon public` key

**Claude AI** - [console.anthropic.com](https://console.anthropic.com):
- Generate a new API key

### 5. Configure Environment

Create a `.env` file in the project root:

```bash
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
CLAUDE_API_KEY=your-anthropic-key-here
```

### 6. Install & Run

```bash
npm install
npm start
```

### 7. Deploy to Vercel

1. Push code to GitHub
2. Import the repository at [vercel.com](https://vercel.com)
3. Add the three environment variables above
4. Deploy

## Project Structure

```
jobflow-v2/
├── api/
│   ├── analyze.js              # AI job analysis endpoint
│   └── cover-letter.js         # AI cover letter endpoint
├── public/
│   ├── index.html
│   └── pdf.worker.min.js
├── src/
│   ├── components/
│   │   ├── AddJobModal.js      # Add job form
│   │   ├── AIAnalysisModal.js  # AI match analysis modal
│   │   ├── CoverLetterModal.js # AI cover letter modal
│   │   ├── ConfigError.js      # Config error display
│   │   ├── Dashboard.js        # Main layout + keyboard shortcuts
│   │   ├── JobDetailModal.js   # Edit job + notes timeline
│   │   ├── Loading.js          # Loading spinner
│   │   ├── LoginPage.js        # Google OAuth login
│   │   ├── Router.js           # Page routing
│   │   └── ToastContainer.js   # Toast notification system
│   ├── context/
│   │   ├── AuthContext.js      # Auth state + Google OAuth
│   │   ├── JobsContext.js      # Jobs CRUD + real-time sync
│   │   ├── ResumeContext.js    # Resume upload + parsing
│   │   └── ThemeContext.js     # Dark/light mode toggle
│   ├── hooks/
│   │   └── useToast.js         # Toast notification hook
│   ├── lib/
│   │   ├── claude.js           # Claude API client
│   │   ├── localAnalyze.js     # Fallback local analysis
│   │   └── supabase.js         # Supabase client
│   ├── pages/
│   │   ├── Analytics/          # Analytics dashboard
│   │   ├── Board/              # Kanban board + job cards
│   │   ├── Resume/             # Resume management
│   │   └── Settings/           # Settings + export
│   ├── styles/
│   │   └── styles.js           # Centralized style objects
│   ├── App.js                  # Root component + providers
│   ├── index.css               # CSS custom properties (theming)
│   └── index.js                # Entry point
├── supabase/
│   └── schema.sql              # Database schema + RLS policies
├── vercel.json                 # Vercel config
└── package.json
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `N` | Open new job modal |
| `1` | Go to Board |
| `2` | Go to Resume |
| `3` | Go to Analytics |
| `4` | Go to Settings |
| `?` | Show keyboard shortcuts |
| `Esc` | Close open modal |

## Troubleshooting

**App won't connect** - Verify `.env` values and restart the dev server.

**Google login fails** - Check the redirect URI matches your Supabase project URL and that Google provider is enabled.

**Permission denied on data** - Run `schema.sql` to set up RLS policies. Confirm the user is authenticated.

**Node.js v22 issues** - react-scripts 5.0.1 has compatibility issues with Node 22's `cross-spawn`. Fix with `rm -rf node_modules && npm install`.

## License

MIT
