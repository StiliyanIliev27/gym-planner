"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Edit, 
  Save, 
  X, 
  Plus,
  Trash2,
  Calendar,
  Clock,
  Dumbbell,
  Target,
  Weight,
  RotateCcw,
  Play,
  CheckCircle,
  Timer,
  Hash
} from "lucide-react";

// Import stores and services
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { useWorkoutStore } from "@/stores/workout/useWorkoutStore";
import { getExercises } from "@/lib/services/exerciseService";
import { addExerciseToWorkout, removeExerciseFromWorkout } from "@/lib/services/workoutService";
import AIWorkoutHelper from './ai-workout-helper';
import WorkoutCoverUpload from './workout-cover-upload';

export default function WorkoutDetail({ workoutId }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const { 
    currentWorkout,
    operationLoading,
    loadWorkout,
    updateExistingWorkout,
    addExerciseToCurrentWorkout
  } = useWorkoutStore();

  // State management
  const [isEditing, setIsEditing] = useState(searchParams?.get('edit') === 'true');
  const [editedWorkout, setEditedWorkout] = useState(null);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [exercisesLoading, setExercisesLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteExerciseId, setDeleteExerciseId] = useState(null);
  const [showCoverUpload, setShowCoverUpload] = useState(false);

  // Load workout data
  useEffect(() => {
    if (workoutId) {
      loadWorkout(workoutId);
    }
  }, [workoutId, loadWorkout]);

  // Initialize edited workout when current workout loads
  useEffect(() => {
    if (currentWorkout && !editedWorkout) {
      setEditedWorkout({
        name: currentWorkout.name,
        notes: currentWorkout.notes || '',
        workout_date: currentWorkout.workout_date,
        status: currentWorkout.status,
        total_duration_minutes: currentWorkout.total_duration_minutes || '',
      });
    }
  }, [currentWorkout, editedWorkout]);

  // Load exercises for adding
  const loadExercises = async () => {
    setExercisesLoading(true);
    try {
      const { data, error } = await getExercises({
        limit: 50,
        search: searchTerm
      });
      
      if (!error && data) {
        setExercises(data);
      }
    } catch (error) {
      console.error("Error loading exercises:", error);
    } finally {
      setExercisesLoading(false);
    }
  };

  useEffect(() => {
    if (showAddExercise) {
      loadExercises();
    }
  }, [showAddExercise, searchTerm]);

  const handleSave = async () => {
    if (!editedWorkout || !currentWorkout?.id) return;

    try {
      const result = await updateExistingWorkout(currentWorkout.id, editedWorkout);
      if (!result.success) {
        toast.error('Failed to save workout');
        return;
      }

      setIsEditing(false);
      toast.success('Workout saved successfully!');
    } catch (error) {
      console.error('Error saving workout:', error);
      toast.error('Something went wrong');
    }
  };

  const handleCancel = () => {
    setEditedWorkout({
      name: currentWorkout.name,
      notes: currentWorkout.notes || '',
      workout_date: currentWorkout.workout_date,
      status: currentWorkout.status,
      total_duration_minutes: currentWorkout.total_duration_minutes || '',
    });
    setIsEditing(false);
  };

  const handleAddExercise = async (exercise) => {
    try {
      const result = await addExerciseToCurrentWorkout(exercise.id, {
        order_index: (currentWorkout.workout_exercises?.length || 0) + 1,
        notes: `3 sets x 10 reps`
      });
      
      if (result.success) {
        toast.success("Exercise added successfully");
        setShowAddExercise(false);
        setSearchTerm("");
        // Reload workout to get updated data
        await loadWorkout(workoutId);
      } else {
        toast.error("Error adding exercise: " + (result.error?.message || "Unknown error"));
      }
    } catch (error) {
      toast.error("Error adding exercise: " + error.message);
    }
  };

  const handleRemoveExercise = async (workoutExerciseId) => {
    try {
      const { error } = await removeExerciseFromWorkout(workoutExerciseId);
      if (!error) {
        toast.success("Exercise removed successfully");
        setDeleteExerciseId(null);
        // Reload workout to get updated data
        await loadWorkout(workoutId);
      } else {
        toast.error("Error removing exercise: " + (error?.message || "Unknown error"));
      }
    } catch (error) {
      toast.error("Error removing exercise: " + error.message);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      planned: { label: "Planned", variant: "secondary", icon: Target },
      in_progress: { label: "In Progress", variant: "default", icon: Timer },
      completed: { label: "Completed", variant: "default", icon: CheckCircle },
      skipped: { label: "Skipped", variant: "destructive", icon: X }
    };
    
    const config = statusConfig[status] || statusConfig.planned;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="text-xs gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const handleCoverUploaded = async (coverUrl) => {
    // Update the edited workout state
    setEditedWorkout(prev => ({ ...prev, cover_image_url: coverUrl }));
    
    // Update the workout in the database and store
    try {
      await updateExistingWorkout(currentWorkout.id, { cover_image_url: coverUrl });
      toast.success('Cover image updated successfully!');
    } catch (error) {
      console.error('Error updating cover:', error);
      toast.error('Failed to update cover image');
    }
    
    setShowCoverUpload(false);
  };

  if (operationLoading && !currentWorkout) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentWorkout) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Workout not found</h3>
            <p className="text-muted-foreground mb-4">
              The workout with this ID doesn't exist or has been deleted.
            </p>
            <Button onClick={() => router.push('/my-workouts')}>
              Back to Workouts
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push('/my-workouts')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {isEditing ? editedWorkout?.name || currentWorkout.name : currentWorkout.name}
            </h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(currentWorkout.workout_date)}
              </div>
              {currentWorkout.total_duration_minutes && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {currentWorkout.total_duration_minutes}m
                </div>
              )}
              {getStatusBadge(currentWorkout.status)}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel} className="gap-2">
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save
              </Button>
            </>
          ) : (
            <>
              {currentWorkout.status === 'planned' && (
                <Button variant="outline" className="gap-2">
                  <Play className="h-4 w-4" />
                  Start Workout
                </Button>
              )}
              <Button onClick={() => setIsEditing(true)} className="gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Workout Cover */}
          {(currentWorkout.cover_image_url || isEditing) && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Workout Cover</CardTitle>
                  {isEditing && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowCoverUpload(!showCoverUpload)}
                    >
                      {showCoverUpload ? 'Hide' : 'Change Cover'}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {showCoverUpload ? (
                  <WorkoutCoverUpload
                    currentCoverUrl={currentWorkout.cover_image_url}
                    onCoverUploaded={handleCoverUploaded}
                    userId={user.id}
                  />
                ) : currentWorkout.cover_image_url ? (
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <img
                      src={currentWorkout.cover_image_url}
                      alt="Workout cover"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : isEditing ? (
                  <WorkoutCoverUpload
                    currentCoverUrl={null}
                    onCoverUploaded={handleCoverUploaded}
                    userId={user.id}
                  />
                ) : null}
              </CardContent>
            </Card>
          )}

          {/* Workout Info */}
          <Card>
            <CardHeader>
              <CardTitle>Workout Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Workout Name</Label>
                    <Input
                      id="name"
                      value={editedWorkout?.name || ''}
                      onChange={(e) => setEditedWorkout(prev => ({
                        ...prev,
                        name: e.target.value
                      }))}
                      placeholder="Workout name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={editedWorkout?.notes || ''}
                      onChange={(e) => setEditedWorkout(prev => ({
                        ...prev,
                        notes: e.target.value
                      }))}
                      placeholder="Add notes about this workout..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={editedWorkout?.workout_date || ''}
                        onChange={(e) => setEditedWorkout(prev => ({
                          ...prev,
                          workout_date: e.target.value
                        }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (minutes)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={editedWorkout?.total_duration_minutes || ''}
                        onChange={(e) => setEditedWorkout(prev => ({
                          ...prev,
                          total_duration_minutes: parseInt(e.target.value) || null
                        }))}
                        placeholder="60"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={editedWorkout?.status || 'planned'}
                      onValueChange={(value) => setEditedWorkout(prev => ({
                        ...prev,
                        status: value
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planned">Planned</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="skipped">Skipped</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              ) : (
                <>
                  {currentWorkout.notes && (
                    <div>
                      <Label className="text-sm font-medium">Notes</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {currentWorkout.notes}
                      </p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Date</Label>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(currentWorkout.workout_date)}
                      </p>
                    </div>
                    
                    {currentWorkout.total_duration_minutes && (
                      <div>
                        <Label className="text-sm font-medium">Duration</Label>
                        <p className="text-sm text-muted-foreground">
                          {currentWorkout.total_duration_minutes} minutes
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Exercises */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="h-5 w-5" />
                  Exercises ({currentWorkout.workout_exercises?.length || 0})
                </CardTitle>
                {isEditing && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowAddExercise(true)}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Exercise
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {currentWorkout.workout_exercises && currentWorkout.workout_exercises.length > 0 ? (
                <div className="space-y-4">
                  {currentWorkout.workout_exercises
                    .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
                    .map((workoutExercise, index) => (
                    <div key={workoutExercise.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                        <span className="text-sm font-medium">{index + 1}</span>
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-medium">
                          {workoutExercise.exercises?.name || 'Unknown Exercise'}
                        </h4>
                        {workoutExercise.exercises?.primary_muscle_groups && workoutExercise.exercises.primary_muscle_groups.length > 0 && (
                          <Badge variant="outline" className="text-xs mt-1">
                            {workoutExercise.exercises.primary_muscle_groups[0]}
                          </Badge>
                        )}
                        {workoutExercise.notes && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {workoutExercise.notes}
                          </p>
                        )}
                      </div>
                      
                      {isEditing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteExerciseId(workoutExercise.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No exercises</h3>
                  <p className="text-muted-foreground mb-4">
                    This workout doesn't have any exercises added yet.
                  </p>
                  {isEditing && (
                    <Button 
                      onClick={() => setShowAddExercise(true)}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add First Exercise
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar with stats and AI helper */}
        <div className="space-y-6">
          {/* AI Workout Helper */}
          <AIWorkoutHelper 
            workout={currentWorkout} 
            userProfile={user} 
          />
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Exercises</span>
                </div>
                <span className="font-medium">
                  {currentWorkout.workout_exercises?.length || 0}
                </span>
              </div>
              
              {currentWorkout.total_volume_kg > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Weight className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Total weight</span>
                  </div>
                  <span className="font-medium">{currentWorkout.total_volume_kg}kg</span>
                </div>
              )}
              
              {currentWorkout.total_reps > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RotateCcw className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Total reps</span>
                  </div>
                  <span className="font-medium">{currentWorkout.total_reps}</span>
                </div>
              )}
              
              {currentWorkout.estimated_calories_burned > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Calories</span>
                  </div>
                  <span className="font-medium">{currentWorkout.estimated_calories_burned}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Enhanced Workout Tags */}
          {(currentWorkout.workout_tags && currentWorkout.workout_tags.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {currentWorkout.workout_tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Difficulty Rating */}
          {currentWorkout.difficulty_rating && (
            <Card>
              <CardHeader>
                <CardTitle>Difficulty</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-full mr-1 ${
                          i < currentWorkout.difficulty_rating 
                            ? 'bg-primary' 
                            : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {currentWorkout.difficulty_rating}/5
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Add Exercise Dialog */}
      {showAddExercise && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Add Exercise</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowAddExercise(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Input
                  placeholder="Search exercises..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="max-h-96 overflow-y-auto space-y-2">
                {exercisesLoading ? (
                  [...Array(5)].map((_, i) => (
                    <div key={i} className="p-3 border rounded-lg">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  ))
                ) : exercises.length > 0 ? (
                  exercises.map((exercise) => (
                    <div 
                      key={exercise.id} 
                      className="p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                      onClick={() => handleAddExercise(exercise)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{exercise.name}</h4>
                          {exercise.primary_muscle_groups && exercise.primary_muscle_groups.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {exercise.primary_muscle_groups.slice(0, 2).map((group, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {group}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <Plus className="h-4 w-4" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No exercises found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Exercise Confirmation */}
      <AlertDialog open={!!deleteExerciseId} onOpenChange={() => setDeleteExerciseId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Exercise</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this exercise from the workout?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => handleRemoveExercise(deleteExerciseId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 