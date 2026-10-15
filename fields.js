// Shared field definitions for TRJ Reflection Journals (athlete daily journal)

export const SESSION_TYPES = [
    'S&C',
    'On Court',
    'Off Court'
];


// form element id -> stored entry key
export const FIELD_MAP = {
    entryDate: 'date',
    sessionTypeSelect: 'sessionType',
    sleepHours: 'sleep',
    sleepQuality: 'sleepQuality',
    hydration: 'hydration',
    soreness: 'soreness',
    moodScore: 'mood',
    stressScore: 'stress',
    fatigueScore: 'fatigue',
    goal1: 'goal1',
    goal1Strategy: 'goal1Strategy',
    goal2: 'goal2',
    goal2Strategy: 'goal2Strategy',
    highlight: 'highlight',
    lesson: 'lesson',
    resilience: 'resilience',
    goal1Score: 'goal1Score',
    goal2Score: 'goal2Score',
    sessionDuration: 'duration',
    sessionRPE: 'rpe',
    focusRating: 'focusRating',
    coachNotes: 'coachNotes',
    tomorrowFocus: 'tomorrowFocus'
};

// CSV header -> entry key
export const CSV_COLUMNS = [
    ['Date', 'date'],
    ['Session Type', 'sessionType'],
    ['Sleep Duration (hrs)', 'sleep'],
    ['Sleep Quality (1-10)', 'sleepQuality'],
    ['Hydration (L)', 'hydration'],
    ['Muscle Soreness (1-10)', 'soreness'],
    ['Mood (1-10)', 'mood'],
    ['Perceived Stress (1-10)', 'stress'],
    ['Fatigue (1-10)', 'fatigue'],
    ['Goal 1', 'goal1'],
    ['Goal 1 Execution Strategy', 'goal1Strategy'],
    ['Goal 1 Achieved (%)', 'goal1Score'],
    ['Goal 2', 'goal2'],
    ['Goal 2 Execution Strategy', 'goal2Strategy'],
    ['Goal 2 Achieved (%)', 'goal2Score'],
    ['Highlight / Evidence', 'highlight'],
    ['Key Lesson Learned', 'lesson'],
    ['Determination & Resilience', 'resilience'],
    ['Session Duration (min)', 'duration'],
    ['Session RPE (1-10)', 'rpe'],
    ['Mental Focus Rating (1-10)', 'focusRating'],
    ['Coach Feedback / Debrief Notes', 'coachNotes'],
    ["Target Focus for Tomorrow's Session", 'tomorrowFocus']
];

// Session load (arbitrary units) = session RPE x duration in minutes.
// Returns null unless both numbers are present.
export function sessionLoad(entry) {
    const rpe = parseFloat(entry?.rpe);
    const minutes = parseFloat(entry?.duration);
    if (isNaN(rpe) || isNaN(minutes) || rpe <= 0 || minutes <= 0) return null;
    return Math.round(rpe * minutes);
}

// Slider questions. Each stores a number in the hidden input with the same id.
// A slider left untouched stays blank, so it never records a made-up value.
export const RECOVERY_SLIDERS = [
    { id: 'sleepHours',   label: 'Sleep (hours)',     min: 0, max: 12,  step: 0.5,  start: 7,   unit: ' hrs', low: '0',    high: '12' },
    { id: 'sleepQuality', label: 'Sleep quality',     min: 1, max: 10,  step: 1,    start: 5,   of: 10, low: 'Poor',  high: 'Excellent' },
    { id: 'hydration',    label: 'Hydration (litres)', min: 0, max: 6,   step: 0.25, start: 2.5, unit: ' L',   low: '0',    high: '6' },
    { id: 'soreness',     label: 'Muscle soreness',   min: 1, max: 10,  step: 1,    start: 5,   of: 10, low: 'None',  high: 'Severe' },
    { id: 'moodScore',    label: 'Mood',              min: 1, max: 10,  step: 1,    start: 5,   of: 10, low: 'Low',   high: 'Great' },
    { id: 'stressScore',  label: 'Stress',            min: 1, max: 10,  step: 1,    start: 5,   of: 10, low: 'Calm',  high: 'Very stressed' },
    { id: 'fatigueScore', label: 'Fatigue',           min: 1, max: 10,  step: 1,    start: 5,   of: 10, low: 'Fresh', high: 'Exhausted' }
];

export const GOAL_SLIDERS = [
    { id: 'goal1Score', label: 'Goal 1 achieved', min: 0, max: 100, step: 5, start: 50, unit: '%', low: 'Not at all', high: 'Every time' },
    { id: 'goal2Score', label: 'Goal 2 achieved', min: 0, max: 100, step: 5, start: 50, unit: '%', low: 'Not at all', high: 'Every time' }
];
