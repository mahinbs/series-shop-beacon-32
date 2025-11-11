import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const DatabaseTest = () => {
  const [testResult, setTestResult] = useState<string>('Testing...');
  const [eventsCount, setEventsCount] = useState<number>(0);

  useEffect(() => {
    const testDatabase = async () => {
      try {
        console.log('🧪 Testing database connection...');
        
        // Test 1: Check if we can connect to Supabase
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        console.log('🔐 Auth test:', { user, authError });
        
        // Test 2: Try to query the event_calendar table
        const { data, error } = await supabase
          .from('event_calendar' as any)
          .select('*')
          .limit(5);
        
        console.log('📊 Database query result:', { data, error });
        
        if (error) {
          setTestResult(`❌ Database Error: ${error.message}`);
          console.error('Database error:', error);
        } else {
          setTestResult(`✅ Database Connected! Found ${data?.length || 0} events`);
          setEventsCount(data?.length || 0);
        }
        
      } catch (err) {
        console.error('💥 Test failed:', err);
        setTestResult(`💥 Test Failed: ${err}`);
      }
    };

    testDatabase();
  }, []);

  return (
    <div className="p-4 bg-gray-800 rounded-lg mb-4">
      <h3 className="text-white font-semibold mb-2">Database Connection Test</h3>
      <p className="text-gray-300 mb-2">{testResult}</p>
      <p className="text-gray-400 text-sm">Events in database: {eventsCount}</p>
    </div>
  );
};
