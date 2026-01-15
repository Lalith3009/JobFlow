# JobFlow

A full-stack job tracking application with Supabase backend, Google authentication, and Chrome extension integration.

## Features

-  **Google Authentication** - Secure sign-in with Google
-  **Kanban Board** - Drag-and-drop job status management
-  **Analytics Dashboard** - Track your job search progress
-  **Real-time Sync** - Changes sync instantly across devices
-  **Chrome Extension** - Save jobs with one click from any job site
-  **AI Analysis** - Get intelligent job match scores (optional)

## Tech Stack

- **Frontend**: React 18
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Hosting**: Vercel (free tier)
- **Extension**: Chrome Extension

## Setup Instructions

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Name it "jobflow" and set a database password
4. Wait for the project to be created (~2 minutes)

### Step 2: Set Up Database

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the contents of `supabase/schema.sql` and paste it
4. Click "Run" to create all tables and policies

### Step 3: Enable Google Auth

1. Go to **Authentication** → **Providers**
2. Enable **Google**
3. Go to [Google Cloud Console](https://console.cloud.google.com)
4. Create a new project or select existing
5. Go to **APIs & Services** → **Credentials**
6. Create **OAuth 2.0 Client ID** (Web application)
7. Add authorized redirect URI: `https://YOUR-PROJECT-ID.supabase.co/auth/v1/callback`
8. Copy Client ID and Secret to Supabase Google provider settings

### Step 4: Get Your Supabase Keys

1. In Supabase dashboard, go to **Project Settings** → **API**
2. Copy:
   - `Project URL` (e.g., https://xxxxx.supabase.co)
   - `anon public` key

### Step 5: Set Up Claude AI
**Go to console.anthropic.com and sign up.**

- Generate a new API Key.

**Add to Supabase:**

- Go to `Supabase Dashboard` → `Project Settings` → `Edge Functions` (or Vault/Secrets).

- Add a new secret named `ANTHROPIC_API_KEY` with your key value.

- Keep this key handy for the next steps (Local .env and Vercel).

### Step 6: Configure the App

1. Create `.env` file in project root:
```bash
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
REACT_APP_CLAUDE_API_KEY=your-anthropic-key-here
```

### Step 7: Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

### Step 8: Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`
   - `REACT_APP_CLAUDE_API_KEY`
5. Deploy!

## Chrome Extension Setup

The Chrome extension syncs jobs to your dashboard:

1. Install the JobFlow Chrome extension  
2. Sign in to the web app  
3. Open the Chrome extension  
4. Click **Sync** — jobs automatically sync to your dashboard


## Project Structure

```
jobflow-v2/
├── public/
│   └── index.html
│   └──   pdf.worker.min.js
├── src/
│   ├── components/
│   │   ├── AddJobModal.js     # Add job form
│   │   ├── AIAnalysisModal.js # AI job analysis modal
│   │   ├── LoginPage.js       # Google sign-in
│   │   ├── Dashboard.js       # Main layout
│   │   ├── Header.js          # Top navigation
│   │   ├── JobCard.js         # Individual job card
│   │   ├── Sidebar.js         # Navigation
│   │   ├── KanbanBoard.js     # Drag-drop board
│   │   ├── StatsBar.js        # Table view
│   │   └── AddJobModal.js     # Add job form
│   ├── context/
│   │   ├── AuthContext.js     # Auth state
│   │   └── JobsContext.js     # Jobs state
│   │   └── ResumeContext.js   # Resume state
│   ├── lib/
│   │   └── supabase.js        # Supabase client
│   │   └── claude.js          # Claude Client
│   ├── App.js
│   ├── index.js
│   └── index.css
├── supabase/
│   └── schema.sql             # Database schema
├── .gitignore
├── package-lock.json
├── package.json
└── README.md
└── vercel.json
```

## Database Schema

### Tables
- `jobs` - Job applications
- `resumes` - User resumes
- `user_settings` - User preferences
- `activities` - Activity log

## Troubleshooting

### "App won’t connect"

- Check .env values

- Restart dev server

### "Google login fails"

- Verify redirect URI

- Ensure Google provider is enabled in Supabase

### Permission denied

- Run schema.sql

- Confirm user is authenticated

## License

MIT License - feel free to use for your own job search!
