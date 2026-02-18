-- Add focus_score to sessions table
alter table public.sessions
add column focus_score int2 default 100;

-- Create Context Switches Table
create table public.context_switches (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid references public.sessions(id) on delete set null,
  from_project_id uuid references public.projects(id) on delete set null,
  to_project_id uuid references public.projects(id) on delete set null,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.context_switches enable row level security;

-- Policies for Context Switches
create policy "Users can view their own switches"
  on public.context_switches for select
  using (auth.uid() = user_id);

create policy "Users can insert their own switches"
  on public.context_switches for insert
  with check (auth.uid() = user_id);
