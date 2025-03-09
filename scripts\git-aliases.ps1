# Git workflow functions
function lp-init {
    git init
    git remote add origin https://github.com/fredadun/LorePinProjectV3.git
    git remote -v
    git fetch origin
}

function lp-dev {
    git checkout development
    git pull origin development
}

function lp-commit {
    git add .
    $message = Read-Host -Prompt "Enter commit message"
    git commit -m $message
    git push origin development
}

function lp-feature {
    $featureName = Read-Host -Prompt "Enter feature name"
    git checkout -b "feature/$featureName" development
    git push -u origin "feature/$featureName"
}

function lp-update {
    git checkout development
    git pull origin development
}