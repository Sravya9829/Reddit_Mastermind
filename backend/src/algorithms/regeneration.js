/**
 * ALGORITHM 10: Auto-Regeneration Algorithm
 * 
 * Automatically regenerates low-quality content
 * - Max 3 attempts
 * - Returns best attempt if all fail
 * - Threshold: 7.5/10
 */

import { QUALITY_THRESHOLD, MAX_REGENERATION_ATTEMPTS } from '../utils/constants.js';
import { calculateQualityScore } from './qualityScore.js';

export async function generateWithQualityCheck(generateFunction, type = 'post') {
  let bestContent = null;
  let bestScore = 0;
  
  for (let attempt = 1; attempt <= MAX_REGENERATION_ATTEMPTS; attempt++) {
    console.log(`  Attempt ${attempt}/${MAX_REGENERATION_ATTEMPTS}...`);
    
    // Generate content
    const content = await generateFunction();
    
    // Calculate quality
    const quality = calculateQualityScore(content, type);
    content.quality_score = quality.overall;
    content.quality_breakdown = quality.breakdown;
    
    console.log(`  Quality: ${quality.overall}/10`);
    
    // Check if good enough
    if (quality.overall >= QUALITY_THRESHOLD) {
      console.log(`  ✓ Quality acceptable (>= ${QUALITY_THRESHOLD})`);
      return content;
    }
    
    // Save if best so far
    if (quality.overall > bestScore) {
      bestScore = quality.overall;
      bestContent = content;
      console.log(`  Saved as best (${quality.overall}/10)`);
    }
  }
  
  // All attempts exhausted - return best
  console.log(`  ⚠ Max attempts reached. Best: ${bestScore}/10`);
  
  if (bestScore >= 6.0) {
    return bestContent;
  } else {
    console.log(`  ⚠⚠ WARNING: Quality below 6.0`);
    bestContent.warning = 'Quality below acceptable threshold';
    return bestContent;
  }
}
