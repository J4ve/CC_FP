# GenericMart Cloud - PowerShell deployment script (Scenario B)
# Mirror of deploy.azcli for Windows users without Git Bash/WSL.
# Run from PowerShell: .\deploy.ps1

$ErrorActionPreference = "Stop"

# =========================
# Project variables (EDIT)
# =========================
$LOCATION = "japaneast"
$RG       = "rg-genericmart-cloud"

$APP_PLAN = "asp-genericmart"
$WEBAPP   = "app-genericmart-$(Get-Random)$(Get-Random)"

$STORAGE   = "stgenericmart$(Get-Random)$(Get-Random)" -replace "[^a-z0-9]","" | ForEach-Object { $_.ToLower().Substring(0, [Math]::Min($_.Length, 24)) }
$CONTAINER = "products"

$SQL_SERVER    = "sql-genericmart-$(Get-Random)$(Get-Random)"
$SQL_DB        = "sqldb-genericmart"
$SQL_ADMIN_USER = "sqladminuser"

if (-not $env:SQL_ADMIN_PASSWORD) {
  Write-Error "SQL_ADMIN_PASSWORD env var not set. Run: `$env:SQL_ADMIN_PASSWORD = 'YourStrongP@ssw0rd!'"
}
$SQL_ADMIN_PASSWORD = $env:SQL_ADMIN_PASSWORD

Write-Host "Deploying:"
Write-Host "  RG=$RG  LOCATION=$LOCATION"
Write-Host "  WEBAPP=$WEBAPP  PLAN=$APP_PLAN"
Write-Host "  SQL_SERVER=$SQL_SERVER  DB=$SQL_DB"
Write-Host "  STORAGE=$STORAGE  CONTAINER=$CONTAINER"
Write-Host ""

# Resource Group
az group create -n $RG -l $LOCATION | Out-Null

# Storage Account + Blob container
az storage account create -n $STORAGE -g $RG -l $LOCATION --sku Standard_LRS --kind StorageV2 --allow-blob-public-access true | Out-Null
$STORAGE_KEY = az storage account keys list -g $RG -n $STORAGE --query "[0].value" -o tsv
az storage container create --name $CONTAINER --account-name $STORAGE --account-key $STORAGE_KEY --public-access blob | Out-Null
$BLOB_BASE = "https://$STORAGE.blob.core.windows.net/$CONTAINER"

# SQL Server + DB
az sql server create -g $RG -n $SQL_SERVER -l $LOCATION -u $SQL_ADMIN_USER -p $SQL_ADMIN_PASSWORD | Out-Null
az sql server firewall-rule create -g $RG -s $SQL_SERVER -n "AllowAzureServices" --start-ip-address 0.0.0.0 --end-ip-address 0.0.0.0 | Out-Null
az sql db create -g $RG -s $SQL_SERVER -n $SQL_DB --service-objective S0 | Out-Null
$SQL_FQDN = az sql server show -g $RG -n $SQL_SERVER --query fullyQualifiedDomainName -o tsv

# App Service Plan (2 instances) + Web App
az appservice plan create -g $RG -n $APP_PLAN --is-linux --sku S1 | Out-Null
az appservice plan update -g $RG -n $APP_PLAN --number-of-workers 2 | Out-Null
az webapp create -g $RG -p $APP_PLAN -n $WEBAPP --runtime "NODE:20-lts" | Out-Null

# Managed Identity (security control)
az webapp identity assign -g $RG -n $WEBAPP | Out-Null

# App settings
az webapp config appsettings set -g $RG -n $WEBAPP --settings `
  "SQL_SERVER=$SQL_FQDN" `
  "SQL_DATABASE=$SQL_DB" `
  "SQL_USER=$SQL_ADMIN_USER" `
  "SQL_PASSWORD=$SQL_ADMIN_PASSWORD" `
  "STORAGE_BLOB_BASE=$BLOB_BASE" `
  "WEBSITE_NODE_DEFAULT_VERSION=~20" `
  "SCM_DO_BUILD_DURING_DEPLOYMENT=true" | Out-Null

az webapp config set -g $RG -n $WEBAPP --startup-file "node server.js" | Out-Null

# Autoscale (Optimization #1)
$PLAN_ID = az appservice plan show -g $RG -n $APP_PLAN --query id -o tsv
az monitor autoscale create -g $RG --resource $PLAN_ID --resource-type "Microsoft.Web/serverfarms" -n "as-$APP_PLAN" --min-count 2 --max-count 4 --count 2 | Out-Null
az monitor autoscale rule create -g $RG --autoscale-name "as-$APP_PLAN" --condition "Percentage CPU > 70 avg 5m" --scale out 1 | Out-Null
az monitor autoscale rule create -g $RG --autoscale-name "as-$APP_PLAN" --condition "Percentage CPU < 30 avg 10m" --scale in 1 | Out-Null

$APP_URL = "https://$WEBAPP.azurewebsites.net"

Write-Host ""
Write-Host "==============================="
Write-Host "DEPLOYMENT COMPLETE"
Write-Host "==============================="
Write-Host "Resource Group : $RG"
Write-Host "Web App URL    : $APP_URL"
Write-Host "SQL Server     : $SQL_FQDN"
Write-Host "Storage URL    : $BLOB_BASE"
Write-Host ""
Write-Host "Next: deploy app code:"
Write-Host "  cd ..\src"
Write-Host "  npm install --omit=dev"
Write-Host "  Compress-Archive -Path * -DestinationPath app.zip -Force"
Write-Host "  az webapp deploy -g $RG -n $WEBAPP --src-path app.zip --type zip"
