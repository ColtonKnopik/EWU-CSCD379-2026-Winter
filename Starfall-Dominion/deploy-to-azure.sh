#!/bin/bash

# Starfall Dominion - Azure Deployment Script
# Usage: ./deploy-to-azure.sh

set -e  # Exit on error

echo "🚀 Starfall Dominion - Azure Deployment"
echo "========================================"

# Configuration (CHANGE THESE!)
RESOURCE_GROUP="starfall-dominion-rg"
LOCATION="westus2"
APP_SERVICE_PLAN="starfall-api-plan"
WEB_APP_NAME="starfall-dominion-api"  # Must be globally unique!
STATIC_WEB_APP_NAME="starfall-dominion-game"
SQL_SERVER="starfall-dominion-dbserver"
SQL_DATABASE="StarfallDominionDb"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo ""
echo -e "${YELLOW}📋 Configuration:${NC}"
echo "  Resource Group: $RESOURCE_GROUP"
echo "  Backend App: $WEB_APP_NAME"
echo "  Frontend App: $STATIC_WEB_APP_NAME"
echo ""

# Check if logged in to Azure
echo -e "${YELLOW}🔐 Checking Azure login...${NC}"
if ! az account show &> /dev/null; then
    echo -e "${RED}❌ Not logged in to Azure!${NC}"
    echo "Please run: az login"
    exit 1
fi
echo -e "${GREEN}✅ Logged in to Azure${NC}"

# Ask for confirmation
read -p "Deploy backend to Azure? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled"
    exit 0
fi

# Create App Service if it doesn't exist
echo ""
echo -e "${YELLOW}🏗️  Creating App Service (if needed)...${NC}"
if ! az webapp show --name $WEB_APP_NAME --resource-group $RESOURCE_GROUP &> /dev/null; then
    echo "Creating new App Service..."
    
    # Create App Service Plan
    az appservice plan create \
      --name $APP_SERVICE_PLAN \
      --resource-group $RESOURCE_GROUP \
      --sku B1 \
      --is-linux \
      --location $LOCATION
    
    # Create Web App
    az webapp create \
      --name $WEB_APP_NAME \
      --resource-group $RESOURCE_GROUP \
      --plan $APP_SERVICE_PLAN \
      --runtime "DOTNET|8.0"
    
    echo -e "${GREEN}✅ App Service created${NC}"
else
    echo -e "${GREEN}✅ App Service already exists${NC}"
fi

# Enable Managed Identity
echo ""
echo -e "${YELLOW}🔐 Enabling Managed Identity...${NC}"
az webapp identity assign \
  --name $WEB_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --output none
echo -e "${GREEN}✅ Managed Identity enabled${NC}"

# Configure App Settings
echo ""
echo -e "${YELLOW}⚙️  Configuring app settings...${NC}"
az webapp config connection-string set \
  --name $WEB_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --connection-string-type SQLAzure \
  --settings DefaultConnection="Server=tcp:$SQL_SERVER.database.windows.net,1433;Database=$SQL_DATABASE;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;" \
  --output none

az webapp config appsettings set \
  --name $WEB_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --settings \
    UseManagedIdentity=true \
    ASPNETCORE_ENVIRONMENT=Production \
  --output none

echo -e "${GREEN}✅ App settings configured${NC}"

# Build and deploy backend
echo ""
echo -e "${YELLOW}📦 Building backend...${NC}"
cd backend
dotnet publish -c Release -o ./publish

echo -e "${YELLOW}📦 Creating deployment package...${NC}"
cd publish
zip -r ../deploy.zip . > /dev/null
cd ..

echo -e "${YELLOW}🚀 Deploying to Azure...${NC}"
az webapp deployment source config-zip \
  --name $WEB_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --src deploy.zip \
  --output none

# Cleanup
rm deploy.zip
rm -rf publish

cd ..

echo -e "${GREEN}✅ Backend deployed!${NC}"

# Get backend URL
BACKEND_URL=$(az webapp show --name $WEB_APP_NAME --resource-group $RESOURCE_GROUP --query defaultHostName -o tsv)

echo ""
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo ""
echo "Backend URL: https://$BACKEND_URL"
echo "Swagger: https://$BACKEND_URL/swagger"
echo ""
echo -e "${YELLOW}📝 Next Steps:${NC}"
echo "1. Grant database access (run in Azure Portal Query Editor):"
echo "   CREATE USER [$WEB_APP_NAME] FROM EXTERNAL PROVIDER;"
echo "   ALTER ROLE db_datareader ADD MEMBER [$WEB_APP_NAME];"
echo "   ALTER ROLE db_datawriter ADD MEMBER [$WEB_APP_NAME];"
echo "   ALTER ROLE db_ddladmin ADD MEMBER [$WEB_APP_NAME];"
echo ""
echo "2. Update .env.production with backend URL:"
echo "   NUXT_PUBLIC_API_BASE=https://$BACKEND_URL/api"
echo ""
echo "3. Deploy frontend:"
echo "   npm run build"
echo "   swa deploy .output/public --deployment-token [YOUR_TOKEN]"
echo ""
echo "View logs: az webapp log tail --name $WEB_APP_NAME --resource-group $RESOURCE_GROUP"
