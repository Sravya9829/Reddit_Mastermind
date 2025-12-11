/**
 * ALGORITHM 6: Comment Threading Algorithm
 * 
 * Creates realistic comment thread structure:
 * - C1: Discovery comment (mentions product naturally)
 * - C2: Validation comment (supports C1)
 * - C3: OP response (thanks for recommendation)
 */

export function createCommentThreads(posts, personas) {
  const threads = [];
  
  for (const post of posts) {
    const postPersona = post.author;
    
    // Get other personas (not the OP)
    const otherPersonas = personas.filter(p => p.username !== postPersona);
    
    if (otherPersonas.length < 2) {
      // Not enough personas for full thread
      continue;
    }
    
    // Randomly select 2 personas for comments
    const shuffled = [...otherPersonas].sort(() => Math.random() - 0.5);
    const commenter1 = shuffled[0];
    const commenter2 = shuffled[1];
    
    const thread = {
      postId: post.post_id,
      comments: [
        {
          commentId: `${post.post_id}-C1`,
          author: commenter1.username,
          authorInfo: commenter1.info,
          parentId: null, // Top-level comment
          role: 'discovery', // Mentions the product
          order: 1
        },
        {
          commentId: `${post.post_id}-C2`,
          author: commenter2.username,
          authorInfo: commenter2.info,
          parentId: null, // Top-level comment
          role: 'validation', // Supports C1
          order: 2
        },
        {
          commentId: `${post.post_id}-C3`,
          author: postPersona,
          authorInfo: post.authorInfo,
          parentId: `${post.post_id}-C1`, // Reply to C1
          role: 'op_response', // OP thanks for rec
          order: 3
        }
      ]
    };
    
    threads.push(thread);
  }
  
  return threads;
}
