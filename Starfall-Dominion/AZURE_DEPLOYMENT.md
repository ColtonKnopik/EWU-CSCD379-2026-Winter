# Azure Deployment Guide - Starfall Dominion

## 🎯 Overview

This guide walks you through deploying your game to Azure with:
- Backend API → **Azure App Service**
- Frontend → **Azure Static Web Apps**
- Database → **Azure SQL Database** (already created)
- Authentication → **Managed Identity** (secure, no passwords!)

---

## 📋 Prerequisites

✅ Azure SQL Server: `starfall-dominion-dbserver`  
✅ Azure SQL Database: `StarfallDominionDb`  
✅ Azure Account with permissions to create resources  
✅ Azure CLI installed: https://aka.ms/installazurecli  

---

## 🚀 Part 1: Deploy Backend to Azure App Service

### Step 1: Create Azure App Service

```bash
# Login to Azure
az login

# Set variables (customize these!)
RESOURCE_GROUP="starfall-dominion-rg"
LOCATION="westus2"
APP_SERVICE_PLAN="starfall-api-plan"
WEB_APP_NAME="starfall-dominion-api"  # Must be globally unique!

# Create resource group (if not exists)
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create App Service Plan (Linux, .NET 8)
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

### Step 2: Enable Managed Identity

```bash
# Enable system-assigned managed identity
az webapp identity assign \
  --name $WEB_APP_NAME \
  --resource-group $RESOURCE_GROUP

# Save the principal ID (you'll need it!)
PRINCIPAL_ID=$(az webapp identity show \
  --name $WEB_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query principalId -o tsv)

echo "Managed Identity Principal ID: $PRINCIPAL_ID"
```

### Step 3: Grant Database Access to Managed Identity

**Option A: Using Azure Portal**
1. Go to Azure Portal → SQL Database → `StarfallDominionDb`
2. Click **Query editor**
3. Login with your Azure AD account
4. Run this SQL:

```sql
CREATE USER [starfall-dominion-api] FROM EXTERNAL PROVIDER;
ALTER ROLE db_datareader ADD MEMBER [starfall-dominion-api];
ALTER ROLE db_datawriter ADD MEMBER [starfall-dominion-api];
ALTER ROLE db_ddladmin ADD MEMBER [starfall-dominion-api];
GO
```

**Option B: Using Azure CLI + SQL**
```bash
# Get your SQL server admin
SQL_SERVER="starfall-dominion-dbserver"

# You'll need to run the SQL commands above manually in the portal
# Azure CLI doesn't support this directly yet
```

### Step 4: Configure App Settings

```bash
# Set connection string (without username/password!)
az webapp config connection-string set \
  --name $WEB_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --connection-string-type SQLAzure \
  --settings DefaultConnection="Server=tcp:starfall-dominion-dbserver.database.windows.net,1433;Database=StarfallDominionDb;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"

# Set app settings
az webapp config appsettings set \
  --name $WEB_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --settings \
    UseManagedIdentity=true \
    ASPNETCORE_ENVIRONMENT=Production
```

### Step 5: Deploy Backend Code

**Option A: Deploy from Local (easiest for now)**
```bash
cd backend

# Publish the app
dotnet publish -c Release -o ./publish

# Create deployment package
cd publish
zip -r ../deploy.zip .
cd ..

# Deploy to Azure
az webapp deployment source config-zip \
  --name $WEB_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --src deploy.zip
```

**Option B: Deploy from GitHub (recommended for production)**
```bash
# Configure GitHub deployment
az webapp deployment source config \
  --name $WEB_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --repo-url https://github.com/ColtonKnopik/EWU-CSCD379-2026-Winter \
  --branch Assignment3 \
  --manual-integration
```

### Step 6: Test Backend

```bash
# Get your backend URL
BACKEND_URL=$(az webapp show \
  --name $WEB_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query defaultHostName -o tsv)

echo "Backend URL: https://$BACKEND_URL"

# Test it!
curl https://$BACKEND_URL/swagger
```

✅ **Backend deployed!** → `https://starfall-dominion-api.azurewebsites.net`

---

## 🎨 Part 2: Deploy Frontend to Azure Static Web Apps

### Step 1: Create Static Web App

```bash
STATIC_WEB_APP_NAME="starfall-dominion-game"

# Create Static Web App
az staticwebapp create \
  --name $STATIC_WEB_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --location "westus2" \
  --sku Free
```

### Step 2: Configure Frontend Environment

Update your frontend to use the production API:

**Create `.env.production` in your frontend root:**
```bash
NUXT_PUBLIC_API_BASE=https://starfall-dominion-api.azurewebsites.net/api
```

### Step 3: Build Frontend

```bash
# In your project root (not backend folder)
npm run build
```

### Step 4: Deploy Frontend

**Option A: Deploy via Azure CLI**
```bash
# Get deployment token
DEPLOYMENT_TOKEN=$(az staticwebapp secrets list \
  --name $STATIC_WEB_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query properties.apiKey -o tsv)

# Install SWA CLI
npm install -g @azure/static-web-apps-cli

# Deploy
swa deploy .output/public \
  --deployment-token $DEPLOYMENT_TOKEN
```

**Option B: Deploy via GitHub Actions (Recommended)**

Azure Static Web Apps will automatically create a GitHub Action. Just:
1. Push your code to GitHub
2. The workflow will auto-deploy!

### Step 5: Update CORS in Backend

```bash
# Get your frontend URL
FRONTEND_URL=$(az staticwebapp show \
  --name $STATIC_WEB_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query defaultHostname -o tsv)

echo "Frontend URL: https://$FRONTEND_URL"

# Update backend CORS settings
az webapp config appsettings set \
  --name $WEB_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --settings AllowedOrigins__0="https://$FRONTEND_URL"
```

### Step 6: Test Full Stack

Visit: `https://[your-static-app].azurestaticapps.net`

✅ **Frontend deployed!** → Should connect to backend and database!

---

## 🔐 Part 3: Security & Final Configuration

### Update Backend appsettings.Production.json

Edit `backend/appsettings.Production.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=starfall-dominion-dbserver.database.windows.net;Database=StarfallDominionDb;Encrypt=True;"
  },
  "UseManagedIdentity": true,
  "AllowedOrigins": [
    "https://[your-static-app].azurestaticapps.net"
  ],
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore": "Warning"
    }
  }
}
```

### Enable HTTPS Only

```bash
# Force HTTPS
az webapp update \
  --name $WEB_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --https-only true
```

### Configure Custom Domain (Optional)

```bash
# Add custom domain
az webapp config hostname add \
  --webapp-name $WEB_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --hostname yourdomain.com
```

---

## 📊 Monitoring & Troubleshooting

### View Backend Logs
```bash
az webapp log tail \
  --name $WEB_APP_NAME \
  --resource-group $RESOURCE_GROUP
```

### Check Connection
```bash
# Test backend API
curl https://starfall-dominion-api.azurewebsites.net/api/maps

# Check health
curl https://starfall-dominion-api.azurewebsites.net/swagger
```

### Common Issues

**1. Managed Identity not working?**
- Verify the identity is enabled: `az webapp identity show ...`
- Check database user exists in SQL
- Ensure firewall allows Azure services

**2. CORS errors?**
- Update `AllowedOrigins` in backend
- Restart the web app: `az webapp restart ...`

**3. Database connection fails?**
- Check connection string format
- Verify managed identity has permissions
- Check SQL firewall rules

---

## 💰 Cost Estimate

- **App Service (B1)**: ~$13/month
- **Azure SQL Database**: Varies (check your tier)
- **Static Web Apps (Free)**: $0
- **Total**: ~$13-50/month depending on SQL tier

---

## 🎉 Success Checklist

- [ ] Backend deployed to App Service
- [ ] Managed Identity enabled
- [ ] Database permissions granted
- [ ] Frontend deployed to Static Web Apps
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] HTTPS enforced
- [ ] Can create and play games!

---

## 📝 Quick Reference URLs

After deployment, you'll have:

- **Backend API**: `https://starfall-dominion-api.azurewebsites.net`
- **Swagger Docs**: `https://starfall-dominion-api.azurewebsites.net/swagger`
- **Frontend**: `https://[your-app].azurestaticapps.net`
- **Database**: `starfall-dominion-dbserver.database.windows.net`

---

## 🚀 Next Steps

1. Set up CI/CD with GitHub Actions
2. Add custom domain
3. Configure SSL certificate
4. Set up Application Insights for monitoring
5. Add authentication for users
6. Scale up as needed

**Need help?** Check Azure docs or run `az --help`

Happy deploying! 🎮☁️
