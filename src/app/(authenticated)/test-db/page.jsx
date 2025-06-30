"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/auth/useAuthStore';
import { 
  testDatabaseConnection,
  getUserProfile,
  getMuscleGroups,
  getEquipment,
  getFoodCategories
} from '@/lib/services';

export default function TestDatabasePage() {
  const { user } = useAuthStore();
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const runTest = async (testName, testFunction) => {
    setLoading(true);
    setResults(prev => ({ ...prev, [testName]: { status: 'loading', data: null, error: null } }));
    
    try {
      const result = await testFunction();
      setResults(prev => ({ 
        ...prev, 
        [testName]: { 
          status: result.error ? 'error' : 'success', 
          data: result.data, 
          error: result.error 
        } 
      }));
    } catch (error) {
      setResults(prev => ({ 
        ...prev, 
        [testName]: { 
          status: 'error', 
          data: null, 
          error: error.message 
        } 
      }));
    }
    setLoading(false);
  };

  const tests = [
    {
      name: 'Database Connection',
      key: 'connection',
      func: () => testDatabaseConnection(),
      description: 'Tests basic connectivity to Supabase'
    },
    {
      name: 'User Profile',
      key: 'profile',
      func: () => user ? getUserProfile(user.id) : Promise.resolve({ data: null, error: 'No user logged in' }),
      description: 'Tests user profile retrieval'
    },
    {
      name: 'Muscle Groups',
      key: 'muscles',
      func: () => getMuscleGroups(),
      description: 'Tests exercise muscle groups table'
    },
    {
      name: 'Equipment',
      key: 'equipment', 
      func: () => getEquipment(),
      description: 'Tests exercise equipment table'
    },
    {
      name: 'Food Categories',
      key: 'foods',
      func: () => getFoodCategories(),
      description: 'Tests nutrition food categories table'
    }
  ];

  const runAllTests = async () => {
    for (const test of tests) {
      await runTest(test.key, test.func);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'loading': return <Badge variant="secondary">Loading...</Badge>;
      case 'success': return <Badge variant="default" className="bg-green-500">Success</Badge>;
      case 'error': return <Badge variant="destructive">Error</Badge>;
      default: return <Badge variant="outline">Not Run</Badge>;
    }
  };

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Database Connection Tests</h1>
        <p className="text-muted-foreground">
          Test the connection to Supabase database and verify all services are working properly.
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <Button onClick={runAllTests} disabled={loading}>
          Run All Tests
        </Button>
        <Button 
          variant="outline" 
          onClick={() => setResults({})}
          disabled={loading}
        >
          Clear Results
        </Button>
      </div>

      {user && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Current User</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Created:</strong> {new Date(user.created_at).toLocaleString()}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {tests.map((test) => (
          <Card key={test.key}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{test.name}</CardTitle>
                  <CardDescription>{test.description}</CardDescription>
                </div>
                <div className="flex gap-2 items-center">
                  {getStatusBadge(results[test.key]?.status)}
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => runTest(test.key, test.func)}
                    disabled={loading}
                  >
                    Test
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            {results[test.key] && (
              <CardContent>
                {results[test.key].status === 'success' && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                      Success
                    </h4>
                    <pre className="text-sm text-green-700 dark:text-green-300 overflow-x-auto">
                      {JSON.stringify(results[test.key].data, null, 2)}
                    </pre>
                  </div>
                )}
                
                {results[test.key].status === 'error' && (
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                      Error
                    </h4>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {results[test.key].error?.message || results[test.key].error}
                    </p>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Development Notes</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• This page is only available in authenticated routes</li>
          <li>• All tests use the Supabase services we just created</li>
          <li>• Green = Success, Red = Error, Gray = Not run yet</li>
          <li>• Check browser console for detailed error logs</li>
        </ul>
      </div>
    </div>
  );
} 