-- 1. Add avatar_url column to profiles if it doesn't exist
alter table public.profiles add column if not exists avatar_url text;

-- 2. Create the 'avatars' storage bucket (must be public)
insert into storage.buckets (id, name, public) 
values ('avatars', 'avatars', true) 
on conflict (id) do nothing;

-- 3. Set up Storage RLS Policies so users can upload their own photos
create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Users can upload their own avatar."
  on storage.objects for insert
  with check ( bucket_id = 'avatars' and auth.uid() = owner );

create policy "Users can update their own avatar."
  on storage.objects for update
  using ( bucket_id = 'avatars' and auth.uid() = owner );
