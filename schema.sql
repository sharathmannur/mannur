-- Drop existing tables to start fresh
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

drop table if exists applications cascade;
drop table if exists saved_opportunities cascade;
drop table if exists opportunities cascade;
drop table if exists profiles cascade;
drop table if exists institutions cascade;

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  user_id uuid references auth.users on delete cascade not null,
  full_name text,
  email text,
  institution_id uuid,
  campus text,
  year text,
  branch text,
  skills text[],
  interests text[],
  role text default 'STUDENT' check (role in ('STUDENT', 'ADMIN')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- INSTITUTIONS
create table institutions (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  city text,
  state text,
  website text,
  logo_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add foreign key now that both exist
alter table profiles add constraint fk_institution foreign key (institution_id) references institutions(id);

-- OPPORTUNITIES
create table opportunities (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  organization text not null,
  category text not null,
  description text not null,
  eligibility text,
  skills text[],
  deadline timestamp with time zone,
  location text,
  mode text,
  source_url text,
  application_url text,
  institution_id uuid references institutions(id),
  is_demo boolean default false,
  verification_status text default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SAVED_OPPORTUNITIES
create table saved_opportunities (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  opportunity_id uuid references opportunities(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, opportunity_id)
);

-- APPLICATIONS
create table applications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  opportunity_id uuid references opportunities(id) on delete cascade not null,
  status text not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, opportunity_id)
);

-- RLS POLICIES
alter table profiles enable row level security;
alter table institutions enable row level security;
alter table opportunities enable row level security;
alter table saved_opportunities enable row level security;
alter table applications enable row level security;

create policy "Users can view own profile" on profiles for select using ( auth.uid() = id );
create policy "Users can insert own profile" on profiles for insert with check ( auth.uid() = id );
create policy "Users can update own profile" on profiles for update using ( auth.uid() = id );

create policy "Everyone can view institutions" on institutions for select using ( true );

create policy "Everyone can view opportunities" on opportunities for select using ( true );
create policy "Admins can manage opportunities" on opportunities for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'ADMIN')
);

create policy "Users can view own saved" on saved_opportunities for select using ( auth.uid() = user_id );
create policy "Users can insert own saved" on saved_opportunities for insert with check ( auth.uid() = user_id );
create policy "Users can delete own saved" on saved_opportunities for delete using ( auth.uid() = user_id );

create policy "Users can view own applications" on applications for select using ( auth.uid() = user_id );
create policy "Users can insert own applications" on applications for insert with check ( auth.uid() = user_id );
create policy "Users can update own applications" on applications for update using ( auth.uid() = user_id );
create policy "Users can delete own applications" on applications for delete using ( auth.uid() = user_id );

-- Automatically create profile on signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, user_id, full_name, email)
  values (new.id, new.id, new.raw_user_meta_data->>'full_name', new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
