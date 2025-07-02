"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  User, 
  Calendar, 
  Ruler, 
  Weight,
  Target,
  Heart,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth/useAuthStore';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { 
    user, 
    profile, 
    updateProfile, 
    profileLoading, 
    hasCompletedProfile,
    goals,
    updateGoal
  } = useAuthStore();

  const [formData, setFormData] = useState({
    full_name: '',
    date_of_birth: '',
    height_cm: '',
    weight_kg: '',
    fitness_goals: '',
    activity_level: '',
    experience_level: '',
    bio: ''
  });

  const [goalData, setGoalData] = useState({
    goal_type: 'general_fitness',
    target_weight_kg: '',
    weekly_workout_frequency: 3,
    description: ''
  });

  const [saving, setSaving] = useState(false);

  // Load profile data into form
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        date_of_birth: profile.date_of_birth || '',
        height_cm: profile.height_cm || '',
        weight_kg: profile.weight_kg || '',
        fitness_goals: profile.fitness_goals || '',
        activity_level: profile.activity_level || '',
        experience_level: profile.experience_level || '',
        bio: profile.bio || ''
      });
    }
  }, [profile]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGoalChange = (field, value) => {
    setGoalData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      // Validate required fields
      if (!formData.full_name || !formData.date_of_birth || !formData.height_cm) {
        toast.error('Please fill in the required fields: name, date of birth, and height');
        return;
      }

      // Update profile
      const result = await updateProfile(formData);
      
      if (result.success) {
        toast.success('Profile updated successfully!');
        
        // Update goal if provided
        if (goalData.target_weight_kg || goalData.description) {
          await updateGoal(goalData);
        }
      } else {
        toast.error('Error updating profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };

  const getCompletionPercentage = () => {
    const fields = [
      formData.full_name,
      formData.date_of_birth, 
      formData.height_cm,
      formData.weight_kg,
      formData.fitness_goals,
      formData.activity_level,
      formData.experience_level
    ];
    
    const completed = fields.filter(field => field && field.toString().trim() !== '').length;
    return Math.round((completed / fields.length) * 100);
  };

  const isProfileComplete = hasCompletedProfile();
  const completionPercentage = getCompletionPercentage();

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your information and goals
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {isProfileComplete ? (
            <Badge variant="default" className="gap-1">
              <CheckCircle className="h-3 w-3" />
              Complete
            </Badge>
          ) : (
            <Badge variant="outline" className="gap-1">
              <AlertCircle className="h-3 w-3" />
              {completionPercentage}% complete
            </Badge>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column - Basic Information */}
        <div className="md:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">
                    Full Name *
                  </Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date_of_birth">
                    Date of Birth *
                  </Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Physical Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ruler className="h-5 w-5" />
                Physical Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height_cm">
                    Height (cm) *
                  </Label>
                  <Input
                    id="height_cm"
                    type="number"
                    value={formData.height_cm}
                    onChange={(e) => handleInputChange('height_cm', e.target.value)}
                    placeholder="175"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="weight_kg">
                    Weight (kg)
                  </Label>
                  <Input
                    id="weight_kg"
                    type="number"
                    value={formData.weight_kg}
                    onChange={(e) => handleInputChange('weight_kg', e.target.value)}
                    placeholder="70"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fitness Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Fitness Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fitness_goals">
                    Fitness Goals
                  </Label>
                  <Select
                    value={formData.fitness_goals}
                    onValueChange={(value) => handleInputChange('fitness_goals', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weight_loss">Weight Loss</SelectItem>
                      <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                      <SelectItem value="strength">Increase Strength</SelectItem>
                      <SelectItem value="endurance">Endurance</SelectItem>
                      <SelectItem value="general_fitness">General Fitness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience_level">
                    Experience Level
                  </Label>
                  <Select
                    value={formData.experience_level}
                    onValueChange={(value) => handleInputChange('experience_level', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity_level">
                  Activity Level
                </Label>
                <Select
                  value={formData.activity_level}
                  onValueChange={(value) => handleInputChange('activity_level', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary (little to no exercise)</SelectItem>
                    <SelectItem value="lightly_active">Lightly Active (1-3 days/week)</SelectItem>
                    <SelectItem value="moderately_active">Moderately Active (3-5 days/week)</SelectItem>
                    <SelectItem value="very_active">Very Active (6-7 days/week)</SelectItem>
                    <SelectItem value="extremely_active">Extremely Active (twice per day)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Goals & Summary */}
        <div className="space-y-6">
          {/* Profile Completion */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Completion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Profile complete</span>
                  <span className="text-sm font-semibold">{completionPercentage}%</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>

                {!isProfileComplete && (
                  <div className="text-xs text-muted-foreground">
                    To complete your profile, fill in: name, date of birth, and height
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Goal Setting */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Quick Goal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="goal_type">
                  Goal Type
                </Label>
                <Select
                  value={goalData.goal_type}
                  onValueChange={(value) => handleGoalChange('goal_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight_loss">Weight Loss</SelectItem>
                    <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                    <SelectItem value="general_fitness">General Health</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {goalData.goal_type !== 'general_fitness' && (
                <div className="space-y-2">
                  <Label htmlFor="target_weight">
                    Target Weight (kg)
                  </Label>
                  <Input
                    id="target_weight"
                    type="number"
                    value={goalData.target_weight_kg}
                    onChange={(e) => handleGoalChange('target_weight_kg', e.target.value)}
                    placeholder="65"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="weekly_frequency">
                  Workouts per week
                </Label>
                <Select
                  value={goalData.weekly_workout_frequency.toString()}
                  onValueChange={(value) => handleGoalChange('weekly_workout_frequency', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 time</SelectItem>
                    <SelectItem value="2">2 times</SelectItem>
                    <SelectItem value="3">3 times</SelectItem>
                    <SelectItem value="4">4 times</SelectItem>
                    <SelectItem value="5">5 times</SelectItem>
                    <SelectItem value="6">6 times</SelectItem>
                    <SelectItem value="7">Every day</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button 
            onClick={handleSave} 
            disabled={saving || profileLoading}
            className="w-full gap-2"
            size="lg"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
} 