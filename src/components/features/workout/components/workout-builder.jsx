"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Plus, 
  Search, 
  Trash2, 
  GripVertical, 
  Play, 
  Save,
  Timer,
  Target,
  Dumbbell,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Edit3,
  MessageCircle,
  RefreshCw,
  Eye,
  Loader2,
  User,
  Check,
  Activity,
  Heart,
  Zap,
  Award
} from "lucide-react";

// Import real services and stores
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { useWorkoutStore } from "@/stores/workout/useWorkoutStore";
import { getExercises, getMuscleGroups, getEquipment } from "@/lib/services/exerciseService";
import { addExerciseToWorkout as addExerciseToWorkoutDB } from "@/lib/services/workoutService";

// Assessment questions structure
const assessmentSteps = [
  {
    id: 1,
    title: "Basic Information",
    subtitle: "Let's start with your personal details",
    icon: User,
    questions: [
      { id: "age", label: "Age", type: "number", required: true, min: 13, max: 100 },
      { id: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Other"], required: true },
      { id: "height", label: "Height (cm)", type: "number", required: true, min: 100, max: 250 },
      { id: "weight", label: "Weight (kg)", type: "number", required: true, min: 30, max: 300 },
    ]
  },
  {
    id: 2,
    title: "Fitness Goals",
    subtitle: "What do you want to achieve?",
    icon: Target,
    questions: [
      { 
        id: "primaryGoal", 
        label: "What's your primary fitness goal?", 
        type: "select", 
        options: ["Weight Loss", "Muscle Gain", "Strength Building", "Endurance", "General Fitness", "Athletic Performance"],
        required: true 
      },
      { 
        id: "timeCommitment", 
        label: "How many days per week can you workout?", 
        type: "select", 
        options: ["2-3 days", "3-4 days", "4-5 days", "5-6 days", "Daily"],
        required: true 
      },
      { 
        id: "sessionDuration", 
        label: "How long can each workout session be?", 
        type: "select", 
        options: ["15-30 minutes", "30-45 minutes", "45-60 minutes", "60-90 minutes", "90+ minutes"],
        required: true 
      }
    ]
  },
  {
    id: 3,
    title: "Experience & Fitness Level",
    subtitle: "Tell us about your fitness background",
    icon: Award,
    questions: [
      { 
        id: "fitnessLevel", 
        label: "How would you rate your current fitness level?", 
        type: "select", 
        options: ["Beginner (New to exercise)", "Intermediate (6+ months experience)", "Advanced (2+ years experience)", "Expert (5+ years experience)"],
        required: true 
      },
      { 
        id: "exerciseTypes", 
        label: "What types of exercise do you enjoy? (Select all that apply)", 
        type: "multiselect", 
        options: ["Weightlifting", "Cardio", "Bodyweight", "Sports", "Yoga/Flexibility", "HIIT", "Swimming", "Running"],
        required: true 
      }
    ]
  },
  {
    id: 4,
    title: "Equipment & Environment",
    subtitle: "What do you have access to?",
    icon: Dumbbell,
    questions: [
      { 
        id: "equipment", 
        label: "What equipment do you have access to?", 
        type: "multiselect", 
        options: ["Full Gym", "Home Gym with Weights", "Dumbbells Only", "Resistance Bands", "Pull-up Bar", "Bodyweight Only", "Cardio Equipment"],
        required: true 
      },
      { 
        id: "workoutLocation", 
        label: "Where do you prefer to workout?", 
        type: "select", 
        options: ["Home", "Gym", "Both", "Outdoors"],
        required: true 
      }
    ]
  },
  {
    id: 5,
    title: "Health & Limitations",
    subtitle: "Help us keep you safe and comfortable",
    icon: Heart,
    questions: [
      { 
        id: "injuries", 
        label: "Do you have any current injuries or physical limitations?", 
        type: "textarea", 
        placeholder: "Please describe any injuries, pain, or areas to avoid (e.g., lower back issues, knee problems, etc.)"
      },
      { 
        id: "medicalConditions", 
        label: "Any medical conditions we should consider?", 
        type: "textarea", 
        placeholder: "Heart conditions, diabetes, blood pressure issues, etc."
      },
      { 
        id: "additionalNotes", 
        label: "Additional preferences or notes", 
        type: "textarea", 
        placeholder: "Any other information that might help us create the perfect workout for you?"
      }
    ]
  }
];

export default function AIWorkoutBuilder() {
  // Auth & Workout Store
  const { user, profile, hasCompletedProfile } = useAuthStore();
  const { 
    currentPhase, 
    setCurrentPhase,
    assessmentData, 
    updateAssessmentData,
    builderWorkout,
    setBuilderWorkout,
    isGenerating,
    setIsGenerating,
    createNewWorkout,
    operationLoading
  } = useWorkoutStore();

  // Local state
  const [currentStep, setCurrentStep] = useState(0);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [profileDataLoaded, setProfileDataLoaded] = useState(false);
  
  // Exercise data
  const [exercises, setExercises] = useState([]);
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [exercisesLoading, setExercisesLoading] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    muscleGroup: 'all',
    equipment: 'all',
    difficulty: ''
  });

  // Auto-populate profile data
  useEffect(() => {
    if (profile && hasCompletedProfile() && !profileDataLoaded) {
      console.log('🔍 Auto-populating profile data:', profile);
      
      // Basic Information section
      const basicInfoData = {};
      
      // Calculate age from date of birth
      if (profile.date_of_birth) {
        const today = new Date();
        const birthDate = new Date(profile.date_of_birth);
        const age = Math.floor((today - birthDate) / (365.25 * 24 * 60 * 60 * 1000));
        basicInfoData.age = age;
      }
      
      // Map profile data to assessment format
      if (profile.height_cm) basicInfoData.height = profile.height_cm;
      if (profile.weight_kg) basicInfoData.weight = profile.weight_kg;
      
      // Fitness Goals section
      const fitnessGoalsData = {};
      if (profile.fitness_goals) {
        const goalMap = {
          'weight_loss': 'Weight Loss',
          'muscle_gain': 'Muscle Gain', 
          'strength': 'Strength Building',
          'endurance': 'Endurance',
          'general_fitness': 'General Fitness'
        };
        fitnessGoalsData.primaryGoal = goalMap[profile.fitness_goals] || 'General Fitness';
      }
      
      // Experience & Fitness Level section
      const experienceData = {};
      if (profile.experience_level) {
        const levelMap = {
          'beginner': 'Beginner (New to exercise)',
          'intermediate': 'Intermediate (6+ months experience)',
          'advanced': 'Advanced (2+ years experience)'
        };
        experienceData.fitnessLevel = levelMap[profile.experience_level] || 'Beginner (New to exercise)';
      }
      
      // Update assessment data with correct section structure
      updateAssessmentData('basicinformation', basicInfoData);
      updateAssessmentData('fitnessgoals', fitnessGoalsData);
      updateAssessmentData('experiencefitneslevel', experienceData);
      
      setProfileDataLoaded(true);
      
      toast.success('Profile data loaded! Review and adjust as needed.');
    }
  }, [profile, hasCompletedProfile, profileDataLoaded, updateAssessmentData]);

  // Load exercise data on component mount
  useEffect(() => {
    loadExerciseData();
  }, []);

  // Load exercises when filters change
  useEffect(() => {
    loadExercises();
  }, [selectedFilters, searchTerm]);

  const loadExerciseData = async () => {
    console.log('🔍 DEBUG: Starting to load exercise data...');
    try {
      const [muscleGroupsRes, equipmentRes] = await Promise.all([
        getMuscleGroups(),
        getEquipment()
      ]);

      if (muscleGroupsRes.data) {
        console.log('✅ DEBUG: Loaded muscle groups:', muscleGroupsRes.data.length);
        setMuscleGroups(muscleGroupsRes.data);
      }
      
      if (equipmentRes.data) {
        console.log('✅ DEBUG: Loaded equipment:', equipmentRes.data.length);
        setEquipment(equipmentRes.data);
      }

      // Also load exercises when component mounts
      await loadExercises();
    } catch (error) {
      console.error('❌ DEBUG: Error loading exercise data:', error);
      toast.error('Error loading data');
    }
  };

  const loadExercises = async () => {
    console.log('🔍 DEBUG: Starting to load exercises...');
    setExercisesLoading(true);
    try {
      const options = {
        page: 1,
        limit: 50,
        search: searchTerm
      };

      if (selectedFilters.muscleGroup && selectedFilters.muscleGroup !== 'all') {
        options.muscleGroup = selectedFilters.muscleGroup;
      }
      if (selectedFilters.equipment && selectedFilters.equipment !== 'all') {
        options.equipment = selectedFilters.equipment;
      }

      console.log('🔍 DEBUG: getExercises options:', options);
      const { data, error, count } = await getExercises(options);
      
      console.log('🔍 DEBUG: getExercises response:', { data, error, count });
      console.log('🔍 DEBUG: data length:', data?.length);
      console.log('🔍 DEBUG: first exercise:', data?.[0]);
      
      if (!error && data) {
        console.log('✅ DEBUG: Setting exercises, count:', data.length);
        setExercises(data);
      } else {
        console.error('❌ DEBUG: Error loading exercises:', error);
        setExercises([]);
      }
    } catch (error) {
      console.error('❌ DEBUG: Exception loading exercises:', error);
      setExercises([]);
    } finally {
      setExercisesLoading(false);
      console.log('🔍 DEBUG: Finished loading exercises');
    }
  };

  // Handle assessment form updates
  const handleAssessmentUpdate = (questionId, value) => {
    // Update assessment data in the proper format for the store
    const currentStepData = assessmentSteps[currentStep];
    const section = currentStepData.title.toLowerCase().replace(/[^a-z]/g, '');
    updateAssessmentData(section, { [questionId]: value });
  };

  // Validate current step
  const validateCurrentStep = () => {
    const currentStepData = assessmentSteps[currentStep];
    const requiredQuestions = currentStepData.questions.filter(q => q.required);
    const section = currentStepData.title.toLowerCase().replace(/[^a-z]/g, '');
    const sectionData = assessmentData[section] || {};
    
    for (const question of requiredQuestions) {
      const value = sectionData[question.id];
      if (!value || (Array.isArray(value) && value.length === 0)) {
        return { isValid: false, message: `${question.label} is required` };
      }
    }
    
    return { isValid: true };
  };

  // Move to next step
  const nextStep = () => {
    const validation = validateCurrentStep();
    
    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    }
    
    if (currentStep < assessmentSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generateWorkout();
    }
  };

  // Move to previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // AI Workout Generation with real data
  const generateWorkout = async () => {
    console.log('🔍 Starting workout generation...');
    console.log('🔍 Assessment Data:', assessmentData);
    console.log('🔍 Available Exercises:', exercises.length);
    
    setIsGenerating(true);
    setCurrentPhase("generating");
    
    try {
      // Check if we have exercises loaded
      if (exercises.length === 0) {
        console.error('❌ No exercises loaded! Attempting to reload...');
        await loadExercises();
        
        if (exercises.length === 0) {
          toast.error('No exercises available. Please refresh the page.');
          setCurrentPhase("assessment");
          return;
        }
      }
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate workout based on assessment data
    const workout = generateWorkoutPlan(assessmentData);
      console.log('🔍 Generated Workout:', workout);
      
      if (!workout.exercises || workout.exercises.length === 0) {
        console.error('❌ Generated workout is empty!');
        toast.error('Could not generate workout. Please try again.');
        setCurrentPhase("assessment");
        return;
      }
      
      setBuilderWorkout(workout);
    setCurrentPhase("editing");
      
      toast.success('Workout generated successfully!');
    } catch (error) {
      console.error('Error generating workout:', error);
      toast.error('Error generating workout');
      setCurrentPhase("assessment");
    } finally {
    setIsGenerating(false);
    }
  };

  // Smart workout generation logic using real exercise data
  const generateWorkoutPlan = (userData) => {
    console.log('🔍 DEBUG: Assessment data received:', userData);
    console.log('🔍 DEBUG: Available exercises count:', exercises.length);
    
    // Extract data from sections
    const basicInfo = userData.basicinformation || {};
    const fitnessGoals = userData.fitnessgoals || {};
    const experience = userData.experienceampfitnesslevel || {};
    const equipmentInfo = userData.equipmentampenvironment || {};
    
    console.log('🔍 DEBUG: Extracted sections:', {
      basicInfo,
      fitnessGoals,
      experience,
      equipmentInfo
    });
    
    const { 
      fitnessLevel = experience.fitnessLevel,
      primaryGoal = fitnessGoals.primaryGoal, 
      timeCommitment = fitnessGoals.timeCommitment, 
      equipment = equipmentInfo.equipment, 
      exerciseTypes = experience.exerciseTypes 
    } = { ...basicInfo, ...fitnessGoals, ...experience, ...equipmentInfo };
    
    console.log('🔍 DEBUG: Extracted preferences:', {
      fitnessLevel,
      primaryGoal,
      timeCommitment,
      equipment,
      exerciseTypes
    });

    // Check if we have exercises loaded
    if (exercises.length === 0) {
      console.error('❌ No exercises loaded! Cannot generate workout.');
      toast.error('No exercises available. Please try again.');
      return {
        name: 'Empty Workout',
        description: 'No exercises could be loaded.',
        exercises: [],
        estimatedDuration: 0,
        difficulty: 'Beginner',
        goal: 'General Fitness'
      };
    }
    
    // Filter exercises based on user preferences and equipment
    let availableExercises = exercises.filter(exercise => {
      // Filter by equipment access
      if (equipment?.includes("Bodyweight Only")) {
        return exercise.equipment_needed?.name === "Bodyweight" || !exercise.equipment_needed;
      }
      if (equipment?.includes("Dumbbells Only")) {
        return ["Bodyweight", "Dumbbells", "Free Weights"].includes(exercise.equipment_needed?.name);
      }
      if (equipment?.includes("Home Gym with Weights")) {
        return !["Cable Machine", "Smith Machine", "Leg Press"].includes(exercise.equipment_needed?.name);
      }
      return true; // Full gym access
    });

    console.log('🔍 DEBUG: Available exercises after equipment filter:', availableExercises.length);

    // Filter by fitness level/difficulty
    const levelMap = {
      "Beginner (New to exercise)": ["Beginner", "Easy"],
      "Intermediate (6+ months experience)": ["Beginner", "Easy", "Intermediate", "Medium"],
      "Advanced (2+ years experience)": ["Beginner", "Easy", "Intermediate", "Medium", "Advanced", "Hard"],
      "Expert (5+ years experience)": ["Beginner", "Easy", "Intermediate", "Medium", "Advanced", "Hard", "Expert"]
    };
    
    if (levelMap[fitnessLevel] && availableExercises.length > 0) {
      availableExercises = availableExercises.filter(ex => 
        levelMap[fitnessLevel].includes(ex.difficulty_level) || !ex.difficulty_level
      );
    }

    console.log('🔍 DEBUG: Available exercises after difficulty filter:', availableExercises.length);

    // If no exercises after filtering, use all exercises
    if (availableExercises.length === 0) {
      console.warn('⚠️ No exercises found after filtering, using all exercises');
      availableExercises = exercises;
    }

    // Ensure muscle group diversity
    const muscleGroups = [...new Set(availableExercises.map(ex => ex.muscle_groups?.name).filter(Boolean))];
    let selectedExercises = [];
    
    // Try to get at least one exercise per major muscle group
    const majorGroups = muscleGroups.slice(0, 6);
    majorGroups.forEach(group => {
      const groupExercises = availableExercises.filter(ex => ex.muscle_groups?.name === group);
      if (groupExercises.length > 0) {
        selectedExercises.push(groupExercises[0]);
      }
    });

    // Fill remaining slots with popular exercises
    const remainingSlots = Math.max(0, 6 - selectedExercises.length);
    const remainingExercises = availableExercises
      .filter(ex => !selectedExercises.find(sel => sel.id === ex.id))
      .slice(0, remainingSlots);
    
    selectedExercises = [...selectedExercises, ...remainingExercises];

    // If still no exercises, take first 6 from available
    if (selectedExercises.length === 0) {
      selectedExercises = availableExercises.slice(0, 6);
    }

    console.log('🔍 DEBUG: Selected exercises:', selectedExercises.length);

    // Map exercises to workout format with goal-specific parameters
    const workoutExercises = selectedExercises.map((exercise, index) => ({
      ...exercise,
      workoutId: Date.now() + index,
      sets: primaryGoal === "Strength Building" ? 5 : primaryGoal === "Endurance" ? 2 : 3,
      reps: primaryGoal === "Strength Building" ? "5-6" : primaryGoal === "Endurance" ? "12-15" : "8-12",
      weight: exercise.equipment_needed?.name === "Bodyweight" ? 0 : 20,
      restTime: primaryGoal === "Strength Building" ? 120 : primaryGoal === "Endurance" ? 30 : 60,
      muscleGroup: exercise.muscle_groups?.name || "Full Body",
      equipment: exercise.equipment_needed?.name || "Bodyweight"
    }));

    const result = {
      name: `AI ${primaryGoal || 'Fitness'} Plan`,
      description: `Personalized workout plan based on your ${fitnessLevel?.toLowerCase() || 'fitness level'} and ${primaryGoal?.toLowerCase() || 'fitness'} goals.`,
      exercises: workoutExercises,
      estimatedDuration: workoutExercises.length * 8, // rough estimate
      difficulty: fitnessLevel,
      goal: primaryGoal,
      daysPerWeek: timeCommitment?.includes("2-3") ? 3 : timeCommitment?.includes("3-4") ? 4 : 5
    };

    console.log('🔍 DEBUG: Generated workout:', result);
    return result;
  };

  // Handle chat with AI
  const sendMessage = () => {
    if (!currentMessage.trim()) return;
    
    const userMessage = { type: "user", content: currentMessage, timestamp: Date.now() };
    const aiResponse = { 
      type: "ai", 
      content: "I understand your request! Let me help you modify your workout plan. Would you like me to adjust the intensity, swap exercises, or change the focus?",
      timestamp: Date.now() + 1
    };
    
    setChatMessages(prev => [...prev, userMessage, aiResponse]);
    setCurrentMessage("");
  };

  // Remove exercise from workout
  const removeExercise = (workoutId) => {
    setBuilderWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.filter(ex => ex.workoutId !== workoutId)
    }));
  };

  // Update exercise parameters
  const updateExercise = (workoutId, field, value) => {
    setBuilderWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex => 
        ex.workoutId === workoutId ? { ...ex, [field]: value } : ex
      )
    }));
  };

  // Add exercise from database
  const addExerciseToBuilder = (exercise) => {
    const workoutExercise = {
      ...exercise,
      workoutId: Date.now(),
      sets: 3,
      reps: 12,
      weight: exercise.equipment_needed?.name === "Bodyweight" ? 0 : 20, // Fixed: was exercise.equipment
      restTime: 60,
      muscleGroup: exercise.muscle_groups?.name || "Full Body",
      equipment: exercise.equipment_needed?.name || "Bodyweight"
    };
    setBuilderWorkout(prev => ({
      ...prev,
      exercises: [...(prev?.exercises || []), workoutExercise]
    }));
  };

  // Regenerate workout
  const regenerateWorkout = () => {
    generateWorkout();
  };

  // Save workout to database
  const saveWorkout = async () => {
    if (!user?.id || !builderWorkout) {
      toast.error('No user or workout to save');
      return;
    }

    try {
      // Step 1: Create the workout
      const workoutData = {
        name: builderWorkout.name,
        notes: builderWorkout.description, // Changed from description to notes to match database schema
        workout_date: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD for date field
        total_duration_minutes: builderWorkout.estimatedDuration, // Changed from estimated_duration
        status: 'planned' // Default status for new workouts
      };

      console.log('🔍 Creating workout with data:', workoutData);
      const result = await createNewWorkout(user.id, workoutData);
      
      if (result.success && result.data) {
        console.log('✅ Workout created successfully:', result.data);
        
        // Step 2: Add exercises to the workout
        if (builderWorkout.exercises && builderWorkout.exercises.length > 0) {
          console.log('🔍 Adding exercises to workout...');
          
          for (let i = 0; i < builderWorkout.exercises.length; i++) {
            const exercise = builderWorkout.exercises[i];
            
            const exerciseData = {
              order_index: i + 1,
              notes: `${exercise.sets} sets x ${exercise.reps} reps` + 
                     (exercise.weight ? ` @ ${exercise.weight}kg` : '') +
                     (exercise.restTime ? ` | Rest: ${exercise.restTime}s` : '')
            };
            
            console.log(`🔍 Adding exercise ${i + 1}:`, exercise.name, exerciseData);
            const exerciseResult = await addExerciseToWorkoutDB(result.data.id, exercise.id, exerciseData);
            
            if (exerciseResult && !exerciseResult.error) {
              console.log(`✅ Exercise ${exercise.name} added successfully`);
            } else {
              console.warn(`⚠️ Failed to add exercise ${exercise.name}:`, exerciseResult?.error || 'Unknown error');
            }
          }
        }
        
        toast.success('Workout saved successfully!');
        setCurrentPhase("preview");
      } else {
        console.error('❌ Error creating workout:', result.error);
        toast.error('Error creating workout: ' + (result.error?.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('❌ Error saving workout:', error);
      toast.error('Error saving workout: ' + error.message);
    }
  };

  // Update exercise search and filtering
  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({
      muscleGroup: 'all',
      equipment: 'all',
      difficulty: ''
    });
    setSearchTerm('');
  };

  // Assessment Phase
  if (currentPhase === "assessment") {
    const currentStepData = assessmentSteps[currentStep];
    const progress = ((currentStep + 1) / assessmentSteps.length) * 100;
    const section = currentStepData.title.toLowerCase().replace(/[^a-z]/g, '');
    const sectionData = assessmentData[section] || {};
    const StepIcon = currentStepData.icon;

    return (
      <div className="max-w-7xl mx-auto space-y-6 p-4">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div className="p-2 rounded-full bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">AI Workout Builder</h1>
              <p className="text-muted-foreground">Create your personalized fitness journey</p>
            </div>
          </div>
          
          {/* Profile Auto-populate Indicator */}
          {profileDataLoaded && (
            <div className="flex items-center justify-center gap-2 py-2 px-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-700 dark:text-green-400 font-medium">
                Profile data loaded - review and adjust as needed
              </span>
            </div>
          )}

          {/* Progress Section */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-3 max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {assessmentSteps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index < currentStep ? 'bg-primary' : 
                        index === currentStep ? 'bg-primary/70' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  Step {currentStep + 1} of {assessmentSteps.length}
                </span>
              </div>
              <span className="text-sm font-semibold text-primary">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Main Content Card */}
        <Card className="border shadow-md">
          <CardHeader className="space-y-2 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <StepIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">{currentStepData.title}</CardTitle>
                <p className="text-muted-foreground text-sm">{currentStepData.subtitle}</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-0">
            <div className="grid gap-5">
              {currentStepData.questions.map((question, index) => (
                <div key={question.id} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                      {index + 1}
                    </div>
                    <Label className="text-sm font-semibold text-foreground">
                      {question.label}
                      {question.required && <span className="text-destructive ml-1">*</span>}
                    </Label>
                  </div>
                  
                  {question.type === "number" && (
                    <Input
                      type="number"
                      min={question.min}
                      max={question.max}
                      value={sectionData[question.id] || ""}
                      onChange={(e) => handleAssessmentUpdate(question.id, e.target.value)}
                      placeholder={question.placeholder}
                      className="h-10 max-w-md"
                    />
                  )}
                  
                  {question.type === "select" && (
                    <Select
                      value={sectionData[question.id] || ""}
                      onValueChange={(value) => handleAssessmentUpdate(question.id, value)}
                    >
                      <SelectTrigger className="h-10 max-w-md">
                        <SelectValue placeholder={question.placeholder || "Select an option..."} />
                      </SelectTrigger>
                      <SelectContent>
                        {question.options.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  
                  {question.type === "multiselect" && (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
                      {question.options.map((option) => (
                        <div 
                          key={option} 
                          className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-all hover:bg-muted/50 ${
                            (sectionData[question.id] || []).includes(option) 
                              ? 'border-primary bg-primary/5' 
                              : 'border-muted-foreground/20'
                          }`}
                          onClick={() => {
                            const current = sectionData[question.id] || [];
                            const updated = current.includes(option)
                              ? current.filter(item => item !== option)
                              : [...current, option];
                            handleAssessmentUpdate(question.id, updated);
                          }}
                        >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                            (sectionData[question.id] || []).includes(option)
                              ? 'border-primary bg-primary'
                              : 'border-muted-foreground/30'
                          }`}>
                            {(sectionData[question.id] || []).includes(option) && (
                              <Check className="h-2.5 w-2.5 text-white" />
                            )}
                          </div>
                          <span className="text-sm font-medium">{option}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {question.type === "textarea" && (
                    <Textarea
                      value={sectionData[question.id] || ""}
                      onChange={(e) => handleAssessmentUpdate(question.id, e.target.value)}
                      placeholder={question.placeholder}
                      rows={3}
                      className="resize-none max-w-2xl"
                    />
                  )}
                </div>
              ))}
            </div>
            
            {/* Navigation */}
            <div className="flex justify-between items-center pt-6 border-t">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="gap-2 h-10 px-4"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <div className="flex items-center gap-3">
                {currentStep === assessmentSteps.length - 1 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Zap className="h-4 w-4" />
                    Ready to generate!
                  </div>
                )}
                <Button onClick={nextStep} className="gap-2 h-10 px-4">
                  {currentStep === assessmentSteps.length - 1 ? (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate Workout
                    </>
                  ) : (
                    <>
                      Continue
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Generating Phase
  if (currentPhase === "generating") {
    return (
      <div className="max-w-5xl mx-auto space-y-6 p-4">
        <Card className="border shadow-lg bg-gradient-to-br from-primary/5 via-background to-primary/5">
          <CardContent className="text-center space-y-6 py-12">
            {/* Animated Icon */}
            <div className="relative">
              <div className="absolute inset-0 animate-ping">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/20"></div>
              </div>
              <div className="relative animate-spin">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
              </div>
            </div>

            {/* Header Text */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                AI is Creating Your Perfect Workout
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Analyzing your fitness profile and generating a personalized workout plan
              </p>
            </div>

            {/* Processing Steps */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-xs">Analyzing Profile</div>
                    <div className="text-xs text-muted-foreground">Processing your data</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-muted">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Dumbbell className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-xs text-muted-foreground">Selecting Exercises</div>
                    <div className="text-xs text-muted-foreground">Finding the best fit</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-muted">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-xs text-muted-foreground">Building Plan</div>
                    <div className="text-xs text-muted-foreground">Creating your routine</div>
                  </div>
                </div>
              </div>

              {/* Animated Dots */}
              <div className="flex justify-center space-x-1">
                <div className="animate-pulse h-2 w-2 bg-primary rounded-full"></div>
                <div className="animate-pulse h-2 w-2 bg-primary rounded-full animation-delay-75"></div>
                <div className="animate-pulse h-2 w-2 bg-primary rounded-full animation-delay-150"></div>
              </div>

              {/* Fun Facts */}
              <div className="bg-muted/30 rounded-lg p-4 max-w-xl mx-auto">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-primary text-sm">Did you know?</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Personalized workout plans are 3x more effective than generic routines. 
                  Our AI considers your goals, experience level, and equipment to create the perfect fit.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Editing Phase
  if (currentPhase === "editing" && builderWorkout) {
    const filteredExercises = exercises.filter(exercise => {
      // Search filter
      const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Not already in workout - check by original exercise ID, not workoutId
      const notInWorkout = !builderWorkout.exercises || !builderWorkout.exercises.some(ex => ex.id === exercise.id);
      
      // Muscle group filter
      const matchesMuscleGroup = !selectedFilters.muscleGroup || 
        selectedFilters.muscleGroup === 'all' ||
        exercise.muscle_groups?.name === selectedFilters.muscleGroup;
      
      // Equipment filter
      const matchesEquipment = !selectedFilters.equipment || 
        selectedFilters.equipment === 'all' ||
        exercise.equipment_needed?.name === selectedFilters.equipment;
      
      return matchesSearch && notInWorkout && matchesMuscleGroup && matchesEquipment;
    });

    return (
      <div className="max-w-full mx-auto space-y-4 p-4">
        {/* Enhanced Header with Summary */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-full bg-primary/10">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight">
                    {builderWorkout.name}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {builderWorkout.description}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={regenerateWorkout} className="gap-2 h-8 px-3 text-sm">
                <RefreshCw className="h-3 w-3" />
                Regenerate
              </Button>
              <Button variant="outline" onClick={() => setCurrentPhase("preview")} className="gap-2 h-8 px-3 text-sm">
                <Eye className="h-3 w-3" />
                Preview
              </Button>
              <Button 
                onClick={saveWorkout} 
                disabled={operationLoading}
                className="gap-2 h-8 px-4 text-sm"
              >
                {operationLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                <Save className="h-3 w-3" />
                )}
                Save Workout
              </Button>
            </div>
          </div>

          {/* Workout Summary - moved to header */}
          <div className="grid grid-cols-4 gap-4 bg-background/50 rounded-lg p-4 border">
            <div className="text-center space-y-1">
              <div className="flex items-center justify-center gap-1">
                <Dumbbell className="h-4 w-4 text-primary" />
                <p className="text-lg font-bold text-primary">{(builderWorkout.exercises || []).length}</p>
              </div>
              <p className="text-xs font-medium text-muted-foreground">Exercises</p>
            </div>
            <div className="text-center space-y-1">
              <div className="flex items-center justify-center gap-1">
                <Target className="h-4 w-4 text-primary" />
                <p className="text-lg font-bold text-primary">
                  {(builderWorkout.exercises || []).reduce((sum, ex) => sum + ex.sets, 0)}
                </p>
              </div>
              <p className="text-xs font-medium text-muted-foreground">Total Sets</p>
            </div>
            <div className="text-center space-y-1">
              <div className="flex items-center justify-center gap-1">
                <Timer className="h-4 w-4 text-primary" />
                <p className="text-lg font-bold text-primary">{builderWorkout.estimatedDuration}</p>
              </div>
              <p className="text-xs font-medium text-muted-foreground">Minutes</p>
            </div>
            <div className="text-center space-y-1">
              <div className="flex items-center justify-center gap-1">
                <Activity className="h-4 w-4 text-primary" />
                <p className="text-lg font-bold text-primary">
                  {new Set((builderWorkout.exercises || []).map(e => e.muscleGroup)).size}
                </p>
              </div>
              <p className="text-xs font-medium text-muted-foreground">Muscle Groups</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-12">
          {/* AI Chat Assistant */}
          <div className="lg:col-span-3">
            <Card className="h-[550px] flex flex-col border shadow-md rounded-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 py-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <div className="p-1 rounded-full bg-primary/10">
                    <MessageCircle className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">AI Workout Coach</div>
                    <p className="text-xs text-muted-foreground font-normal">Get suggestions</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-3 space-y-3 overflow-hidden">
                <div className="flex-1 min-h-0 space-y-2 overflow-y-auto pr-1 max-h-[400px]">
                  <div className="p-2 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-1 mb-1">
                      <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                        <Sparkles className="h-2 w-2 text-primary" />
                      </div>
                      <p className="font-semibold text-primary text-xs">AI Coach</p>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed word-break">
                      Your workout is ready! I can help modify exercises, adjust intensity, or optimize for your goals.
                    </p>
                  </div>
                  {chatMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded-lg max-w-full ${
                        message.type === "user"
                          ? "bg-primary text-primary-foreground ml-3"
                          : "bg-muted/50 mr-3 border"
                      }`}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <div className={`w-3 h-3 rounded-full ${
                          message.type === "user" ? "bg-primary-foreground/20" : "bg-primary/20"
                        } flex items-center justify-center`}>
                          {message.type === "user" ? (
                            <User className="h-1.5 w-1.5" />
                          ) : (
                            <Sparkles className="h-1.5 w-1.5 text-primary" />
                          )}
                        </div>
                        <p className="font-semibold text-xs truncate">
                          {message.type === "user" ? "You" : "AI Coach"}
                        </p>
                      </div>
                      <p className={`text-xs leading-relaxed break-all hyphens-auto max-w-full overflow-hidden ${message.type === "user" ? "" : "text-muted-foreground"}`}>
                        {message.content}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 pt-2 border-t">
                  <div className="flex gap-1">
                    <Input
                      placeholder="Ask me to modify..."
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                      className="text-xs h-7 text-sm"
                    />
                    <Button size="sm" onClick={sendMessage} className="h-7 px-2">
                      <MessageCircle className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Try: "Make it harder" or "More cardio"
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current Workout */}
          <div className="lg:col-span-6">
            <Card className="h-[550px] flex flex-col border shadow-md rounded-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-full bg-primary/10">
                      <Edit3 className="h-3 w-3 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold">Your Workout Plan</CardTitle>
                      <p className="text-xs text-muted-foreground">Customize exercises</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="px-2 py-0.5 text-xs">
                    {(builderWorkout.exercises || []).length} exercises
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-3 overflow-hidden">
                <div className="h-full space-y-3 overflow-y-auto pr-2">
                  {(builderWorkout.exercises || []).map((exercise, index) => (
                    <div 
                      key={exercise.workoutId} 
                      className="group border rounded-lg p-3 space-y-3 bg-gradient-to-r from-muted/30 to-muted/10 hover:from-muted/50 hover:to-muted/20 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-1 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors">
                            <GripVertical className="h-3 w-3 text-primary cursor-move" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm truncate">{exercise.name}</span>
                              <Badge variant="outline" className="text-xs shrink-0">
                                #{index + 1}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground font-medium truncate">
                              {exercise.muscleGroup} • {exercise.equipment}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeExercise(exercise.workoutId)}
                          className="h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive rounded-lg shrink-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-4 gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Sets</Label>
                          <Input
                            type="number"
                            value={exercise.sets}
                            onChange={(e) => updateExercise(exercise.workoutId, 'sets', parseInt(e.target.value))}
                            className="h-7 text-center text-sm font-semibold border focus:border-primary"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Reps</Label>
                          <Input
                            type="number"
                            value={exercise.reps}
                            onChange={(e) => updateExercise(exercise.workoutId, 'reps', parseInt(e.target.value))}
                            className="h-7 text-center text-sm font-semibold border focus:border-primary"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Weight</Label>
                          <Input
                            type="number"
                            value={exercise.weight}
                            onChange={(e) => updateExercise(exercise.workoutId, 'weight', parseInt(e.target.value))}
                            className="h-7 text-center text-sm font-semibold border focus:border-primary"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Rest</Label>
                          <Input
                            type="number"
                            value={exercise.restTime}
                            onChange={(e) => updateExercise(exercise.workoutId, 'restTime', parseInt(e.target.value))}
                            className="h-7 text-center text-sm font-semibold border focus:border-primary"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Exercise Library */}
          <div className="lg:col-span-3">
            <Card className="h-[550px] flex flex-col border shadow-md rounded-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 py-3">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-full bg-primary/10">
                    <Dumbbell className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold">Exercise Library</CardTitle>
                    <p className="text-xs text-muted-foreground">Add to workout</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-3 space-y-3 overflow-hidden">
                {/* Enhanced Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                  <Input
                    placeholder="Search exercises..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 h-7 text-sm border focus:border-primary"
                  />
                </div>

                {/* Enhanced Filters - On Same Row */}
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Muscle Group</label>
                      <Select
                        value={selectedFilters.muscleGroup}
                        onValueChange={(value) => handleFilterChange('muscleGroup', value)}
                      >
                        <SelectTrigger className="h-7 text-xs border focus:border-primary">
                          <SelectValue placeholder="All Groups" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Muscle Groups</SelectItem>
                          {muscleGroups.map(group => (
                            <SelectItem key={group.id} value={group.name}>
                              {group.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Equipment</label>
                      <Select
                        value={selectedFilters.equipment}
                        onValueChange={(value) => handleFilterChange('equipment', value)}
                      >
                        <SelectTrigger className="h-7 text-xs border focus:border-primary">
                          <SelectValue placeholder="All Equipment" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Equipment</SelectItem>
                          {equipment.map(eq => (
                            <SelectItem key={eq.id} value={eq.name}>
                              {eq.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {(selectedFilters.muscleGroup !== 'all' || selectedFilters.equipment !== 'all' || searchTerm) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="h-6 text-xs w-full hover:bg-muted"
                    >
                      <RefreshCw className="h-2 w-2 mr-1" />
                      Clear Filters
                    </Button>
                  )}
                </div>

                {/* Enhanced Exercise List */}
                <div className="flex-1 space-y-2 overflow-y-auto">
                  {exercisesLoading ? (
                    <div className="flex flex-col items-center justify-center py-8 space-y-2">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <p className="text-xs text-muted-foreground">Loading exercises...</p>
                    </div>
                  ) : filteredExercises.length === 0 ? (
                    <div className="text-center py-8 space-y-2">
                      <div className="p-3 rounded-full bg-muted/30 w-fit mx-auto">
                        <Search className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-muted-foreground text-sm">No exercises found</p>
                        <p className="text-xs text-muted-foreground/70">Try adjusting filters</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between pb-1">
                        <span className="text-xs font-medium text-muted-foreground">
                          {filteredExercises.length} available
                        </span>
                      </div>
                      {filteredExercises.map((exercise) => (
                        <div
                          key={exercise.id}
                          className="group p-3 border rounded-lg hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-center gap-1">
                                <p className="font-semibold text-xs truncate">{exercise.name}</p>
                                <Badge variant="outline" className="text-xs shrink-0">
                                  {exercise.muscle_groups?.name || 'Full Body'}
                                </Badge>
                              </div>
                              {exercise.equipment_needed?.name && (
                                <p className="text-xs text-muted-foreground font-medium truncate">
                                  {exercise.equipment_needed.name}
                                </p>
                              )}
                            </div>
                            <Button
                              size="sm"
                              onClick={() => addExerciseToBuilder(exercise)}
                              className="gap-1 h-7 px-2 shrink-0 group-hover:bg-primary group-hover:text-primary-foreground text-xs"
                            >
                              <Plus className="h-3 w-3" />
                              Add
                            </Button>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Preview Phase
  if (currentPhase === "preview" && builderWorkout) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Workout Preview</h1>
            <p className="text-muted-foreground">Review your workout before starting</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setCurrentPhase("editing")} className="gap-2">
              <Edit3 className="h-4 w-4" />
              Edit Workout
            </Button>
              <Button 
                onClick={() => toast.success('Starting workout!')}
                className="gap-2"
              >
              <Play className="h-4 w-4" />
              Start Workout
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-6 w-6" />
              {builderWorkout.name}
            </CardTitle>
            <p className="text-muted-foreground">{builderWorkout.description}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Workout Overview */}
            <div className="grid grid-cols-4 gap-4 p-4 bg-accent/50 rounded-lg">
              <div className="text-center">
                <p className="text-2xl font-bold">{builderWorkout.exercises.length}</p>
                <p className="text-sm text-muted-foreground">Exercises</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {new Set(builderWorkout.exercises.map(e => e.muscleGroup)).size}
                </p>
                <p className="text-sm text-muted-foreground">Muscle Groups</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{builderWorkout.daysPerWeek || 4}</p>
                <p className="text-sm text-muted-foreground">Days/Week</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{builderWorkout.estimatedDuration}</p>
                <p className="text-sm text-muted-foreground">Minutes</p>
              </div>
            </div>

            {/* Exercise List */}
            <div className="space-y-4">
              {builderWorkout.exercises.map((exercise, index) => (
                <div
                  key={exercise.workoutId || index}
                  className="p-4 border rounded-lg bg-muted/30"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">{exercise.name}</h4>
                    <Badge variant="outline">{exercise.muscleGroup}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {exercise.sets} sets × {exercise.reps} reps — {exercise.equipment}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}