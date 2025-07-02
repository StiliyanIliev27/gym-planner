'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Lightbulb, Target, Plus, Clock, Flame, Heart, TrendingUp, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { generateWorkoutSuggestions, getMotivationalMessage, getExerciseTips } from '@/lib/services/aiService';
import { toast } from 'sonner';

const iconMap = {
  Plus, Target, Clock, Flame, Heart, TrendingUp, AlertCircle, Lightbulb
};

export default function AIWorkoutHelper({ workout, userProfile = {}, className = '' }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exerciseTips, setExerciseTips] = useState(null);
  const [motivationalMessage, setMotivationalMessage] = useState('');

  useEffect(() => {
    if (workout) {
      loadSuggestions();
      setMotivationalMessage(getMotivationalMessage(workout));
    }
  }, [workout]);

  const loadSuggestions = async () => {
    if (!workout) return;
    
    setLoading(true);
    try {
      const { suggestions: newSuggestions, error } = await generateWorkoutSuggestions(workout, userProfile);
      
      if (error) {
        console.error('Error loading AI suggestions:', error);
        toast.error('Unable to load AI suggestions');
        return;
      }

      setSuggestions(newSuggestions || []);
    } catch (error) {
      console.error('Unexpected error loading suggestions:', error);
      toast.error('Something went wrong loading suggestions');
    } finally {
      setLoading(false);
    }
  };

  const handleExerciseTips = async (exercise) => {
    if (!exercise) return;

    setSelectedExercise(exercise);
    setLoading(true);

    try {
      const { tips, error } = await getExerciseTips(exercise);
      
      if (error) {
        toast.error('Unable to load exercise tips');
        return;
      }

      setExerciseTips(tips);
    } catch (error) {
      console.error('Error loading exercise tips:', error);
      toast.error('Something went wrong loading exercise tips');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return AlertCircle;
      case 'medium': return Lightbulb;
      case 'low': return Target;
      default: return Lightbulb;
    }
  };

  if (!workout) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Motivational Message */}
      <Card className="border-l-4 border-l-primary">
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <p className="text-sm font-medium">{motivationalMessage}</p>
          </div>
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">AI Suggestions</CardTitle>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        
        {expanded && (
          <CardContent className="space-y-3">
            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-3 border rounded-lg">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                ))}
              </div>
            ) : suggestions.length > 0 ? (
              <div className="space-y-3">
                {suggestions.map((suggestion, index) => {
                  const IconComponent = iconMap[suggestion.icon] || getPriorityIcon(suggestion.priority);
                  
                  return (
                    <div key={index} className="p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <IconComponent className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-sm">{suggestion.title}</h4>
                            <Badge variant={getPriorityColor(suggestion.priority)} className="text-xs">
                              {suggestion.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                          {suggestion.actionable && (
                            <Button variant="outline" size="sm" className="text-xs">
                              Take Action
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6">
                <Lightbulb className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No suggestions available at the moment</p>
                <Button variant="outline" size="sm" onClick={loadSuggestions} className="mt-2">
                  Refresh Suggestions
                </Button>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Exercise Tips */}
      {workout.workout_exercises && workout.workout_exercises.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Exercise Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-2">
              {workout.workout_exercises.map((workoutExercise, index) => (
                <Button
                  key={workoutExercise.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleExerciseTips(workoutExercise.exercises)}
                  className="justify-start text-left"
                >
                  <span className="truncate">
                    {index + 1}. {workoutExercise.exercises?.name || 'Unknown Exercise'}
                  </span>
                </Button>
              ))}
            </div>

            {selectedExercise && exerciseTips && (
              <div className="mt-4 p-4 bg-accent/30 rounded-lg space-y-3">
                <h4 className="font-medium text-sm">Tips for {selectedExercise.name}</h4>
                
                {exerciseTips.form_tips && exerciseTips.form_tips.length > 0 && (
                  <div>
                    <h5 className="text-xs font-medium text-muted-foreground mb-1">Form Tips:</h5>
                    <ul className="text-xs space-y-1">
                      {exerciseTips.form_tips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <span className="text-primary">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {exerciseTips.common_mistakes && exerciseTips.common_mistakes.length > 0 && (
                  <div>
                    <h5 className="text-xs font-medium text-muted-foreground mb-1">Avoid These Mistakes:</h5>
                    <ul className="text-xs space-y-1">
                      {exerciseTips.common_mistakes.map((mistake, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <span className="text-destructive">•</span>
                          <span>{mistake}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {exerciseTips.alternatives && exerciseTips.alternatives.length > 0 && (
                  <div>
                    <h5 className="text-xs font-medium text-muted-foreground mb-1">Alternatives:</h5>
                    <div className="flex flex-wrap gap-1">
                      {exerciseTips.alternatives.map((alt, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {alt}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">
                {workout.workout_exercises?.length || 0}
              </p>
              <p className="text-xs text-muted-foreground">Exercises</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">
                {workout.total_duration_minutes || '--'}
              </p>
              <p className="text-xs text-muted-foreground">Minutes</p>
            </div>
          </div>
          
          {workout.workout_tags && workout.workout_tags.length > 0 && (
            <div className="mt-4">
              <h5 className="text-xs font-medium text-muted-foreground mb-2">Tags:</h5>
              <div className="flex flex-wrap gap-1">
                {workout.workout_tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 