# TwinLink Dashboard Testing Guide

## 🚀 Quick Start

### 1. Start Backend
```bash
cd backend
npm run start:dev
```
Expected output: `Application is running on: http://localhost:3002`

### 2. Start Frontend  
```bash
cd frontend
npm run dev
```
Expected output: `Local: http://localhost:3000`

### 3. Test the Flow

#### **Step 1: Visit Landing Page**
- Open: `http://localhost:3000`
- Should see TwinLink landing page

#### **Step 2: Sign Up / Login**
- Click "Sign Up" or "Login"
- Use Clerk OAuth (Google/GitHub) or Email/Password
- Clerk will authenticate you

#### **Step 3: Complete Onboarding**
- Fill in all onboarding steps:
  - Basic Info (name, age, gender, location)
  - Personality traits
  - Interests
  - Lifestyle
  - Communication style
  - Goals
  - Relationship intent
  - Deal breakers
- Click "Complete Onboarding"
- Wait for Twin generation (shows loading animation)

#### **Step 4: View Dashboard**
- After onboarding, automatically redirected to `/dashboard`
- Dashboard should show:
  - ✅ Your real name in greeting
  - ✅ Twin status badge (ACTIVE, EXPLORING, etc.)
  - ✅ Twin health percentage
  - ✅ Last active timestamp
  - ✅ Conversation count
  - ✅ Activity summary

---

## 🧪 Testing Scenarios

### Scenario 1: Fresh User (No Twin)
**Expected**: Dashboard shows "No Digital Twin Found" with "Create Twin" button

### Scenario 2: Existing User with Twin
**Expected**: Dashboard shows full twin status card with real metrics

### Scenario 3: Backend Offline
**Expected**: Error state with "Try Again" button appears

### Scenario 4: Network Issues
**Expected**: Error message explains the issue, retry button available

---

## 🔍 Verify API Calls

### Open Browser DevTools (F12) → Network Tab

You should see these requests:

1. **GET /v1/users/me**
   - Status: 200
   - Response: User object with your data

2. **GET /v1/profiles/me**  
   - Status: 200
   - Response: Profile object with onboarding data

3. **GET /v1/twins/me**
   - Status: 200
   - Response: Twin object with status and memory

### Check Request Headers
```
Authorization: Bearer eyJhbGciOiJ...
Content-Type: application/json
```

---

## 📊 Dashboard Data Points to Verify

### Header
- [ ] User avatar shows initials or image
- [ ] Current time displays correctly
- [ ] Notification bell present

### Welcome Section  
- [ ] Greeting matches time of day
- [ ] User's first name displayed
- [ ] AI summary reflects twin data

### Twin Status Card
- [ ] Status badge shows correct twin status
- [ ] Version number displays (e.g., v1)
- [ ] Mission text reflects status
- [ ] Health percentage calculated
- [ ] Last active shows relative time
- [ ] Conversation count accurate

### Activity Summary
- [ ] Shows number of explored twins
- [ ] Shows completed conversations
- [ ] Shows discovered insights
- [ ] All counts match twin memory data

---

## 🐛 Common Issues & Fixes

### Issue: "No authentication token available"
**Cause**: Not logged in or session expired
**Fix**: Log out and log back in via Clerk

### Issue: "Digital twin not found"  
**Cause**: User hasn't completed onboarding
**Fix**: Complete onboarding flow to create twin

### Issue: CORS error in console
**Cause**: Backend CORS not configured
**Fix**: Check `backend/.env` has `CORS_ORIGINS=http://localhost:3000`

### Issue: 401 Unauthorized
**Cause**: Invalid Clerk token or backend not configured
**Fix**: 
1. Check backend `.env` has correct `CLERK_SECRET_KEY`
2. Ensure frontend `.env.local` has correct `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`

### Issue: 404 Not Found
**Cause**: Backend routes not available
**Fix**: Restart backend with `npm run start:dev`

### Issue: Loading forever
**Cause**: Backend not running
**Fix**: Start backend on port 3002

---

## 📝 Manual Testing Checklist

### Authentication
- [ ] Can sign up with email/password
- [ ] Can sign up with Google OAuth
- [ ] Can sign up with GitHub OAuth
- [ ] Can log in with existing account
- [ ] Session persists after page refresh
- [ ] Can log out successfully

### Onboarding
- [ ] All form fields work
- [ ] Validation errors display correctly
- [ ] Can navigate back/forward between steps
- [ ] Twin generation shows loading state
- [ ] Redirects to dashboard after completion

### Dashboard - Loading States
- [ ] Shows skeleton while loading
- [ ] Smooth transition to real data
- [ ] No flash of unstyled content

### Dashboard - Success State
- [ ] Real user name displays
- [ ] Twin status accurate
- [ ] Metrics reflect actual data
- [ ] Timestamps formatted correctly
- [ ] All cards render properly

### Dashboard - Error State
- [ ] Error message displays
- [ ] Retry button works
- [ ] Go Home button navigates correctly
- [ ] No console errors

### Dashboard - Empty State  
- [ ] "No Twin" message shows when appropriate
- [ ] Create Twin button appears
- [ ] UI remains stable

---

## 🔧 Developer Tools

### Check API Responses
```javascript
// In browser console
fetch('http://localhost:3002/v1/users/me', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN_HERE'
  }
})
.then(r => r.json())
.then(console.log)
```

### Check Clerk Token
```javascript
// In browser console (on frontend)
await window.Clerk.session.getToken()
```

### Force Refetch Dashboard Data
```javascript
// Add this temporarily to dashboard page
<Button onClick={() => refetch()}>Refresh Data</Button>
```

---

## ✅ Final Verification

Before considering testing complete, verify:

1. **Backend APIs**
   - [ ] All 3 endpoints return 200 status
   - [ ] Data structure matches TypeScript interfaces
   - [ ] Authentication works correctly

2. **Frontend Integration**
   - [ ] No TypeScript errors
   - [ ] No console errors in browser
   - [ ] All loading states work
   - [ ] All error states work
   - [ ] Real data displays correctly

3. **User Experience**
   - [ ] Page loads in < 2 seconds
   - [ ] Animations smooth
   - [ ] No layout shifts
   - [ ] Mobile responsive
   - [ ] Dark/light mode works

---

## 🎯 Success Criteria

✅ User can log in
✅ User can complete onboarding
✅ Dashboard loads with real data
✅ All API calls succeed
✅ No errors in console
✅ Loading states display
✅ Error handling works
✅ Empty states work
✅ UI matches design

**If all checkboxes are ticked, integration is successful!** 🎉

---

## 📞 Need Help?

### Backend Issues
- Check: `backend/.env` configuration
- Check: Backend console for errors
- Check: `http://localhost:3002/health` endpoint

### Frontend Issues  
- Check: `frontend/.env.local` configuration
- Check: Browser console for errors
- Check: Network tab for failed requests

### Clerk Issues
- Check: Clerk Dashboard settings
- Check: OAuth providers enabled
- Check: API keys match environment files
