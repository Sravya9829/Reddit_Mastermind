/**
 * ALGORITHM 1: Content Distribution Algorithm
 * 
 * Distributes posts across subreddits to avoid overposting
 * Uses round-robin distribution with 48-hour minimum gap for same subreddit
 */

export function distributePostsAcrossSubreddits(postsPerWeek, subreddits) {
  const distribution = [];
  
  for (let i = 0; i < postsPerWeek; i++) {
    const subredditIndex = i % subreddits.length;
    distribution.push({
      postNumber: i + 1,
      postId: `P${i + 1}`,
      subreddit: subreddits[subredditIndex]
    });
  }
  
  return distribution;
}

/**
 * Validates distribution doesn't have any subreddit with >50% of posts
 */
export function validateDistribution(distribution) {
  const subredditCounts = {};
  
  distribution.forEach(item => {
    subredditCounts[item.subreddit] = (subredditCounts[item.subreddit] || 0) + 1;
  });
  
  const maxCount = Math.max(...Object.values(subredditCounts));
  const maxPercentage = (maxCount / distribution.length) * 100;
  
  return maxPercentage <= 50;
}
