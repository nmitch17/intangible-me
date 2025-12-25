#!/bin/bash
# create_issue.sh - Create a GitHub issue with structured format
#
# Usage:
#   ./create_issue.sh --type bug --title "Description" --summary "What happened" \
#     --context "Why it matters" --files "file1.ts,file2.ts" --labels "bug,priority:high"
#
# Arguments:
#   --type      Issue type: bug, feature, tech-debt, docs, test, security (required)
#   --title     Issue title without type prefix (required)
#   --summary   Brief summary of the issue (required)
#   --context   Why this issue matters (optional)
#   --details   Additional details or acceptance criteria (optional)
#   --files     Comma-separated list of affected files (optional)
#   --refs      Comma-separated list of references/links (optional)
#   --labels    Comma-separated list of labels (optional, defaults based on type)
#   --assignee  Assignee username (optional)
#   --dry-run   Print the issue without creating it

set -e

# Default values
TYPE=""
TITLE=""
SUMMARY=""
CONTEXT=""
DETAILS=""
FILES=""
REFS=""
LABELS=""
ASSIGNEE=""
DRY_RUN=false

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --type)
      TYPE="$2"
      shift 2
      ;;
    --title)
      TITLE="$2"
      shift 2
      ;;
    --summary)
      SUMMARY="$2"
      shift 2
      ;;
    --context)
      CONTEXT="$2"
      shift 2
      ;;
    --details)
      DETAILS="$2"
      shift 2
      ;;
    --files)
      FILES="$2"
      shift 2
      ;;
    --refs)
      REFS="$2"
      shift 2
      ;;
    --labels)
      LABELS="$2"
      shift 2
      ;;
    --assignee)
      ASSIGNEE="$2"
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
if [[ -z "$TYPE" ]]; then
  echo "Error: --type is required (bug, feature, tech-debt, docs, test, security)"
  exit 1
fi

if [[ -z "$TITLE" ]]; then
  echo "Error: --title is required"
  exit 1
fi

if [[ -z "$SUMMARY" ]]; then
  echo "Error: --summary is required"
  exit 1
fi

# Map type to prefix and default labels
case $TYPE in
  bug)
    PREFIX="Bug"
    DEFAULT_LABELS="bug"
    ;;
  feature)
    PREFIX="Feature"
    DEFAULT_LABELS="enhancement"
    ;;
  tech-debt)
    PREFIX="Tech Debt"
    DEFAULT_LABELS="tech-debt"
    ;;
  docs)
    PREFIX="Docs"
    DEFAULT_LABELS="documentation"
    ;;
  test)
    PREFIX="Test"
    DEFAULT_LABELS="testing"
    ;;
  security)
    PREFIX="Security"
    DEFAULT_LABELS="security,priority:high"
    ;;
  *)
    echo "Error: Unknown type '$TYPE'. Use: bug, feature, tech-debt, docs, test, security"
    exit 1
    ;;
esac

# Use provided labels or defaults
if [[ -z "$LABELS" ]]; then
  LABELS="$DEFAULT_LABELS"
fi

# Format the title
FULL_TITLE="[$PREFIX] $TITLE"

# Build the issue body
BODY="## Summary
$SUMMARY"

if [[ -n "$CONTEXT" ]]; then
  BODY="$BODY

## Context
$CONTEXT"
fi

if [[ -n "$DETAILS" ]]; then
  BODY="$BODY

## Details
$DETAILS"
fi

if [[ -n "$FILES" ]]; then
  BODY="$BODY

## Affected Files"
  IFS=',' read -ra FILE_ARRAY <<< "$FILES"
  for file in "${FILE_ARRAY[@]}"; do
    BODY="$BODY
- \`$file\`"
  done
fi

if [[ -n "$REFS" ]]; then
  BODY="$BODY

## References"
  IFS=',' read -ra REF_ARRAY <<< "$REFS"
  for ref in "${REF_ARRAY[@]}"; do
    BODY="$BODY
- $ref"
  done
fi

BODY="$BODY

---
*Issue created during development session on $(date '+%Y-%m-%d')*"

# Output or create
if [[ "$DRY_RUN" == true ]]; then
  echo "=== DRY RUN - Issue would be created ==="
  echo ""
  echo "Title: $FULL_TITLE"
  echo "Labels: $LABELS"
  if [[ -n "$ASSIGNEE" ]]; then
    echo "Assignee: $ASSIGNEE"
  fi
  echo ""
  echo "Body:"
  echo "$BODY"
else
  # Build gh command
  CMD="gh issue create --title \"$FULL_TITLE\" --label \"$LABELS\""

  if [[ -n "$ASSIGNEE" ]]; then
    CMD="$CMD --assignee \"$ASSIGNEE\""
  fi

  # Execute with heredoc for body
  if [[ -n "$ASSIGNEE" ]]; then
    gh issue create --title "$FULL_TITLE" --label "$LABELS" --assignee "$ASSIGNEE" --body "$BODY"
  else
    gh issue create --title "$FULL_TITLE" --label "$LABELS" --body "$BODY"
  fi
fi
