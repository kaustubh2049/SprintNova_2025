# ⚡ Quick Start - 5 Minutes Setup

## 🎯 Goal
Get your XIE Student Council website running with Supabase in 5 minutes!

## ✅ Prerequisites
- [ ] Node.js installed
- [ ] Project downloaded
- [ ] Terminal/Command Prompt open

---

## 📝 Step-by-Step (5 Minutes)

### **1️⃣ Create Supabase Account (1 min)**
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub or email

### **2️⃣ Create Project (1 min)**
1. Click "New Project"
2. Name: `xie-student-council`
3. Password: Create strong password (SAVE IT!)
4. Region: Choose closest to you
5. Click "Create new project"
6. ⏳ Wait 2 minutes for setup

### **3️⃣ Get API Keys (30 sec)**
1. Click "Settings" → "API"
2. Copy these 3 values:
   - Project URL
   - anon public key
   - service_role key

### **4️⃣ Update .env File (30 sec)**
1. Open `.env` file in project root
2. Replace these lines:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

### **5️⃣ Create Database Tables (1 min)**
1. In Supabase Dashboard → Click "SQL Editor"
2. Click "New Query"
3. Copy ALL content from `supabase/01-create-tables.sql`
4. Paste and click "Run"
5. ✅ Wait for success message

### **6️⃣ Add Sample Data (30 sec)**
1. Still in SQL Editor → Click "New Query"
2. Copy ALL content from `supabase/02-insert-sample-data.sql`
3. Paste and click "Run"
4. ✅ You should see: "3 Fests, 24 Events, 21 Winners..."

### **7️⃣ Test Connection (30 sec)**
```bash
node scripts/test-supabase-connection.js
```

You should see:
```
✅ Fests: 3
✅ Events: 24
✅ Winners: 21
✅ Gallery: 12
✅ Drafts: 12
```

### **8️⃣ Start Website (10 sec)**
```bash
npm run dev
```

### **9️⃣ Test Website (30 sec)**
Open browser: `http://localhost:3000`

Check these pages:
- ✅ Home page loads
- ✅ Events shows 24 events
- ✅ Gallery shows 12 photos
- ✅ Standings shows medal tally
- ✅ Notices shows 12 announcements

### **🔟 Test Admin Panel (30 sec)**
1. Go to: `http://localhost:3000/admin`
2. Password: `admin123`
3. Click "Fest Management"
4. ✅ You should see 3 fests!

---

## 🎉 Done! Your Website is Live!

### What You Have Now:
- ✅ 3 Fests (Sparx, Spandan, Transmission)
- ✅ 24 Events across all fests
- ✅ 21 Winners with medals
- ✅ 12 Gallery photos
- ✅ 12 Notices/Announcements
- ✅ Fully functional admin panel
- ✅ Beautiful public website

### Next Steps:
1. **Customize** fest dates and names
2. **Upload** real event photos
3. **Add** actual winners
4. **Update** notices with real announcements
5. **Change** admin password (in `app/admin/page.tsx` line 29)

---

## 🆘 Troubleshooting

### ❌ "relation does not exist"
**Fix**: Run `01-create-tables.sql` again in SQL Editor

### ❌ No data showing
**Fix**: 
1. Check `.env` file has correct Supabase URL
2. Restart: `npm run dev`

### ❌ Test script fails
**Fix**: 
1. Make sure `.env` file is updated
2. Check Supabase project is running (green status)

### ❌ Admin pages redirect
**Fix**: Already fixed! Just login with `admin123`

---

## 📚 Full Documentation

- **Complete Setup**: See `SUPABASE_SETUP.md`
- **All Features**: See `SETUP_GUIDE.md`
- **Database Schema**: See `supabase/01-create-tables.sql`

---

## 🎊 Success Checklist

- [ ] Supabase account created
- [ ] Project created
- [ ] API keys in `.env` file
- [ ] Tables created (7 tables)
- [ ] Sample data inserted
- [ ] Test script passes
- [ ] Website loads with data
- [ ] Admin panel works
- [ ] Can add/edit data

**If all checked ✅ - You're ready to go! 🚀**
