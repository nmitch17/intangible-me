---
name: document-commit-push-pr
description: Executes a complete shipping workflow by running /document, /commit, and /pr commands in sequence. Use when the user wants to ship their work, document progress, commit changes, and create or update a pull request.
---

# Document, Commit, Push, and PR Workflow

This skill orchestrates a complete shipping workflow by executing slash commands in sequence. It ensures project progress is documented, changes are committed, pushed to a new branch, and a PR is created or updated.

## Workflow Steps

Execute these steps in order. Wait for each to complete before proceeding to the next.

### Step 1: Document Progress

Run the `/document` slash command to document project progress.

- Wait for the command to complete fully
- Verify documentation was created/updated successfully
- If the command fails, report the error and stop

### Step 2: Commit Changes

Run the `/commit` slash command to stage and commit all changes.

- This includes any documentation created in Step 1
- Wait for the commit and push to complete
- If the command fails, report the error and stop

### Step 3: Create or Update PR

Run the `/pr` slash command to create a new pull request or update an existing one.

- Wait for the PR operation to complete
- Report the PR URL when finished
- If the command fails, report the error

## Success Criteria

The workflow is complete when:

1. Documentation has been updated
2. All changes have been committed and pushed
3. A pull request has been created or updated
4. The PR URL has been reported to the user

## Error Handling

If any step fails:

- Stop the workflow immediately
- Report which step failed and why
- Suggest how to resolve the issue before retrying

## Usage

This skill is typically invoked via the `/ship` slash command, which triggers the full workflow automatically.
