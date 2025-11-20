# Deploying to Vercel

This guide explains how to deploy the Methanol Vessel Intake Form to Vercel.

## Option 1: Deploy via Vercel CLI (Recommended)

### Prerequisites
1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

### Deployment Steps

1. Navigate to your project directory:
   ```bash
   cd C:\Users\dmoroz\Demo
   ```

2. Deploy to Vercel:
   ```bash
   vercel
   ```

3. Follow the prompts:
   - Set up and deploy? **Yes**
   - Which scope? (Select your account)
   - Link to existing project? **No**
   - Project name? (Press Enter for default or enter custom name)
   - Directory? (Press Enter for current directory)
   - Override settings? **No**

4. For production deployment:
   ```bash
   vercel --prod
   ```

## Option 2: Deploy via GitHub Integration

### Steps

1. **Push your code to GitHub** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/MorozDenis/methanol-vessel-intake-form.git
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository: `MorozDenis/methanol-vessel-intake-form`
   - Vercel will auto-detect the project settings

3. **Configure Project Settings**:
   - Framework Preset: **Other**
   - Root Directory: `.` (current directory)
   - Build Command: Leave empty (static file)
   - Output Directory: Leave empty
   - Install Command: Leave empty

4. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically deploy and provide you with a URL

## Option 3: Deploy via Vercel Dashboard (Drag & Drop)

1. Go to [vercel.com](https://vercel.com) and login
2. Click "Add New Project"
3. Select "Upload" or drag and drop your `vessel-intake-standalone.html` file
4. Vercel will deploy it automatically

## Configuration

The project includes a `vercel.json` file that:
- Serves the standalone HTML file as the root route
- Uses Vercel's static file serving

## Custom Domain

After deployment:
1. Go to your project settings in Vercel dashboard
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Environment Variables

If you need to add environment variables later:
1. Go to Project Settings → Environment Variables
2. Add your variables
3. Redeploy the project

## Troubleshooting

### Issue: 404 Not Found
- Ensure `vercel.json` is correctly configured
- Check that `vessel-intake-standalone.html` exists in the root directory

### Issue: Build Fails
- This is a static HTML file, so no build is needed
- Make sure Framework Preset is set to "Other"

## Post-Deployment

After successful deployment, you'll receive:
- **Production URL**: `https://your-project-name.vercel.app`
- **Preview URLs**: For each commit/pull request

The form will be accessible at the production URL and fully functional!

