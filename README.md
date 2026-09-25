# Opportunity Hub

Discover. Apply. Grow. A centralized platform for NIAT students.

## Features Built (MVP)
1. Authentication (Login / Signup) via Supabase
2. Student Dashboard
3. AI Assistant (Gemini)
4. Landing Page
5. Core UI framework set up (Next.js 15, Tailwind)

## Setup Instructions

### 1. Supabase Setup
1. Create a new project in [Supabase](https://supabase.com).
2. Go to the SQL Editor and run the queries in `schema.sql`.
3. Then run the queries in `seed.sql` to populate institutions and demo opportunities.
4. Go to Authentication -> Providers and make sure Email provider is enabled.
5. In Authentication -> URL Configuration, set your Site URL to `http://localhost:3000`.

### 2. Environment Variables
Copy `.env.example` to `.env.local` and add your keys:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Local Development
Run the following commands:
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Vercel Deployment
1. Push the code to a GitHub repository.
2. Import the project in Vercel.
3. Add the 3 environment variables in Vercel settings.
4. Deploy!

## Note on Remaining MVP Features
For a complete demo, you can build out the `opportunities`, `saved`, `applications`, and `profile` pages using the patterns established in `dashboard/page.tsx` using `supabase-js`.
