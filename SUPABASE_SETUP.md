# 🚀 Complete Supabase Setup Guide

## Step 1: Create Supabase Account

1. **Go to** [supabase.com](https://supabase.com)
2. **Click** "Start your project"
3. **Sign up** with GitHub (recommended) or email
4. **Verify** your email if needed

## Step 2: Create New Project

1. **Click** "New Project"
2. **Fill in details**:
   - **Name**: `xie-student-council` (or any name)
   - **Database Password**: Create a strong password (SAVE THIS!)
   - **Region**: Choose closest to you (e.g., Mumbai for India)
   - **Pricing Plan**: Free tier is perfect
3. **Click** "Create new project"
4. **Wait** 2-3 minutes for setup to complete

## Step 3: Get Your Credentials

Once your project is ready:

### 3.1 Get API Keys

1. **Click** "Settings" (gear icon) in left sidebar
2. **Click** "API" under Project Settings
3. **Copy** these values:

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3.2 Update Your .env File

1. **Open** `.env` file in your project root
2. **Replace** the placeholder values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. **Save** the file

## Step 4: Create Database Tables

1. **Go to** Supabase Dashboard
2. **Click** "SQL Editor" in left sidebar
3. **Click** "New Query"
4. **Copy** entire content from `supabase/01-create-tables.sql`
5. **Paste** into SQL Editor
6. **Click** "Run" (or press Ctrl+Enter)
7. **Wait** for success message

### ✅ You should see:
```
✅ All tables created successfully!
✅ Indexes created for better performance!
✅ Row Level Security enabled!
✅ Policies configured!
```

## Step 5: Insert Sample Data

1. **Still in SQL Editor**, click "New Query"
2. **Copy** entire content from `supabase/02-insert-sample-data.sql`
3. **Paste** into SQL Editor
4. **Click** "Run"
5. **Wait** for success message

### ✅ You should see:
```
✅ Sample data inserted successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Data Summary:
   • Fests: 3
   • Events: 24
   • Winners: 21
   • Gallery Photos: 12
   • Notices: 12
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Step 6: Verify Tables Created

1. **Click** "Table Editor" in left sidebar
2. **You should see** these tables:
   - ✅ fests
   - ✅ events
   - ✅ winners
   - ✅ gallery
   - ✅ drafts
   - ✅ email_lists
   - ✅ email_logs

3. **Click** on each table to see sample data

## Step 7: Set Up Storage (For Images)

1. **Click** "Storage" in left sidebar
2. **Click** "Create a new bucket"
3. **Name**: `gallery-images`
4. **Public bucket**: ✅ YES (check this!)
5. **Click** "Create bucket"

### Upload Test Image:
1. **Click** on `gallery-images` bucket
2. **Click** "Upload file"
3. **Select** any image from your computer
4. **After upload**, click on the image
5. **Copy** the public URL
6. **Use this URL** when adding photos in admin panel

## Step 8: Test Connection

1. **Restart** your dev server:
   ```bash
   npm run dev
   ```

2. **Open** browser: `http://localhost:3000`

3. **Check** these pages:
   - ✅ Home page loads
   - ✅ Events page shows 24 events
   - ✅ Gallery shows 12 photos
   - ✅ Standings shows medal tally
   - ✅ Notices shows 12 announcements

## Step 9: Test Admin Panel

1. **Go to** `http://localhost:3000/admin`
2. **Login** with password: `admin123`
3. **Click** "Fest Management"
4. **You should see** 3 fests (Sparx, Spandan, Transmission)
5. **Try adding** a new fest
6. **Check** if it appears in the list

### Test Each Admin Page:
- ✅ Fest Management - Add/Edit/Delete fests
- ✅ Event Management - Add/Edit/Delete events
- ✅ Winner Management - Add/Edit/Delete winners
- ✅ Gallery Management - Add/Edit/Delete photos
- ✅ Draft Management - Add/Edit/Delete notices
- ✅ Reports - View statistics and download CSV

## 🎉 Success Checklist

- [ ] Supabase account created
- [ ] Project created and running
- [ ] API keys copied to `.env` file
- [ ] Tables created (7 tables)
- [ ] Sample data inserted
- [ ] Storage bucket created
- [ ] Website loads with data
- [ ] Admin panel works
- [ ] Can add/edit/delete data

## 🔧 Troubleshooting

### Issue: "relation does not exist"
**Solution**: Run `01-create-tables.sql` again

### Issue: No data showing on website
**Solution**: 
1. Check `.env` file has correct Supabase URL and keys
2. Restart dev server: `npm run dev`
3. Clear browser cache

### Issue: "Failed to fetch"
**Solution**:
1. Check Supabase project is running (green status)
2. Verify API keys are correct
3. Check internet connection

### Issue: Can't upload images
**Solution**:
1. Make sure storage bucket is PUBLIC
2. Check bucket name is `gallery-images`
3. Try uploading smaller image (< 5MB)

### Issue: RLS Policy Error
**Solution**: Tables have public read access by default. If you get errors, disable RLS temporarily:
```sql
ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
```

## 📊 Database Schema

```
fests
├── id (UUID)
├── name (TEXT)
├── type (cultural/technical/sports)
├── description (TEXT)
├── start_date (DATE)
├── end_date (DATE)
└── created_at (TIMESTAMP)

events
├── id (UUID)
├── fest_id (UUID) → fests.id
├── name (TEXT)
├── description (TEXT)
├── event_date (DATE)
├── venue (TEXT)
└── created_at (TIMESTAMP)

winners
├── id (UUID)
├── event_id (UUID) → events.id
├── fest_id (UUID) → fests.id
├── student_name (TEXT)
├── class (TEXT)
├── department (TEXT)
├── medal (gold/silver/bronze)
└── created_at (TIMESTAMP)

gallery
├── id (UUID)
├── fest_id (UUID) → fests.id
├── event_id (UUID) → events.id
├── title (TEXT)
├── description (TEXT)
├── image_url (TEXT)
└── created_at (TIMESTAMP)

drafts
├── id (UUID)
├── title (TEXT)
├── content (TEXT)
├── file_url (TEXT)
├── status (draft/published)
├── published_at (TIMESTAMP)
└── created_at (TIMESTAMP)
```

## 🎯 Next Steps

1. **Customize** sample data with your college info
2. **Upload** real event photos to storage
3. **Add** your actual fest dates
4. **Update** winner names with real students
5. **Create** email lists with actual emails
6. **Test** all features thoroughly

## 📞 Support

If you face any issues:
1. Check Supabase Dashboard for errors
2. Check browser console (F12) for errors
3. Check terminal for server errors
4. Verify all environment variables are set

## 🎊 You're All Set!

Your XIE Student Council website is now fully connected to Supabase and ready to use!

**Happy Managing! 🚀**
