/**
 * ALGORITHM 4: Post Strategy Selection Algorithm
 * 
 * Selects post type based on keywords and context
 * Types: genuine_question, comparison_seeking, recommendation_request, 
 *        problem_solving, experience_sharing
 */

import { POST_STRATEGIES } from '../utils/constants.js';
import { randomFromArray } from '../utils/helpers.js';

export function selectPostStrategy(keywords) {
  // Analyze keywords to determine best strategy
  const keywordText = keywords.map(k => k.keyword.toLowerCase()).join(' ');
  
  if (keywordText.includes('best') || keywordText.includes('vs') || keywordText.includes('alternative')) {
    return 'comparison_seeking';
  }
  
  if (keywordText.includes('how to') || keywordText.includes('help') || keywordText.includes('need')) {
    return 'problem_solving';
  }
  
  if (keywordText.includes('recommend') || keywordText.includes('suggest') || keywordText.includes('looking for')) {
    return 'recommendation_request';
  }
  
  if (keywordText.includes('experience') || keywordText.includes('anyone tried')) {
    return 'experience_sharing';
  }
  
  // Default to genuine question
  return 'genuine_question';
}

export function assignStrategies(distribution, keywordAssignments) {
  return distribution.map(post => {
    const postKeywords = keywordAssignments.find(k => k.postId === post.postId).keywords;
    const strategy = selectPostStrategy(postKeywords);
    
    return {
      postId: post.postId,
      strategy
    };
  });
}
