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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Hash,
  Edit3,
  TrendingUp,
  Send,
  Bot,
  User,
  ChevronDown,
  ChevronUp,
  Info,
  Zap,
  AlertTriangle,
  BookOpen,
  Star,
  Activity,
  Globe,
  Lock,
  UserCheck
} from "lucide-react";

// Import stores and services
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { useWorkoutStore } from "@/stores/workout/useWorkoutStore";
import { getExercises, createExercise } from "@/lib/services/exerciseService";
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
  const [editingExercise, setEditingExercise] = useState(null);
  const [showCustomExerciseDialog, setShowCustomExerciseDialog] = useState(false);
  const [customExercise, setCustomExercise] = useState({
    name: '',
    description: '',
    instructions: '',
    primary_muscle_groups: [],
    secondary_muscle_groups: [],
    equipment_needed: [],
    exercise_type: '',
    difficulty_level: '',
    movement_pattern: '',
    tips: '',
    form_cues: [],
    common_mistakes: [],
    demo_video_url: '',
    is_compound: false,
    is_bilateral: true,
    is_public: false
  });
  const [updatedExercises, setUpdatedExercises] = useState({});
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your AI workout coach. I can help you optimize your workout, suggest modifications, or answer questions about your exercises. How can I assist you today?",
      sender: "ai",
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [expandedExercises, setExpandedExercises] = useState(new Set());

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
    setUpdatedExercises({});
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

  const handleCreateCustomExercise = async () => {
    if (!customExercise.name.trim()) {
      toast.error("Exercise name is required");
      return;
    }

    try {
      const exerciseData = {
        name: customExercise.name,
        description: customExercise.description,
        instructions: customExercise.instructions,
        primary_muscle_groups: customExercise.primary_muscle_groups,
        secondary_muscle_groups: customExercise.secondary_muscle_groups,
        equipment_needed: customExercise.equipment_needed,
        exercise_type: customExercise.exercise_type,
        difficulty_level: customExercise.difficulty_level,
        movement_pattern: customExercise.movement_pattern,
        tips: customExercise.tips,
        form_cues: customExercise.form_cues,
        common_mistakes: customExercise.common_mistakes,
        demo_video_url: customExercise.demo_video_url,
        is_compound: customExercise.is_compound,
        is_bilateral: customExercise.is_bilateral
      };

      const { data, error } = await createExercise(user.id, exerciseData, customExercise.is_public);

      if (error) {
        toast.error("Error creating custom exercise: " + error.message);
        return;
      }

      if (data) {
        await handleAddExercise(data);
        setShowCustomExerciseDialog(false);
        setCustomExercise({
          name: '',
          description: '',
          instructions: '',
          primary_muscle_groups: [],
          secondary_muscle_groups: [],
          equipment_needed: [],
          exercise_type: '',
          difficulty_level: '',
          movement_pattern: '',
          tips: '',
          form_cues: [],
          common_mistakes: [],
          demo_video_url: '',
          is_compound: false,
          is_bilateral: true,
          is_public: false
        });
        toast.success("Custom exercise created and added!");
      }
    } catch (error) {
      toast.error("Error creating custom exercise: " + error.message);
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

  const handleEditExercise = (workoutExercise) => {
    const current = updatedExercises[workoutExercise.id] || workoutExercise;
    setEditingExercise({
      id: workoutExercise.id,
      notes: current.notes || '',
      sets: current.sets || 3,
      reps: current.reps || 10,
      weight: current.weight || '',
      rest_seconds: current.rest_seconds || 60
    });
  };

  const handleSaveExerciseEdit = async () => {
    if (!editingExercise) return;

    try {
      // Update the local state to reflect changes immediately
      setUpdatedExercises(prev => ({
        ...prev,
        [editingExercise.id]: {
          ...editingExercise
        }
      }));

      // In real app would call API to update workout_exercise
      // await updateWorkoutExercise(editingExercise.id, editingExercise);
      
      toast.success("Exercise updated successfully");
      setEditingExercise(null);
    } catch (error) {
      toast.error("Error updating exercise: " + error.message);
    }
  };

  const getExerciseData = (workoutExercise) => {
    return updatedExercises[workoutExercise.id] || workoutExercise;
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: newMessage,
      sender: "user",
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage("");

    // Simulate AI response (in real app would call AI API)
    setTimeout(() => {
      const aiResponses = [
        "That's a great question! Based on your current workout, I'd suggest...",
        "I notice you could benefit from adding more rest between sets. Try increasing your rest time to 90 seconds.",
        "Your exercise selection looks solid! Consider adding a compound movement like deadlifts for better overall development.",
        "Perfect! Your workout structure follows good progressive overload principles.",
        "I recommend focusing on proper form rather than increasing weight too quickly."
      ];
      
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      const aiMessage = {
        id: Date.now() + 1,
        text: randomResponse,
        sender: "ai",
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, aiMessage]);
    }, 1000);
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

  const toggleExerciseExpansion = (exerciseId) => {
    setExpandedExercises(prev => {
      const newSet = new Set(prev);
      if (newSet.has(exerciseId)) {
        newSet.delete(exerciseId);
      } else {
        newSet.add(exerciseId);
      }
      return newSet;
    });
  };

  const renderExerciseDetails = (exercise) => {
    if (!exercise) return null;

    // Function to extract YouTube video ID from URL
    const getYouTubeVideoId = (url) => {
      if (!url) return null;
      const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
      return match ? match[1] : null;
    };

    const videoId = getYouTubeVideoId(exercise.demo_video_url);

    return (
      <div className="mt-2 pt-2 border-t bg-muted/20 rounded-md p-3">
        <div className="flex gap-4">
          {/* Video Player - Left Side */}
          {videoId && (
            <div className="flex-shrink-0 w-96">
              <Label className="text-sm font-medium text-muted-foreground mb-2 block">Demo Video</Label>
              <div className="space-y-2">
                {/* YouTube Embed Player */}
                <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0`}
                    title="Exercise Demo"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
                
                {/* Video Info Below */}
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Watch for:</span>
                    <span>Proper form and technique</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Focus on:</span>
                    <span>Movement speed and control</span>
                  </div>
                  {exercise.primary_muscle_groups && exercise.primary_muscle_groups.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Targets:</span>
                      <span>{exercise.primary_muscle_groups.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Exercise Information - Right Side */}
          <div className="flex-1 space-y-2">
            {/* First Row: Target Muscles and Form Points */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Target Muscles */}
              {exercise.primary_muscle_groups && exercise.primary_muscle_groups.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Target Muscles</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {exercise.primary_muscle_groups.map((muscle, index) => (
                      <Badge key={index} variant="default" className="text-xs">
                        {muscle}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Form Points */}
              {exercise.form_cues && exercise.form_cues.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Activity className="h-4 w-4" />
                    Form Points
                  </Label>
                  <ul className="text-sm mt-1 space-y-1 p-1 rounded-md">
                    {exercise.form_cues.slice(0, 2).map((cue, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-600 mt-1 font-bold text-xs">•</span>
                        <span className="text-green-700 dark:text-green-300 text-xs">{cue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Second Row: Exercise Type & Difficulty and Avoid These */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Exercise Type & Difficulty */}
              <div className="flex gap-4">
                {exercise.exercise_type && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                    <p className="text-sm capitalize">{exercise.exercise_type}</p>
                  </div>
                )}
                {exercise.difficulty_level && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Difficulty</Label>
                    <Badge variant="outline" className="text-xs">
                      {exercise.difficulty_level}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Avoid These */}
              {exercise.common_mistakes && exercise.common_mistakes.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    Avoid These
                  </Label>
                  <ul className="text-sm mt-1 space-y-1 p-1 rounded-md">
                    {exercise.common_mistakes.slice(0, 2).map((mistake, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-red-600 mt-1 font-bold text-xs">•</span>
                        <span className="text-red-700 dark:text-red-300 text-xs">{mistake}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Third Row: Equipment and Tips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Equipment Needed */}
              {exercise.equipment_needed && exercise.equipment_needed.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Equipment</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {exercise.equipment_needed.map((equipment, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {equipment}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Tips */}
              {exercise.tips && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Info className="h-4 w-4" />
                    Key Tips
                  </Label>
                  <p className="text-xs mt-1 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/30 p-2 rounded-md">
                    {exercise.tips}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
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
                Save Changes
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
                Edit Workout
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Compact Workout Cover */}
          {(currentWorkout.cover_image_url || isEditing) && (
            <div className="relative">
              {showCoverUpload ? (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium">Workout Cover</span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowCoverUpload(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                    <WorkoutCoverUpload
                      currentCoverUrl={currentWorkout.cover_image_url}
                      onCoverUploaded={handleCoverUploaded}
                      userId={user.id}
                    />
                  </CardContent>
                </Card>
              ) : currentWorkout.cover_image_url ? (
                <div className="relative group">
                  <div className="w-full h-20 rounded-lg overflow-hidden bg-muted border">
                    <img
                      src={currentWorkout.cover_image_url}
                      alt="Workout cover"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  {isEditing && (
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => setShowCoverUpload(true)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs px-2 py-1"
                    >
                      Change
                    </Button>
                  )}
                </div>
              ) : isEditing ? (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium">Add Workout Cover</span>
                    </div>
                    <WorkoutCoverUpload
                      currentCoverUrl={null}
                      onCoverUploaded={handleCoverUploaded}
                      userId={user.id}
                    />
                  </CardContent>
                </Card>
              ) : null}
            </div>
          )}

          {/* Workout Information */}
          <Card>
            <CardHeader>
              <CardTitle>Workout Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {/* Exercises Section */}
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
                    .map((workoutExercise, index) => {
                      const exerciseData = getExerciseData(workoutExercise);
                      const isExpanded = expandedExercises.has(workoutExercise.id);
                      return (
                        <div key={workoutExercise.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                              <span className="text-sm font-medium">{index + 1}</span>
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium">
                                  {workoutExercise.exercises?.name || 'Unknown Exercise'}
                                </h4>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleExerciseExpansion(workoutExercise.id)}
                                  className="h-6 w-6 p-0 hover:bg-muted"
                                >
                                  {isExpanded ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                              
                              {workoutExercise.exercises?.primary_muscle_groups && workoutExercise.exercises.primary_muscle_groups.length > 0 && (
                                <Badge variant="outline" className="text-xs mb-2">
                                  {workoutExercise.exercises.primary_muscle_groups[0]}
                                </Badge>
                              )}
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                <div className="flex items-center gap-1">
                                  <Hash className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-muted-foreground">Sets:</span>
                                  <span className="font-medium">{exerciseData.sets || 3}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <RotateCcw className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-muted-foreground">Reps:</span>
                                  <span className="font-medium">{exerciseData.reps || 10}</span>
                                </div>
                                {exerciseData.weight && (
                                  <div className="flex items-center gap-1">
                                    <Weight className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-muted-foreground">Weight:</span>
                                    <span className="font-medium">{exerciseData.weight}kg</span>
                                  </div>
                                )}
                                {exerciseData.rest_seconds && (
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-muted-foreground">Rest:</span>
                                    <span className="font-medium">{exerciseData.rest_seconds}s</span>
                                  </div>
                                )}
                              </div>
                              
                              {exerciseData.notes && (
                                <p className="text-sm text-muted-foreground mt-2">
                                  {exerciseData.notes}
                                </p>
                              )}

                              {/* Expandable Exercise Details */}
                              {isExpanded && renderExerciseDetails(workoutExercise.exercises)}
                            </div>
                            
                            {isEditing && (
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditExercise(workoutExercise)}
                                  className="gap-2"
                                >
                                  <Edit3 className="h-4 w-4" />
                                  Edit
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setDeleteExerciseId(workoutExercise.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No exercises added yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start building your workout by adding exercises.
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

        {/* Simplified Sidebar */}
        <div className="space-y-6">
          {/* AI Coach Chatbot */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bot className="h-5 w-5 text-primary" />
                AI Coach Chat
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {/* Chat Messages */}
              <div className="space-y-3 max-h-80 overflow-y-auto mb-4">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex gap-2 max-w-[85%] ${
                        message.sender === "user" ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {message.sender === "user" ? (
                          <User className="h-3 w-3" />
                        ) : (
                          <Bot className="h-3 w-3" />
                        )}
                      </div>
                      <div
                        className={`rounded-lg p-2 text-xs ${
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Ask your AI coach..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      sendMessage();
                    }
                  }}
                  className="text-sm"
                />
                <Button size="sm" onClick={sendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AI Workout Helper */}
          <AIWorkoutHelper 
            workout={currentWorkout} 
            userProfile={user} 
          />

          {/* Difficulty Rating - Only if exists */}
          {currentWorkout.difficulty_rating && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Difficulty</CardTitle>
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
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    placeholder="Search exercises..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCustomExerciseDialog(true)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create Custom
                </Button>
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
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{exercise.name}</h4>
                            
                            {/* Exercise visibility indicators */}
                            {exercise.is_system ? (
                              <Badge variant="secondary" className="text-xs gap-1">
                                <Star className="h-3 w-3" />
                                System
                              </Badge>
                            ) : exercise.is_public ? (
                              <Badge variant="outline" className="text-xs gap-1 text-green-600 border-green-600">
                                <Globe className="h-3 w-3" />
                                Public
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs gap-1 text-orange-600 border-orange-600">
                                <Lock className="h-3 w-3" />
                                Private
                              </Badge>
                            )}

                            {/* Creator indicator for non-system exercises */}
                            {!exercise.is_system && exercise.created_by_profile && (
                              <Badge variant="outline" className="text-xs gap-1">
                                <UserCheck className="h-3 w-3" />
                                {exercise.created_by_profile.full_name || 
                                 `${exercise.created_by_profile.first_name} ${exercise.created_by_profile.last_name}`.trim() ||
                                 'User'}
                              </Badge>
                            )}
                          </div>
                          
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

      {/* Custom Exercise Creation Dialog */}
      <Dialog open={showCustomExerciseDialog} onOpenChange={setShowCustomExerciseDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader className="pb-3">
            <DialogTitle className="text-lg font-semibold">Create Custom Exercise</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Create a personalized exercise. Public exercises are shared with the community.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3">
            {/* Basic Information Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="exercise-name" className="text-sm font-medium">Exercise Name *</Label>
                <Input
                  id="exercise-name"
                  value={customExercise.name}
                  onChange={(e) => setCustomExercise(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Modified Push-ups"
                  className="h-9"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="exercise-type" className="text-sm font-medium">Exercise Type</Label>
                <Select
                  value={customExercise.exercise_type}
                  onValueChange={(value) => setCustomExercise(prev => ({ ...prev, exercise_type: value }))}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="strength">Strength</SelectItem>
                    <SelectItem value="cardio">Cardio</SelectItem>
                    <SelectItem value="flexibility">Flexibility</SelectItem>
                    <SelectItem value="balance">Balance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Properties Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label htmlFor="difficulty-level" className="text-sm font-medium">Difficulty</Label>
                <Select
                  value={customExercise.difficulty_level}
                  onValueChange={(value) => setCustomExercise(prev => ({ ...prev, difficulty_level: value }))}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="movement-pattern" className="text-sm font-medium">Movement</Label>
                <Select
                  value={customExercise.movement_pattern}
                  onValueChange={(value) => setCustomExercise(prev => ({ ...prev, movement_pattern: value }))}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Pattern" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="push">Push</SelectItem>
                    <SelectItem value="pull">Pull</SelectItem>
                    <SelectItem value="squat">Squat</SelectItem>
                    <SelectItem value="hinge">Hinge</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="exercise-is-public" className="text-sm font-medium">Visibility</Label>
                <Select
                  value={customExercise.is_public ? 'true' : 'false'}
                  onValueChange={(value) => setCustomExercise(prev => ({ ...prev, is_public: value === 'true' }))}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Public - Share with community</SelectItem>
                    <SelectItem value="false">Private - Only for you</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Muscle Groups & Equipment Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="primary-muscles" className="text-sm font-medium">Primary Muscles</Label>
                <Input
                  id="primary-muscles"
                  value={customExercise.primary_muscle_groups.join(', ')}
                  onChange={(e) => setCustomExercise(prev => ({ 
                    ...prev, 
                    primary_muscle_groups: e.target.value.split(',').map(m => m.trim()).filter(m => m) 
                  }))}
                  placeholder="e.g., Chest, Shoulders"
                  className="h-9"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="equipment-needed" className="text-sm font-medium">Equipment</Label>
                <Input
                  id="equipment-needed"
                  value={customExercise.equipment_needed.join(', ')}
                  onChange={(e) => setCustomExercise(prev => ({ 
                    ...prev, 
                    equipment_needed: e.target.value.split(',').map(e => e.trim()).filter(e => e) 
                  }))}
                  placeholder="e.g., Dumbbells, Bench"
                  className="h-9"
                />
              </div>
            </div>

            {/* Description & Instructions Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="exercise-description" className="text-sm font-medium">Description</Label>
                <Textarea
                  id="exercise-description"
                  value={customExercise.description}
                  onChange={(e) => setCustomExercise(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the exercise"
                  rows={2}
                  className="resize-none"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="exercise-instructions" className="text-sm font-medium">Instructions</Label>
                <Textarea
                  id="exercise-instructions"
                  value={customExercise.instructions}
                  onChange={(e) => setCustomExercise(prev => ({ ...prev, instructions: e.target.value }))}
                  placeholder="Step-by-step instructions"
                  rows={2}
                  className="resize-none"
                />
              </div>
            </div>

            {/* Tips & Form Cues Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="exercise-tips" className="text-sm font-medium">Tips</Label>
                <Textarea
                  id="exercise-tips"
                  value={customExercise.tips}
                  onChange={(e) => setCustomExercise(prev => ({ ...prev, tips: e.target.value }))}
                  placeholder="Helpful tips"
                  rows={2}
                  className="resize-none"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="form-cues" className="text-sm font-medium">Form Cues</Label>
                <Textarea
                  id="form-cues"
                  value={customExercise.form_cues.join('\n')}
                  onChange={(e) => setCustomExercise(prev => ({ 
                    ...prev, 
                    form_cues: e.target.value.split('\n').filter(cue => cue.trim()) 
                  }))}
                  placeholder="Each cue on new line"
                  rows={2}
                  className="resize-none"
                />
              </div>
            </div>

            {/* Properties & Video Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Properties</Label>
                <div className="flex gap-4 pt-1">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is-compound"
                      checked={customExercise.is_compound}
                      onChange={(e) => setCustomExercise(prev => ({ ...prev, is_compound: e.target.checked }))}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <Label htmlFor="is-compound" className="text-sm">Compound</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is-bilateral"
                      checked={customExercise.is_bilateral}
                      onChange={(e) => setCustomExercise(prev => ({ ...prev, is_bilateral: e.target.checked }))}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <Label htmlFor="is-bilateral" className="text-sm">Bilateral</Label>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="demo-video" className="text-sm font-medium">Demo Video URL</Label>
                <Input
                  id="demo-video"
                  value={customExercise.demo_video_url}
                  onChange={(e) => setCustomExercise(prev => ({ ...prev, demo_video_url: e.target.value }))}
                  placeholder="YouTube URL (optional)"
                  className="h-9"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setShowCustomExerciseDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCustomExercise} disabled={!customExercise.name.trim()}>
              Create Exercise
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Exercise Edit Dialog */}
      <Dialog open={!!editingExercise} onOpenChange={() => setEditingExercise(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Exercise Details</DialogTitle>
            <DialogDescription>
              Modify the sets, reps, weight, and rest time for this exercise.
            </DialogDescription>
          </DialogHeader>
          {editingExercise && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-sets">Sets</Label>
                  <Input
                    id="edit-sets"
                    type="number"
                    value={editingExercise.sets}
                    onChange={(e) => setEditingExercise(prev => ({ ...prev, sets: parseInt(e.target.value) || 1 }))}
                    min="1"
                    max="20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-reps">Reps</Label>
                  <Input
                    id="edit-reps"
                    type="number"
                    value={editingExercise.reps}
                    onChange={(e) => setEditingExercise(prev => ({ ...prev, reps: parseInt(e.target.value) || 1 }))}
                    min="1"
                    max="100"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-weight">Weight (kg)</Label>
                  <Input
                    id="edit-weight"
                    type="number"
                    value={editingExercise.weight}
                    onChange={(e) => setEditingExercise(prev => ({ ...prev, weight: e.target.value }))}
                    placeholder="Optional"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-rest">Rest (seconds)</Label>
                  <Input
                    id="edit-rest"
                    type="number"
                    value={editingExercise.rest_seconds}
                    onChange={(e) => setEditingExercise(prev => ({ ...prev, rest_seconds: parseInt(e.target.value) || 60 }))}
                    min="30"
                    max="600"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  value={editingExercise.notes}
                  onChange={(e) => setEditingExercise(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Exercise notes or instructions"
                  rows={2}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingExercise(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveExerciseEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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