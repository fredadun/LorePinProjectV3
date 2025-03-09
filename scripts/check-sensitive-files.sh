#!/bin/bash

# Array of sensitive file patterns
SENSITIVE_PATTERNS=(
    "*.key"
    "*.pem"
    "*.cert"
    "*.password"
    "*secret*"
    "*.env"
    "*config*.json"
    "serviceAccount*.json"
)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo "Checking for potentially sensitive files..."

FOUND_SENSITIVE=0

for pattern in "${SENSITIVE_PATTERNS[@]}"
do
    FILES=$(find . -name "$pattern" -not -path "*/node_modules/*" -not -path "*/\.*")
    if [ ! -z "$FILES" ]; then
        echo -e "${RED}Warning: Found potentially sensitive files matching '$pattern':${NC}"
        echo "$FILES"
        FOUND_SENSITIVE=1
    fi
done

if [ $FOUND_SENSITIVE -eq 0 ]; then
    echo -e "${GREEN}No sensitive files found!${NC}"
else
    echo -e "${RED}Please review these files and ensure they should be committed.${NC}"
    exit 1
fi