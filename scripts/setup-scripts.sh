# Create scripts directory if it doesn't exist
mkdir -p scripts

# Create all script files
touch scripts/init-repo.sh
touch scripts/checkout-dev.sh
touch scripts/commit-changes.sh
touch scripts/feature-branch.sh
touch scripts/update-code.sh

# Make all scripts executable
chmod +x scripts/*.sh