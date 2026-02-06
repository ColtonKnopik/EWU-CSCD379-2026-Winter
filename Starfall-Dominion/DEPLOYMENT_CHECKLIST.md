# 🚀 Azure Deployment Checklist

## ✅ Pre-Deployment Setup

### Local Development (Already Done!)
- [x] Backend API working locally
- [x] Frontend working locally  
- [x] Database migrations created
- [x] appsettings.json configured for local dev
- [ ] Update your actual SQL credentials in `appsettings.json`

### Azure Resources (You Have!)
- [x] Azure SQL Server: `starfall-dominion-dbserver`
- [x] Azure SQL Database: `StarfallDominionDb`
- [x] Microsoft Authentication enabled

---

## 📦 Backend Deployment Steps

### 1. Install Azure CLI
```bash
# Check if installed
az --version

# If not: https://aka.ms/installazurecli
```

### 2. Install Azure.Identity Package
```bash
cd backend
dotnet add package Azure.Identity
dotnet restore
```

### 3. Create Azure App Service
```bash
# Login
az login

# Variables (CHANGE THESE!)
export RESOURCE_GROUP="starfall-dominion-rg"
export WEB_APP_NAME="starfall-dominion-api"  # Must be unique!
export APP_SERVICE_PLAN="starfall-api-plan"

# Create App Service Plan
az appservice plan create \
  --name $APP_SERVICE_PLAN \
  --resource-group $RESOURCE_GROUP \
  --sku B1 \
  --is-linux

# Create Web App
az webapp create \
  --name $WEB_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --plan $APP_SERVICE_PLAN \
  --runtime "DOTNET|8.0"
```

### 4. Enable Managed Identity
```bash
az webapp identity assign \
  --name $WEB_APP_NAME \
  --resource-group $RESOURCE_GROUP
```

### 5. Grant Database Access

**Go to Azure Portal:**
1. Open your SQL Database: `StarfallDominionDb`
2. Click "Query editor"
3. Login with your Microsoft account
4. Run this SQL:

```sql
CREATE USER [starfall-dominion-api] FROM EXTERNAL PROVIDER;
ALTER ROLE db_datareader ADD MEMBER [starfall-dominion-api];
ALTER ROLE db_datawriter ADD MEMBER [starfall-dominion-api];
ALTER ROLE db_ddladmin ADD MEMBER [starfall-dominion-api];
GO
```

### 6. Configure App Settings
```bash
# Set connection string (NO password needed!)
az webapp config connection-string set \
  --name $WEB_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --connection-string-type SQLAzure \
  --settings DefaultConnection="Server=tcp:starfall-dominion-dbserver.database.windows.net,1433;Database=StarfallDominionDb;Encrypt=True;"

# Set environment variables
az webapp config appsettings set \
  --name $WEB_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --settings \
    UseManagedIdentity=true \
    ASPNETCORE_ENVIRONMENT=Production
```

### 7. Deploy Backend
```bash
cd backend

# Build and publish
dotnet publish -c Release -o ./publish

# Create zip
cd publish
zip -r ../deploy.zip .
cd ..

# Deploy
az webapp deployment source config-zip \
  --name $WEB_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --src deploy.zip

# Check logs
az webapp log tail --name $WEB_APP_NAME --resource-group $RESOURCE_GROUP
```

### 8. Test Backend
```bash
# Get URL
BACKEND_URL=$(az webapp show --name $WEB_APP_NAME --resource-group $RESOURCE_GROUP --query defaultHostName -o tsv)

echo "Test: https://$BACKEND_URL/swagger"
```

---

## 🎨 Frontend Deployment Steps

### 1. Create .env.production
```bash
# In project root (not backend!)
echo "NUXT_PUBLIC_API_BASE=https://starfall-dominion-api.azurewebsites.net/api" > .env.production
```

### 2. Create Static Web App
```bash
export STATIC_WEB_APP_NAME="starfall-dominion-game"

az staticwebapp create \
  --name $STATIC_WEB_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --location "westus2" \
  --sku Free
```

### 3. Build Frontend
```bash
npm run build
```

### 4. Deploy Frontend
```bash
# Install SWA CLI
npm install -g @azure/static-web-apps-cli

# Get deployment token
DEPLOYMENT_TOKEN=$(az staticwebapp secrets list --name $STATIC_WEB_APP_NAME --resource-group $RESOURCE_GROUP --query properties.apiKey -o tsv)

# Deploy
swa deploy .output/public --deployment-token $DEPLOYMENT_TOKEN
```

### 5. Update Backend CORS
```bash
# Get frontend URL
FRONTEND_URL=$(az staticwebapp show --name $STATIC_WEB_APP_NAME --resource-group $RESOURCE_GROUP --query defaultHostname -o tsv)

# Update CORS
az webapp config appsettings set \
  --name $WEB_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --settings "AllowedOrigins__0=https://$FRONTEND_URL"

# Restart backend
az webapp restart --name $WEB_APP_NAME --resource-group $RESOURCE_GROUP
```

---

## ✅ Final Checks

### Backend Check
- [ ] Visit: `https://[your-app].azurewebsites.net/swagger`
- [ ] Try: `GET /api/maps` - should return 200
- [ ] Try: `POST /api/games` - should create a game

### Frontend Check
- [ ] Visit: `https://[your-app].azurestaticapps.net`
- [ ] Open browser DevTools → Network tab
- [ ] API calls should go to Azure backend
- [ ] No CORS errors

### Database Check
- [ ] Games are saved to Azure SQL
- [ ] Maps are persisted
- [ ] Actions are logged

---

## 🐛 Troubleshooting

### "Login failed" errors?
✅ **Solution**: Managed Identity SQL user created?
```sql
-- Run this in Azure Portal Query Editor:
SELECT name, type_desc FROM sys.database_principals WHERE type = 'E';
-- Should see: [starfall-dominion-api]
```

### CORS errors?
✅ **Solution**: Check `AllowedOrigins` in backend:
```bash
az webapp config appsettings list --name $WEB_APP_NAME --resource-group $RESOURCE_GROUP | grep AllowedOrigins
```

### Can't connect to database?
✅ **Solution**: Check firewall rules
```bash
az sql server firewall-rule create \
  --resource-group $RESOURCE_GROUP \
  --server starfall-dominion-dbserver \
  --name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

---

## 📝 Commands Summary

### Quick Deploy (After Initial Setup)

**Backend:**
```bash
cd backend
dotnet publish -c Release -o ./publish
cd publish && zip -r ../deploy.zip . && cd ..
az webapp deployment source config-zip --name starfall-dominion-api --resource-group starfall-dominion-rg --src deploy.zip
```

**Frontend:**
```bash
npm run build
swa deploy .output/public --deployment-token [YOUR_TOKEN]
```

---

## 🎉 Success!

Your game is now live on Azure with:
- ✅ Secure Managed Identity (no passwords in code!)
- ✅ Scalable App Service
- ✅ Fast Static Web App frontend
- ✅ Azure SQL Database
- ✅ HTTPS everywhere

**Share your game:** `https://[your-app].azurestaticapps.net` 🎮

---

## 📚 Documentation

- Full guide: `AZURE_DEPLOYMENT.md`
- Local dev: `QUICK_START.md`
- API integration: `FRONTEND_BACKEND_INTEGRATION.md`
