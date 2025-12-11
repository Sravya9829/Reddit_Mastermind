/**
 * ALGORITHM 9: Anti-Spam Pattern Detection Algorithm
 * 
 * Detects spam patterns:
 * - Same persona posting too frequently
 * - Similar language across posts
 * - Too many posts in short timeframe
 */

export function detectSpamPatterns(posts, comments) {
  const issues = [];
  
  // Check persona overuse
  const personaCounts = {};
  posts.forEach(post => {
    personaCounts[post.author] = (personaCounts[post.author] || 0) + 1;
  });
  
  Object.entries(personaCounts).forEach(([persona, count]) => {
    const percentage = (count / posts.length) * 100;
    if (percentage > 40) {
      issues.push({
        type: 'persona_overuse',
        persona,
        percentage: percentage.toFixed(1),
        severity: 'high'
      });
    }
  });
  
  // Check time clustering
  const timestamps = posts.map(p => new Date(p.timestamp)).sort((a, b) => a - b);
  
  for (let i = 1; i < timestamps.length; i++) {
    const hoursDiff = (timestamps[i] - timestamps[i-1]) / 3600000;
    if (hoursDiff < 8) {
      issues.push({
        type: 'time_clustering',
        post1: posts[i-1].post_id,
        post2: posts[i].post_id,
        hoursDiff: hoursDiff.toFixed(1),
        severity: 'medium'
      });
    }
  }
  
  // Check for repetitive language
  const titleWords = posts.map(p => 
    p.title.toLowerCase().split(/\s+/).filter(w => w.length > 4)
  );
  
  for (let i = 0; i < titleWords.length; i++) {
    for (let j = i + 1; j < titleWords.length; j++) {
      const common = titleWords[i].filter(w => titleWords[j].includes(w));
      if (common.length > 3) {
        issues.push({
          type: 'repetitive_language',
          post1: posts[i].post_id,
          post2: posts[j].post_id,
          commonWords: common.length,
          severity: 'low'
        });
      }
    }
  }
  
  return {
    hasIssues: issues.length > 0,
    issues,
    severity: issues.some(i => i.severity === 'high') ? 'high' : 
              issues.some(i => i.severity === 'medium') ? 'medium' : 'low'
  };
}
