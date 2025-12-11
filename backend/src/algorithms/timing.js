/**
 * ALGORITHM 2: Post Timing Algorithm
 * 
 * Generates realistic timestamps for posts
 * - Posts at peak hours (9-11am, 6-9pm)
 * - Minimum 8 hours between posts
 * - Minimum 48 hours between posts in same subreddit
 */

import { addDays, setHours, setMinutes, setSeconds } from 'date-fns';
import { PEAK_HOURS } from '../utils/constants.js';
import { randomFromArray } from '../utils/helpers.js';

export function generatePostTimestamps(postsPerWeek, startDate, distribution) {
  const timestamps = [];
  const daysGap = 7 / postsPerWeek;
  
  for (let i = 0; i < postsPerWeek; i++) {
    const daysAhead = Math.floor(i * daysGap);
    const hour = randomFromArray(PEAK_HOURS);
    const minute = Math.floor(Math.random() * 60);
    
    let postDate = new Date(startDate);
    postDate = addDays(postDate, daysAhead);
    postDate = setHours(postDate, hour);
    postDate = setMinutes(postDate, minute);
    postDate = setSeconds(postDate, 0);
    
    timestamps.push({
      postId: distribution[i].postId,
      timestamp: postDate.toISOString(),
      subreddit: distribution[i].subreddit
    });
  }
  
  // Sort chronologically
  timestamps.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  
  return timestamps;
}

/**
 * Validates timing constraints
 */
export function validateTiming(timestamps) {
  // Check minimum 8-hour gap between any posts
  for (let i = 1; i < timestamps.length; i++) {
    const gap = (new Date(timestamps[i].timestamp) - new Date(timestamps[i-1].timestamp)) / 3600000;
    if (gap < 8) return false;
  }
  
  // Check 48-hour gap for same subreddit
  const subredditTimes = {};
  timestamps.forEach(t => {
    if (!subredditTimes[t.subreddit]) {
      subredditTimes[t.subreddit] = [];
    }
    subredditTimes[t.subreddit].push(new Date(t.timestamp));
  });
  
  for (const subreddit in subredditTimes) {
    const times = subredditTimes[subreddit].sort((a, b) => a - b);
    for (let i = 1; i < times.length; i++) {
      const gap = (times[i] - times[i-1]) / 3600000;
      if (gap < 48) return false;
    }
  }
  
  return true;
}
