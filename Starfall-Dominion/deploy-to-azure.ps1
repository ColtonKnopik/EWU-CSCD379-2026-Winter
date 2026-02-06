# Starfall Dominion - Azure Deployment Script (PowerShell)
# Usage: .\deploy-to-azure.ps1

$ErrorActionPreference = "Stop"

Write-Host "`n🚀 Starfall Dominion - Azure Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Configuration (CHANGE THESE!)
$RESOURCE_GROUP = "starfall-dominion-rg"
$LOCATION = "westus2"
$APP_SERVICE_PLAN = "starfall-api-plan"
$WEB_APP_NAME = "starfall-dominion-api"  # Must be globally unique!
$STATIC_WEB_APP_NAME = "starfall-dominion-game"
$SQL_SERVER = "starfall-dominion-dbserver"
$SQL_DATABASE = "StarfallDominionDb"

Write-Host "`n📋 Configuration:" -ForegroundColor Yellow
Write-Host "  Resource Group: $RESOURCE_GROUP"
Write-Host "  Backend App: $WEB_APP_NAME"
Write-Host "  Frontend App: $STATIC_WEB_APP_NAME"
Write-Host ""

# Check if logged in to Azure
Write-Host "🔐 Checking Azure login..." -ForegroundColor Yellow
try {
    az account show | Out-Null
    Write-Host "✅ Logged in to Azure" -ForegroundColor Green
} catch {
    Write-Host "❌ Not logged in to Azure!" -ForegroundColor Red
    Write-Host "Please run: az login"
    exit 1
}

# Ask for confirmation
$response = Read-Host "Deploy backend to Azure? (y/N)"
if ($response -ne "y" -and $response -ne "Y") {
    Write-Host "Deployment cancelled"
    exit 0
}

# Create App Service if it doesn't exist
Write-Host "`n🏗️  Creating App Service (if needed)..." -ForegroundColor Yellow
try {
    az webapp show --name $WEB_APP_NAME --resource-group $RESOURCE_GROUP 2>$null | Out-Null
    Write-Host "✅ App Service already exists" -ForegroundColor Green
} catch {
    Write-Host "Creating new App Service..."
    
    # Create App Service Plan
    az appservice plan create `
      --name $APP_SERVICE_PLAN `
      --resource-group $RESOURCE_GROUP `
      --sku B1 `
      --is-linux `
      --location $LOCATION
    
    # Create Web App
    az webapp create `
      --name $WEB_APP_NAME `
      --resource-group $RESOURCE_GROUP `
      --plan $APP_SERVICE_PLAN `
      --runtime "DOTNET|8.0"
    
    Write-Host "✅ App Service created" -ForegroundColor Green
}

# Enable Managed Identity
Write-Host "`n🔐 Enabling Managed Identity..." -ForegroundColor Yellow
az webapp identity assign `
  --name $WEB_APP_NAME `
  --resource-group $RESOURCE_GROUP `
  --output none
Write-Host "✅ Managed Identity enabled" -ForegroundColor Green

# Configure App Settings
Write-Host "`n⚙️  Configuring app settings..." -ForegroundColor Yellow
$connectionString = "Server=tcp:$SQL_SERVER.database.windows.net,1433;Database=$SQL_DATABASE;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"

az webapp config connection-string set `
  --name $WEB_APP_NAME `
  --resource-group $RESOURCE_GROUP `
  --connection-string-type SQLAzure `
  --settings "DefaultConnection=$connectionString" `
  --output none

az webapp config appsettings set `
  --name $WEB_APP_NAME `
  --resource-group $RESOURCE_GROUP `
  --settings UseManagedIdentity=true ASPNETCORE_ENVIRONMENT=Production `
  --output none

Write-Host "✅ App settings configured" -ForegroundColor Green

# Build and deploy backend
Write-Host "`n📦 Building backend..." -ForegroundColor Yellow
Set-Location backend
dotnet publish -c Release -o ./publish

Write-Host "📦 Creating deployment package..." -ForegroundColor Yellow
Set-Location publish
Compress-Archive -Path * -DestinationPath ../deploy.zip -Force
Set-Location ..

Write-Host "🚀 Deploying to Azure..." -ForegroundColor Yellow
az webapp deployment source config-zip `
  --name $WEB_APP_NAME `
  --resource-group $RESOURCE_GROUP `
  --src deploy.zip `
  --output none

# Cleanup
Remove-Item deploy.zip
Remove-Item -Recurse -Force publish

Set-Location ..

Write-Host "✅ Backend deployed!" -ForegroundColor Green

# Get backend URL
$BACKEND_URL = az webapp show --name $WEB_APP_NAME --resource-group $RESOURCE_GROUP --query defaultHostName -o tsv

Write-Host "`n🎉 Deployment Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Backend URL: https://$BACKEND_URL"
Write-Host "Swagger: https://$BACKEND_URL/swagger"
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Grant database access (run in Azure Portal Query Editor):"
Write-Host "   CREATE USER [$WEB_APP_NAME] FROM EXTERNAL PROVIDER;"
Write-Host "   ALTER ROLE db_datareader ADD MEMBER [$WEB_APP_NAME];"
Write-Host "   ALTER ROLE db_datawriter ADD MEMBER [$WEB_APP_NAME];"
Write-Host "   ALTER ROLE db_ddladmin ADD MEMBER [$WEB_APP_NAME];"
Write-Host ""
Write-Host "2. Update .env.production with backend URL:"
Write-Host "   NUXT_PUBLIC_API_BASE=https://$BACKEND_URL/api"
Write-Host ""
Write-Host "3. Deploy frontend:"
Write-Host "   npm run build"
Write-Host "   swa deploy .output/public --deployment-token [YOUR_TOKEN]"
Write-Host ""
Write-Host "View logs: az webapp log tail --name $WEB_APP_NAME --resource-group $RESOURCE_GROUP"
