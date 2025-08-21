PocketSEND - Claude Code Assistant Context
Project: AI-powered SEN training via WhatsApp
Transform nervous Teaching Assistants into confident SEN professionals through micro-learning.
Bash Commands
bashnpm run dev          # Start dev server (port 5000)
npm run build        # Build for production
npm run typecheck    # Run TypeScript checks
npm run db:push      # Push schema to Supabase
npm run db:pull      # Pull schema from Supabase
git push origin main # Deploy to staging
Code Style Guidelines
IMPORTANT: TypeScript & React Rules

Use TypeScript strict mode - NO any types
Server components by default, 'use client' only when needed
Components under 150 lines - extract hooks for logic
Mobile-first Tailwind classes - test at 375px width
Use ES modules (import/export), never CommonJS

File Naming & Structure
typescript// New pages: app/(protected)/[feature]/page.tsx
// API routes: app/api/[feature]/route.ts  
// Components: components/ui/[Component].tsx
// Always export default for pages
Database Patterns
typescript// ALWAYS use Supabase client, not raw SQL
import { supabase } from '@/lib/supabase'
const { data, error } = await supabase.from('table').select()

// Handle errors with user-friendly messages
if (error) throw new Error('Something went wrong. Please try again.')
Workflow Instructions
YOU MUST follow this development cycle:

Write working code first - polish later
Test on mobile viewport (375px) BEFORE desktop
Deploy daily - small increments only
Run typecheck after code changes: npm run typecheck

Git Workflow
bash# Commit pattern (keep it simple):
git add .
git commit -m "feat: description"  # New feature
git commit -m "fix: description"   # Bug fix
git commit -m "wip: description"   # Work in progress
git push origin main               # Auto-deploys to staging
Core Files & Functions
Authentication

/lib/supabase.ts - Supabase client singleton
/app/api/auth/route.ts - Auth endpoints
Use supabase.auth.getUser() for current user

UI Components

/components/ui/button.tsx - Primary button component
/components/ui/card.tsx - Card wrapper
Always use cn() helper for className merging

Critical Paths
typescript// WhatsApp integration (PRIORITY)
app/api/whatsapp/webhook/route.ts   # Webhook handler
lib/whatsapp/client.ts              # Twilio client

// AI Roleplay (CORE FEATURE)
app/api/ai/roleplay/route.ts       # OpenAI integration
components/features/ChatInterface.tsx # Chat UI
Testing Strategy
IMPORTANT: Test These Scenarios First

Mobile Experience (375px width)

Can user complete signup with one thumb?
Do modals/popups work with keyboard open?
Is text readable without zooming?


Critical User Paths

New user: Land → Signup → First lesson → Complete
Returning user: Login → Resume lesson → See progress
Agency: Login → Browse candidates → Contact


Edge Cases to Always Check

Network offline/slow (throttle to 3G)
Wrong password 3x times
Duplicate email signup
Session timeout (leave tab open 24hr)
Multiple tabs open



Quick Testing Commands
bash# Reset and seed database
npm run db:reset && npm run db:seed

# Test with different users
# Candidate: test.candidate@example.com / password123
# Agency: test.agency@example.com / password123

# Test WhatsApp locally
ngrok http 5000  # Expose local to internet
# Update webhook URL in Twilio console
Performance Testing
bash# Check bundle size
npm run build && npm run analyze

# Lighthouse audit (aim for 90+ mobile)
# Open DevTools → Lighthouse → Mobile → Generate report

# Database query performance
# Supabase Dashboard → SQL Editor → Query Performance
Debugging Playbook
Common Issues & Quick Fixes
"Cannot read property of undefined"
typescript// ALWAYS check if data exists first
const user = data?.user?.profile?.name || 'Guest'
// Use optional chaining everywhere
Supabase Auth Not Working
bash# Check service role key
echo $SUPABASE_SERVICE_ROLE_KEY
# Verify it starts with 'eyJ'

# Test connection
npx supabase status
# Should show 'Reachable'
WhatsApp Messages Not Sending
typescript// Add debug logging
console.log('Twilio Config:', {
  accountSid: process.env.TWILIO_ACCOUNT_SID?.slice(0, 5) + '...',
  hasAuthToken: !!process.env.TWILIO_AUTH_TOKEN,
  toNumber: phoneNumber,
})
// Check Twilio console for error codes
Build Failures
bash# Clear all caches
rm -rf .next node_modules package-lock.json
npm install
npm run build

# Type errors - check imports
npm run typecheck -- --listFilesOnly
Debug Tools & Commands
bash# View real-time logs
npm run dev -- --verbose

# Supabase logs (for API issues)
npx supabase logs --tail

# Database inspector
npx supabase inspect db tables

# Check environment variables
npx dotenv-checker

# Network requests debugging
# Chrome DevTools → Network → Slow 3G → Check "Preserve log"
Console Debugging Helpers
typescript// Add these temporarily when debugging

// Track component renders
console.log(`[${new Date().toISOString()}] ComponentName rendered`)

// API debugging
console.log('API Request:', { method, url, body })
console.log('API Response:', { status, data })

// State debugging
useEffect(() => {
  console.log('State changed:', { oldValue, newValue })
}, [stateVariable])

// REMEMBER: Remove all console.logs before committing
Error Boundary Setup
typescript// Add to app/error.tsx for production error catching
'use client'
export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  // Log to error tracking service (e.g., Sentry)
  console.error('Application error:', error)
  
  return (
    <div className="p-4">
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
Environment Setup
Required Environment Variables
envNEXT_PUBLIC_SUPABASE_URL=       # From Supabase dashboard
NEXT_PUBLIC_SUPABASE_ANON_KEY=  # From Supabase dashboard  
SUPABASE_SERVICE_ROLE_KEY=      # From Supabase dashboard
OPENAI_API_KEY=                 # From OpenAI platform
TWILIO_ACCOUNT_SID=             # For WhatsApp
TWILIO_AUTH_TOKEN=              # For WhatsApp
Local Development
bash# First time setup
npm install
cp .env.example .env.local  # Add your keys
npm run dev

# Daily startup
npm run dev
# Open http://localhost:5000
Current Sprint Focus
CRITICAL - Ship These Features

WhatsApp message sending - /app/api/whatsapp/send
First lesson content - /content/lessons/day-1.json
Basic AI roleplay - /app/(protected)/chat/page.tsx

Known Issues & Warnings

Supabase RLS policies need updating - use service role for now
WhatsApp Business API approval pending - use test numbers
AI responses sometimes too long - limit to 100 words
Mobile keyboard covers input on some devices - add scroll padding

Architecture Decisions
Why These Choices

Next.js App Router: Best DX, built-in API routes
Supabase: Fast setup, good enough for scale
Tailwind: Rapid prototyping, mobile-first
WhatsApp: Where our users already are

Scaling Strategy
typescript// Phase 1 (NOW): Direct calls
const data = await supabase.from('table').select()

// Phase 2 (LATER): Add caching when needed
// Phase 3 (FUTURE): Queue heavy operations
Common Patterns
Create New Feature Page
typescript// app/(protected)/candidate-[feature]/page.tsx
export default async function FeaturePage() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Feature</h1>
      {/* Mobile-first layout */}
    </div>
  )
}
Add API Endpoint
typescript// app/api/[feature]/route.ts
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    // Process request
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
Remember
Ship working code to real users. Perfect is the enemy of done.
Every feature should answer: "Does this help a nervous TA feel more capable?"
