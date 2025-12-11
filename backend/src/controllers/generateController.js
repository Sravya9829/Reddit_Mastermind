/**
 * Generate Controller
 * Handles calendar generation requests
 */

import { generateCalendar } from '../services/calendarGenerator.js';
import { generateExcelOutput } from '../services/excelExporter.js';

// Store generated calendars temporarily (in production, use Redis or database)
const calendars = new Map();

export async function generateWeek(req, res) {
  try {
    const { company, personas, keywords, weekNumber = 1 } = req.body;
    
    // Validate input
    if (!company || !personas || !keywords) {
      return res.status(400).json({
        error: 'Missing required fields: company, personas, keywords'
      });
    }
    
    console.log(`\n📅 Generating calendar for week ${weekNumber}...`);
    
    // Generate calendar
    const calendar = await generateCalendar({
      company,
      personas,
      keywords,
      weekNumber
    });
    
    console.log('✅ Calendar generated successfully');
    console.log(`   Session ID: ${calendar.sessionId}`);
    console.log(`   Posts: ${calendar.totalPosts}`);
    console.log(`   Comments: ${calendar.totalComments}`);
    
    // Store calendar
    calendars.set(calendar.sessionId, calendar);
    console.log('✅ Calendar stored in memory');
    
    // Send response (without full post/comment bodies to reduce size)
    const response = {
      success: true,
      sessionId: calendar.sessionId,
      weekNumber: calendar.weekNumber,
      posts: calendar.posts.map(p => ({
        post_id: p.post_id,
        title: p.title,
        body: p.body.substring(0, 200) + '...', // Truncate for response
        subreddit: p.subreddit,
        author: p.author,
        timestamp: p.timestamp,
        quality_score: p.quality_score,
        keywords: p.keywords
      })),
      comments: calendar.comments.map(c => ({
        comment_id: c.comment_id,
        post_id: c.post_id,
        author: c.author
      })), // Send minimal comment info for counting
      totalPosts: calendar.totalPosts,
      totalComments: calendar.totalComments,
      averageQuality: calendar.averageQuality,
      spamCheck: calendar.spamCheck
    };
    
    console.log('✅ Sending response to frontend...');
    res.json(response);
    console.log('✅ Response sent successfully');
    
  } catch (error) {
    console.error('❌ Generation error:', error);
    console.error('   Stack:', error.stack);
    res.status(500).json({
      error: 'Generation failed',
      message: error.message
    });
  }
}

export async function downloadCalendar(req, res) {
  try {
    const { sessionId } = req.params;
    
    const calendar = calendars.get(sessionId);
    
    if (!calendar) {
      return res.status(404).json({
        error: 'Calendar not found'
      });
    }
    
    // Generate Excel file
    const buffer = generateExcelOutput(calendar);
    
    // Send file
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=reddit_calendar_week_${calendar.weekNumber}.xlsx`);
    res.send(buffer);
    
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({
      error: 'Download failed',
      message: error.message
    });
  }
}
