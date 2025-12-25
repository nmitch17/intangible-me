# GitHub Issue Best Practices

## Issue Quality Guidelines

### Anatomy of a Well-Written Issue

A high-quality issue contains:

1. **Clear, Specific Title**
   - Describes the issue in 5-10 words
   - Includes type prefix for quick scanning
   - Mentions affected component/area

2. **Concise Summary**
   - One paragraph explaining the issue
   - Answers: What is wrong? What should happen?

3. **Reproducibility Information** (for bugs)
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details

4. **Context and Justification**
   - Why this matters
   - Impact on users/system
   - Business or technical value

5. **Helpful Details**
   - Code references with file paths and line numbers
   - Links to related issues/PRs
   - Screenshots or logs if relevant

### Title Conventions

#### Format
```
[Type] Component: Brief description
```

#### Examples
| Good | Bad |
|------|-----|
| `[Bug] Auth: Password reset email not sent` | `Email broken` |
| `[Feature] Dashboard: Add CSV export` | `New feature request` |
| `[Tech Debt] API: Consolidate error handlers` | `Refactoring needed` |
| `[Docs] README: Update installation steps` | `Update docs` |

### Priority Guidelines

| Priority | Criteria | Response Time |
|----------|----------|---------------|
| Critical | System down, data loss, security breach | Immediate |
| High | Major feature broken, blocks users | Same day |
| Medium | Degraded experience, workaround exists | This sprint |
| Low | Minor inconvenience, enhancement | Backlog |

## Linking and References

### Code References

Use GitHub's permalink format for stable references:

```markdown
## Related Code
- Authentication logic: [`src/auth/login.ts:45-67`](link)
- User model: [`src/models/user.ts:12`](link)
```

### Issue Cross-References

```markdown
## Related Issues
- Blocks: #45
- Blocked by: #32
- Related to: #78, #92
- Duplicate of: #15
```

### PR References

```markdown
## Pull Requests
- Partial fix: #123
- Full implementation: #456
```

## Documentation References

When creating issues, reference relevant documentation:

```markdown
## References
- API Specification: `docs/api/auth.md`
- Architecture Decision: `docs/adr/002-auth-strategy.md`
- User Story: `docs/requirements/login-flow.md`
```

## Label Strategy

### Standard Labels

```
Type Labels:
- bug           : Something isn't working
- enhancement   : New feature or request
- documentation : Documentation improvements
- tech-debt     : Code quality improvements
- security      : Security-related issues

Priority Labels:
- priority:critical : Requires immediate attention
- priority:high     : Should be addressed soon
- priority:medium   : Normal priority
- priority:low      : Nice to have

Status Labels:
- needs-triage  : Needs initial review
- in-progress   : Actively being worked on
- blocked       : Waiting on external dependency
- needs-review  : Ready for review
- wontfix       : Decided not to address

Area Labels:
- frontend      : UI/client-side
- backend       : Server-side
- database      : Data layer
- api           : API endpoints
- infrastructure: DevOps/deployment
```

### Label Combinations

Common combinations for different issue types:

| Issue Type | Labels |
|------------|--------|
| Critical bug | `bug`, `priority:critical`, `needs-triage` |
| Feature request | `enhancement`, `priority:medium` |
| Tech debt | `tech-debt`, `priority:low` |
| Security issue | `security`, `priority:high`, `bug` |

## Issue Lifecycle

### States

```
1. Open (New)
   ↓
2. Triaged (Labels assigned, priority set)
   ↓
3. In Progress (Assigned, work started)
   ↓
4. In Review (PR created)
   ↓
5. Closed (Resolved or won't fix)
```

### Closing Etiquette

Always close with context:

**Good closing comment:**
```markdown
Resolved in PR #234.

Changes made:
- Fixed null check in user validation
- Added unit test for edge case

Verified fix works in staging environment.
```

**Bad closing comment:**
```markdown
Fixed.
```

## Templates Reference

### Minimal Bug Template

```markdown
**Bug:** [One sentence description]

**Steps:** [How to reproduce]

**Expected:** [What should happen]

**Actual:** [What happens instead]

**Files:** [`path/to/file.ts`]
```

### Minimal Feature Template

```markdown
**Feature:** [One sentence description]

**Why:** [Business/user value]

**Acceptance:**
- [ ] Criterion 1
- [ ] Criterion 2
```

### Minimal Tech Debt Template

```markdown
**Debt:** [One sentence description]

**Current:** [How it works now]

**Desired:** [How it should work]

**Files:** [`path/to/file.ts`]
```

## Common Mistakes to Avoid

1. **Vague titles**: "It's broken" vs "[Bug] Login: Form validation fails on special characters"

2. **Missing reproduction steps**: Always include how to trigger the issue

3. **No context**: Explain why the issue matters

4. **Orphan issues**: Always link to related code, docs, or issues

5. **Missing labels**: Apply appropriate labels for discoverability

6. **Silent closes**: Always explain why an issue was closed

7. **Scope creep**: One issue = one problem. Create separate issues for related but distinct items.

8. **Stale issues**: Regularly review and close outdated issues

## Resolution Documentation

When closing an issue, document:

1. **What was done**: Specific changes made
2. **How it was verified**: Testing performed
3. **Where to find the fix**: PR/commit reference
4. **Any follow-up needed**: Related work identified
5. **Lessons learned**: Insights for future reference
