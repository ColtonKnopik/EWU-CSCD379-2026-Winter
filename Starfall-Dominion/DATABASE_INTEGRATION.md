# 🗺️ Database Integration & Map System

## 📋 Overview

This implementation adds **database integration** to your tactical strategy game with a complete **custom map system**. Players can now create, save, and play on custom maps!

---

## 🚀 Features

### ✅ **Database Integration**
- SQLite database with better-sqlite3
- Full CRUD API for map management
- Persistent storage of custom maps
- Game history tracking (ready for future features)

### ✅ **Enhanced Map Editor**
- Save maps to database with names & descriptions
- Load any saved map for editing
- Delete unwanted maps
- Export maps as JSON files
- Real-time status feedback
- Beautiful modal UI for map management

### ✅ **Map Selection System**
- Map selector component with grid view
- Play with default map or custom maps
- Preview map details before playing
- Direct link to map editor

### ✅ **Updated Game System**
- Load custom maps via URL parameter (`/game?mapId=1`)
- Fallback to default map if no map specified
- Seamless integration with existing game logic

---

## 📦 Installation

### 1. Install Dependencies

```bash
npm install better-sqlite3
npm install --save-dev @types/better-sqlite3
```

### 2. Database will be auto-created on first run

The database file `game.db` will be created automatically in your project root when you first start the server.

---

## 🎮 How to Use

### **For Players:**

1. **Start from Main Menu** (`/`)
   - Click "Local Play" to open map selector
   - Choose a custom map or create your first one
   - Or play with the default map

2. **Play Custom Map**
   - Select from available custom maps
   - Maps show name, description, and last update time
   - Click any map to start playing

### **For Map Creators:**

1. **Open Map Editor** (`/MapEditor` or `/mapeditor`)
   
2. **Create Your Map:**
   - Enter a unique map name (required)
   - Add an optional description
   - Click terrain types to select
   - Click cells to paint terrain
   
3. **Save Your Map:**
   - Click "💾 Save to Database"
   - Map is saved with name and description
   - Can update existing maps

4. **Manage Maps:**
   - Click "📂 Load Map" to see all saved maps
   - Load any map for editing
   - Delete unwanted maps
   - Export maps as JSON

---

## 🗂️ Database Schema

### **Maps Table**
```sql
CREATE TABLE maps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  terrain_data TEXT NOT NULL, -- JSON string
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### **Games Table** (Future Feature)
```sql
CREATE TABLE games (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  map_id INTEGER NOT NULL,
  winner TEXT,
  final_turn INTEGER,
  played_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (map_id) REFERENCES maps(id) ON DELETE CASCADE
);
```

---

## 🔌 API Endpoints

### **GET** `/api/maps`
Get all maps (list view - no terrain data)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Lava Fortress",
      "description": "A challenging map with rivers of lava",
      "created_at": "2025-01-15T10:30:00.000Z",
      "updated_at": "2025-01-15T10:30:00.000Z"
    }
  ]
}
```

### **GET** `/api/maps/:id`
Get specific map with terrain data

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Lava Fortress",
    "description": "A challenging map with rivers of lava",
    "terrain_data": [
      ["0-0", "land"],
      ["0-1", "lava"],
      // ... more terrain data
    ],
    "created_at": "2025-01-15T10:30:00.000Z",
    "updated_at": "2025-01-15T10:30:00.000Z"
  }
}
```

### **POST** `/api/maps`
Create a new map

**Request Body:**
```json
{
  "name": "My Awesome Map",
  "description": "Optional description",
  "terrain_data": [
    ["0-0", "land"],
    ["0-1", "water"]
  ]
}
```

### **PUT** `/api/maps/:id`
Update existing map

**Request Body:** Same as POST

### **DELETE** `/api/maps/:id`
Delete a map

---

## 📁 New Files Created

```
server/
├── api/
│   └── maps/
│       ├── index.get.ts       # List all maps
│       ├── index.post.ts      # Create map
│       ├── [id].get.ts        # Get specific map
│       ├── [id].put.ts        # Update map
│       └── [id].delete.ts     # Delete map
├── database/
│   └── schema.sql             # Database schema
└── utils/
    └── database.ts            # Database connection utility

components/
└── MapSelector.vue            # Map selection modal

```

---

## 🎯 Workflow Example

### Creating and Playing a Custom Map:

1. **Player A creates a map:**
   ```
   Main Menu → Map Editor
   → Design terrain
   → Name: "Island Fortress"
   → Description: "Water surrounds a mountain fortress"
   → Save to Database ✓
   ```

2. **Player B selects the map:**
   ```
   Main Menu → Local Play
   → See "Island Fortress" in list
   → Click to play
   → Game starts with custom map! 🎮
   ```

3. **Player A edits the map:**
   ```
   Map Editor → Load Map
   → Select "Island Fortress"
   → Make changes
   → Save (updates existing map) ✓
   ```

---

## 🔮 Future Enhancements

The database structure supports these future features:

1. **Game History:**
   - Track wins/losses per map
   - Leaderboards
   - Map statistics (most played, win rates)

2. **Map Ratings:**
   - Players rate maps
   - Sort by popularity
   - Featured maps

3. **Map Sharing:**
   - Export/import map codes
   - Community map repository
   - Map thumbnails/previews

4. **Multiplayer:**
   - Map selection in online lobbies
   - Vote for maps
   - Random map selection

---

## 🐛 Troubleshooting

### Database not creating?
- Make sure `better-sqlite3` is installed
- Check write permissions in project directory
- Check server logs for errors

### Maps not loading?
- Check browser console for API errors
- Verify database file exists (`game.db`)
- Check API endpoint responses

### Can't save map?
- Ensure map name is unique
- Check that all required fields are filled
- Verify API is running

---

## 🎨 UI Features

### Map Editor:
- ✅ Real-time terrain painting
- ✅ Name & description fields
- ✅ Status messages (success/error)
- ✅ Modal for map management
- ✅ Beautiful card-based map list
- ✅ Confirmation dialogs

### Map Selector:
- ✅ Grid layout for maps
- ✅ Hover effects
- ✅ Loading states
- ✅ Empty state handling
- ✅ Direct link to editor
- ✅ Quick play buttons

---

## 💡 Tips

1. **Map Names Must Be Unique**
   - Each map needs a unique name
   - Update existing maps to modify them

2. **Test Your Maps**
   - Play your map before sharing
   - Check spawn point balance
   - Ensure paths to flags

3. **Backup Important Maps**
   - Use "Export JSON" feature
   - Keep backups of favorite maps
   - Can re-import if needed

---

**Enjoy creating and playing on custom maps! 🎮🗺️**
