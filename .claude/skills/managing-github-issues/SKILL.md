---
name: managing-github-issues
description: Creates, tracks, and resolves GitHub issues for identified work items during development. Use when a to-do or work item is identified that isn't being addressed immediately, when completing work that resolves an issue, or when needing to track technical debt, bugs, or feature requests in the current repository.
---

# Managing GitHub Issues

Manage the lifecycle of GitHub issues for work items identified during development sessions. This skill handles issue creation when work is identified but deferred, and issue resolution when work is completed.

## When to Use This Skill

**Create issues when:**
- A bug, improvement, or feature request is identified but not being addressed now
- Technical debt is discovered during code review or implementation
- A to-do item emerges from conversation that should be tracked
- Documentation gaps or inconsistencies are found
- Test coverage improvements are needed
- Refactoring opportunities are identified

**Resolve issues when:**
- A PR is merged that addresses the issue
- Work is completed that resolves the tracked item
- An issue is determined to be no longer relevant

## Prerequisites

Verify GitHub CLI is authenticated:
```bash
gh auth status
```

If not authenticated, run `gh auth login` first.

## Issue Creation Workflow

When a work item is identified for tracking:

### Step 1: Gather Context

Before creating an issue, collect:
- **What**: Clear description of the work item
- **Why**: Business or technical justification
- **Where**: Affected files, components, or systems
- **Related**: Links to specs, docs, or related issues

### Step 2: Determine Issue Type and Labels

| Type | When to Use | Suggested Labels |
|------|-------------|------------------|
| Bug | Something is broken or behaving incorrectly | `bug`, `priority:*` |
| Feature | New functionality requested | `enhancement`, `feature` |
| Technical Debt | Code quality improvement | `tech-debt`, `refactor` |
| Documentation | Missing or outdated docs | `documentation` |
| Test Coverage | Missing or inadequate tests | `testing`, `quality` |
| Security | Security-related concerns | `security`, `priority:high` |

### Step 3: Create the Issue

Use the GitHub CLI to create structured issues:

```bash
gh issue create \
  --title "[Type] Brief descriptive title" \
  --body "$(cat <<'EOF'
## Summary
[1-2 sentence description of what needs to be done]

## Context
[Why this work is needed - business value or technical necessity]

## Details
[Specific requirements, acceptance criteria, or technical details]

## Affected Areas
- [File/component 1]
- [File/component 2]

## References
- [Link to relevant documentation]
- [Link to related code: `path/to/file.ts:123`]
- [Link to specs or requirements]

## Additional Notes
[Any other relevant information, constraints, or considerations]

---
*Issue created during development session on $(date '+%Y-%m-%d')*
EOF
)" \
  --label "label1,label2"
```

### Step 4: Record the Issue Number

After creation, note the issue number for future reference. The CLI will output:
```
https://github.com/owner/repo/issues/123
```

## Issue Resolution Workflow

When work is completed that resolves an issue:

### Step 1: Verify Completion

Confirm:
- [ ] The original problem/request is fully addressed
- [ ] All acceptance criteria are met
- [ ] Related tests pass
- [ ] Code has been reviewed (if applicable)

### Step 2: Identify the Closing PR

Find the PR that contains the fix:
```bash
# List recent PRs
gh pr list --state merged --limit 10

# Or find PR by branch
gh pr list --head <branch-name>
```

### Step 3: Add Resolution Comment

Before closing, add a detailed resolution comment:

```bash
gh issue comment <issue-number> --body "$(cat <<'EOF'
## Resolution

**Status:** Resolved
**Resolved Date:** $(date '+%Y-%m-%d %H:%M %Z')
**Resolved By:** PR #<pr-number>

### What Was Done
[Brief description of the solution implemented]

### Changes Made
- [Change 1]
- [Change 2]

### Files Modified
- `path/to/file1.ts`
- `path/to/file2.ts`

### Testing
[How the fix was verified]

### Results & Findings
[Any important discoveries, lessons learned, or follow-up considerations]

---
*Resolved during development session*
EOF
)"
```

### Step 4: Close the Issue

Close with a reference to the PR:

```bash
gh issue close <issue-number> --comment "Closed by PR #<pr-number>"
```

Or if the PR includes `Fixes #<issue-number>` or `Closes #<issue-number>` in its description, the issue will close automatically when merged.

## Quick Reference Commands

### Creating Issues

```bash
# Simple issue
gh issue create --title "Title" --body "Description"

# With labels
gh issue create --title "Title" --body "Description" --label "bug,priority:high"

# With assignee
gh issue create --title "Title" --body "Description" --assignee "@me"

# Interactive mode (opens editor)
gh issue create
```

### Viewing Issues

```bash
# List open issues
gh issue list

# View specific issue
gh issue view <number>

# View in browser
gh issue view <number> --web
```

### Updating Issues

```bash
# Add comment
gh issue comment <number> --body "Comment text"

# Add labels
gh issue edit <number> --add-label "label1,label2"

# Remove labels
gh issue edit <number> --remove-label "label1"

# Assign
gh issue edit <number> --add-assignee "@me"

# Update title
gh issue edit <number> --title "New title"
```

### Closing Issues

```bash
# Close with comment
gh issue close <number> --comment "Reason for closing"

# Close without comment
gh issue close <number>

# Reopen
gh issue reopen <number>
```

### Searching Issues

```bash
# Search by label
gh issue list --label "bug"

# Search by assignee
gh issue list --assignee "@me"

# Search by state
gh issue list --state closed

# Search with query
gh issue list --search "keyword in:title"
```

## Issue Templates

### Bug Report Template

Use when reporting bugs discovered during development:

```markdown
## Bug Description
[Clear description of the incorrect behavior]

## Expected Behavior
[What should happen instead]

## Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Actual Behavior
[What actually happens]

## Environment
- Branch: `<branch-name>`
- Commit: `<commit-hash>`

## Possible Cause
[If identified, what might be causing this]

## Suggested Fix
[If known, how to fix it]

## Related Code
- `path/to/relevant/file.ts:line`
```

### Feature Request Template

Use for new functionality or enhancements:

```markdown
## Feature Description
[What new functionality is needed]

## Use Case
[Why this feature is needed - the problem it solves]

## Proposed Solution
[How this could be implemented]

## Alternatives Considered
[Other approaches that were considered]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## References
- [Related documentation]
- [Similar implementations]
```

### Technical Debt Template

Use for code quality improvements:

```markdown
## Technical Debt Description
[What needs to be improved]

## Current State
[How it works now and why it's problematic]

## Desired State
[How it should work after improvement]

## Impact
[What's affected by this technical debt]

## Effort Estimate
- Complexity: [Low/Medium/High]
- Risk: [Low/Medium/High]

## Suggested Approach
[How to address this]

## Files Affected
- `path/to/file1.ts`
- `path/to/file2.ts`
```

## Best Practices

### Writing Good Issue Titles
- Start with type prefix: `[Bug]`, `[Feature]`, `[Tech Debt]`, `[Docs]`
- Be specific and concise
- Include affected component if relevant
- Examples:
  - `[Bug] Login form submits twice on rapid clicks`
  - `[Feature] Add export to CSV functionality for reports`
  - `[Tech Debt] Refactor UserService to use dependency injection`

### Effective Labels
- Use consistent labeling conventions
- Include priority labels when relevant
- Add component/area labels for larger codebases
- Common label categories:
  - Type: `bug`, `enhancement`, `documentation`
  - Priority: `priority:critical`, `priority:high`, `priority:medium`, `priority:low`
  - Status: `needs-triage`, `in-progress`, `blocked`
  - Area: `frontend`, `backend`, `api`, `database`

### Linking Issues to Code
- Reference specific files and line numbers
- Use GitHub's code permalink format
- Link to related issues with `#<number>`
- Reference PRs that partially address the issue

### Resolution Documentation
- Always document what was done, not just that it was done
- Include lessons learned for future reference
- Note any follow-up work identified
- Reference the exact PR/commit that resolved the issue

## Automation Tips

### Auto-close with PR Keywords

Include these keywords in PR descriptions to auto-close issues:
- `Fixes #123`
- `Closes #123`
- `Resolves #123`

### Link Issues to PRs

```bash
# Create PR that references issue
gh pr create --title "Fix login bug" --body "Fixes #123"
```

## Troubleshooting

### "gh: command not found"
Install GitHub CLI: https://cli.github.com/

### "gh: not authenticated"
Run `gh auth login` and follow prompts.

### "repository not found"
Ensure you're in a git repository with a GitHub remote:
```bash
git remote -v
```

### Rate limiting
If hitting rate limits, wait or authenticate with a token that has higher limits.
