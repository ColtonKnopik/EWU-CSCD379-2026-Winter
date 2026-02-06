# Frontend-Backend Integration Guide

## 🚀 Quick Start

### 1. Start the Backend API
```bash
cd backend
dotnet run --launch-profile http
```
The API will be available at: **http://localhost:5000**

### 2. Start the Frontend
```bash
npm run dev
```
The frontend will be available at: **http://localhost:3000**

---

## 📡 API Configuration

### Environment Variables
Create or edit `.env` file in the root directory:

```env
NUXT_PUBLIC_API_BASE=http://localhost:5000/api
```

### Runtime Config
The API base URL is configured in `nuxt.config.ts`:

```typescript
runtimeConfig: {
  public: {
    apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:5000/api'
  }
}
```

---

## 🧪 Testing the Connection

### Option 1: API Test Page
Navigate to: **http://localhost:3000/api-test**

This page allows you to:
- Test the Maps API (`GET /api/maps`)
- Test the Games API (`GET /api/games`)
- Create a test game
- Check connection status

### Option 2: Browser DevTools
1. Open http://localhost:3000
2. Open browser DevTools (F12)
3. Check the Network tab for API calls to `localhost:5000`

### Option 3: Direct API Access
Open Swagger UI: **http://localhost:5000/swagger**

---

## 📦 Available Composables

### `useGameApi()`
Handles all game-related API calls:

```typescript
const gameApi = useGameApi()

// Create a new game
const game = await gameApi.createGame(mapId, player1Id, player2Id)

// Get game state
const gameState = await gameApi.getGame(gameId)

// Make a move
await gameApi.moveUnit(gameId, unitId, toRow, toCol)

// Attack
await gameApi.attackUnit(gameId, attackerUnitId, targetUnitId)

// End turn
await gameApi.endTurn(gameId)

// Get valid moves/attacks
const moves = await gameApi.getValidMoves(gameId, unitId)
const attacks = await gameApi.getValidAttacks(gameId, unitId)
```

### `useMapApi()`
Handles map-related API calls:

```typescript
const mapApi = useMapApi()

// Get all maps
const maps = await mapApi.getMaps()

// Get specific map
const map = await mapApi.getMap(mapId)

// Create map
await mapApi.createMap({ name, description, terrainData })

// Update map
await mapApi.updateMap(mapId, { name, description, terrainData })

// Delete map
await mapApi.deleteMap(mapId)
```

---

## 🎮 Playing a Game with Backend

### Start a New Game

```vue
<template>
  <button @click="startGame">Start Game</button>
</template>

<script setup>
const gameApi = useGameApi()
const router = useRouter()

async function startGame() {
  const game = await gameApi.createGame(
    1,           // Map ID
    'player1',   // Player 1 ID
    'player2'    // Player 2 ID
  )
  
  router.push(`/play?gameId=${game.id}`)
}
</script>
```

### Load Existing Game

```typescript
const gameApi = useGameApi()
const gameState = await gameApi.getGame(gameId)

// Game state includes:
// - units: All units on the board
// - flags: Flag ownership
// - terrainData: Map terrain
// - currentPlayer, turn, phase, etc.
```

---

## 🔄 Game Flow with Backend

### 1. **Create Game**
```typescript
const game = await gameApi.createGame(mapId, player1Id, player2Id)
// Phase: "placement"
```

### 2. **Place Units (Placement Phase)**
```typescript
await gameApi.placeUnit(gameId, {
  owner: 'player1',
  unitType: 'king',
  row: 0,
  col: 1
})
```

### 3. **End Turn (Transition to Playing)**
```typescript
await gameApi.endTurn(gameId)
// After both players place their kings, phase becomes "playing"
```

### 4. **Make Moves (Playing Phase)**
```typescript
// Get valid moves
const validMoves = await gameApi.getValidMoves(gameId, unitId)

// Move unit
await gameApi.moveUnit(gameId, unitId, toRow, toCol)
```

### 5. **Attack**
```typescript
// Get valid attacks
const validAttacks = await gameApi.getValidAttacks(gameId, unitId)

// Attack
await gameApi.attackUnit(gameId, attackerUnitId, targetUnitId)
```

### 6. **End Turn**
```typescript
await gameApi.endTurn(gameId)
// Switches to next player, resets unit actions, applies income
```

### 7. **Victory**
When a king dies, the game phase automatically becomes "victory" and `winner` is set.

---

## 🔌 API Endpoints

### Games
- `POST /api/games` - Create game
- `GET /api/games` - List games
- `GET /api/games/{id}` - Get game details
- `POST /api/games/{id}/units` - Place/purchase unit
- `POST /api/games/{id}/move` - Move unit
- `POST /api/games/{id}/attack` - Attack
- `POST /api/games/{id}/end-turn` - End turn
- `GET /api/games/{id}/valid-moves/{unitId}` - Get valid moves
- `GET /api/games/{id}/valid-attacks/{unitId}` - Get valid attacks
- `DELETE /api/games/{id}` - Delete game

### Maps
- `GET /api/maps` - List all maps
- `GET /api/maps/{id}` - Get map details
- `POST /api/maps` - Create map
- `PUT /api/maps/{id}` - Update map
- `DELETE /api/maps/{id}` - Delete map

---

## 🐛 Troubleshooting

### "Failed to fetch" errors
1. **Check backend is running**: Visit http://localhost:5000/swagger
2. **Check CORS**: Backend must allow `localhost:3000`
3. **Check API base URL**: Verify `.env` file has correct URL

### Connection refused
- Make sure backend is running on port 5000
- Check firewall settings

### 404 errors
- Verify API endpoint URLs in composables
- Check Swagger docs for correct endpoint paths

### Database errors
- Ensure migrations are applied: `dotnet ef database update`
- Check Azure SQL Server firewall rules
- Verify connection string in `appsettings.json`

---

## 📝 Next Steps

1. ✅ Test API connection at `/api-test`
2. ⏳ Create a game using the API
3. ⏳ Update `Game.vue` component to use backend state
4. ⏳ Add real-time updates (polling or SignalR)
5. ⏳ Add authentication
6. ⏳ Deploy to production

---

## 🔐 Security Notes

- All game logic is now validated on the backend
- Clients cannot cheat by manipulating moves/attacks
- Gold and economy managed server-side
- Victory conditions checked server-side

The frontend is now just a **UI layer** - all game rules are enforced by the backend! 🎉
