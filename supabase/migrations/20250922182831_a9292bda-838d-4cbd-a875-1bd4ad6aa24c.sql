-- Update profiles RLS policy to allow users to view other profiles for networking
DROP POLICY IF EXISTS "Users can view their profile" ON public.profiles;

CREATE POLICY "Users can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (true);

-- Add profile creation after signup by updating the trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
begin
  insert into public.profiles (id, full_name, bio, subjects, experience, location, profile_image)
  values (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', ''), 
    '', 
    '{}', 
    0, 
    '', 
    ''
  )
  on conflict (id) do nothing;
  return new;
end;
$function$;

-- Create the trigger if it doesn't exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();