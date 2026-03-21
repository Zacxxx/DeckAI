-- SQL to set up the decks table in Supabase

create table decks (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  style text,
  slides_count integer default 0,
  status text default 'Verified'
);

-- Enable Row Level Security (RLS)
alter table decks enable row level security;

-- Create a policy that allows all users to read (for demo purposes)
-- In a real app, you'd restrict this to authenticated users or specific owners
create policy "Allow public read access" on decks for select using (true);
create policy "Allow public insert access" on decks for insert with check (true);
create policy "Allow public delete access" on decks for delete using (true);
