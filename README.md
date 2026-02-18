# ⚡ Work Timer Pro

**Work Timer Pro** is a high-performance productivity application designed for deep work. It combines precise time-tracking with context-aware metrics, giving professionals a command center to optimize their workflow.

![Work Timer Pro Dashboard](https://placehold.co/1200x600/171717/6366f1?text=Work+Timer+Pro+Preview)

## 🚀 Features

### ⏱️ Smart Timer
- **Dual Modes**: Switch between **Stopwatch** (flexible tracking) and **Focus Mode** (Pomodoro countdown).
- **Hot Switching**: Seamlessly switch projects mid-session. The system automatically logs the transition and calculates "Context Tax".
- **Real-Time Persistence**: Your session survives page reloads.

### 🧠 Focus Metrics
- **Context Tax**: Visual feedback on the cognitive cost of multitasking. Every switch deducts from your daily "Focus Score".
- **Fragmentation Meter**: A Cyberpunk-styled gauge that warns you when your workflow becomes chaotic.

### 📊 Analytics & Insights
- **Neon Grid Heatmap**: Github-style contribution graph visualizing your work intensity over the last 90 days.
- **Weekly Trends**: Bar charts tracking your total focus hours.
- **Detailed History**: Granular logs of every session, tagged by Project and Task.

### 📂 Organization
- **Projects & Tasks**: Create color-coded projects and break them down into actionable tasks.
- **Quick Selector**: Keyboard-friendly dropdown for rapid context switching.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Directory, React Server Components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Dark Mode, Glassmorphism)
- **Backend & Auth**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Icons**: Lucide React
- **Utilities**: `date-fns`

## 🏁 Getting Started

### Prerequisites
- Node.js 18+
- A Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/work-timer-pro.git
   cd work-timer-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   Run the following SQL in your Supabase SQL Editor to set up the tables:

   ```sql
   -- Projects Table
   create table public.projects (
     id uuid default gen_random_uuid() primary key,
     user_id uuid references auth.users(id) not null,
     name text not null,
     color text not null, -- Hex code
     created_at timestamp with time zone default timezone('utc'::text, now()) not null
   );

   -- Tasks Table
   create table public.tasks (
     id uuid default gen_random_uuid() primary key,
     user_id uuid references auth.users(id) not null,
     project_id uuid references public.projects(id) on delete cascade not null,
     name text not null,
     status text default 'todo',
     created_at timestamp with time zone default timezone('utc'::text, now()) not null
   );

   -- Sessions Table (Updated for Phase 4)
   create table public.sessions (
     id uuid default gen_random_uuid() primary key,
     user_id uuid references auth.users(id) not null,
     project_id uuid references public.projects(id) on delete set null,
     task_id uuid references public.tasks(id) on delete set null,
     start_time timestamp with time zone not null,
     end_time timestamp with time zone,
     duration integer, -- in seconds
     focus_score smallint default 100,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null
   );

   -- Context Switches Log
   create table public.context_switches (
     id uuid default gen_random_uuid() primary key,
     user_id uuid references auth.users(id) not null,
     session_id uuid references public.sessions(id) on delete set null,
     from_project_id uuid references public.projects(id),
     to_project_id uuid references public.projects(id),
     timestamp timestamp with time zone default timezone('utc'::text, now()) not null
   );

   -- Enable RLS (Row Level Security)
   alter table public.projects enable row level security;
   alter table public.tasks enable row level security;
   alter table public.sessions enable row level security;
   alter table public.context_switches enable row level security;

   -- Add Policies (Simplified for brevity - ensure you create policies for Select/Insert/Update/Delete where uid() = user_id)
   ```

5. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser.

## 🚀 Deployment

The easiest way to deploy is using [Vercel](https://vercel.com/):

1. Push your code to GitHub.
2. Import the project into Vercel.
3. Add your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to the Environment Variables settings.
4. Deploy!

## 📄 License

MIT License.
