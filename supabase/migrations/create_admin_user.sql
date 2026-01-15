-- Create Admin User Script (Fixed)
-- Creates a new user in Supabase Auth with email: abdulrahmanambooka@gmail.com

-- NOTE: This requires the pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Insert the user into auth.users only if they don't exist
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
SELECT
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'abdulrahmanambooka@gmail.com',
  crypt('Msah.Amb00ka', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(),
  now(),
  '',
  '',
  '',
  ''
WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'abdulrahmanambooka@gmail.com'
);

-- Output the credentials for the user
SELECT 'User created (or already exists)' as status, 'abdulrahmanambooka@gmail.com' as email;
