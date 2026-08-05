# Clerk Dashboard Setup Guide

## 🎯 Quick Setup (5 Minutes)

Follow these steps to configure your Clerk Dashboard for TwinLink authentication.

---

## Step 1: Access Clerk Dashboard

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Sign in with your account
3. Select your TwinLink application (or create one if needed)

---

## Step 2: Enable Google OAuth

### Navigate to Social Connections
1. Click **"User & Authentication"** in left sidebar
2. Click **"Social connections"**
3. Find **"Google"** in the list

### Configure Google
1. Click the **toggle** to enable Google
2. **Option A - Use Clerk's Shared Credentials (Quick Start):**
   - ✅ Just toggle it on - Clerk provides credentials
   - ⚠️ Limited to development only
   - Works immediately for testing

3. **Option B - Use Your Own Google OAuth App (Production):**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create new OAuth 2.0 credentials
   - Add these to Clerk Dashboard:
     - Client ID
     - Client Secret
   - Add authorized redirect URIs in Google:
     - `https://[your-clerk-domain].clerk.accounts.dev/v1/oauth_callback`

4. Click **"Save"**

---

## Step 3: Enable GitHub OAuth

### Navigate to Social Connections
1. In the same **"Social connections"** page
2. Find **"GitHub"** in the list

### Configure GitHub
1. Click the **toggle** to enable GitHub
2. **Option A - Use Clerk's Shared Credentials (Quick Start):**
   - ✅ Just toggle it on
   - ⚠️ Limited to development only
   - Works immediately for testing

3. **Option B - Use Your Own GitHub OAuth App (Production):**
   - Go to [GitHub Developer Settings](https://github.com/settings/developers)
   - Click **"New OAuth App"**
   - Fill in:
     - **Application name:** TwinLink
     - **Homepage URL:** `http://localhost:3001` (dev) or your domain
     - **Authorization callback URL:** `https://[your-clerk-domain].clerk.accounts.dev/v1/oauth_callback`
   - Copy Client ID and Client Secret to Clerk
   
4. Click **"Save"**

---

## Step 4: Configure Redirect URLs

### Set Application URLs
1. Click **"Account Portal"** in left sidebar
2. Click **"Redirects"** tab
3. Add these URLs:

**For Development:**
- **Sign-in fallback redirect URL:** `http://localhost:3001/dashboard`
- **Sign-up fallback redirect URL:** `http://localhost:3001/onboarding`
- **After sign-out URL:** `http://localhost:3001/`

**For Production (when deploying):**
- Replace `localhost:3001` with your production domain

---

## Step 5: Verify Environment Variables

Make sure your `.env.local` has the correct keys:

```env
# These keys are from your Clerk Dashboard → API Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# These match your routes
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

### Where to Find API Keys:
1. Go to Clerk Dashboard
2. Click **"API Keys"** in left sidebar
3. Copy the **Publishable key** (starts with `pk_test_`)
4. Copy the **Secret key** (starts with `sk_test_`)
5. Paste into `.env.local`

---

## Step 6: Test the Integration

### Test Google OAuth
1. Open `http://localhost:3001/signup`
2. Click **"Continue with Google"**
3. You should see Google account picker
4. Select an account
5. Grant permissions
6. You should be redirected to `/onboarding`

### Test GitHub OAuth
1. Open `http://localhost:3001/signup`
2. Click **"Continue with GitHub"**
3. You should see GitHub authorization page
4. Click **"Authorize"**
5. You should be redirected to `/onboarding`

---

## Step 7: Configure User Metadata (Optional)

To store onboarding data:

1. Click **"Users"** in Clerk Dashboard
2. Click any user
3. You'll see **"Metadata"** section
4. Our app stores:
   ```json
   {
     "onboardingComplete": true,
     "interests": ["Technology", "Music"],
     "bio": "User's bio text",
     "lookingFor": "Friendship"
   }
   ```

This data is automatically saved by the onboarding page when users complete setup.

---

## 🚨 Common Issues & Solutions

### Issue 1: "Clerk is not configured"
**Solution:**
- Check `.env.local` exists in project root
- Verify keys are correct (no extra spaces)
- Restart dev server: `npm run dev`

### Issue 2: OAuth redirect fails
**Solution:**
- Check redirect URL in Clerk Dashboard matches exactly
- For Google: Verify redirect URI in Google Cloud Console
- For GitHub: Verify callback URL in GitHub OAuth App settings

### Issue 3: "Invalid publishable key"
**Solution:**
- Make sure you're using the correct key for your environment
- Development keys start with `pk_test_`
- Production keys start with `pk_live_`

### Issue 4: Users not being created
**Solution:**
- Check Clerk Dashboard → Users to see if they're created
- Verify OAuth providers are enabled
- Check browser console for errors

### Issue 5: Middleware not protecting routes
**Solution:**
- Verify `middleware.ts` is in project root (not in `app/`)
- Check `config.matcher` includes your routes
- Restart dev server

---

## 🔒 Production Checklist

Before deploying to production:

- [ ] Replace `pk_test_` key with `pk_live_` key
- [ ] Replace `sk_test_` key with `sk_live_` key
- [ ] Update redirect URLs to production domain
- [ ] Configure custom OAuth apps (not Clerk's shared credentials)
- [ ] Add production domain to Google Cloud Console
- [ ] Add production domain to GitHub OAuth App
- [ ] Test entire flow on staging environment
- [ ] Enable email verification (optional)
- [ ] Configure session timeout settings
- [ ] Set up webhook for user events (optional)

---

## 📊 Monitoring & Analytics

### View User Activity
1. Clerk Dashboard → **"Users"**
2. See all registered users
3. Click any user to see:
   - Sign-in history
   - OAuth connections
   - Metadata
   - Sessions

### View Sign-in Attempts
1. Clerk Dashboard → **"Events"**
2. See all authentication events:
   - Successful sign-ins
   - Failed attempts
   - OAuth connections
   - Sign-outs

---

## 🎨 Customize OAuth Buttons (Optional)

If you want to customize how OAuth buttons look in Clerk's UI components:

1. Clerk Dashboard → **"Customization"**
2. Click **"Appearance"**
3. Customize:
   - Colors
   - Fonts
   - Button styles
   - Logo

**Note:** TwinLink uses custom buttons, not Clerk's UI components, so this mainly affects the account portal.

---

## 📞 Support Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk Discord Community](https://clerk.com/discord)
- [Clerk Support](https://clerk.com/support)
- [Google OAuth Setup Guide](https://clerk.com/docs/authentication/social-connections/google)
- [GitHub OAuth Setup Guide](https://clerk.com/docs/authentication/social-connections/github)

---

## ✅ Setup Complete!

Your Clerk authentication is now fully configured. Users can sign up and sign in with:
- ✅ Google OAuth
- ✅ GitHub OAuth
- ✅ Persistent sessions
- ✅ Protected routes
- ✅ Onboarding flow

**Next:** Test the complete user journey from signup to dashboard!

---

**Last Updated:** January 2026  
**Clerk Version:** Latest  
**TwinLink Version:** 1.0
