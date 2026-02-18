-- Create Projects Table
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  color text not null default '#6366f1', -- Default indigo
  user_id uuid not null references auth.users(id) on delete cascade
);

-- Create Tasks Table
create table public.tasks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  project_id uuid not null references public.projects(id) on delete cascade,
  status text not null default 'todo', -- todo, in_progress, done
  user_id uuid not null references auth.users(id) on delete cascade
);

-- Update Sessions Table to include Project and Task references
alter table public.sessions 
add column project_id uuid references public.projects(id) on delete set null,
add column task_id uuid references public.tasks(id) on delete set null;

-- Enable RLS (Row Level Security)
alter table public.projects enable row level security;
alter table public.tasks enable row level security;

-- Policies for Projects
create policy "Users can view their own projects"
  on public.projects for select
  using (auth.uid() = user_id);

create policy "Users can insert their own projects"
  on public.projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own projects"
  on public.projects for update
  using (auth.uid() = user_id);

create policy "Users can delete their own projects"
  on public.projects for delete
  using (auth.uid() = user_id);

-- Policies for Tasks
create policy "Users can view their own tasks"
  on public.tasks for select
  using (auth.uid() = user_id);

create policy "Users can insert their own tasks"
  on public.tasks for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own tasks"
  on public.tasks for update
  using (auth.uid() = user_id);

create policy "Users can delete their own tasks"
  on public.tasks for delete
  using (auth.uid() = user_id);
