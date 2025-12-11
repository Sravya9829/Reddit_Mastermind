// Peak posting hours (9-11am, 6-9pm EST)
export const PEAK_HOURS = [9, 10, 11, 18, 19, 20];

// Timing constraints
export const MIN_HOURS_BETWEEN_POSTS = 8;
export const MIN_HOURS_SAME_SUBREDDIT = 48;
export const MIN_COMMENT_DELAY_HOURS = 2;
export const MAX_COMMENT_DELAY_HOURS = 12;

// Quality thresholds
export const QUALITY_THRESHOLD = 7.5;
export const MIN_ACCEPTABLE_QUALITY = 6.0;
export const MAX_REGENERATION_ATTEMPTS = 3;

// Post strategies
export const POST_STRATEGIES = [
  'genuine_question',
  'comparison_seeking',
  'recommendation_request',
  'problem_solving',
  'experience_sharing'
];

// Anti-spam patterns
export const MAX_PERSONA_USAGE_PERCENT = 40;
export const MIN_TIME_VARIETY_HOURS = 4;

// Gemini API configuration
export const GEMINI_CONFIG = {
  temperature: 0.9,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 1024,
};
