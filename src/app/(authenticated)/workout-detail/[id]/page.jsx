import WorkoutDetail from "@/components/features/workout/components/workout-detail";

export default function WorkoutDetailPage({ params }) {
  return <WorkoutDetail workoutId={params.id} />;
} 