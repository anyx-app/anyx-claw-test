-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Trends Table
create table public.trends (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  industry text not null, -- e.g., 'SaaS', 'BioTech', 'FinTech'
  tam_valuation numeric, -- Total Addressable Market in USD (e.g., 5000000000)
  growth_cagr numeric, -- Compounded Annual Growth Rate (%)
  signal_strength int default 0, -- 0-100 score based on "buzz" or validation
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS (Row Level Security) - Start open for MVP
alter table public.trends enable row level security;

-- Policy: Everyone can read trends
create policy "Allow public read" on public.trends for select using (true);

-- Policy: Only authenticated users can insert (future-proofing)
create policy "Allow auth insert" on public.trends for insert with check (auth.role() = 'authenticated');
