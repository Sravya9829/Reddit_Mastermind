/**
 * ALGORITHM 7: Comment Timing Algorithm
 * 
 * Generates realistic comment timestamps:
 * - C1: 2-6 hours after post
 * - C2: 4-8 hours after C1
 * - C3: 2-4 hours after C1 (OP response)
 */

import { addHours } from 'date-fns';
import { MIN_COMMENT_DELAY_HOURS, MAX_COMMENT_DELAY_HOURS } from '../utils/constants.js';

export function generateCommentTimestamps(threads, postTimestamps) {
  const commentTimestamps = [];
  
  for (const thread of threads) {
    const postTimestamp = postTimestamps.find(t => t.postId === thread.postId);
    if (!postTimestamp) continue;
    
    const postDate = new Date(postTimestamp.timestamp);
    
    for (const comment of thread.comments) {
      let commentDate;
      
      if (comment.role === 'discovery') {
        // C1: 2-6 hours after post
        const hoursDelay = 2 + Math.random() * 4;
        commentDate = addHours(postDate, hoursDelay);
      } else if (comment.role === 'validation') {
        // C2: 4-8 hours after post
        const hoursDelay = 4 + Math.random() * 4;
        commentDate = addHours(postDate, hoursDelay);
      } else if (comment.role === 'op_response') {
        // C3: 2-4 hours after C1
        const c1Timestamp = commentTimestamps.find(t => 
          t.commentId === `${thread.postId}-C1`
        );
        if (c1Timestamp) {
          const hoursDelay = 2 + Math.random() * 2;
          commentDate = addHours(new Date(c1Timestamp.timestamp), hoursDelay);
        } else {
          commentDate = addHours(postDate, 4);
        }
      }
      
      commentTimestamps.push({
        commentId: comment.commentId,
        timestamp: commentDate.toISOString(),
        author: comment.author
      });
    }
  }
  
  return commentTimestamps;
}
