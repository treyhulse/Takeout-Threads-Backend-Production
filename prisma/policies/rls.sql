-- First, enable RLS on all tables
ALTER TABLE "public"."Store" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Theme" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Page" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Component" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."Store";
DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."Theme";
DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."Page";
DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."Component";

-- Create new policies that explicitly handle both authenticated and public access
CREATE POLICY "Enable read access for all users"
ON "public"."Store"
FOR SELECT
TO PUBLIC
USING (
    (auth.role() = 'authenticated' AND auth.uid() IS NOT NULL) OR 
    (auth.role() = 'anon')
);

CREATE POLICY "Enable read access for all users"
ON "public"."Theme"
FOR SELECT
TO PUBLIC
USING (
    (auth.role() = 'authenticated' AND auth.uid() IS NOT NULL) OR 
    (auth.role() = 'anon')
);

CREATE POLICY "Enable read access for all users"
ON "public"."Page"
FOR SELECT
TO PUBLIC
USING (
    (auth.role() = 'authenticated' AND auth.uid() IS NOT NULL) OR 
    (auth.role() = 'anon')
);

CREATE POLICY "Enable read access for all users"
ON "public"."Component"
FOR SELECT
TO PUBLIC
USING (
    (auth.role() = 'authenticated' AND auth.uid() IS NOT NULL) OR 
    (auth.role() = 'anon')
);

-- Grant necessary permissions to both authenticated and anonymous users
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
