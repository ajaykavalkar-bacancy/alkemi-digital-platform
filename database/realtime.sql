do $$
declare
  publication_exists boolean;
  publication_all_tables boolean;
  table_name text;
  target_tables text[] := array[
    'users',
    'accounts',
    'transactions',
    'transfers',
    'cards',
    'notifications',
    'ai_insights'
  ];
begin
  select exists (
    select 1 from pg_publication where pubname = 'supabase_realtime'
  )
  into publication_exists;

  if not publication_exists then
    create publication supabase_realtime;
  end if;

  select puballtables
  from pg_publication
  where pubname = 'supabase_realtime'
  into publication_all_tables;

  if publication_all_tables then
    raise notice 'supabase_realtime is already FOR ALL TABLES; no table-level changes needed.';
    return;
  end if;

  foreach table_name in array target_tables
  loop
    if to_regclass(format('public.%I', table_name)) is null then
      raise notice 'Skipping table public.% because it does not exist.', table_name;
      continue;
    end if;

    if not exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = table_name
    ) then
      execute format('alter publication supabase_realtime add table public.%I', table_name);
    end if;
  end loop;
end $$;
