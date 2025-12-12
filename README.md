# Reddit Mastermind

AI-powered Reddit content calendar generator. Creates authentic posts and comments that look 100% human-written.

---

## What It Does

Upload an Excel file with your company info, personas, and keywords. Get back a complete Reddit marketing calendar with posts and comments that look natural.

**Features:**
- Generates 3+ posts with 9 comments per week
- Smart timing (posts at peak hours, spaces them out)
- Quality scoring (8+/10 average)
- Natural language (no AI buzzwords)
- Anti-spam detection
- Auto-regenerates low-quality content

---

## Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/reddit-mastermind.git
cd reddit-mastermind
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```bash
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5001
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

Get your Gemini API key: https://aistudio.google.com/app/apikey

Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

No `.env` file needed - frontend uses default backend URL (`http://localhost:5001/api`).

Start the frontend:
```bash
npm run dev
```

### 4. Open Your Browser
Go to http://localhost:5173

---

## How to Use

1. **Upload Excel File**
   - Click the upload area or drag & drop
   - Must include: Company info, Personas, Keywords
   - See `test.xlsx` for example format

2. **Generate Calendar**
   - Click "GENERATE WEEK 1"
   - Takes 3-4 minutes (AI generation + rate limit delays)
   - Progress bar shows status

3. **Download Results**
   - Click "DOWNLOAD EXCEL" when done
   - Get posts and comments in spreadsheet
   - Review quality scores (aim for 8+/10)

4. **Generate More or Start Over**
   - "WEEK 2" - Generate next week
   - "DONE" - Reset and upload new file

---

## Excel File Format

Your input Excel should have these sections:

### Company Info
```
Name         | Your Company Name
Description  | What your company does
Subreddits   | r/entrepreneur
             | r/startups
             | r/business
Username     | your_reddit_username
```

### Personas (Fake Reddit Users)
```
Username      | Info
john_tech     | Software engineer, loves automation tools
sarah_market  | Marketing manager at SaaS startup
alex_consult  | Independent consultant, works with SMBs
```

### Keywords
```
keyword_id | keyword
K1         | best presentation tool
K2         | how to make slides faster
K3         | AI design tools
```

---

## Output Format

You'll get an Excel file with:

### Posts Sheet
- Post titles and bodies
- Subreddit, author, timestamp
- Keyword IDs used (K1, K14, K4)

### Comments Sheet
- 3 comments per post
- Reply threading (C2 replies to C1)
- Different personas for each comment
- Natural timing delays

---

## The 10 Algorithms

### 1. Content Distribution
Spreads posts across subreddits. Won't spam the same one (max 50% per subreddit, 48h gap).

### 2. Post Timing
Schedules at peak hours (9-11am, 6-9pm EST). Minimum 8 hours between posts.

### 3. Persona Assignment
Balances persona usage (max 40% per persona). No same persona in subreddit within 48h.

### 4. Strategy Selection
Picks post type based on keywords:
- Questions - "What's the best..."
- Comparisons - "X vs Y"
- Problems - "How do I fix..."

### 5. Keyword Assignment
Assigns 1-3 keywords per post. No repeats in same subreddit.

### 6. Comment Threading
Creates realistic threads:
- C1 (Discovery) - Mentions your product
- C2 (Validation) - Agrees with C1
- C3 (OP Response) - Thanks them

### 7. Comment Timing
Natural delays:
- C1: 2-6 hours after post
- C2: 4-8 hours after post
- C3: 2-4 hours after C1

### 8. Quality Scoring
Rates 0-10 on 4 metrics (Naturalness, Authenticity, Engagement, Strategic). Auto-regenerates if <7.5.

### 9. Spam Detection
Catches patterns: persona overuse, time clustering, repetitive language.

### 10. Auto-Regeneration
Tries up to 3 times if quality is low. Returns best attempt.

---

## Project Structure

```
reddit-mastermind/
├── backend/
│   ├── src/
│   │   ├── algorithms/        # All 10 algorithms
│   │   ├── services/          # Gemini API, Excel export
│   │   ├── controllers/       # API handlers
│   │   ├── routes/            # Express routes
│   │   └── utils/             # Helpers, constants
│   ├── server.js              # Express app
│   ├── package.json
│   └── .env                   
│
└── frontend/
    ├── src/
    │   ├── pages/             # React pages
    │   ├── services/          # API calls
    │   └── utils/             # Helpers
    └── package.json
```

---

## Tech Stack

**Backend:**
- Node.js + Express
- Google Gemini API (AI generation)
- XLSX (Excel files)
- date-fns (date handling)

**Frontend:**
- React + Vite
- Tailwind CSS (styling)
- Framer Motion (animations)
- React Hot Toast (notifications)

---

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5001
lsof -ti:5001 | xargs kill -9
```

### Gemini API Errors

**503 Service Unavailable**  
Google's servers are busy. Wait 1-2 minutes, it auto-retries.

**429 Rate Limit**  
Free tier: 20 requests/day. Enable billing or wait until tomorrow.

**404 Model Not Found**  
Wrong model name. Use `gemini-flash-latest` in `geminiService.js`.

### Frontend Shows 0 Replies
Backend needs to send comments array. Check `generateController.js` line 57-61.

### Only One Keyword in Excel
Check `geminiService.js` line 192 uses `k.keyword_id` not `k.keyword`.

---

## Quality Tips

**Good posts (8+/10) have:**
- Casual Reddit language (tbh, honestly, ngl)
- Personal stories and details
- Natural questions
- One mention of your product (feels organic)

**Bad posts (<6/10) have:**
- Marketing buzzwords (revolutionary, game-changing)
- Too formal or robotic
- Multiple product mentions
- Obviously promotional

---

## Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

---

## Get Your API Key

1. Go to https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy it to your `backend/.env` file

Free tier includes 20 requests/day (enough for 1-2 calendars).

---
