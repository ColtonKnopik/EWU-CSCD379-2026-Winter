# Starfall Dominion Map API

ASP.NET Core Web API for managing game maps with Entity Framework Core and Azure SQL Server.

## Setup Instructions

### 1. Update Connection String

Edit `appsettings.json` and replace the connection string with your Azure SQL Server credentials:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=starfall-dominion-dbserver.database.windows.net;Database=StarfallDominionDb;User Id=YOUR_USERNAME;Password=YOUR_PASSWORD;Encrypt=True;TrustServerCertificate=False;"
}
```

### 2. Install Dependencies

```bash
cd backend
dotnet restore
```

### 3. Create Database Migration

```bash
dotnet ef migrations add InitialCreate
```

### 4. Update Database

```bash
dotnet ef database update
```

### 5. Run the API

```bash
dotnet run
```

The API will be available at:
- HTTP: `http://localhost:5000`
- HTTPS: `https://localhost:5001`
- Swagger UI: `https://localhost:5001/swagger`

## API Endpoints

### Maps

- `GET /api/maps` - Get all maps
- `GET /api/maps/{id}` - Get a specific map
- `POST /api/maps` - Create a new map
- `PUT /api/maps/{id}` - Update an existing map
- `DELETE /api/maps/{id}` - Delete a map

### Example Request Body (POST /api/maps)

```json
{
  "name": "Volcanic Arena",
  "description": "A dangerous map with lava pits",
  "terrainData": [
    { "row": 0, "col": 0, "terrainType": "land" },
    { "row": 0, "col": 1, "terrainType": "water" },
    { "row": 0, "col": 2, "terrainType": "lava" }
  ]
}
```

## Database Schema

### Maps Table
- `Id` (int, primary key)
- `Name` (string, required, max 100)
- `Description` (string, optional, max 500)
- `CreatedAt` (datetime)
- `UpdatedAt` (datetime, nullable)

### TerrainCells Table
- `Id` (int, primary key)
- `MapId` (int, foreign key)
- `Row` (int)
- `Col` (int)
- `TerrainType` (string, required, max 20)
- Unique index on (MapId, Row, Col)

## Terrain Types

Valid terrain types: `water`, `land`, `lava`, `void`, `mountain`, `spawn`, `flag`
