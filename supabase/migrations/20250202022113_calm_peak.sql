/*
  # IP-based Usage Tracking System

  1. New Tables
    - `usage_tracking`
      - `id` (uuid, primary key)
      - `ip_address` (text)
      - `minutes_used` (integer)
      - `last_used` (timestamp)
      - `created_at` (timestamp)

  2. Functions
    - `track_usage`: Tracks video processing usage by IP address
    
  3. Security
    - Enable RLS on usage_tracking table
    - Add policies for tracking usage
*/

-- Create usage tracking table
CREATE TABLE IF NOT EXISTS usage_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text NOT NULL,
  minutes_used integer DEFAULT 0,
  last_used timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

-- Create policy for inserting and updating usage
CREATE POLICY "Allow anonymous usage tracking"
  ON usage_tracking
  FOR ALL
  TO anon
  USING (true);

-- Create function to track usage
CREATE OR REPLACE FUNCTION track_usage(video_length_minutes integer)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_ip text;
  current_usage record;
  remaining_hours float;
  is_premium boolean;
BEGIN
  -- Get client IP from request.header('cf-connecting-ip')
  user_ip := current_setting('request.headers')::json->>'cf-connecting-ip';
  
  -- Get or create usage record
  INSERT INTO usage_tracking (ip_address, minutes_used)
  VALUES (user_ip, video_length_minutes)
  ON CONFLICT (ip_address) DO UPDATE
  SET 
    minutes_used = usage_tracking.minutes_used + video_length_minutes,
    last_used = now()
  RETURNING * INTO current_usage;
  
  -- Calculate remaining hours (5 hours = 300 minutes free tier)
  remaining_hours := GREATEST(0, (300 - current_usage.minutes_used)::float / 60);
  is_premium := false; -- Set to true when premium features are implemented
  
  RETURN json_build_object(
    'remaining_hours', remaining_hours,
    'is_premium', is_premium
  );
END;
$$;