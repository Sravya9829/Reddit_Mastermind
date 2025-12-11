/**
 * Excel Export Service
 * Generates single-sheet output with Posts and Comments sections
 */

import XLSX from 'xlsx';

export function generateExcelOutput(calendar) {
  const workbook = XLSX.utils.book_new();
  
  // Create worksheet data as array of arrays
  const worksheetData = [];
  
  // ========== POSTS SECTION ==========
  worksheetData.push(['Posts']); // Section header
  worksheetData.push([
    'post_id',
    'subreddit',
    'title',
    'body',
    'author_username',
    'timestamp',
    'keyword_ids'
  ]);
  
  // Add post data (without quality_score and strategy)
  calendar.posts.forEach(post => {
    worksheetData.push([
      post.post_id,
      post.subreddit,
      post.title,
      post.body,
      post.author,
      post.timestamp,
      post.keywords.join(', ')
    ]);
  });
  
  // Empty rows for spacing
  worksheetData.push([]);
  worksheetData.push([]);
  worksheetData.push([]);
  
  // ========== COMMENTS SECTION ==========
  worksheetData.push(['Comments']); // Section header
  worksheetData.push([
    'comment_id',
    'post_id',
    'parent_comment_id',
    'comment_text',
    'username',
    'timestamp'
  ]);
  
  // Add comment data (without quality_score)
  calendar.comments.forEach(comment => {
    worksheetData.push([
      comment.comment_id,
      comment.post_id,
      comment.parent_id === 'Top-level' ? '' : comment.parent_id,
      comment.text,
      comment.author,
      comment.timestamp
    ]);
  });
  
  // Create worksheet from array of arrays
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  
  // Set column widths
  worksheet['!cols'] = [
    { wch: 12 },  // post_id / comment_id
    { wch: 18 },  // subreddit / post_id  
    { wch: 45 },  // title / parent_comment_id
    { wch: 80 },  // body / comment_text
    { wch: 18 },  // author_username / username
    { wch: 20 },  // timestamp
    { wch: 25 }   // keyword_ids
  ];
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Content Calendar');
  
  // Generate buffer
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  
  return buffer;
}
