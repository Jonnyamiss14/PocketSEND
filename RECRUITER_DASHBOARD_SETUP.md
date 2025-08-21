# Recruiter Dashboard Setup Guide

## Overview
The recruiter dashboard has been successfully implemented for PocketSEND. This guide explains how to complete the setup.

## Database Migration Required

**IMPORTANT**: Before using the dashboard, you must run the database migration to add the required fields and functions.

### Step 1: Apply Database Migration

Go to your Supabase dashboard and run the SQL script located at:
```
/database/migrations/add_recruiter_dashboard_fields.sql
```

This migration adds:
- New fields to candidates table: `learning_streak`, `total_learning_minutes`, `confidence_score`, `last_active_at`
- New tables: `preparation_modules`, `ai_conversations`  
- Database function: `get_recruiter_stats()` for dashboard statistics
- Proper RLS policies for multi-tenant security

### Step 2: Verify Setup

1. **Navigate to the dashboard**: `/recruiter-dashboard`
2. **Check authentication**: Only logged-in agency users can access
3. **Test functionality**:
   - Stats cards should display (may show 0s initially)
   - Search and filters should work
   - Add candidate modal should open and submit
   - Export CSV should work

## Features Implemented

### ✅ Core Dashboard Features
- **Stats Overview Cards**: Total candidates, active learners, placements this week, average confidence
- **Candidates Grid**: Responsive grid with candidate cards showing activity status, learning progress
- **Real-time Updates**: Uses Supabase subscriptions for live data updates
- **Search & Filtering**: URL-based filtering by name, location, and activity status
- **Pagination**: 20 candidates per page with navigation
- **Add Candidate Modal**: Complete form for registering new candidates
- **Export to CSV**: Download candidate data with applied filters

### ✅ Security & Multi-tenancy
- **Row Level Security**: All queries properly filtered by agency_id
- **Authentication Required**: Middleware protection for dashboard routes
- **Data Isolation**: Candidates only visible to their associated agencies

### ✅ Mobile Responsive Design
- **Mobile-first approach**: Works on phones, tablets, and desktop
- **Responsive grid**: 1 column on mobile, 2 on tablet, 3 on desktop
- **Touch-friendly**: Large touch targets and mobile-optimized interactions

### ✅ Real-time Features
- **Live statistics**: Stats update when candidates or placements change
- **Candidate updates**: Grid refreshes when candidate data changes
- **Activity indicators**: Real-time activity status (green/yellow/gray dots)

## Technical Architecture

### File Structure
```
app/(protected)/recruiter-dashboard/
├── page.tsx                 # Main dashboard (Server Component)
├── actions.ts              # Server Actions for mutations
└── components/
    ├── stats-cards.tsx      # Real-time stats (Client Component)
    ├── candidates-grid.tsx  # Candidate list with real-time updates
    ├── candidate-card.tsx   # Individual candidate display
    ├── filters.tsx          # Search and filtering
    ├── add-candidate-modal.tsx  # New candidate form
    └── export-button.tsx    # CSV export functionality
```

### Data Flow
1. **Server Component** (page.tsx) fetches initial data
2. **Client Components** add interactivity and real-time updates
3. **Server Actions** handle mutations (add/update candidates)
4. **Supabase subscriptions** provide real-time updates

### Performance Optimizations
- **Server-side rendering** for initial page load
- **Pagination** (20 candidates per page)
- **Debounced search** (500ms delay)
- **Optimistic updates** for better UX
- **Database indexes** on frequently queried fields

## Usage Instructions

### For Recruiters
1. **Access Dashboard**: Navigate to `/recruiter-dashboard`
2. **View Overview**: Check stats cards for key metrics
3. **Browse Candidates**: Use search and filters to find specific candidates
4. **Add New Candidates**: Click "Add Candidate" button to register new TAs
5. **Export Data**: Use "Export CSV" to download candidate lists
6. **Track Activity**: Monitor candidate engagement with activity indicators

### Key Metrics Explained
- **Total Candidates**: Active candidates in your agency pool
- **Active Learners**: Candidates who used the platform in last 7 days
- **Placements This Week**: New placements created this week
- **Average Confidence**: Mean confidence score across all active candidates

### Activity Status Indicators
- **🟢 Green dot**: Active in last 24 hours
- **🟡 Yellow dot**: Active in last 7 days  
- **⚫ Gray dot**: Inactive (over 7 days)

## Testing Checklist

### ✅ Functionality Tests
- [ ] Dashboard loads without errors
- [ ] Stats cards display correct data
- [ ] Search functionality works
- [ ] Location and status filters work
- [ ] Pagination works correctly
- [ ] Add candidate form submits successfully
- [ ] Export CSV downloads file
- [ ] Real-time updates work (test with multiple tabs)

### ✅ Mobile Responsiveness
- [ ] Works on 375px width (iPhone SE)
- [ ] Grid adapts to different screen sizes
- [ ] Forms work with mobile keyboard
- [ ] Touch targets are adequate size
- [ ] Text is readable without zooming

### ✅ Security Tests
- [ ] Unauthenticated users redirected to login
- [ ] Users only see their agency's candidates
- [ ] RLS policies prevent cross-agency data access
- [ ] Server actions validate agency permissions

## Troubleshooting

### Common Issues

**Dashboard shows "No candidates found"**
- Check that the database migration was applied
- Verify that candidates are linked to agencies via `candidate_agencies` table
- Ensure RLS policies are properly configured

**Stats showing 0 values**
- Run the database migration to create the `get_recruiter_stats()` function
- Check that sample data exists in the database
- Verify agency_id is correctly set in user session

**Real-time updates not working**
- Check that Supabase realtime is enabled
- Verify RLS policies allow subscriptions
- Check browser console for subscription errors

**Export CSV fails**
- Verify server actions are working
- Check that the user has proper agency permissions
- Ensure no special characters in candidate names

### Development Notes
- Uses Next.js 15 App Router
- Server Components by default, Client Components only for interactivity
- TypeScript strict mode enabled
- Tailwind CSS with brand colors (teal #17A398, gold #FCD34D)
- Supabase for backend with RLS for security

## Next Steps

Future enhancements could include:
1. **Bulk actions**: Select multiple candidates for bulk operations
2. **Advanced filters**: Filter by DBS status, experience level, availability
3. **Candidate profiles**: Detailed candidate pages with full history
4. **Analytics dashboard**: Deeper insights into candidate performance
5. **Messaging integration**: Direct WhatsApp messaging from dashboard
6. **Calendar integration**: Schedule interviews and placements
7. **Automated workflows**: Email notifications and follow-ups

The dashboard provides a solid foundation that can be extended with additional features as the business grows.