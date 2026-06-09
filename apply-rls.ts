import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mbogfvobjobxdsdpiely.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ib2dmdm9iam9ieGRzZHBpZWx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NzIwNjcsImV4cCI6MjA5NjM0ODA2N30.9I2xiucHjPFRJ4W3Q78QRi2ef3a32CdLjBGGu9j2uLY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const rls_sql = `
-- Enable RLS on branches table
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous users (anon role) to SELECT from branches
CREATE POLICY IF NOT EXISTS "Allow anon to select branches" ON branches
  FOR SELECT
  USING (true);

-- Create policy to allow anonymous users to INSERT into branches
CREATE POLICY IF NOT EXISTS "Allow anon to insert branches" ON branches
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow anonymous users to UPDATE branches
CREATE POLICY IF NOT EXISTS "Allow anon to update branches" ON branches
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create policy to allow anonymous users to DELETE branches
CREATE POLICY IF NOT EXISTS "Allow anon to delete branches" ON branches
  FOR DELETE
  USING (true);

-- Enable RLS on sections table
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous users to SELECT from sections
CREATE POLICY IF NOT EXISTS "Allow anon to select sections" ON sections
  FOR SELECT
  USING (true);

-- Create policy to allow anonymous users to INSERT into sections
CREATE POLICY IF NOT EXISTS "Allow anon to insert sections" ON sections
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow anonymous users to UPDATE sections
CREATE POLICY IF NOT EXISTS "Allow anon to update sections" ON sections
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create policy to allow anonymous users to DELETE sections
CREATE POLICY IF NOT EXISTS "Allow anon to delete sections" ON sections
  FOR DELETE
  USING (true);

-- Enable RLS on spreadsheets table
ALTER TABLE spreadsheets ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous users to SELECT from spreadsheets
CREATE POLICY IF NOT EXISTS "Allow anon to select spreadsheets" ON spreadsheets
  FOR SELECT
  USING (true);

-- Create policy to allow anonymous users to INSERT into spreadsheets
CREATE POLICY IF NOT EXISTS "Allow anon to insert spreadsheets" ON spreadsheets
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow anonymous users to UPDATE spreadsheets
CREATE POLICY IF NOT EXISTS "Allow anon to update spreadsheets" ON spreadsheets
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create policy to allow anonymous users to DELETE spreadsheets
CREATE POLICY IF NOT EXISTS "Allow anon to delete spreadsheets" ON spreadsheets
  FOR DELETE
  USING (true);
`;

async function applyRLS() {
  try {
    console.log('🔄 جاري تطبيق RLS Policies...');
    
    const { data, error } = await supabase.rpc('exec_sql', {
      sql_string: rls_sql
    });

    if (error) {
      // Try alternative method using raw SQL
      console.log('⚠️ محاولة الطريقة البديلة...');
      
      // Split queries and execute them one by one
      const queries = rls_sql.split(';').filter(q => q.trim());
      
      for (const query of queries) {
        if (query.trim()) {
          const { error: queryError } = await supabase.rpc('exec_sql', {
            sql_string: query.trim() + ';'
          });
          
          if (queryError && !queryError.message.includes('already exists')) {
            console.log('❌ خطأ في:', query.substring(0, 50));
            console.log('📌 التفاصيل:', queryError);
          } else {
            console.log('✅', query.substring(0, 60) + '...');
          }
        }
      }
    } else {
      console.log('✅ تم تطبيق جميع RLS Policies بنجاح!');
      console.log(data);
    }
    
    console.log('\n✨ اكتمل! الآن:\n');
    console.log('1️⃣  أعد تشغيل الخادم: npm run dev');
    console.log('2️⃣  حاول إنشاء spreadsheet جديد');
    
  } catch (err) {
    console.error('❌ خطأ عام:', err);
    console.log('\n💡 البديل اليدوي:\n');
    console.log('1. افتح: https://app.supabase.com/project/mbogfvobjobxdsdpiely/sql/new');
    console.log('2. انسخ محتوى: supabase/migrations/20240609000000_enable_rls_policies.sql');
    console.log('3. الصقه وشغله\n');
  }
}

applyRLS();
