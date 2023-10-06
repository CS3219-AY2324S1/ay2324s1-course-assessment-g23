# Get the target branch name
TARGET_BRANCH=$(gh pr view ${PR_NUMBER} --json baseRefName -q '.baseRefName')

# Script below is based on: https://stackoverflow.com/a/75369041/19221602
# Check that all commits in TARGET_BRANCH..PR_BRANCH are descendants of TARGET_BRANCH
BOUNDARY=$(git rev-list --boundary origin/${TARGET_BRANCH}..HEAD | grep -e '^-')
WANTED=$(git rev-parse origin/${TARGET_BRANCH})
WANTED="-$WANTED"

if [ "$BOUNDARY" != "$WANTED" ]; then
    echo "Error: You need to rebase on top of upstream/${TARGET_BRANCH}."
    exit 1
fi

echo "Your branch is properly rebased on top of upstream/${TARGET_BRANCH}."
