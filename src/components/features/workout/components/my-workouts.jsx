"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Skeleton 
} from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar,
  Clock,
  Dumbbell,
  Filter,
  SortDesc,
  MoreHorizontal,
  Play
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Import stores and services
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { useWorkoutStore } from "@/stores/workout/useWorkoutStore";

export default function MyWorkouts() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { 
    workouts, 
    workoutsLoading,
    loadUserWorkouts,
    deleteExistingWorkout 
  } = useWorkoutStore();

  // Local state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date_desc");
  const [deleteWorkoutId, setDeleteWorkoutId] = useState(null);

  // Load workouts on component mount
  useEffect(() => {
    if (user?.id) {
      loadUserWorkouts(user.id, 90); // Load last 90 days
    }
  }, [user?.id, loadUserWorkouts]);

  // Filter and sort workouts
  const filteredWorkouts = workouts
    .filter(workout => {
      // Search filter
      const matchesSearch = workout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (workout.notes || "").toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      const matchesStatus = statusFilter === "all" || workout.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "name_desc":
          return b.name.localeCompare(a.name);
        case "date_asc":
          return new Date(a.workout_date) - new Date(b.workout_date);
        case "date_desc":
        default:
          return new Date(b.workout_date) - new Date(a.workout_date);
      }
    });

  const handleDeleteWorkout = async (workoutId) => {
    try {
      const result = await deleteExistingWorkout(workoutId);
      if (result.success) {
        toast.success("Workout deleted successfully");
        setDeleteWorkoutId(null);
      } else {
        toast.error("Error deleting workout: " + (result.error?.message || "Unknown error"));
      }
    } catch (error) {
      toast.error("Error deleting workout: " + error.message);
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
      planned: { label: "Planned", variant: "secondary" },
      in_progress: { label: "In Progress", variant: "default" },
      completed: { label: "Completed", variant: "default" },
      skipped: { label: "Skipped", variant: "destructive" }
    };
    
    const config = statusConfig[status] || statusConfig.planned;
    return (
      <Badge variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    );
  };

  const WorkoutCard = ({ workout }) => (
    <Card className="hover:shadow-md transition-shadow">
      {/* Workout Cover Image */}
      {workout.cover_image_url && (
        <div className="aspect-video rounded-t-lg overflow-hidden">
          <img
            src={workout.cover_image_url}
            alt={workout.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">{workout.name}</h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(workout.workout_date)}
              </div>
              {workout.total_duration_minutes && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {workout.total_duration_minutes} min
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(workout.status)}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push(`/workout-detail/${workout.id}`)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`/workout-detail/${workout.id}?edit=true`)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                {workout.status === 'planned' && (
                  <DropdownMenuItem onClick={() => {
                    // TODO: Implement start workout functionality
                    toast.info("Start workout functionality will be added soon");
                  }}>
                    <Play className="h-4 w-4 mr-2" />
                    Start Workout
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => setDeleteWorkoutId(workout.id)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {workout.notes && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {workout.notes}
          </p>
        )}

        {/* Enhanced workout info */}
        <div className="space-y-3 mb-4">
          {/* Workout Tags */}
          {workout.workout_tags && workout.workout_tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {workout.workout_tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {workout.workout_tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{workout.workout_tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Difficulty Rating */}
          {workout.difficulty_rating && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Difficulty:</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full mr-1 ${
                      i < workout.difficulty_rating 
                        ? 'bg-primary' 
                        : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Workout exercises summary */}
        {workout.workout_exercises && workout.workout_exercises.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Dumbbell className="h-4 w-4" />
              {workout.workout_exercises.length} exercises
            </div>
            <div className="flex flex-wrap gap-1">
              {workout.workout_exercises.slice(0, 3).map((we, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {we.exercises?.name || 'Exercise'}
                </Badge>
              ))}
              {workout.workout_exercises.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{workout.workout_exercises.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
        
        {/* Workout metrics */}
        {(workout.total_volume_kg > 0 || workout.total_reps > 0 || workout.estimated_calories_burned) && (
          <>
            <Separator className="my-3" />
            <div className="flex gap-4 text-sm text-muted-foreground">
              {workout.total_volume_kg > 0 && (
                <span>Total weight: {workout.total_volume_kg}kg</span>
              )}
              {workout.total_reps > 0 && (
                <span>Total reps: {workout.total_reps}</span>
              )}
              {workout.estimated_calories_burned && (
                <span>Calories: {workout.estimated_calories_burned}</span>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );

  const LoadingSkeleton = () => (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Workouts</h1>
          <p className="text-muted-foreground">
            View and manage your saved workouts
          </p>
        </div>
        <Button onClick={() => router.push('/workout-builder')} className="gap-2">
          <Plus className="h-4 w-4" />
          New Workout
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search workouts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="skipped">Skipped</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SortDesc className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date_desc">Newest First</SelectItem>
                <SelectItem value="date_asc">Oldest First</SelectItem>
                <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                <SelectItem value="name_desc">Name (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Workouts Grid */}
      {workoutsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <LoadingSkeleton key={i} />
          ))}
        </div>
      ) : filteredWorkouts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkouts.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm || statusFilter !== "all" 
                ? "No workouts found" 
                : "No workouts yet"
              }
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== "all"
                ? "Try different filters or search terms"
                : "Create your first workout with AI Workout Builder"
              }
            </p>
            {!searchTerm && statusFilter === "all" && (
              <Button onClick={() => router.push('/workout-builder')} className="gap-2">
                <Plus className="h-4 w-4" />
                Create First Workout
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteWorkoutId} onOpenChange={() => setDeleteWorkoutId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this workout? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => handleDeleteWorkout(deleteWorkoutId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 