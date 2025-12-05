# 🚀 GetLemons.XYZ - Complete Deployment Guide

## Part 1: GitHub Setup

### 1. Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `GetLemons.XYZ` (or your preferred name)
3. Description: "Asset repository platform for AE scripts and 3D assets"
4. Choose **Public** or **Private**
5. **DO NOT** initialize with README (we already have one)
6. Click "Create repository"

### 2. Push Your Code to GitHub
Run these commands in your terminal:

```bash
# Add GitHub as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/GetLemons.XYZ.git

# Push code to GitHub
git branch -M main
git push -u origin main
```

---

## Part 2: Supabase Setup

### 1. Create Supabase Project
1. Go to https://supabase.com
2. Sign in or create an account
3. Click "New Project"
4. Fill in:
   - **Name**: GetLemons
   - **Database Password**: (create a strong password - save it!)
   - **Region**: Choose closest to your users
5. Click "Create new project" (takes ~2 minutes)

### 2. Set Up Database
1. In your Supabase project, go to **SQL Editor** (left sidebar)
2. Click "New Query"
3. Copy and paste the entire contents of `supabase-setup.sql`
4. Click "Run" or press `Ctrl+Enter`
5. You should see "Success. No rows returned"

### 3. Get Your Supabase Credentials
1. In Supabase, go to **Project Settings** (gear icon)
2. Click **API** in the left menu
3. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

### 4. Update Local Environment
1. Open `.env.local` in your project
2. Replace with your actual values:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 5. Set Up Authentication (for Admin Panel)
1. In Supabase, go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Go to **Authentication** → **Users**
4. Click "Add user" → "Create new user"
5. Enter your email and password
6. This will be your admin account

---

## Part 3: Deploy to Vercel (Recommended)

### 1. Deploy to Vercel
1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Add New" → "Project"
4. Import your `GetLemons.XYZ` repository
5. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 2. Add Environment Variables
1. Before deploying, click "Environment Variables"
2. Add these variables:
   ```
   VITE_SUPABASE_URL = https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY = your_anon_key_here
   ```
3. Click "Deploy"

### 3. Set Up Custom Domain (Optional)
1. After deployment, go to your project in Vercel
2. Click "Settings" → "Domains"
3. Add your domain (e.g., `getlemons.xyz`)
4. Follow Vercel's instructions to update your DNS

---

## Alternative: Deploy to Netlify

### 1. Deploy to Netlify
1. Go to https://netlify.com
2. Sign in with GitHub
3. Click "Add new site" → "Import an existing project"
4. Choose GitHub and select your repository
5. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

### 2. Add Environment Variables
1. Go to "Site settings" → "Environment variables"
2. Add:
   ```
   VITE_SUPABASE_URL = https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY = your_anon_key_here
   ```
3. Click "Deploy site"

---

## Part 4: Testing Your Deployment

### 1. Test the Site
1. Wait for deployment to complete (~2 minutes)
2. Click on the deployment URL (e.g., `your-project.vercel.app`)
3. You should see your site with the pulse background!

### 2. Test Admin Features
1. On your deployed site, click the admin icon or navigate to admin
2. Log in with the email/password you created in Supabase
3. Try adding a new asset
4. Check that it appears in the repository

### 3. Verify Database Connection
1. In Supabase, go to **Table Editor** → **assets**
2. You should see the assets you added through the admin panel

---

## Part 5: Continuous Deployment

Once set up, any time you push code to GitHub:
```bash
git add .
git commit -m "Your commit message"
git push
```

Your site will automatically redeploy! 🎉

---

## Troubleshooting

### Site loads but admin doesn't work
- Check environment variables are set correctly in Vercel/Netlify
- Verify Supabase URL and key are correct
- Check browser console for errors

### Can't log in
- Verify you created a user in Supabase Authentication
- Check that email authentication is enabled
- Try resetting the password in Supabase

### Database errors
- Re-run the `supabase-setup.sql` script
- Check RLS policies are enabled
- Verify table exists in Supabase Table Editor

### Build fails
- Check all dependencies are in `package.json`
- Verify build command is `npm run build`
- Check for TypeScript errors locally first

---

## 📞 Need Help?

- Supabase Docs: https://supabase.com/docs
- Vercel Docs: https://vercel.com/docs
- GitHub Issues: Create an issue in your repository

---

## 🎉 You're Done!

Your site is now live and connected to Supabase. You can:
- ✅ Manage content through the admin panel
- ✅ Add new assets to the repository
- ✅ Edit homepage content
- ✅ Customize the pulse background
- ✅ Push updates via Git

Enjoy your new platform! 🍋
