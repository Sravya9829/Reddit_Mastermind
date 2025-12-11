/**
 * Gemini API Service
 * Handles all AI content generation using Google's Gemini API
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI;
let model;

export function initializeGemini(apiKey) {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is required');
  }
  
  genAI = new GoogleGenerativeAI(apiKey);
  model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash-preview-09-2025",
    generationConfig: {
      temperature: 0.9,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    }
  });
  
  console.log('✓ Gemini API initialized');
}

export async function generatePost(postPlan, companyInfo) {
  const prompt = buildPostPrompt(postPlan, companyInfo);
  
  const maxRetries = 3;
  const baseDelay = 15000;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await new Promise(resolve => setTimeout(resolve, baseDelay));
      
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      return parsePostResponse(text, postPlan);
    } catch (error) {
      if (error.message.includes('503') || error.message.includes('overloaded')) {
        if (attempt < maxRetries) {
          const retryDelay = baseDelay * Math.pow(2, attempt);
          console.log(`  ⚠️  Server overloaded, retrying in ${retryDelay/1000}s... (attempt ${attempt + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          continue;
        }
      }
      
      console.error('Gemini API error:', error.message);
      throw new Error(`Failed to generate post: ${error.message}`);
    }
  }
}

export async function generateComment(commentPlan, postContent, companyInfo) {
  const prompt = buildCommentPrompt(commentPlan, postContent, companyInfo);
  
  const maxRetries = 3;
  const baseDelay = 15000;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await new Promise(resolve => setTimeout(resolve, baseDelay));
      
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      return parseCommentResponse(text, commentPlan);
    } catch (error) {
      if (error.message.includes('503') || error.message.includes('overloaded')) {
        if (attempt < maxRetries) {
          const retryDelay = baseDelay * Math.pow(2, attempt);
          console.log(`  ⚠️  Server overloaded, retrying in ${retryDelay/1000}s... (attempt ${attempt + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          continue;
        }
      }
      
      console.error('Gemini API error:', error.message);
      throw new Error(`Failed to generate comment: ${error.message}`);
    }
  }
}

function buildPostPrompt(postPlan, companyInfo) {
  const keywordText = postPlan.keywords.map(k => k.keyword).join(', ');
  
  return `You are ${postPlan.persona}, posting in ${postPlan.subreddit}.

PERSONA INFO:
${postPlan.personaInfo}

COMPANY TO MENTION (naturally):
${companyInfo.name}: ${companyInfo.description}

TARGET KEYWORDS (integrate naturally): ${keywordText}

POST STRATEGY: ${postPlan.strategy}

CRITICAL RULES:
- Write like a REAL Reddit user, not an AI
- Use casual language, contractions, occasional typos are OK
- NO marketing buzzwords (revolutionary, game-changing, etc.)
- Be specific and personal
- Ask genuine questions
- Mention ${companyInfo.name} naturally if relevant, but don't force it
- Sound human and authentic

Generate a Reddit post with:

TITLE: (question or statement, 50-100 chars)
BODY: (2-4 paragraphs, personal experience, specific details, natural voice)

Format as:
TITLE: [your title]
BODY: [your body text]`;
}

function buildCommentPrompt(commentPlan, postContent, companyInfo) {
  let prompt = `You are ${commentPlan.author}, commenting in ${postContent.subreddit}.

PERSONA INFO:
${commentPlan.authorInfo}

POST YOU'RE RESPONDING TO:
Title: ${postContent.title}
Body: ${postContent.body}

YOUR ROLE: ${commentPlan.role}

`;

  if (commentPlan.role === 'discovery') {
    prompt += `Write a discovery comment that:
- Naturally mentions ${companyInfo.name} as a solution
- Shares your personal experience with it
- Is helpful and genuine, not promotional
- 2-3 sentences, casual tone
- Maybe includes a caveat ("not perfect but...")
`;
  } else if (commentPlan.role === 'validation') {
    prompt += `Write a validation comment that:
- Supports the previous comment's suggestion
- Adds your own brief experience
- Keeps it short (1-2 sentences)
- Uses Reddit casual language (+1, honestly, tbh, etc.)
`;
  } else if (commentPlan.role === 'op_response') {
    prompt += `Write an OP response that:
- Thanks for the recommendation
- Shows genuine interest
- Very brief (1 sentence)
- Natural enthusiasm without over-selling
`;
  }

  prompt += `\nCRITICAL: Sound like a real person, not an AI or marketer.

Generate just the comment text (no labels):`;

  return prompt;
}

function parsePostResponse(text, postPlan) {
  const titleMatch = text.match(/TITLE:\s*(.+?)(?:\n|BODY:)/i);
  const bodyMatch = text.match(/BODY:\s*(.+)/is);
  
  const title = titleMatch ? titleMatch[1].trim() : 'Untitled Post';
  const body = bodyMatch ? bodyMatch[1].trim() : text.trim();
  
  // CRITICAL: Extract keyword IDs from postPlan
  const keywordIds = postPlan.keywords.map(k => k.keyword_id);
  
  console.log(`  Keywords assigned: ${keywordIds.join(', ')} (${keywordIds.length} total)`);
  
  return {
    post_id: postPlan.postId,
    title,
    body,
    subreddit: postPlan.subreddit,
    author: postPlan.persona,
    authorInfo: postPlan.personaInfo,
    timestamp: postPlan.timestamp,
    keywords: keywordIds, // Array of IDs: ['K1', 'K14', 'K4']
    strategy: postPlan.strategy,
    quality_score: undefined
  };
}

function parseCommentResponse(text, commentPlan) {
  let commentText = text.trim();
  commentText = commentText.replace(/^(COMMENT:|TEXT:)\s*/i, '');
  
  return {
    comment_id: commentPlan.commentId,
    text: commentText,
    author: commentPlan.author,
    authorInfo: commentPlan.authorInfo,
    parent_id: commentPlan.parentId,
    post_id: commentPlan.postId,
    timestamp: commentPlan.timestamp,
    role: commentPlan.role,
    quality_score: undefined
  };
}