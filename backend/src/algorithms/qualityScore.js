/**
 * ALGORITHM 8: Quality Scoring Algorithm
 * 
 * Scores content on 4 metrics (each 0-10):
 * - Naturalness: Does it read like real Reddit?
 * - Authenticity: No marketing buzzwords, genuine voice
 * - Engagement: Will it get responses?
 * - Strategic: Keywords naturally integrated?
 */

export function calculateQualityScore(content, type = 'post') {
  const scores = {
    naturalness: scoreNaturalness(content, type),
    authenticity: scoreAuthenticity(content),
    engagement: scoreEngagement(content, type),
    strategic: scoreStrategic(content)
  };
  
  // Overall score is weighted average
  const overall = (
    scores.naturalness * 0.35 +
    scores.authenticity * 0.35 +
    scores.engagement * 0.15 +
    scores.strategic * 0.15
  );
  
  return {
    overall: parseFloat(overall.toFixed(1)),
    breakdown: scores
  };
}

function scoreNaturalness(content, type) {
  let score = 10;
  
  const text = type === 'post' ? `${content.title} ${content.body}` : content.text;
  
  // Deduct for overly formal language
  if (text.match(/\b(Furthermore|Moreover|Subsequently|Accordingly)\b/gi)) {
    score -= 2;
  }
  
  // Deduct for perfect grammar (too polished)
  if (!text.match(/[.!?]$/) && type === 'comment') {
    score += 0.5; // Actually better for comments
  }
  
  // Bonus for casual markers
  if (text.match(/\b(honestly|tbh|lol|ngl|imo)\b/i)) {
    score += 1;
  }
  
  return Math.max(0, Math.min(10, score));
}

function scoreAuthenticity(content) {
  let score = 10;
  
  const text = typeof content === 'string' ? content : 
    `${content.title || ''} ${content.body || content.text || ''}`;
  
  // Deduct for marketing buzzwords
  const buzzwords = [
    'revolutionary', 'game-changing', 'cutting-edge', 'innovative solution',
    'leverage', 'synergy', 'paradigm', 'disruptive', 'next-generation'
  ];
  
  buzzwords.forEach(word => {
    if (text.toLowerCase().includes(word)) {
      score -= 2;
    }
  });
  
  // Deduct for excessive exclamation marks
  const exclamationCount = (text.match(/!/g) || []).length;
  if (exclamationCount > 2) {
    score -= 1;
  }
  
  // Deduct for promotional language
  if (text.match(/\b(must-have|life-changing|absolutely|amazing tool)\b/gi)) {
    score -= 1.5;
  }
  
  return Math.max(0, Math.min(10, score));
}

function scoreEngagement(content, type) {
  let score = 7; // Base score
  
  const text = type === 'post' ? `${content.title} ${content.body}` : content.text;
  
  // Bonus for questions
  if (text.includes('?')) {
    score += 1.5;
  }
  
  // Bonus for personal experience
  if (text.match(/\b(I|my|I'm|I've)\b/g)?.length > 2) {
    score += 1;
  }
  
  // Bonus for specificity
  if (text.match(/\b\d+\b/g)?.length > 0) {
    score += 0.5;
  }
  
  return Math.max(0, Math.min(10, score));
}

function scoreStrategic(content) {
  let score = 8; // Base score
  
  const text = typeof content === 'string' ? content : 
    `${content.title || ''} ${content.body || content.text || ''}`;
  
  // Check if product name appears naturally (not forced)
  const productMentions = (text.match(/slideforge/gi) || []).length;
  
  if (productMentions === 0) {
    score -= 2; // Should mention the product
  } else if (productMentions === 1) {
    score += 1; // Perfect - natural mention
  } else if (productMentions > 2) {
    score -= 3; // Too much - feels promotional
  }
  
  return Math.max(0, Math.min(10, score));
}
