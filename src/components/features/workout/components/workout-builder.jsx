"use client";
import { useState } from "react";
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
  Eye
} from "lucide-react";

// Sample exercise database
const exerciseDatabase = [
  { id: 1, name: "Push-ups", muscleGroup: "Chest", equipment: "Bodyweight", difficulty: "Beginner" },
  { id: 2, name: "Pull-ups", muscleGroup: "Back", equipment: "Pull-up bar", difficulty: "Intermediate" },
  { id: 3, name: "Squats", muscleGroup: "Legs", equipment: "Bodyweight", difficulty: "Beginner" },
  { id: 4, name: "Bench Press", muscleGroup: "Chest", equipment: "Barbell", difficulty: "Intermediate" },
  { id: 5, name: "Deadlift", muscleGroup: "Back", equipment: "Barbell", difficulty: "Advanced" },
  { id: 6, name: "Shoulder Press", muscleGroup: "Shoulders", equipment: "Dumbbells", difficulty: "Beginner" },
  { id: 7, name: "Bicep Curls", muscleGroup: "Arms", equipment: "Dumbbells", difficulty: "Beginner" },
  { id: 8, name: "Planks", muscleGroup: "Core", equipment: "Bodyweight", difficulty: "Beginner" },
  { id: 9, name: "Lunges", muscleGroup: "Legs", equipment: "Bodyweight", difficulty: "Beginner" },
  { id: 10, name: "Mountain Climbers", muscleGroup: "Core", equipment: "Bodyweight", difficulty: "Intermediate" },
  { id: 11, name: "Burpees", muscleGroup: "Full Body", equipment: "Bodyweight", difficulty: "Advanced" },
  { id: 12, name: "Lat Pulldowns", muscleGroup: "Back", equipment: "Cable Machine", difficulty: "Beginner" },
];

// Assessment questions structure
const assessmentSteps = [
  {
    id: 1,
    title: "Basic Information",
    questions: [
      { id: "age", label: "Age", type: "number", required: true },
      { id: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Other"], required: true },
      { id: "height", label: "Height (cm)", type: "number", required: true },
      { id: "weight", label: "Weight (kg)", type: "number", required: true },
    ]
  },
  {
    id: 2,
    title: "Fitness Goals",
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
  const [currentPhase, setCurrentPhase] = useState("assessment"); // assessment, generating, editing, preview
  const [currentStep, setCurrentStep] = useState(0);
  const [assessmentData, setAssessmentData] = useState({});
  const [generatedWorkout, setGeneratedWorkout] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Handle assessment form updates
  const updateAssessmentData = (questionId, value) => {
    setAssessmentData(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Validate current step
  const validateCurrentStep = () => {
    const currentStepData = assessmentSteps[currentStep];
    const requiredQuestions = currentStepData.questions.filter(q => q.required);
    
    for (const question of requiredQuestions) {
      const value = assessmentData[question.id];
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

  // AI Workout Generation (Simulated)
  const generateWorkout = async () => {
    setIsGenerating(true);
    setCurrentPhase("generating");
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate workout based on assessment data
    const workout = generateWorkoutPlan(assessmentData);
    setGeneratedWorkout(workout);
    setCurrentPhase("editing");
    setIsGenerating(false);
  };

  // Simulated AI workout generation logic
  const generateWorkoutPlan = (userData) => {
    const { fitnessLevel, primaryGoal, timeCommitment, equipment, exerciseTypes } = userData;
    
    // Filter exercises based on user preferences and equipment
    let availableExercises = exerciseDatabase.filter(exercise => {
      // Filter by equipment
      if (equipment?.includes("Bodyweight Only")) {
        return exercise.equipment === "Bodyweight";
      }
      if (equipment?.includes("Dumbbells Only")) {
        return exercise.equipment === "Bodyweight" || exercise.equipment === "Dumbbells";
      }
      return true; // Full gym access
    });

    // Filter by fitness level
    const levelMap = {
      "Beginner (New to exercise)": ["Beginner"],
      "Intermediate (6+ months experience)": ["Beginner", "Intermediate"],
      "Advanced (2+ years experience)": ["Beginner", "Intermediate", "Advanced"],
      "Expert (5+ years experience)": ["Beginner", "Intermediate", "Advanced"]
    };
    
    if (levelMap[fitnessLevel]) {
      availableExercises = availableExercises.filter(ex => 
        levelMap[fitnessLevel].includes(ex.difficulty)
      );
    }

    // Select exercises for workout
    const selectedExercises = availableExercises.slice(0, 6).map((exercise, index) => ({
      ...exercise,
      workoutId: Date.now() + index,
      sets: primaryGoal === "Strength Building" ? 5 : primaryGoal === "Endurance" ? 2 : 3,
      reps: primaryGoal === "Strength Building" ? 6 : primaryGoal === "Endurance" ? 15 : 12,
      weight: exercise.equipment === "Bodyweight" ? 0 : 20,
      restTime: primaryGoal === "Strength Building" ? 120 : primaryGoal === "Endurance" ? 30 : 60
    }));

    return {
      name: `AI Generated ${primaryGoal} Workout`,
      description: `Personalized workout plan based on your ${fitnessLevel.toLowerCase()} level and ${primaryGoal.toLowerCase()} goals.`,
      exercises: selectedExercises,
      estimatedDuration: selectedExercises.length * 8, // rough estimate
      difficulty: fitnessLevel,
      goal: primaryGoal
    };
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
    setGeneratedWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.filter(ex => ex.workoutId !== workoutId)
    }));
  };

  // Update exercise parameters
  const updateExercise = (workoutId, field, value) => {
    setGeneratedWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex => 
        ex.workoutId === workoutId ? { ...ex, [field]: value } : ex
      )
    }));
  };

  // Add exercise from database
  const addExerciseToWorkout = (exercise) => {
    const workoutExercise = {
      ...exercise,
      workoutId: Date.now(),
      sets: 3,
      reps: 12,
      weight: exercise.equipment === "Bodyweight" ? 0 : 20,
      restTime: 60
    };
    setGeneratedWorkout(prev => ({
      ...prev,
      exercises: [...prev.exercises, workoutExercise]
    }));
  };

  // Regenerate workout
  const regenerateWorkout = () => {
    generateWorkout();
  };

  // Assessment Phase
  if (currentPhase === "assessment") {
    const currentStepData = assessmentSteps[currentStep];
    const progress = ((currentStep + 1) / assessmentSteps.length) * 100;

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">AI Workout Builder</h1>
          </div>
          <p className="text-muted-foreground">
            Let's create the perfect workout plan tailored just for you
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {currentStep + 1} of {assessmentSteps.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {currentStepData.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStepData.questions.map((question) => (
              <div key={question.id} className="space-y-3">
                <Label className="text-sm font-medium">
                  {question.label}
                  {question.required && <span className="text-destructive ml-1">*</span>}
                </Label>
                
                {question.type === "number" && (
                  <Input
                    type="number"
                    value={assessmentData[question.id] || ""}
                    onChange={(e) => updateAssessmentData(question.id, e.target.value)}
                    placeholder={question.placeholder}
                  />
                )}
                
                {question.type === "select" && (
                  <Select
                    value={assessmentData[question.id] || ""}
                    onValueChange={(value) => updateAssessmentData(question.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option..." />
                    </SelectTrigger>
                    <SelectContent>
                      {question.options.map(option => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                
                {question.type === "multiselect" && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Select multiple options:</p>
                    <div className="flex flex-wrap gap-2">
                      {question.options.map(option => (
                        <Badge
                          key={option}
                          variant={assessmentData[question.id]?.includes(option) ? "default" : "outline"}
                          className="cursor-pointer transition-colors"
                          onClick={() => {
                            const current = assessmentData[question.id] || [];
                            const updated = current.includes(option)
                              ? current.filter(item => item !== option)
                              : [...current, option];
                            updateAssessmentData(question.id, updated);
                          }}
                        >
                          {option}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {question.type === "textarea" && (
                  <Textarea
                    value={assessmentData[question.id] || ""}
                    onChange={(e) => updateAssessmentData(question.id, e.target.value)}
                    placeholder={question.placeholder}
                    rows={3}
                  />
                )}
              </div>
            ))}
            
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <Button onClick={nextStep} className="gap-2">
                {currentStep === assessmentSteps.length - 1 ? (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Workout
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Generating Phase
  if (currentPhase === "generating") {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6 py-20">
        <div className="space-y-4">
          <div className="animate-spin mx-auto">
            <Sparkles className="h-16 w-16 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">AI is Creating Your Perfect Workout</h2>
          <p className="text-muted-foreground">
            Analyzing your fitness profile and generating a personalized workout plan...
          </p>
          <div className="flex justify-center space-x-1">
            <div className="animate-pulse h-2 w-2 bg-primary rounded-full"></div>
            <div className="animate-pulse h-2 w-2 bg-primary rounded-full delay-75"></div>
            <div className="animate-pulse h-2 w-2 bg-primary rounded-full delay-150"></div>
          </div>
        </div>
      </div>
    );
  }

  // Editing Phase
  if (currentPhase === "editing" && generatedWorkout) {
    const filteredExercises = exerciseDatabase.filter(exercise =>
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !generatedWorkout.exercises.some(ex => ex.id === exercise.id)
    );

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Sparkles className="h-6 w-6" />
              {generatedWorkout.name}
            </h1>
            <p className="text-muted-foreground">
              {generatedWorkout.description}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={regenerateWorkout} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Regenerate
            </Button>
            <Button variant="outline" onClick={() => setCurrentPhase("preview")} className="gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button className="gap-2">
              <Save className="h-4 w-4" />
              Save Workout
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* AI Chat Assistant */}
          <div className="lg:col-span-1">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MessageCircle className="h-4 w-4" />
                  AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col space-y-4">
                <div className="flex-1 space-y-3 overflow-y-auto">
                  <div className="text-sm p-3 bg-accent/50 rounded-lg">
                    <p className="font-medium text-accent-foreground">AI Coach:</p>
                    <p className="text-muted-foreground mt-1">
                      Your workout is ready! Feel free to ask me to modify anything - intensity, exercises, duration, or focus areas.
                    </p>
                  </div>
                  {chatMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`text-sm p-3 rounded-lg ${
                        message.type === "user"
                          ? "bg-primary text-primary-foreground ml-2"
                          : "bg-accent/50 mr-2"
                      }`}
                    >
                      <p className="font-medium">
                        {message.type === "user" ? "You:" : "AI Coach:"}
                      </p>
                      <p className={message.type === "user" ? "" : "text-muted-foreground mt-1"}>
                        {message.content}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask AI to modify your workout..."
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    className="text-sm"
                  />
                  <Button size="sm" onClick={sendMessage}>
                    Send
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current Workout */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit3 className="h-5 w-5" />
                  Your Workout Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {generatedWorkout.exercises.map((exercise, index) => (
                  <div key={exercise.workoutId} className="border rounded-lg p-4 space-y-3 bg-card">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                        <div>
                          <span className="font-medium">{exercise.name}</span>
                          <p className="text-sm text-muted-foreground">
                            {exercise.muscleGroup} • {exercise.equipment}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeExercise(exercise.workoutId)}
                        className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-sm">
                      <div>
                        <Label className="text-xs text-muted-foreground">Sets</Label>
                        <Input
                          type="number"
                          value={exercise.sets}
                          onChange={(e) => updateExercise(exercise.workoutId, 'sets', parseInt(e.target.value))}
                          className="h-8 text-center"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Reps</Label>
                        <Input
                          type="number"
                          value={exercise.reps}
                          onChange={(e) => updateExercise(exercise.workoutId, 'reps', parseInt(e.target.value))}
                          className="h-8 text-center"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Weight (kg)</Label>
                        <Input
                          type="number"
                          value={exercise.weight}
                          onChange={(e) => updateExercise(exercise.workoutId, 'weight', parseInt(e.target.value))}
                          className="h-8 text-center"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Rest (sec)</Label>
                        <Input
                          type="number"
                          value={exercise.restTime}
                          onChange={(e) => updateExercise(exercise.workoutId, 'restTime', parseInt(e.target.value))}
                          className="h-8 text-center"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Workout Summary */}
                <Separator />
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{generatedWorkout.exercises.length}</p>
                    <p className="text-muted-foreground">Exercises</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      {generatedWorkout.exercises.reduce((sum, ex) => sum + ex.sets, 0)}
                    </p>
                    <p className="text-muted-foreground">Total Sets</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{generatedWorkout.estimatedDuration}</p>
                    <p className="text-muted-foreground">Minutes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Exercise Library */}
          <div className="lg:col-span-1">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Dumbbell className="h-4 w-4" />
                  Add Exercises
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search exercises..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex-1 space-y-2 overflow-y-auto">
                  {filteredExercises.map((exercise) => (
                    <div
                      key={exercise.id}
                      className="flex items-center justify-between p-2 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-sm">{exercise.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {exercise.muscleGroup}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addExerciseToWorkout(exercise)}
                        className="gap-1 h-7 px-2"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Preview Phase
  if (currentPhase === "preview" && generatedWorkout) {
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
            <Button className="gap-2">
              <Play className="h-4 w-4" />
              Start Workout
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-6 w-6" />
              {generatedWorkout.name}
            </CardTitle>
            <p className="text-muted-foreground">{generatedWorkout.description}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Workout Overview */}
            <div className="grid grid-cols-4 gap-4 p-4 bg-accent/50 rounded-lg">
              <div className="text-center">
                <p className="text-2xl font-bold">{generatedWorkout.exercises.length}</p>
                <p className="text-sm text-muted-foreground">Exercises</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {new Set(generatedWorkout.exercises.map(e => e.muscleGroup)).size}
                </p>
                <p className="text-sm text-muted-foreground">Muscle Groups</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{generatedWorkout.daysPerWeek || 4}</p>
                <p className="text-sm text-muted-foreground">Days/Week</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{generatedWorkout.estimatedDuration}</p>
                <p className="text-sm text-muted-foreground">Minutes</p>
              </div>
            </div>

            {/* Exercise List */}
            <div className="space-y-4">
              {generatedWorkout.exercises.map((exercise, index) => (
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