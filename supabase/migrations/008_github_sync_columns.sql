-- Migration: Add GitHub sync columns to projects table
-- Run this in Supabase SQL Editor

-- Add new columns for GitHub sync (if they don't exist)
DO $$
BEGIN
    -- github_id: Unique GitHub repository ID for matching
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'projects' AND column_name = 'github_id') THEN
        ALTER TABLE public.projects ADD COLUMN github_id BIGINT;
    END IF;

    -- language: Primary programming language from GitHub
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'projects' AND column_name = 'language') THEN
        ALTER TABLE public.projects ADD COLUMN language TEXT;
    END IF;

    -- stars: GitHub stargazers count
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'projects' AND column_name = 'stars') THEN
        ALTER TABLE public.projects ADD COLUMN stars INTEGER DEFAULT 0;
    END IF;

    -- is_private: Whether the repo is private
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'projects' AND column_name = 'is_private') THEN
        ALTER TABLE public.projects ADD COLUMN is_private BOOLEAN DEFAULT false;
    END IF;

    -- pushed_at: Last push timestamp from GitHub
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'projects' AND column_name = 'pushed_at') THEN
        ALTER TABLE public.projects ADD COLUMN pushed_at TIMESTAMPTZ;
    END IF;

    -- homepage: Live URL from GitHub (may duplicate live_url but synced from GitHub)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'projects' AND column_name = 'homepage') THEN
        ALTER TABLE public.projects ADD COLUMN homepage TEXT;
    END IF;
END $$;

-- Create index on github_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_projects_github_id ON public.projects(github_id);

-- Create index on github_url for faster matching
CREATE INDEX IF NOT EXISTS idx_projects_github_url ON public.projects(github_url);
