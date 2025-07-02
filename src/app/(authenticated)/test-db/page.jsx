"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/auth/useAuthStore';
import { useWorkoutStore } from '@/stores/workout/useWorkoutStore';
import { useProgressStore } from '@/stores/progress/useProgressStore';
import { 
  testDatabaseConnection,
  getUserProfile,
  getMuscleGroups,
  getEquipment,
  getFoodCategories
} from '@/lib/services';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/client';

export default function TestDatabasePage() {
  const { user, profile, goals, loadUserProfile } = useAuthStore();
  const { workouts, loadUserWorkouts, workoutsLoading } = useWorkoutStore();
  const { measurements, loadUserMeasurements, measurementsLoading } = useProgressStore();
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [storeTests, setStoreTests] = useState({});

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

  const testStores = async () => {
    if (!user?.id) {
      setStoreTests({ error: 'No user logged in' });
      return;
    }

    setStoreTests({ status: 'loading' });
    
    try {
      // Test Auth Store
      await loadUserProfile(user.id);
      
      // Test Workout Store  
      await loadUserWorkouts(user.id, 30);
      
      // Test Progress Store
      await loadUserMeasurements(user.id, 90);
      
      setStoreTests({ 
        status: 'success',
        authStore: { profile, goals },
        workoutStore: { workouts, workoutsLoading },
        progressStore: { measurements, measurementsLoading }
      });
    } catch (error) {
      setStoreTests({ 
        status: 'error', 
        error: error.message 
      });
    }
  };

  const checkAndFixProfile = async () => {
    if (!user?.id) {
      toast.error("No user logged in");
      return;
    }

    setLoading(true);
    try {
      // Check if profile exists
      const { data: profile, error: profileError } = await getUserProfile(user.id);
      
      if (profileError || !profile) {
        console.log("Profile not found, creating one...");
        
        // Create missing profile
        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            first_name: user.user_metadata?.firstName || user.email?.split('@')[0] || 'User',
            last_name: user.user_metadata?.lastName || '',
            avatar_url: '',
            is_verified: true, // Since they're already logged in
          })
          .select()
          .single();

        if (createError) {
          console.error("Error creating profile:", createError);
          toast.error("Failed to create profile: " + createError.message);
        } else {
          console.log("Profile created successfully:", createdProfile);
          toast.success("Profile created successfully!");
        }
      } else {
        console.log("Profile exists:", profile);
        toast.success("Profile already exists - no action needed");
      }
    } catch (error) {
      console.error("Error checking profile:", error);
      toast.error("Error: " + error.message);
    }
    setLoading(false);
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

      <div className="flex gap-4 mb-6 flex-wrap">
        <Button onClick={runAllTests} disabled={loading}>
          Run All Tests
        </Button>
        <Button 
          onClick={testStores} 
          disabled={loading || !user}
          variant="secondary"
        >
          Test Stores
        </Button>
        <Button 
          onClick={checkAndFixProfile} 
          disabled={loading || !user}
          variant="default"
          className="bg-orange-500 hover:bg-orange-600"
        >
          Check/Fix Profile
        </Button>
        <Button 
          variant="outline" 
          onClick={() => {
            setResults({});
            setStoreTests({});
          }}
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

      {/* Store Integration Tests */}
      {storeTests.status && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Store Integration Tests 
              {storeTests.status === 'loading' && getStatusBadge('loading')}
              {storeTests.status === 'success' && getStatusBadge('success')}
              {storeTests.status === 'error' && getStatusBadge('error')}
            </CardTitle>
            <CardDescription>
              Tests real data loading into Auth, Workout, and Progress stores
            </CardDescription>
          </CardHeader>
          <CardContent>
            {storeTests.status === 'success' && (
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                    Auth Store Data
                  </h4>
                  <p className="text-sm">Profile: {storeTests.authStore?.profile ? '✓ Loaded' : '✗ Empty'}</p>
                  <p className="text-sm">Goals: {storeTests.authStore?.goals?.length || 0} items</p>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    Workout Store Data
                  </h4>
                  <p className="text-sm">Workouts: {storeTests.workoutStore?.workouts?.length || 0} items</p>
                  <p className="text-sm">Loading: {storeTests.workoutStore?.workoutsLoading ? 'Yes' : 'No'}</p>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                    Progress Store Data
                  </h4>
                  <p className="text-sm">Measurements: {storeTests.progressStore?.measurements?.length || 0} items</p>
                  <p className="text-sm">Loading: {storeTests.progressStore?.measurementsLoading ? 'Yes' : 'No'}</p>
                </div>
              </div>
            )}
            
            {storeTests.status === 'error' && (
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                  Store Test Error
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300">
                  {storeTests.error}
                </p>
              </div>
            )}
            
            {storeTests.error && !storeTests.status && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  {storeTests.error}
                </p>
              </div>
            )}
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
          <li>• "Test Stores" button tests Phase 3 store integration</li>
          <li>• Green = Success, Red = Error, Gray = Not run yet</li>
          <li>• Check browser console for detailed error logs</li>
        </ul>
        
        <div className="mt-4 pt-4 border-t">
          <h4 className="font-semibold mb-2 text-green-600">✅ Phase 2 Complete: API Layer & Services</h4>
          <p className="text-sm text-muted-foreground">
            All core Supabase services implemented and tested
          </p>
          
          <h4 className="font-semibold mb-2 mt-3 text-blue-600">🚀 Phase 3 Complete: Store Integration</h4>
          <p className="text-sm text-muted-foreground">
            Enhanced Auth Store, Real Workout Store, and Progress Store created
          </p>
          
          <h4 className="font-semibold mb-2 mt-3 text-orange-600">📋 Next: Phase 4 - Component Data Integration</h4>
          <p className="text-sm text-muted-foreground">
            Replace mock data in dashboard and other components
          </p>
        </div>
      </div>
    </div>
  );
} 