# Reddit Mastermind

Generate authentic Reddit posts and comments for marketing. Uses AI to create natural content that doesn't look like spam.

---

## Getting Started

**Backend:**
```bash
cd backend
npm install
```

Add your Gemini API key to `.env`:
```
GEMINI_API_KEY=your_key_here
```

Start it:
```bash
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

---

## How to Use

1. **Upload your Excel file** with company info, personas, and keywords
2. **Click "Generate Week 1"** and wait 3-4 minutes
3. **Download the Excel** with your posts and comments
4. Click **"Done"** when finished to start over

That's it.

---

## What It Does

Takes your Excel sheet and generates:
- 3 Reddit posts (or however many you want)
- 9 comments (3 per post)
- All scheduled at good times
- Quality scored (aim for 8+/10)

Posts look real because they:
- Use casual language
- Have personal details
- Ask genuine questions
- Mention your product naturally (not salesy)

---

## The 10 Algorithms

### 1. Distribution
Spreads your posts across different subreddits. Won't spam the same one.

### 2. Timing
Posts at peak hours (9-11am, 6-9pm). Spaces them out so it looks natural.

### 3. Personas
Makes sure each persona doesn't post too much. Keeps it balanced.

### 4. Strategy
Picks the post type based on your keywords:
- Questions ("What's the best...")
- Comparisons ("X vs Y")
- Problems ("How do I...")

### 5. Keywords
Assigns 1-3 keywords per post. Won't repeat keywords in the same subreddit.

### 6. Threading
Creates comment threads:
- First comment mentions your product
- Second comment agrees
- Third comment (you) thanks them

### 7. Comment Timing
Spaces out comments by a few hours so it looks organic.

### 8. Quality Score
Rates each post 0-10. Checks for:
- Natural language (not robotic)
- No marketing buzzwords
- Real Reddit voice
- Good product mentions

### 9. Spam Detection
Catches patterns that look spammy before you post.

### 10. Auto-Retry
If quality is low (<7.5), it regenerates automatically. Tries 3 times.

---

## Your Excel File

**What to include:**

**Company info:**
- Name
- Description
- List of subreddits

**Personas** (the fake users):
- Username
- Background/personality

**Keywords:**
- ID (like K1, K2)
- The actual keyword phrase

Check the test.xlsx file for an example.

---

## What You Get

Excel file with two sections:

**Posts:**
- Title, body, subreddit, author, time
- Keyword IDs used

**Comments:**
- Which post it's on
- Reply chain (C2 replies to C1)
- Author, text, time

---

## Frontend Buttons

**Generate Week 1** - Makes your calendar  
**Download Excel** - Get the file  
**Week 2** - Generate next week  
**Done** - Start over

---

## Common Issues

**"Port 5001 already in use"**
```bash
lsof -ti:5001 | xargs kill -9
```

**"Server overloaded" (503 error)**  
Just wait a minute and it auto-retries.

**"Quota exceeded" (429 error)**  
Free tier is 20 requests/day. Either wait til tomorrow or enable billing (super cheap).

**Only showing one keyword**  
Replace `backend/src/services/geminiService.js` with the fixed version from the downloads.

**Shows 0 replies**  
Backend needs to send comments array. Check `generateController.js` has the fix.

---

## API Key

Get it here: https://aistudio.google.com/app/apikey

Click "Create API Key" and paste it in your `.env` file.

---

## Quality Tips

Good posts score 8+/10 and have:
- Casual Reddit language (tbh, honestly, lol)
- Personal stories
- Specific details
- Natural product mentions (not forced)
- Questions that engage

Bad posts have:
- Marketing buzzwords (revolutionary, game-changing)
- Too formal
- Multiple product mentions
- Obvious ads

---

## Tech Used

Backend: Node.js, Express, Gemini API  
Frontend: React, Vite, Tailwind

---

That's everything. Upload your file, generate, download, post.
