/**
 * Calendar Generator Service
 * Orchestrates all 10 algorithms + Gemini API to generate complete calendar
 */

import { distributePostsAcrossSubreddits } from '../algorithms/distribution.js';
import { generatePostTimestamps } from '../algorithms/timing.js';
import { assignPersonas } from '../algorithms/persona.js';
import { assignStrategies } from '../algorithms/strategy.js';
import { assignKeywords } from '../algorithms/keywords.js';
import { createCommentThreads } from '../algorithms/threading.js';
import { generateCommentTimestamps } from '../algorithms/commentTiming.js';
import { detectSpamPatterns } from '../algorithms/spamDetection.js';
import { generateWithQualityCheck } from '../algorithms/regeneration.js';
import { generatePost, generateComment } from './geminiService.js';
import { addDays } from 'date-fns';

export async function generateCalendar(inputData) {
  console.log('\n=== STARTING CALENDAR GENERATION ===\n');
  
  const { company, personas, keywords, weekNumber } = inputData;
  
  // Calculate start date for this week
  const startDate = addDays(new Date(), (weekNumber - 1) * 7);
  
  console.log(`Week ${weekNumber} | Company: ${company.name} | Posts: ${company.postsPerWeek}`);
  console.log(`Personas: ${personas.length} | Keywords: ${keywords.length}`);
  console.log(`Subreddits: ${company.subreddits.join(', ')}\n`);
  
  // ========== PHASE 1: STRUCTURE GENERATION ==========
  console.log('PHASE 1: Generating structure...');
  
  // Algorithm 1: Distribute posts across subreddits
  const distribution = distributePostsAcrossSubreddits(company.postsPerWeek, company.subreddits);
  console.log(`✓ Distribution: ${company.postsPerWeek} posts across ${company.subreddits.length} subreddits`);
  
  // Algorithm 2: Generate timestamps
  const timestamps = generatePostTimestamps(company.postsPerWeek, startDate, distribution);
  console.log(`✓ Timestamps: Posts scheduled with natural timing`);
  
  // Algorithm 5: Assign keywords
  const keywordAssignments = assignKeywords(distribution, keywords);
  console.log(`✓ Keywords: Assigned to all posts`);
  
  // Algorithm 4: Select strategies
  const strategies = assignStrategies(distribution, keywordAssignments);
  console.log(`✓ Strategies: Post types selected`);
  
  // Algorithm 3: Assign personas
  const personaAssignments = assignPersonas(distribution, timestamps, personas);
  console.log(`✓ Personas: Balanced assignment complete`);
  
  // ========== PHASE 2: CONTENT GENERATION ==========
  console.log('\nPHASE 2: Generating content with AI...');
  
  const posts = [];
  
  for (let i = 0; i < distribution.length; i++) {
    const postPlan = {
      postId: distribution[i].postId,
      subreddit: distribution[i].subreddit,
      timestamp: timestamps[i].timestamp,
      persona: personaAssignments[i].persona,
      personaInfo: personaAssignments[i].personaInfo,
      keywords: keywordAssignments[i].keywords,
      strategy: strategies[i].strategy
    };
    
    console.log(`\n[${i + 1}/${distribution.length}] Generating ${postPlan.postId}...`);
    
    // Algorithm 10: Generate with quality check
    const post = await generateWithQualityCheck(
      async () => await generatePost(postPlan, company),
      'post'
    );
    
    posts.push(post);
  }
  
  console.log(`\n✓ Generated ${posts.length} posts`);
  
  // ========== PHASE 3: COMMENT GENERATION ==========
  console.log('\nPHASE 3: Generating comments...');
  
  // Algorithm 6: Create comment threads
  const threads = createCommentThreads(posts, personas);
  console.log(`✓ Created ${threads.length} comment threads`);
  
  // Algorithm 7: Generate comment timestamps
  const commentTimestamps = generateCommentTimestamps(threads, timestamps);
  console.log(`✓ Comment timing scheduled`);
  
  // Generate comment content
  const allComments = [];
  let commentCount = 0;
  
  for (const thread of threads) {
    const post = posts.find(p => p.post_id === thread.postId);
    
    for (const commentPlan of thread.comments) {
      commentCount++;
      const timestamp = commentTimestamps.find(t => t.commentId === commentPlan.commentId);
      
      const fullPlan = {
        ...commentPlan,
        timestamp: timestamp.timestamp,
        postId: thread.postId
      };
      
      console.log(`  [${commentCount}] Generating ${commentPlan.commentId}...`);
      
      const comment = await generateWithQualityCheck(
        async () => await generateComment(fullPlan, post, company),
        'comment'
      );
      
      allComments.push(comment);
    }
  }
  
  console.log(`\n✓ Generated ${allComments.length} comments`);
  
  // ========== PHASE 4: QUALITY CONTROL ==========
  console.log('\nPHASE 4: Quality control...');
  
  // Algorithm 9: Detect spam patterns
  const spamCheck = detectSpamPatterns(posts, allComments);
  
  if (spamCheck.hasIssues) {
    console.log(`⚠ Spam patterns detected (${spamCheck.severity} severity):`);
    spamCheck.issues.forEach(issue => {
      console.log(`  - ${issue.type}: ${JSON.stringify(issue)}`);
    });
  } else {
    console.log(`✓ No spam patterns detected`);
  }
  
  // Calculate overall quality
  const avgQuality = posts.reduce((sum, p) => sum + p.quality_score, 0) / posts.length;
  console.log(`✓ Average quality: ${avgQuality.toFixed(1)}/10`);
  
  // ========== FINAL RESULT ==========
  console.log('\n=== CALENDAR GENERATION COMPLETE ===\n');
  
  return {
    sessionId: `week${weekNumber}-${Date.now()}`,
    weekNumber,
    company: company.name,
    posts,
    comments: allComments,
    totalPosts: posts.length,
    totalComments: allComments.length,
    averageQuality: parseFloat(avgQuality.toFixed(1)),
    spamCheck,
    generatedAt: new Date().toISOString()
  };
}
