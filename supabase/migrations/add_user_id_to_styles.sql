-- Add user_id to styles table to track ownership
ALTER TABLE public.styles ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Enable Row Level Security if not already enabled
ALTER TABLE public.styles ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can see styles
CREATE POLICY "Public styles are visible to everyone" 
ON public.styles FOR SELECT 
USING (true);

-- Policy: Users can insert their own styles
CREATE POLICY "Users can create their own styles" 
ON public.styles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own styles
CREATE POLICY "Users can update their own styles" 
ON public.styles FOR UPDATE 
USING (auth.uid() = user_id);

-- Policy: Users can delete their own styles
CREATE POLICY "Users can delete their own styles" 
ON public.styles FOR DELETE 
USING (auth.uid() = user_id);

-- Policy: Admins can do everything (This is tricky with simple RLS, usually better handled in app logic or specific admin role)
-- For now, we will rely on App Logic (actions.ts) `isAdmin()` check to bypass RLS using `supabase.auth.admin` or similar? 
-- actually `createClient` uses the user's token.
-- If we want "Admins can do any action", we might need a policy for that or use `service_role` in actions if admin.
-- But `isAdmin` checks email. Simple RLS can't verify email easily without a lookup or custom claim.
-- I'll define a function `is_admin_email()` or just rely on server actions to verify admin and then use `service_role` client for admin actions.

-- Let's stick to simple "owner" policies and handle "Admin Override" in the Server Actions using a privileged client if needed,
-- OR add a policy based on the admin email (hardcoded or from a settings table).
-- Since `isAdmin` is hardcoded in `auth.ts`, RLS can't see it.
-- OPTION: Allow standard users to perform actions on their own rows.
-- Admin actions can be done via `supabaseAdmin` client in `actions.ts`.
