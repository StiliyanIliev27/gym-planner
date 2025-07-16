-- Migration: Add Exercise Media URLs and AI Features
-- This migration adds demo videos, images, tips, form cues, and other AI features to existing exercises

-- Update Push-ups
UPDATE exercises SET 
  demo_video_url = 'https://www.youtube.com/watch?v=IODxDxX7oi4',
  tips = 'Keep your body in a straight line from head to heels. Don''t let your hips sag or pike up.',
  form_cues = ARRAY[
    'Hands slightly wider than shoulders',
    'Engage your core throughout the movement',
    'Lower chest to just above the ground',
    'Keep elbows at 45-degree angle to body'
  ],
  common_mistakes = ARRAY[
    'Letting hips sag or pike up',
    'Placing hands too wide apart',
    'Not going through full range of motion',
    'Holding breath during the movement'
  ],
  progressions = ARRAY[
    'Diamond push-ups',
    'Decline push-ups',
    'One-arm push-ups',
    'Explosive/clap push-ups'
  ],
  regressions = ARRAY[
    'Wall push-ups',
    'Incline push-ups on bench',
    'Knee push-ups',
    'Assisted push-ups with resistance band'
  ],
  ai_tags = ARRAY['bodyweight', 'beginner-friendly', 'chest-builder', 'functional'],
  ai_difficulty_score = 3.5
WHERE name = 'Push-ups';

-- Update Bench Press
UPDATE exercises SET 
  demo_video_url = 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
  tips = 'Keep your feet flat on the floor and maintain a slight arch in your lower back. Control the weight on both the way down and up.',
  form_cues = ARRAY[
    'Retract shoulder blades and keep them down',
    'Bar path should be straight up and down',
    'Touch bar to chest at nipple line',
    'Drive through your heels while pressing'
  ],
  common_mistakes = ARRAY[
    'Bouncing the bar off the chest',
    'Lifting feet off the ground',
    'Pressing with inconsistent bar path',
    'Not controlling the eccentric portion'
  ],
  progressions = ARRAY[
    'Close-grip bench press',
    'Incline bench press',
    'Pause bench press',
    'Floor press'
  ],
  regressions = ARRAY[
    'Dumbbell bench press',
    'Machine chest press',
    'Incline push-ups',
    'Resistance band chest press'
  ],
  ai_tags = ARRAY['compound', 'strength-building', 'powerlifting', 'chest-focus'],
  ai_difficulty_score = 6.0
WHERE name = 'Bench Press';

-- Update Squats
UPDATE exercises SET 
  demo_video_url = 'https://www.youtube.com/watch?v=Dy28eq2PjcM',
  tips = 'Keep your chest up and core engaged. Descend as if sitting back into a chair.',
  form_cues = ARRAY[
    'Feet shoulder-width apart',
    'Knees track over toes',
    'Descend until thighs parallel to ground',
    'Drive through heels to stand up'
  ],
  common_mistakes = ARRAY[
    'Knees caving inward',
    'Not going deep enough',
    'Leaning too far forward',
    'Rising on toes instead of staying flat-footed'
  ],
  progressions = ARRAY[
    'Goblet squats',
    'Front squats',
    'Back squats with barbell',
    'Pistol squats'
  ],
  regressions = ARRAY[
    'Chair-assisted squats',
    'Partial range squats',
    'Wall sits',
    'Squat to box'
  ],
  ai_tags = ARRAY['compound', 'leg-day', 'functional', 'glute-builder'],
  ai_difficulty_score = 4.0
WHERE name = 'Squats';

-- Update Deadlifts
UPDATE exercises SET 
  demo_video_url = 'https://www.youtube.com/watch?v=ytGaGIn3SjE',
  tips = 'This is the king of all exercises. Start with light weight and focus on perfect form. Keep the bar close to your body throughout.',
  form_cues = ARRAY[
    'Bar starts over mid-foot',
    'Hinge at hips first, then bend knees',
    'Keep chest up and shoulders back',
    'Drive through heels and squeeze glutes at top'
  ],
  common_mistakes = ARRAY[
    'Rounding the back',
    'Bar drifting away from body',
    'Looking up during the lift',
    'Not engaging lats to keep bar close'
  ],
  progressions = ARRAY[
    'Sumo deadlifts',
    'Romanian deadlifts',
    'Deficit deadlifts',
    'Trap bar deadlifts'
  ],
  regressions = ARRAY[
    'Rack pulls',
    'Kettlebell deadlifts',
    'Romanian deadlifts',
    'Hip hinges without weight'
  ],
  ai_tags = ARRAY['compound', 'powerlifting', 'full-body', 'strength-king'],
  ai_difficulty_score = 8.5
WHERE name = 'Deadlifts';

-- Update Pull-ups
UPDATE exercises SET 
  demo_video_url = 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
  tips = 'Start from a dead hang and pull your chest to the bar. Control the descent.',
  form_cues = ARRAY[
    'Full dead hang at bottom',
    'Pull chest to bar, not chin over bar',
    'Engage lats by pulling elbows down and back',
    'Control the negative portion'
  ],
  common_mistakes = ARRAY[
    'Using momentum/kipping',
    'Not going through full range of motion',
    'Letting shoulders roll forward',
    'Rushing the negative portion'
  ],
  progressions = ARRAY[
    'Weighted pull-ups',
    'L-sit pull-ups',
    'Archer pull-ups',
    'One-arm pull-ups'
  ],
  regressions = ARRAY[
    'Assisted pull-ups with band',
    'Negative pull-ups',
    'Lat pulldowns',
    'Inverted rows'
  ],
  ai_tags = ARRAY['bodyweight', 'back-builder', 'functional', 'challenging'],
  ai_difficulty_score = 7.0
WHERE name = 'Pull-ups';

-- Update Plank
UPDATE exercises SET 
  demo_video_url = 'https://www.youtube.com/watch?v=ASdvN_XEl_c',
  tips = 'Quality over quantity - hold perfect form for shorter time rather than sloppy form for longer.',
  form_cues = ARRAY[
    'Body forms straight line from head to heels',
    'Engage core by pulling belly button to spine',
    'Keep hips level - don''t let them sag or pike',
    'Breathe normally throughout the hold'
  ],
  common_mistakes = ARRAY[
    'Letting hips sag toward ground',
    'Piking hips up too high',
    'Holding breath',
    'Looking up instead of down'
  ],
  progressions = ARRAY[
    'Side planks',
    'Plank with leg lifts',
    'Plank to push-up',
    'Single-arm plank'
  ],
  regressions = ARRAY[
    'Knee plank',
    'Incline plank on bench',
    'Wall plank',
    'Shorter hold times'
  ],
  ai_tags = ARRAY['core', 'isometric', 'functional', 'stability'],
  ai_difficulty_score = 3.0
WHERE name = 'Plank';

-- Update Burpees
UPDATE exercises SET 
  demo_video_url = 'https://www.youtube.com/watch?v=auBLPXO8Fww',
  tips = 'This is a high-intensity exercise that will get your heart rate up quickly. Focus on smooth transitions between movements.',
  form_cues = ARRAY[
    'Drop down smoothly into squat position',
    'Jump or step feet back to plank',
    'Perform clean push-up',
    'Jump feet back to squat and explode up'
  ],
  common_mistakes = ARRAY[
    'Sloppy push-up in the middle',
    'Not jumping high enough at the end',
    'Poor transition between movements',
    'Going too fast and losing form'
  ],
  progressions = ARRAY[
    'Burpee box jumps',
    'Burpee pull-ups',
    'Double burpees',
    'Burpee broad jumps'
  ],
  regressions = ARRAY[
    'Step-back burpees',
    'Half burpees (no push-up)',
    'Burpees without jump',
    'Incline burpees'
  ],
  ai_tags = ARRAY['hiit', 'full-body', 'cardio', 'bodyweight', 'metabolic'],
  ai_difficulty_score = 8.0
WHERE name = 'Burpees';

-- Update Bicep Curls
UPDATE exercises SET 
  demo_video_url = 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
  tips = 'Control the weight on both the way up and down. Don''t swing or use momentum.',
  form_cues = ARRAY[
    'Keep elbows close to your sides',
    'Curl weight up with controlled motion',
    'Squeeze biceps at the top',
    'Lower slowly with control'
  ],
  common_mistakes = ARRAY[
    'Swinging weights with momentum',
    'Letting elbows drift forward',
    'Not controlling the negative',
    'Using too much weight'
  ],
  progressions = ARRAY[
    'Hammer curls',
    '21s (7 bottom half + 7 top half + 7 full)',
    'Concentration curls',
    'Preacher curls'
  ],
  regressions = ARRAY[
    'Resistance band curls',
    'Lighter weight',
    'Assisted curls',
    'Isometric holds'
  ],
  ai_tags = ARRAY['isolation', 'arms', 'beginner-friendly', 'aesthetic'],
  ai_difficulty_score = 2.0
WHERE name = 'Bicep Curls';

-- Update Overhead Press
UPDATE exercises SET 
  demo_video_url = 'https://www.youtube.com/watch?v=2yjwXTZQDDI',
  tips = 'Keep your core tight throughout the movement. Press the weight straight up, not forward.',
  form_cues = ARRAY[
    'Start with bar at shoulder level',
    'Keep core braced and glutes engaged',
    'Press straight up, not forward',
    'Lock out arms directly over shoulders'
  ],
  common_mistakes = ARRAY[
    'Pressing weight forward instead of up',
    'Arching back excessively',
    'Not keeping core engaged',
    'Using legs to help (unless doing push press)'
  ],
  progressions = ARRAY[
    'Push press',
    'Behind-the-neck press',
    'Single-arm overhead press',
    'Handstand push-ups'
  ],
  regressions = ARRAY[
    'Seated overhead press',
    'Dumbbell shoulder press',
    'Pike push-ups',
    'Resistance band overhead press'
  ],
  ai_tags = ARRAY['compound', 'shoulders', 'functional', 'strength'],
  ai_difficulty_score = 6.5
WHERE name = 'Overhead Press';

-- Update Lunges
UPDATE exercises SET 
  demo_video_url = 'https://www.youtube.com/watch?v=QOVaHwm-Q6U',
  tips = 'Step far enough forward that your front thigh is parallel to the ground when you lunge down.',
  form_cues = ARRAY[
    'Step forward with one leg',
    'Lower hips until both knees at 90 degrees',
    'Keep front knee over ankle',
    'Push through front heel to return'
  ],
  common_mistakes = ARRAY[
    'Step too short, causing knee to go over toe',
    'Leaning forward too much',
    'Not lowering deep enough',
    'Pushing off back toe instead of front heel'
  ],
  progressions = ARRAY[
    'Walking lunges',
    'Reverse lunges',
    'Lateral lunges',
    'Jumping lunges'
  ],
  regressions = ARRAY[
    'Stationary lunges',
    'Assisted lunges with support',
    'Partial range lunges',
    'Step-ups'
  ],
  ai_tags = ARRAY['unilateral', 'legs', 'functional', 'balance'],
  ai_difficulty_score = 4.5
WHERE name = 'Lunges'; 
