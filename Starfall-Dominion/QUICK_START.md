# Quick Start Guide - Starfall Dominion with Backend

## ⚡ Quick Start (2 Steps!)

### Step 1: Start Backend (Terminal 1)
```bash
cd backend
dotnet run
```
✅ Backend API running at: http://localhost:5000

### Step 2: Start Frontend (Terminal 2)  
```bash
npm run dev
```
✅ Frontend running at: http://localhost:3000

### Step 3: Test Connection
Open your browser: **http://localhost:3000/api-test**

Click the test buttons to verify everything works!

---

## 🎮 How to Play

1. Go to http://localhost:3000/api-test
2. Click **"Create Game"**
3. Click **"Play This Game"**
4. Enjoy! 🎉

---

## 📖 Full Documentation

- **Integration Guide**: `FRONTEND_BACKEND_INTEGRATION.md`
- **Backend README**: `backend/README.md`
- **API Docs**: http://localhost:5000/swagger

---

## 🐛 Troubleshooting

### Backend won't start?
- Check if SQL Server firewall allows your IP
- Verify `appsettings.json` has correct credentials
- Run: `dotnet ef database update`

### Frontend can't connect?
- Make sure backend is running on port 5000
- Check `.env` file has: `NUXT_PUBLIC_API_BASE=http://localhost:5000/api`
- Clear browser cache and restart dev server

### Database errors?
```bash
cd backend
dotnet ef migrations add InitialCreate
dotnet ef database update
```

---

## 🔥 Quick Commands

### Backend
```bash
# Run backend
cd backend && dotnet run

# Create migration
cd backend && dotnet ef migrations add MigrationName

# Update database
cd backend && dotnet ef database update

# Watch mode (auto-restart on changes)
cd backend && dotnet watch run
```

### Frontend
```bash
# Dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## ✨ What You Can Do Now

✅ Create games via API  
✅ Load game state from database  
✅ Make moves validated by backend  
✅ Attack with server-side rules  
✅ Track game history  
✅ Manage flags and income  
✅ Detect victory conditions  

**All game logic is now secure on the backend!** 🎉

---

## 📚 Learn More

- View all API endpoints: http://localhost:5000/swagger
- Test API: http://localhost:3000/api-test
- Read full guide: `FRONTEND_BACKEND_INTEGRATION.md`

Ready to build something awesome! 🚀
