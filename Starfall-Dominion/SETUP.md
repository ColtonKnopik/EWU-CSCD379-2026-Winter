# 🚀 Quick Setup Guide

## Step 1: Install Dependencies

```bash
npm install better-sqlite3
npm install --save-dev @types/better-sqlite3
npm install --save-dev tsx
```

## Step 2: Start the Development Server

```bash
npm run dev
```

The database will be automatically created on first run at `game.db`

## Step 3: (Optional) Seed Example Maps

```bash
npx tsx scripts/seedMaps.ts
```

This will create 3 example maps:
- **Classic Battlefield** - Balanced map for beginners
- **Lava Fortress** - High-risk map with lava rivers
- **Water World** - Island warfare map

## Step 4: Try It Out!

1. Open http://localhost:3000
2. Click "Local Play"
3. See your seeded maps (or create a new one)
4. Click a map to play!

---

## 🎮 Usage

### Playing the Game:

**Main Menu → Local Play → Select Map → Play!**

or

**Main Menu → Local Play → Create Your First Map → Design → Save → Play!**

### Creating Maps:

**Main Menu → Map Editor → Design → Name It → Save to Database**

### Managing Maps:

**Map Editor → Load Map → Edit/Delete**

---

## 📂 Important Files

### Database:
- `game.db` - SQLite database (auto-created)
- `server/database/schema.sql` - Database schema
- `server/utils/database.ts` - Database connection

### API:
- `server/api/maps/` - All map CRUD endpoints

### Components:
- `components/MapSelector.vue` - Map selection modal
- `pages/MapEditor.vue` - Enhanced map editor
- `components/Game.vue` - Updated game with map loading

---

## 🔍 Verify Setup

### Check if database exists:
```bash
ls -la game.db
```

### Check if maps are seeded:
```bash
sqlite3 game.db "SELECT id, name FROM maps;"
```

Expected output:
```
1|Classic Battlefield
2|Lava Fortress
3|Water World
```

---

## 🐛 Common Issues

### "Cannot find module 'better-sqlite3'"
**Fix:** Run `npm install better-sqlite3`

### "Permission denied" on database
**Fix:** Make sure your project directory has write permissions

### Maps not appearing in selector
**Fix:** Check browser console for API errors, verify database exists

### "Database is locked"
**Fix:** Close any other processes using the database

---

## 🎯 Next Steps

1. ✅ Install dependencies
2. ✅ Start dev server
3. ✅ Seed example maps (optional)
4. ✅ Open browser and play!
5. 🎨 Create your own custom maps
6. 🎮 Challenge your friends!

---

**You're all set! Enjoy the game! 🎮✨**
