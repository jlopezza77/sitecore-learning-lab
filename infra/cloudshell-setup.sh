#!/usr/bin/env bash
# One-time Azure setup for the learning lab. Run in Azure Cloud Shell (Bash).
# Creates: resource group, Cosmos DB (free tier), Static Web App (Free plan).
# Cost: $0 within free tiers. Only ONE free-tier Cosmos DB account is allowed per subscription.
set -euo pipefail

LOCATION="eastus2"                      # region where both services are available
RG="rg-learning-lab"
COSMOS="cosmos-learning-$RANDOM"        # must be globally unique
SWA="swa-learning-lab"

echo "==> Registering resource providers (first time can take a minute)"
az provider register --namespace Microsoft.DocumentDB --wait
az provider register --namespace Microsoft.Web --wait

echo "==> Resource group"
az group create -n "$RG" -l "$LOCATION" -o none

echo "==> Cosmos DB for NoSQL, free tier (takes ~5 minutes)"
az cosmosdb create -n "$COSMOS" -g "$RG" \
  --enable-free-tier true \
  --default-consistency-level Session \
  --locations regionName="$LOCATION" failoverPriority=0 isZoneRedundant=false -o none

echo "==> Database with shared 400 RU/s (free tier covers 1000) + containers"
az cosmosdb sql database create -a "$COSMOS" -g "$RG" -n learning --throughput 400 -o none
az cosmosdb sql container create -a "$COSMOS" -g "$RG" -d learning -n profiles --partition-key-path /id -o none
az cosmosdb sql container create -a "$COSMOS" -g "$RG" -d learning -n events --partition-key-path /visitorId -o none

echo "==> Static Web App (Free plan)"
az staticwebapp create -n "$SWA" -g "$RG" -l "$LOCATION" --sku Free -o none

echo "==> Connecting the API to Cosmos DB"
CONN=$(az cosmosdb keys list -n "$COSMOS" -g "$RG" --type connection-strings \
  --query "connectionStrings[0].connectionString" -o tsv)
az staticwebapp appsettings set -n "$SWA" -g "$RG" --setting-names COSMOS_CONNECTION_STRING="$CONN" -o none

URL=$(az staticwebapp show -n "$SWA" -g "$RG" --query defaultHostname -o tsv)
TOKEN=$(az staticwebapp secrets list -n "$SWA" -g "$RG" --query properties.apiKey -o tsv)

cat <<EOF

============================================================
 Done. Your site will be at:  https://$URL
 (it shows a placeholder until the first GitHub deploy)

 LAST STEP - add the deployment token to GitHub (do NOT paste it in chat):
 1. Open https://github.com/jlopezza77/sitecore-learning-lab/settings/secrets/actions/new
 2. Name:   AZURE_STATIC_WEB_APPS_API_TOKEN
 3. Secret: the line below
------------------------------------------------------------
$TOKEN
------------------------------------------------------------
 4. Then: GitHub repo -> Actions -> "Deploy to Azure Static Web Apps" -> Run workflow
============================================================
EOF
