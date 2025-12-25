#!/bin/bash
# resolve_issue.sh - Close a GitHub issue with detailed resolution documentation
#
# Usage:
#   ./resolve_issue.sh --issue 123 --pr 456 --summary "Fixed the bug" \
#     --changes "Fixed null check,Added test" --files "file1.ts,file2.ts" \
#     --testing "Unit tests pass" --findings "Found related issue"
#
# Arguments:
#   --issue     Issue number to close (required)
#   --pr        PR number that resolves the issue (optional but recommended)
#   --summary   Brief summary of what was done (required)
#   --changes   Comma-separated list of changes made (optional)
#   --files     Comma-separated list of files modified (optional)
#   --testing   How the fix was verified (optional)
#   --findings  Any important discoveries or follow-up notes (optional)
#   --dry-run   Print the comment without posting/closing

set -e

# Default values
ISSUE=""
PR=""
SUMMARY=""
CHANGES=""
FILES=""
TESTING=""
FINDINGS=""
DRY_RUN=false

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --issue)
      ISSUE="$2"
      shift 2
      ;;
    --pr)
      PR="$2"
      shift 2
      ;;
    --summary)
      SUMMARY="$2"
      shift 2
      ;;
    --changes)
      CHANGES="$2"
      shift 2
      ;;
    --files)
      FILES="$2"
      shift 2
      ;;
    --testing)
      TESTING="$2"
      shift 2
      ;;
    --findings)
      FINDINGS="$2"
      shift 2
      ;;
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Validate required arguments
if [[ -z "$ISSUE" ]]; then
  echo "Error: --issue is required"
  exit 1
fi

if [[ -z "$SUMMARY" ]]; then
  echo "Error: --summary is required"
  exit 1
fi

# Get current date/time
RESOLVED_DATE=$(date '+%Y-%m-%d %H:%M %Z')

# Build the resolution comment
BODY="## Resolution

**Status:** Resolved
**Resolved Date:** $RESOLVED_DATE"

if [[ -n "$PR" ]]; then
  BODY="$BODY
**Resolved By:** PR #$PR"
fi

BODY="$BODY

### What Was Done
$SUMMARY"

if [[ -n "$CHANGES" ]]; then
  BODY="$BODY

### Changes Made"
  IFS=',' read -ra CHANGE_ARRAY <<< "$CHANGES"
  for change in "${CHANGE_ARRAY[@]}"; do
    BODY="$BODY
- $change"
  done
fi

if [[ -n "$FILES" ]]; then
  BODY="$BODY

### Files Modified"
  IFS=',' read -ra FILE_ARRAY <<< "$FILES"
  for file in "${FILE_ARRAY[@]}"; do
    BODY="$BODY
- \`$file\`"
  done
fi

if [[ -n "$TESTING" ]]; then
  BODY="$BODY

### Testing
$TESTING"
fi

if [[ -n "$FINDINGS" ]]; then
  BODY="$BODY

### Results & Findings
$FINDINGS"
fi

BODY="$BODY

---
*Resolved during development session*"

# Build closing comment
if [[ -n "$PR" ]]; then
  CLOSE_COMMENT="Closed by PR #$PR"
else
  CLOSE_COMMENT="Resolved"
fi

# Output or execute
if [[ "$DRY_RUN" == true ]]; then
  echo "=== DRY RUN - Issue #$ISSUE would be resolved ==="
  echo ""
  echo "Resolution Comment:"
  echo "$BODY"
  echo ""
  echo "Close Comment: $CLOSE_COMMENT"
else
  # Add resolution comment
  echo "Adding resolution comment to issue #$ISSUE..."
  gh issue comment "$ISSUE" --body "$BODY"

  # Close the issue
  echo "Closing issue #$ISSUE..."
  gh issue close "$ISSUE" --comment "$CLOSE_COMMENT"

  echo ""
  echo "Issue #$ISSUE has been resolved and closed."
fi
