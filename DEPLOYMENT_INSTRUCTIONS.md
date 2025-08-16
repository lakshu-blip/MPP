# Master Placement Platform (MPP) - Local Setup Instructions

## Quick Overview
Your Master Placement Platform is a comprehensive coding interview preparation system with 350+ problems, spaced repetition, progress tracking, and auto-save functionality for completed problems.

## Step-by-Step Local Deployment

### Prerequisites
- Node.js (v18 or later)
- PostgreSQL database
- Git

### 1. Clone or Download the Project
```bash
# If using Git:
git clone <your-repository-url>
cd master-placement-platform

# Or extract from ZIP if downloaded
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup

#### Option A: Using Neon Database (Recommended - Free Tier)
1. Visit [Neon.tech](https://neon.tech) and create a free account
2. Create a new database project
3. Copy the connection string (looks like: `postgresql://user:password@host/dbname?sslmode=require`)
4. Create a `.env` file in your project root:
```bash
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
PGHOST="your-host"
PGUSER="your-user"  
PGPASSWORD="your-password"
PGDATABASE="your-database"
PGPORT="5432"
```

#### Option B: Local PostgreSQL
1. Install PostgreSQL locally
2. Create a new database:
```bash
psql -U postgres
CREATE DATABASE mpp_db;
\q
```
3. Create `.env` file:
```bash
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/mpp_db"
PGHOST="localhost"
PGUSER="postgres"
PGPASSWORD="yourpassword"
PGDATABASE="mpp_db"
PGPORT="5432"
```

### 4. Initialize Database Schema
```bash
# Push the schema to your database
npm run db:push

# When prompted about pattern_number column in mistakes table, select:
# + pattern_number           create column
```

### 5. Populate Sample Problems
```bash
# Run the fix script to add sample problems with patterns
cd server && npx tsx fixProblemsData.ts
```

### 6. Start the Application
```bash
npm run dev
```

Your application will be available at: `http://localhost:5000`

### 7. Verify Everything Works

#### Test the Core Features:
1. **Problems Page**: Visit `http://localhost:5000` - you should see 6 sample problems with difficulty emojis (🟢🟡🔴)
2. **Complete Functionality**: Click "✓ Complete" on any problem to test the auto-save modal
3. **Pattern Information**: Problems should show pattern badges and information
4. **Dashboard**: Check the dashboard for progress tracking
5. **Schedule**: View your daily revision schedule

## Key Features Implemented

### ✓ Completed Features:
- **Problems Database**: 6 sample problems with BYTS patterns loaded
- **Difficulty Emojis**: 🟢 Easy, 🟡 Medium, 🔴 Hard
- **Auto-Save Completion**: Modal captures one-liner summary and code snippet
- **Pattern Integration**: Problems show pattern numbers and names
- **Progress Tracking**: Status indicators and completion rates
- **Revision System**: Three-step spaced repetition (Problem → Solution → Pattern)

### 📊 Database Structure:
- **problems**: Core problem data with patterns, topics, solutions
- **user_progress**: Tracks completion status, attempts, summaries, code snippets
- **schedules**: Daily problem assignments and revisions
- **daily_tasks**: Individual task tracking
- **flashcards**: Pattern-based flashcard system
- **mistakes**: Error pattern analysis

## Adding More Problems

### Import from BYTS Sheet:
The system is designed for 350+ problems from the BYTS SDE Sheet. To import all problems:

1. Prepare your problems data in the format:
```javascript
{
  id: "prob-X",
  title: "Problem Name",
  description: "Problem description",
  difficulty: "Easy|Medium|Hard",
  topics: ["Array", "Hash Table"],
  leetcodeId: 123,
  solution: "// Your solution code",
  patterns: ["Pattern X", "Pattern Description"]
}
```

2. Use the import endpoint:
```bash
curl -X POST http://localhost:5000/api/problems/import \
  -H "Content-Type: application/json" \
  -d '{"problems": [/* your problems array */]}'
```

## Customization Options

### Environment Variables:
```bash
# Database
DATABASE_URL=your_database_url
PGHOST=your_host
PGUSER=your_user
PGPASSWORD=your_password
PGDATABASE=your_database
PGPORT=5432

# Optional: External API Integration
LEETCODE_API_KEY=your_key  # For LeetCode sync (future feature)
CODECHEF_API_KEY=your_key  # For CodeChef rating (future feature)
```

### Theme Customization:
Edit `client/src/index.css` to customize colors:
```css
:root {
  --color-accent-green: hsl(142, 71%, 45%);
  --color-accent-blue: hsl(217, 91%, 60%);
  --color-accent-purple: hsl(262, 83%, 58%);
}
```

## Troubleshooting

### Common Issues:

1. **Database Connection Error**:
   - Verify your DATABASE_URL is correct
   - Check if your database server is running
   - Ensure firewall allows connections

2. **Problems Not Loading**:
   - Run: `npm run db:push` to update schema
   - Run: `cd server && npx tsx fixProblemsData.ts` to add sample data

3. **Completion Modal Not Working**:
   - Check browser console for errors
   - Verify API endpoint is responding: `curl http://localhost:5000/api/problems`

4. **Port Already in Use**:
   - Kill existing processes: `pkill -f node`
   - Or change port in `server/index.ts`

### Getting Help:
- Check browser developer console for errors
- Review server logs in terminal
- Verify all environment variables are set correctly

## Production Deployment

For production deployment, consider:
1. **Hosting**: Vercel, Netlify, or DigitalOcean
2. **Database**: Neon, Supabase, or managed PostgreSQL
3. **Environment**: Set production environment variables
4. **Build**: Run `npm run build` for optimized production build

## Next Steps

Once your local setup is working, you can:
- Import the full 350+ problem dataset
- Connect LeetCode/CodeChef accounts for live rating sync
- Customize the revision algorithm
- Add competitive programming contest tracking
- Implement user authentication for multi-user support

Your Master Placement Platform is now ready for serious interview preparation! 🚀