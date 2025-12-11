/**
 * ALGORITHM 5: Keyword Assignment Algorithm
 * 
 * Assigns 1-3 keywords per post ensuring:
 * - No keyword repetition in same subreddit
 * - Even distribution across all posts
 * - Natural keyword combinations
 */

import { shuffleArray } from '../utils/helpers.js';

export function assignKeywords(distribution, allKeywords) {
  const assignments = [];
  const keywordUsage = {};
  const subredditKeywords = {};
  
  // Initialize tracking
  allKeywords.forEach(k => {
    keywordUsage[k.keyword_id] = 0;
  });
  
  distribution.forEach(post => {
    if (!subredditKeywords[post.subreddit]) {
      subredditKeywords[post.subreddit] = new Set();
    }
  });
  
  // Shuffle keywords for variety
  let availableKeywords = shuffleArray([...allKeywords]);
  
  for (const post of distribution) {
    // Determine how many keywords for this post (1-3)
    const numKeywords = Math.floor(Math.random() * 3) + 1;
    const selectedKeywords = [];
    
    // Filter out keywords already used in this subreddit
    const eligibleKeywords = availableKeywords.filter(k => 
      !subredditKeywords[post.subreddit].has(k.keyword_id)
    );
    
    // If we've used all keywords in this subreddit, reset
    if (eligibleKeywords.length < numKeywords) {
      subredditKeywords[post.subreddit].clear();
      availableKeywords = shuffleArray([...allKeywords]);
    }
    
    // Select keywords
    const keywordsToUse = eligibleKeywords.length > 0 ? eligibleKeywords : availableKeywords;
    
    for (let i = 0; i < Math.min(numKeywords, keywordsToUse.length); i++) {
      const keyword = keywordsToUse[i];
      selectedKeywords.push(keyword);
      keywordUsage[keyword.keyword_id]++;
      subredditKeywords[post.subreddit].add(keyword.keyword_id);
    }
    
    assignments.push({
      postId: post.postId,
      keywords: selectedKeywords
    });
  }
  
  return assignments;
}
