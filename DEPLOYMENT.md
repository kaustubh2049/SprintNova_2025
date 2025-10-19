# Deployment Guide

## Deploy to Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

### Prerequisites
- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com))

### Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/xie-council.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Environment Variables**
   - In the Vercel dashboard, go to your project settings
   - Click "Environment Variables"
   - Add all variables from your `.env.local`:
     - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
     - `CLERK_SECRET_KEY`
     - `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
     - `NEXT_PUBLIC_CLERK_SIGN_UP_URL`
     - `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`
     - `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `EMAIL_HOST`
     - `EMAIL_PORT`
     - `EMAIL_USER`
     - `EMAIL_PASSWORD`
     - `EMAIL_FROM`
     - `ADMIN_USER_IDS`

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your site will be live at `https://your-project.vercel.app`

5. **Update Clerk Settings**
   - Go to your Clerk dashboard
   - Update the allowed redirect URLs to include your Vercel domain
   - Add your production domain to the whitelist

### Custom Domain (Optional)

1. Go to your Vercel project settings
2. Click "Domains"
3. Add your custom domain (e.g., council.xie.edu)
4. Follow the DNS configuration instructions
5. Update Clerk allowed domains

## Deploy to Netlify

### Steps

1. **Push to GitHub** (same as above)

2. **Import to Netlify**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Click "Add new site" > "Import an existing project"
   - Connect to GitHub and select your repository

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Click "Show advanced" and add environment variables

4. **Add Environment Variables**
   - Add all variables from your `.env.local`

5. **Deploy**
   - Click "Deploy site"
   - Wait for the build to complete

## Post-Deployment Checklist

- [ ] Test all pages load correctly
- [ ] Test authentication (sign up, sign in, sign out)
- [ ] Test admin panel access
- [ ] Test creating fests, events, and winners
- [ ] Test image uploads
- [ ] Test email sending
- [ ] Test mobile responsiveness
- [ ] Set up custom domain (if applicable)
- [ ] Enable HTTPS (automatic on Vercel/Netlify)
- [ ] Set up analytics (optional)
- [ ] Configure error monitoring (optional)

## Continuous Deployment

Both Vercel and Netlify automatically deploy when you push to your main branch:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Your site will automatically rebuild and deploy!

## Production Optimizations

### 1. Enable Image Optimization
Already configured in `next.config.js` for Supabase images.

### 2. Set Up Caching
Vercel and Netlify handle this automatically for Next.js.

### 3. Monitor Performance
- Use Vercel Analytics or Netlify Analytics
- Set up error tracking with Sentry (optional)

### 4. Database Backups
- Supabase automatically backs up your database
- Consider setting up additional backups for critical data

### 5. Email Monitoring
- Monitor email delivery rates
- Set up email logs review schedule

## Troubleshooting Deployment Issues

### Build Fails
- Check build logs for specific errors
- Ensure all dependencies are in `package.json`
- Verify TypeScript has no errors: `npm run build` locally

### Environment Variables Not Working
- Ensure all required variables are set
- Variables starting with `NEXT_PUBLIC_` are exposed to the browser
- Restart deployment after adding variables

### Images Not Loading
- Check Supabase storage permissions
- Verify image URLs are correct
- Check `next.config.js` image domains configuration

### Authentication Issues
- Update Clerk allowed domains to include production URL
- Check redirect URLs are correct
- Verify API keys are for production environment

### Database Connection Issues
- Check Supabase connection limits
- Verify RLS policies are correctly set
- Check service role key is correct

## Scaling Considerations

### Database
- Supabase free tier: 500MB database, 1GB file storage
- Upgrade to Pro for more resources
- Monitor database size and query performance

### Email
- Gmail has sending limits (500 emails/day)
- Consider upgrading to SendGrid or AWS SES for higher volume
- Implement email queue for bulk sending

### Performance
- Next.js automatically optimizes for production
- Use Vercel Edge Network for global CDN
- Monitor Core Web Vitals

## Security Best Practices

1. **Never commit `.env.local`** - Already in `.gitignore`
2. **Use environment variables** for all secrets
3. **Enable RLS** on Supabase tables (already configured)
4. **Restrict admin access** using Clerk user IDs
5. **Use HTTPS** (automatic on Vercel/Netlify)
6. **Regular updates** - Keep dependencies updated
7. **Monitor logs** - Check for suspicious activity

## Maintenance

### Regular Tasks
- Review email logs weekly
- Check error logs in Vercel/Netlify dashboard
- Update dependencies monthly: `npm update`
- Backup database monthly (in addition to automatic backups)
- Review and clean up old data quarterly

### Updates
```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

## Support

For deployment issues:
- Vercel: [vercel.com/support](https://vercel.com/support)
- Netlify: [netlify.com/support](https://netlify.com/support)
- Supabase: [supabase.com/docs](https://supabase.com/docs)
- Clerk: [clerk.com/docs](https://clerk.com/docs)

---

Your XIE Student Council platform is now live! 🚀
