# TwinLink Authentication with Clerk

This document describes the Clerk authentication implementation for TwinLink.

## 🎯 Overview

TwinLink uses **Clerk** for authentication with Google and GitHub OAuth providers. The implementation follows Clerk's official Next.js best practices and provides:

- ✅ OAuth authentication (Google & GitHub)
- ✅ Protected routes with middleware
- ✅ Onboarding flow for new users
- ✅ Persistent authentication across sessions
- ✅ Loading states during authentication
- ✅ Error handling with user-friendly messages
- ✅ Automatic redirect to dashboard after onboarding

## 🔐 Authentication Flow

### Sign Up Flow

1. User clicks "Continue with Google" or "Continue with GitHub" on `/signup`
2. Redirected to OAuth provider (Google/GitHub)
3. User authenticates with their account
4. OAuth provider redirects back to TwinLink
5. Clerk creates user session
6. User redirected to `/onboarding`
7. User completes 3-step onboarding process
8. User metadata updated with `onboardingComplete: true`
9. User redirected to `/dashboard`

### Login Flow

1. User clicks "Continue with Google" or "Continue with GitHub" on `/login`
2. Redirected to OAuth provider
3. User authenticates
4. Redirected back to TwinLink
5. Clerk validates existing session
6. **If onboarding complete:** Redirect to `/dashboard`
7. **If onboarding incomplete:** Redirect to `/onboarding`

## 📁 File Structure

```
app/
├── layout.tsx                 # ClerkProvider wrapper
├── login/
│   └── page.tsx              # Login page with OAuth buttons
├── signup/
│   └── page.tsx              # Signup page with OAuth buttons
├── sso-callback/
│   └── page.tsx              # OAuth callback handler
├── onboarding/
│   └── page.tsx              # 3-step onboarding flow
└── dashboard/
    └── page.tsx              # Protected dashboard

middleware.ts                  # Route protection & redirects
.env.local                    # Environment variables (not in git)
```

## 🛡️ Route Protection

### Public Routes (No Auth Required)
- `/` - Landing page
- `/login` - Login page
- `/signup` - Signup page
- `/sso-callback` - OAuth callback

### Onboarding Required
- `/onboarding` - Accessible only to authenticated users who haven't completed onboarding

### Protected Routes (Auth + Onboarding Required)
- `/dashboard`
- `/profile`
- `/settings`
- `/matches`
- `/messages`

## 🔧 Configuration

### Environment Variables

Required in `.env.local`:

```env
# Clerk Authentication Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

### Clerk Dashboard Configuration

1. **Enable OAuth Providers:**
   - Go to Clerk Dashboard → Settings → Authentication
   - Enable Google OAuth
   - Enable GitHub OAuth
   - Configure redirect URIs

2. **OAuth Redirect URIs:**
   - Development: `http://localhost:3001/sso-callback`
   - Production: `https://yourdomain.com/sso-callback`

## 🎨 UI Components

### Login Page (`/login`)
- Email/Password form (optional, currently email-based)
- Google OAuth button with loading state
- GitHub OAuth button with loading state
- Error message display
- Link to signup page

### Signup Page (`/signup`)
- Name, Email, Password fields (optional)
- Google OAuth button with loading state
- GitHub OAuth button with loading state
- Terms of Service checkbox
- Error message display
- Link to login page

### Onboarding Page (`/onboarding`)
- **Step 1:** Select interests (Technology, Music, Sports, etc.)
- **Step 2:** Write bio (character count: 500 max)
- **Step 3:** Choose connection type (Friendship, Dating, etc.)
- Progress bar showing completion percentage
- Back/Next navigation
- Final step updates user metadata

### Dashboard Page (`/dashboard`)
- Welcome message with user's name
- Stats cards (Connections, Messages, Twin Activity)
- Digital Twin status card with active indicator
- User interests display
- UserButton for sign out
- Protected route - requires completed onboarding

## 🔒 Middleware Logic

```typescript
// middleware.ts

1. Check if route is public → Allow access
2. Check if user is authenticated → If not, redirect to /login
3. Check if user completed onboarding:
   - If yes & accessing /onboarding → Redirect to /dashboard
   - If no & accessing protected route → Redirect to /onboarding
4. Allow access
```

## 📊 User Metadata

Stored in `user.unsafeMetadata`:

```typescript
{
  onboardingComplete: boolean,
  interests: string[],
  bio: string,
  lookingFor: string
}
```

## 🧪 Testing the Flow

### Test New User Sign Up

1. Open `http://localhost:3001/signup`
2. Click "Continue with Google" or "Continue with GitHub"
3. Authenticate with your account
4. Verify redirect to `/onboarding`
5. Complete all 3 onboarding steps
6. Verify redirect to `/dashboard`
7. Verify you see your name and interests
8. Refresh page - verify you stay logged in

### Test Existing User Login

1. Sign out from dashboard
2. Open `http://localhost:3001/login`
3. Click OAuth button
4. Verify redirect to `/dashboard` (onboarding already complete)

### Test Protected Routes

1. Sign out completely
2. Try accessing `http://localhost:3001/dashboard` directly
3. Verify redirect to `/login`
4. After login, verify redirect back works

### Test Onboarding Redirect

1. Sign up as new user
2. Get to onboarding page
3. Manually try to access `/dashboard`
4. Verify redirect back to `/onboarding`

## 🐛 Error Handling

### OAuth Errors
- Network failures → "Failed to connect with [Provider]. Please try again."
- User cancellation → Stays on login/signup page
- Invalid credentials → Clerk handles with error message

### Form Validation Errors
- Empty fields → Red border + error text
- Invalid email → "Valid email is required"
- Short password → "Password must be at least 8 characters"
- Password mismatch → "Passwords don't match"

### Session Errors
- Expired session → Automatic redirect to login
- Invalid token → Clerk handles refresh
- Network errors → Error message displayed

## 🚀 Deployment Checklist

- [ ] Update `.env` with production Clerk keys
- [ ] Add production domain to Clerk Dashboard
- [ ] Configure production OAuth redirect URIs
- [ ] Test OAuth flow on staging environment
- [ ] Verify all protected routes work
- [ ] Test onboarding completion flow
- [ ] Verify session persistence
- [ ] Test sign out functionality

## 🔄 Future Enhancements

- [ ] Email/password authentication (currently OAuth-only)
- [ ] Email verification flow
- [ ] Password reset functionality
- [ ] Multi-factor authentication (MFA)
- [ ] Social profile data sync
- [ ] User profile editing
- [ ] Account deletion flow

## 📚 Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk Next.js Guide](https://clerk.com/docs/quickstarts/nextjs)
- [Clerk Middleware](https://clerk.com/docs/references/nextjs/clerk-middleware)
- [OAuth Setup](https://clerk.com/docs/authentication/social-connections/overview)

## 🆘 Troubleshooting

### "Clerk is not configured" Error
- Check `.env.local` exists and has correct keys
- Restart dev server after adding keys
- Verify keys match Clerk Dashboard

### OAuth Redirect Not Working
- Check redirect URI in Clerk Dashboard matches exactly
- Verify `sso-callback` page exists
- Check browser console for errors

### Middleware Not Running
- Verify `middleware.ts` is in root directory
- Check `config.matcher` pattern matches your routes
- Restart dev server

### User Stuck in Onboarding Loop
- Check `user.unsafeMetadata.onboardingComplete` is set to `true`
- Verify middleware checks correct metadata path
- Clear browser cookies and try again

---

**Implementation Date:** January 2026  
**Clerk Version:** Latest (@clerk/nextjs)  
**Next.js Version:** 16.0.10
