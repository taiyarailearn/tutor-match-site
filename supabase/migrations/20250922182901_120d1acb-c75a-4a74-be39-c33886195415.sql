-- Fix the function search path security issue
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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