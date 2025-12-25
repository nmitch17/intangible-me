# GitHub CLI Quick Reference

## Authentication

```bash
# Check auth status
gh auth status

# Login interactively
gh auth login

# Login with token
gh auth login --with-token < token.txt

# Logout
gh auth logout
```

## Issue Commands

### Create Issues

```bash
# Interactive creation
gh issue create

# With title and body
gh issue create --title "Title" --body "Description"

# With labels
gh issue create --title "Title" --body "Body" --label "bug,priority:high"

# With assignee
gh issue create --title "Title" --body "Body" --assignee "@me"

# With milestone
gh issue create --title "Title" --body "Body" --milestone "v1.0"

# With project
gh issue create --title "Title" --body "Body" --project "Project Name"

# Using body from file
gh issue create --title "Title" --body-file issue-body.md

# Using heredoc for complex body
gh issue create --title "Title" --body "$(cat <<'EOF'
## Summary
Description here

## Details
More details
EOF
)"
```

### List Issues

```bash
# List open issues
gh issue list

# List closed issues
gh issue list --state closed

# List all issues
gh issue list --state all

# Filter by label
gh issue list --label "bug"

# Filter by assignee
gh issue list --assignee "@me"
gh issue list --assignee "username"

# Filter by author
gh issue list --author "@me"

# Filter by milestone
gh issue list --milestone "v1.0"

# Search with query
gh issue list --search "keyword in:title"
gh issue list --search "is:open label:bug"

# Limit results
gh issue list --limit 50

# JSON output
gh issue list --json number,title,labels
```

### View Issues

```bash
# View in terminal
gh issue view <number>

# View in browser
gh issue view <number> --web

# View specific fields (JSON)
gh issue view <number> --json title,body,labels,assignees

# View comments
gh issue view <number> --comments
```

### Edit Issues

```bash
# Edit title
gh issue edit <number> --title "New Title"

# Edit body
gh issue edit <number> --body "New body"

# Add labels
gh issue edit <number> --add-label "label1,label2"

# Remove labels
gh issue edit <number> --remove-label "label1"

# Add assignees
gh issue edit <number> --add-assignee "user1,user2"

# Remove assignees
gh issue edit <number> --remove-assignee "user1"

# Set milestone
gh issue edit <number> --milestone "v1.0"

# Remove milestone
gh issue edit <number> --milestone ""

# Add to project
gh issue edit <number> --add-project "Project Name"
```

### Comment on Issues

```bash
# Add comment
gh issue comment <number> --body "Comment text"

# Add comment from file
gh issue comment <number> --body-file comment.md

# Edit last comment
gh issue comment <number> --edit-last --body "Updated comment"

# Add comment with heredoc
gh issue comment <number> --body "$(cat <<'EOF'
## Update
Multi-line comment here
EOF
)"
```

### Close/Reopen Issues

```bash
# Close issue
gh issue close <number>

# Close with comment
gh issue close <number> --comment "Closing because..."

# Close as not planned
gh issue close <number> --reason "not planned"

# Close as completed
gh issue close <number> --reason "completed"

# Reopen issue
gh issue reopen <number>

# Reopen with comment
gh issue reopen <number> --comment "Reopening because..."
```

### Transfer/Pin Issues

```bash
# Transfer to another repo
gh issue transfer <number> <destination-repo>

# Pin issue (requires permissions)
gh issue pin <number>

# Unpin issue
gh issue unpin <number>
```

### Delete Issues

```bash
# Delete issue (requires permissions)
gh issue delete <number>

# Confirm deletion
gh issue delete <number> --yes
```

## PR Commands (Issue-Related)

```bash
# List PRs
gh pr list

# Create PR that closes issue
gh pr create --title "Fix bug" --body "Fixes #123"

# View PR
gh pr view <number>

# Check PR status
gh pr status
```

## Repository Info

```bash
# View repo info
gh repo view

# View in browser
gh repo view --web

# List labels
gh label list

# Create label
gh label create "label-name" --color "FF0000" --description "Description"
```

## Useful Patterns

### Create Issue with Full Template

```bash
gh issue create \
  --title "[Bug] Component: Description" \
  --label "bug,priority:high" \
  --assignee "@me" \
  --body "$(cat <<'EOF'
## Summary
Brief description

## Steps to Reproduce
1. Step 1
2. Step 2

## Expected Behavior
What should happen

## Actual Behavior
What happens instead

## Environment
- OS:
- Version:

## Additional Context
Any other information
EOF
)"
```

### Close Issue with Resolution

```bash
gh issue comment <number> --body "$(cat <<'EOF'
## Resolution

**Status:** Resolved
**Date:** $(date '+%Y-%m-%d %H:%M %Z')
**PR:** #<pr-number>

### Changes Made
- Change 1
- Change 2

### Testing
How the fix was verified
EOF
)" && gh issue close <number>
```

### Batch Operations

```bash
# Close multiple issues
for i in 1 2 3 4 5; do gh issue close $i --comment "Bulk close"; done

# Add label to multiple issues
for i in 1 2 3; do gh issue edit $i --add-label "tech-debt"; done

# List and process issues
gh issue list --json number --jq '.[].number' | while read num; do
  echo "Processing issue $num"
done
```

### Search Patterns

```bash
# Find issues by keyword
gh issue list --search "authentication"

# Find issues by label combination
gh issue list --search "label:bug label:priority:high"

# Find issues assigned to you
gh issue list --search "assignee:@me is:open"

# Find issues in title
gh issue list --search "in:title login"

# Find issues created this week
gh issue list --search "created:>$(date -v-7d '+%Y-%m-%d')"
```

## JSON Output and jq

```bash
# Get issue numbers
gh issue list --json number --jq '.[].number'

# Get titles
gh issue list --json number,title --jq '.[] | "\(.number): \(.title)"'

# Filter by label in JSON
gh issue list --json number,labels --jq '.[] | select(.labels[].name == "bug")'

# Count issues by label
gh issue list --json labels --jq '[.[].labels[].name] | group_by(.) | map({label: .[0], count: length})'
```

## Environment Variables

```bash
# Set default repo
export GH_REPO="owner/repo"

# Set editor
export GH_EDITOR="code --wait"

# Disable prompts
export GH_PROMPT_DISABLED=1
```

## Error Handling

Common errors and solutions:

| Error | Solution |
|-------|----------|
| `gh: not found` | Install: https://cli.github.com |
| `not authenticated` | Run `gh auth login` |
| `repository not found` | Check you're in a git repo with GitHub remote |
| `rate limit exceeded` | Wait or use authenticated requests |
| `permission denied` | Check repo access permissions |
