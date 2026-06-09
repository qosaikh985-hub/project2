import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://mbogfvobjobxdsdpiely.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ib2dmdm9iam9ieGRzZHBpZWx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NzIwNjcsImV4cCI6MjA5NjM0ODA2N30.9I2xiucHjPFRJ4W3Q78QRi2ef3a32CdLjBGGu9j2uLY'
);

async function run() {
  const { data: branches, error: branchesError } = await supabase
    .from('branches')
    .select('id,name')
    .order('created_at', { ascending: true });
  const { data: sections, error: sectionsError } = await supabase
    .from('sections')
    .select('id,name,branch_id')
    .order('created_at', { ascending: true });

  console.log({ branchesError, sectionsError });
  console.log('branches count', branches?.length);
  console.log('sections count', sections?.length);

  const sectionNameCounts = sections?.reduce((acc, item) => {
    if (!item) return acc;
    acc[item.name] = (acc[item.name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};
  console.log('duplicate section names:', Object.entries(sectionNameCounts).filter(([, count]) => count > 1));

  const branchNameCounts = branches?.reduce((acc, item) => {
    if (!item) return acc;
    acc[item.name] = (acc[item.name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};
  console.log('duplicate branch names:', Object.entries(branchNameCounts).filter(([, count]) => count > 1));

  const byBranch = sections?.reduce((acc, item) => {
    if (!item) return acc;
    const key = item.branch_id ?? 'NULL';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};
  console.log('sections by branch_id count', byBranch);
  console.log('sections sample', sections?.slice(0, 100));
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
