# ⚠️ CRITICAL STEP: Fix Database Permissions

Your logs are not saving because Supabase protects tables by default. You must allow "Insert" (saving) permissions.

## Fix it now:

1. Go to the **Supabase SQL Editor** (File icon on the left).
2. Paste and **Run** this code:

```sql
-- 1. Enable RLS (Good practice, creates the lock)
alter table logs enable row level security;

-- 2. Create a Policy to allow ANYONE to insert (save) logs
create policy "Enable insert for all users"
on logs for insert
with check (true);

-- 3. Create a Policy to allow ANYONE to read (view) logs
create policy "Enable read for all users"
on logs for select
using (true);
```

Once you run this, the website will be able to save and view the logs!
