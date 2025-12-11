# 🚀 Reddit Mastermind - Backend

Node.js + Express backend with Gemini AI integration and 10 smart algorithms.

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Start server
npm run dev
```

Server runs on: **http://localhost:5000**

## 🔑 Get Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key
4. Add to `.env`:
   ```
   GEMINI_API_KEY=your_key_here
   ```

## 📁 Project Structure

```
backend/
├── src/
│   ├── algorithms/         # All 10 algorithms
│   │   ├── distribution.js    # Algorithm 1
│   │   ├── timing.js          # Algorithm 2
│   │   ├── persona.js         # Algorithm 3
│   │   ├── strategy.js        # Algorithm 4
│   │   ├── keywords.js        # Algorithm 5
│   │   ├── threading.js       # Algorithm 6
│   │   ├── commentTiming.js   # Algorithm 7
│   │   ├── qualityScore.js    # Algorithm 8
│   │   ├── spamDetection.js   # Algorithm 9
│   │   └── regeneration.js    # Algorithm 10
│   │
│   ├── services/
│   │   ├── geminiService.js        # Gemini API
│   │   ├── calendarGenerator.js    # Main orchestrator
│   │   └── excelExporter.js        # Excel output
│   │
│   ├── controllers/
│   │   └── generateController.js   # Request handlers
│   │
│   ├── routes/
│   │   └── index.js                # API routes
│   │
│   └── utils/
│       ├── constants.js            # Configuration
│       └── helpers.js              # Utility functions
│
└── server.js                       # Express server
```

## 🔌 API Endpoints

### Health Check
```
GET /api/health
```

### Generate Calendar
```
POST /api/generate/week

Body:
{
  "company": {
    "name": "Slideforge",
    "description": "...",
    "subreddits": ["r/PowerPoint", "r/ClaudeAI"],
    "postsPerWeek": 3
  },
  "personas": [
    { "username": "riley_ops", "info": "..." }
  ],
  "keywords": [
    { "keyword_id": "K1", "keyword": "best ai tool" }
  ],
  "weekNumber": 1
}

Response:
{
  "success": true,
  "sessionId": "week1-123456",
  "posts": [...],
  "comments": [...],
  "averageQuality": 8.5
}
```

### Download Excel
```
GET /api/download/:sessionId

Returns: Excel file with Posts and Comments tabs
```

## 🧮 The 10 Algorithms

1. **Distribution** - Spreads posts across subreddits
2. **Timing** - Schedules posts at peak hours
3. **Persona** - Assigns personas (max 40% usage each)
4. **Strategy** - Selects post type (question, comparison, etc.)
5. **Keywords** - Distributes keywords naturally
6. **Threading** - Creates realistic comment threads
7. **Comment Timing** - Delays comments naturally (2-12 hours)
8. **Quality Scoring** - Rates content 0-10
9. **Spam Detection** - Catches patterns
10. **Auto-Regeneration** - Retries low-quality content

## 🤖 How It Works

```
1. Frontend sends parsed Excel data
   ↓
2. Backend runs algorithms to create structure
   ↓
3. Gemini API generates content for each post
   ↓
4. Quality scoring runs (auto-regenerates if < 7.5/10)
   ↓
5. Comments generated with natural delays
   ↓
6. Spam detection checks patterns
   ↓
7. Excel file generated with Posts + Comments tabs
   ↓
8. Frontend downloads result
```

## ⚙️ Configuration

Edit `src/utils/constants.js`:

```javascript
// Peak posting hours
export const PEAK_HOURS = [9, 10, 11, 18, 19, 20];

// Quality threshold
export const QUALITY_THRESHOLD = 7.5;

// Max regeneration attempts
export const MAX_REGENERATION_ATTEMPTS = 3;
```

## 🧪 Testing

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test generation (with valid data)
curl -X POST http://localhost:5000/api/generate/week \
  -H "Content-Type: application/json" \
  -d @test-data.json
```

## 📊 Example Output

**Posts Tab:**
```
Post ID | Title | Body | Subreddit | Author | Quality
P1      | ...   | ...  | r/PowerPoint | riley_ops | 8.7
```

**Comments Tab:**
```
Comment ID | Post ID | Text | Author | Quality
P1-C1      | P1      | ... | jordan_consults | 9.1
```

## 🐛 Troubleshooting

**"GEMINI_API_KEY is required"**
→ Add your API key to `.env`

**"Generation failed"**
→ Check Gemini API quota/limits

**"Quality below threshold"**
→ Increase MAX_REGENERATION_ATTEMPTS

## 📝 Environment Variables

```bash
PORT=5000                              # Server port
GEMINI_API_KEY=your_key_here          # Required
FRONTEND_URL=http://localhost:5173    # CORS
NODE_ENV=development                   # Environment
```

## 🚀 Deployment

```bash
# Build (if needed)
npm run build

# Start production
npm start
```

Deploy to:
- Heroku
- Railway
- Render
- AWS/GCP/Azure

## 📦 Dependencies

- `express` - Web framework
- `@google/generative-ai` - Gemini API
- `xlsx` - Excel file generation
- `date-fns` - Date manipulation
- `cors` - Cross-origin requests
- `dotenv` - Environment variables

## ✅ Checklist

Before running:
- [ ] Node.js 18+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created with GEMINI_API_KEY
- [ ] Frontend running on port 5173
- [ ] Port 5000 available

## 🎯 Next Steps

1. ✅ Backend complete
2. ⏳ Connect frontend to backend
3. ⏳ Test end-to-end
4. ⏳ Deploy both apps

Enjoy! 🔥
