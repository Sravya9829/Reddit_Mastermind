/**
 * ALGORITHM 3: Persona Assignment Algorithm
 * 
 * Assigns personas to posts ensuring:
 * - No persona is overused (max 40% of posts)
 * - No persona posts in same subreddit within 48 hours
 * - Balanced distribution
 */

import { shuffleArray } from '../utils/helpers.js';

export function assignPersonas(distribution, timestamps, personas) {
  const assignments = [];
  const personaUsage = {};
  const personaSubredditTimes = {};
  
  // Initialize tracking
  personas.forEach(p => {
    personaUsage[p.username] = 0;
    personaSubredditTimes[p.username] = {};
  });
  
  // Shuffle personas for random-ish assignment
  const shuffledPersonas = shuffleArray(personas);
  let personaIndex = 0;
  
  for (let i = 0; i < distribution.length; i++) {
    const post = distribution[i];
    const timestamp = timestamps.find(t => t.postId === post.postId);
    
    // Find eligible persona
    let selectedPersona = null;
    let attempts = 0;
    
    while (!selectedPersona && attempts < personas.length * 2) {
      const persona = shuffledPersonas[personaIndex % personas.length];
      
      // Check if persona is eligible
      const usagePercent = (personaUsage[persona.username] / distribution.length) * 100;
      
      if (usagePercent < 40) {
        // Check subreddit timing
        const lastTimeInSubreddit = personaSubredditTimes[persona.username][post.subreddit];
        
        if (!lastTimeInSubreddit) {
          selectedPersona = persona;
        } else {
          const hoursSinceLast = (new Date(timestamp.timestamp) - lastTimeInSubreddit) / 3600000;
          if (hoursSinceLast >= 48) {
            selectedPersona = persona;
          }
        }
      }
      
      personaIndex++;
      attempts++;
    }
    
    // Fallback: just pick the least used persona
    if (!selectedPersona) {
      selectedPersona = personas.reduce((min, p) => 
        personaUsage[p.username] < personaUsage[min.username] ? p : min
      );
    }
    
    // Update tracking
    personaUsage[selectedPersona.username]++;
    personaSubredditTimes[selectedPersona.username][post.subreddit] = new Date(timestamp.timestamp);
    
    assignments.push({
      postId: post.postId,
      persona: selectedPersona.username,
      personaInfo: selectedPersona.info
    });
  }
  
  return assignments;
}
