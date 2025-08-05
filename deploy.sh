#!/bin/bash

# This script creates a config.js file during Cloudflare Pages build
# Ensures environment variables are properly injected

# Check if environment variables are set
if [ -z "$GOOGLE_MAPS_API_KEY" ]; then
  echo "ERROR: GOOGLE_MAPS_API_KEY is not set"
  exit 1
fi

if [ -z "$GOOGLE_SHEETS_WEB_APP_URL" ]; then
  echo "ERROR: GOOGLE_SHEETS_WEB_APP_URL is not set"
  exit 1
fi

if [ -z "$SHEET_ID" ]; then
  echo "ERROR: SHEET_ID is not set"
  exit 1
fi

# Create config.js with environment variables
cat > config.js << EOF
window.ENV = {
  GOOGLE_MAPS_API_KEY: '${GOOGLE_MAPS_API_KEY}',
  GOOGLE_SHEETS_WEB_APP_URL: '${GOOGLE_SHEETS_WEB_APP_URL}',
  SHEET_ID: '${SHEET_ID}'
};
EOF

echo "Config file created successfully with environment variables"

# Verify the file was created
if [ -f config.js ]; then
  echo "config.js exists with $(wc -l < config.js) lines"
else
  echo "ERROR: config.js was not created"
  exit 1
fi