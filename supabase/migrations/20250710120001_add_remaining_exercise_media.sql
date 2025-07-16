-- Migration: Add Media URLs and AI Features to Remaining Exercises
-- This migration completes the exercise data for all remaining exercises

-- Update Dumbbell Flyes
UPDATE exercises SET 
  demo_video_url = 'https://www.youtube.com/watch?v=eozdVDA78K0',
  tips = 'Focus on the stretch at the bottom and squeeze at the top. Keep a slight bend in your elbows throughout.',
  form_cues = ARRAY[
    'Lie flat on bench with dumbbells over chest',
    'Keep slight bend in elbows',
    'Lower weights in wide arc until chest stretch',
    'Squeeze chest muscles to bring weights together'
  ],
  common_mistakes = ARRAY[
    'Using too much weight',
    'Straightening arms completely',
    'Not controlling the eccentric',
    'Going too low and straining shoulders'
  ],
  progressions = ARRAY[
    'Incline dumbbell flyes',
    'Cable flyes',
    'Single-arm dumbbell flyes',
    'Decline dumbbell flyes'
  ],
  regressions = ARRAY[
    'Resistance band flyes',
    'Pec deck machine',
    'Lighter weight',
    'Reduced range of motion'
  ],
  ai_tags = ARRAY['isolation', 'chest', 'aesthetic', 'hypertrophy'],
  ai_difficulty_score = 5.0
WHERE name = 'Dumbbell Flyes';

-- Update Bent-over Rows
UPDATE exercises SET 
  demo_video_url = 'https://www.youtube.com/watch?v=FWJR5Ve8bnQ',
  tips = 'Keep your back straight and core engaged. Pull the weight to your lower chest/upper abdomen.',
  form_cues = ARRAY[
    'Hinge at hips with straight back',
    'Pull bar to lower chest/upper abdomen',
    'Squeeze shoulder blades together',
    'Keep elbows close to body'
  ],
  common_mistakes = ARRAY[
    'Rounding the back',
    'Using too much momentum',
    'Pulling to the wrong part of torso',
    'Not keeping core engaged'
  ],
  progressions = ARRAY[
    'Pendlay rows',
    'T-bar rows',
    'Single-arm dumbbell rows',
    'Weighted vest rows'
  ],
  regressions = ARRAY[
    'Chest-supported rows',
    'Cable rows',
    'Resistance band rows',
    'Lighter weight'
  ],
  ai_tags = ARRAY['compound', 'back', 'strength', 'posture'],
  ai_difficulty_score = 6.0
WHERE name = 'Bent-over Rows';

-- Update Lat Pulldowns
UPDATE exercises SET 
  demo_video_url = 'https://www.youtube.com/watch?v=CAwf7n6Luuc',
  tips = 'Pull to your upper chest, not behind your neck. Focus on using your lats, not your arms.',
  form_cues = ARRAY[
    'Lean back slightly and keep chest up',
    'Pull bar down to upper chest',
    'Squeeze shoulder blades down and back',
    'Control the weight back up'
  ],
  common_mistakes = ARRAY[
    'Pulling behind the neck',
    'Using too much momentum',
    'Not engaging lats properly',
    'Leaning too far back'
  ],
  progressions = ARRAY[
    'Wide-grip lat pulldowns',
    'Close-grip lat pulldowns',
    'Single-arm lat pulldowns',
    'Weighted pull-ups'
  ],
  regressions = ARRAY[
    'Assisted pull-ups',
    'High lat pulldowns',
    'Lighter weight',
    'Resistance band pulldowns'
  ],
  ai_tags = ARRAY['back', 'beginner-friendly', 'machine', 'lat-focus'],
  ai_difficulty_score = 3.5
WHERE name = 'Lat Pulldowns';

-- Update Lateral Raises
UPDATE exercises SET 
  demo_video_url = 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
  tips = 'Use light weight and focus on controlled movement. Lead with your pinkies as you raise.',
  form_cues = ARRAY[
    'Stand with dumbbells at sides',
    'Raise arms out to sides until parallel',
    'Lead with pinkies, thumbs down',
    'Lower slowly with control'
  ],
  common_mistakes = ARRAY[
    'Using too much weight',
    'Swinging or using momentum',
    'Raising arms too high',
    'Not controlling the negative'
  ],
  progressions = ARRAY[
    'Cable lateral raises',
    'Leaning lateral raises',
    'Partial reps at end of set',
    '21s variation'
  ],
  regressions = ARRAY[
    'Resistance band lateral raises',
    'Lighter weight',
    'Seated lateral raises',
    'Single-arm raises'
  ],
  ai_tags = ARRAY['isolation', 'shoulders', 'aesthetic', 'deltoids'],
  ai_difficulty_score = 3.0
WHERE name = 'Lateral Raises';

-- Update Tricep Dips
UPDATE exercises SET 
  demo_video_url = 'https://www.youtube.com/watch?v=0326dy_-CzM',
  tips = 'Keep your body close to the bench/chair. Don''t go too low to avoid shoulder strain.',
  form_cues = ARRAY[
    'Start with arms straight supporting body',
    'Lower body by bending elbows backward',
    'Keep elbows close to body',
    'Push back up to starting position'
  ],
  common_mistakes = ARRAY[
    'Going too low and straining shoulders',
    'Letting elbows flare out',
    'Leaning too far away from bench',
    'Using momentum instead of control'
  ],
  progressions = ARRAY[
    'Weighted tricep dips',
    'Ring dips',
    'Parallel bar dips',
    'Single-leg tricep dips'
  ],
  regressions = ARRAY[
    'Assisted tricep dips',
    'Tricep dips with feet closer',
    'Partial range dips',
    'Incline tricep dips'
  ],
  ai_tags = ARRAY['bodyweight', 'triceps', 'functional', 'upper-body'],
  ai_difficulty_score = 5.5
WHERE name = 'Tricep Dips';

-- Update Crunches
UPDATE exercises SET 
  demo_video_url = 'https://www.youtube.com/watch?v=Xyd_fa5zoEU',
  tips = 'Focus on curling your spine, not just moving your head and shoulders up and down.',
  form_cues = ARRAY[
    'Lie on back with knees bent',
    'Place hands behind head lightly',
    'Curl spine upward, lifting shoulders',
    'Lower slowly with control'
  ],
  common_mistakes = ARRAY[
    'Pulling on neck with hands',
    'Using momentum',
    'Not curling spine properly',
    'Going too fast'
  ],
  progressions = ARRAY[
    'Bicycle crunches',
    'Weighted crunches',
    'Reverse crunches',
    'Russian twists'
  ],
  regressions = ARRAY[
    'Dead bugs',
    'Knee raises',
    'Partial crunches',
    'Supported crunches'
  ],
  ai_tags = ARRAY['core', 'abs', 'beginner', 'floor-exercise'],
  ai_difficulty_score = 2.0
WHERE name = 'Crunches';

-- Update Running
UPDATE exercises SET 
  demo_video_url = 'https://www.youtube.com/watch?v=brFt82qnkX0',
  tips = 'Start slow and build up gradually. Focus on breathing and maintaining good form.',
  form_cues = ARRAY[
    'Land midfoot, not on heels',
    'Keep cadence around 180 steps per minute',
    'Maintain upright posture',
    'Breathe rhythmically'
  ],
  common_mistakes = ARRAY[
    'Heel striking too hard',
    'Overstriding',
    'Holding breath',
    'Poor posture'
  ],
  progressions = ARRAY[
    'Interval running',
    'Hill running',
    'Tempo runs',
    'Long distance runs'
  ],
  regressions = ARRAY[
    'Walking',
    'Walk-run intervals',
    'Slower pace',
    'Shorter distances'
  ],
  ai_tags = ARRAY['cardio', 'endurance', 'full-body', 'outdoor'],
  ai_difficulty_score = 4.0
WHERE name = 'Running';

-- Update Jumping Jacks
UPDATE exercises SET 
  demo_video_url = 'https://www.youtube.com/watch?v=c4DAnQ6DtF8',
  tips = 'Land softly on the balls of your feet. Keep core engaged throughout the movement.',
  form_cues = ARRAY[
    'Start with feet together, arms at sides',
    'Jump feet apart while raising arms overhead',
    'Jump back to starting position',
    'Land softly on balls of feet'
  ],
  common_mistakes = ARRAY[
    'Landing too hard on heels',
    'Not fully extending arms overhead',
    'Poor rhythm and coordination',
    'Not engaging core'
  ],
  progressions = ARRAY[
    'Star jumps',
    'Cross-body jumping jacks',
    'Weighted jumping jacks',
    'Plyometric jumping jacks'
  ],
  regressions = ARRAY[
    'Step-touch instead of jumping',
    'Half jumping jacks',
    'Seated jumping jacks',
    'Slower tempo'
  ],
  ai_tags = ARRAY['cardio', 'full-body', 'warm-up', 'coordination'],
  ai_difficulty_score = 2.5
WHERE name = 'Jumping Jacks';

-- Update Mountain Climbers
UPDATE exercises SET 
  demo_video_url = 'https://www.youtube.com/watch?v=nmwgirgXLYM',
  tips = 'Keep your hips level and core tight. Don''t let your form break down as you get tired.',
  form_cues = ARRAY[
    'Start in plank position',
    'Alternate bringing knees to chest rapidly',
    'Keep hips level',
    'Maintain plank position throughout'
  ],
  common_mistakes = ARRAY[
    'Letting hips pike up or sag',
    'Going too fast and losing form',
    'Not bringing knees far enough forward',
    'Placing hands too far forward'
  ],
  progressions = ARRAY[
    'Cross-body mountain climbers',
    'Single-leg mountain climbers',
    'Mountain climber push-ups',
    'Weighted vest mountain climbers'
  ],
  regressions = ARRAY[
    'Slow mountain climbers',
    'Incline mountain climbers',
    'Step-back mountain climbers',
    'Knee mountain climbers'
  ],
  ai_tags = ARRAY['cardio', 'core', 'full-body', 'hiit'],
  ai_difficulty_score = 6.0
WHERE name = 'Mountain Climbers';

-- Update Kettlebell Swings
UPDATE exercises SET 
  demo_video_url = 'https://www.youtube.com/watch?v=YSxHifyI6s8', 
  tips = 'This is a hip-driven movement, not a squat. Generate power from your glutes and hamstrings.',
  form_cues = ARRAY[
    'Start with kettlebell between legs',
    'Hinge at hips, not squat down',
    'Drive hips forward explosively',
    'Let kettlebell swing to shoulder height'
  ],
  common_mistakes = ARRAY[
    'Squatting instead of hip hinging',
    'Using arms to lift the weight',
    'Letting kettlebell swing too high',
    'Not engaging core properly'
  ],
  progressions = ARRAY[
    'American kettlebell swings',
    'Single-arm kettlebell swings',
    'Heavier kettlebell',
    'Kettlebell snatches'
  ],
  regressions = ARRAY[
    'Lighter kettlebell',
    'Kettlebell deadlifts',
    'Hip hinge practice',
    'Dumbbell swings'
  ],
  ai_tags = ARRAY['compound', 'posterior-chain', 'explosive', 'functional'],
  ai_difficulty_score = 7.0
WHERE name = 'Kettlebell Swings'; 