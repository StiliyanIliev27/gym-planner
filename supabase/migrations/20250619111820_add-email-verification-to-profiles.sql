ALTER TABLE profiles
ADD COLUMN confirmation_code TEXT,
ADD COLUMN confirmation_expires_at TIMESTAMPTZ,
ADD COLUMN is_verified BOOLEAN DEFAULT FALSE;
