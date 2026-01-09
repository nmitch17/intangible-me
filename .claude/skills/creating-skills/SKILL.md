---
name: creating-skills
description: Creates and refines Claude skills with proper SKILL.md structure, YAML frontmatter, and bundled resources. Use when users want to create a new skill, update an existing skill, or need guidance on skill best practices.
---

# Creating Skills

This skill provides guidance for creating effective Claude skills.

## Core Principles

**Conciseness is key.** The context window is shared with conversation history, system prompts, and other skills. Challenge each piece of information: "Does Claude really need this?" Only add context Claude doesn't already have.

**Set appropriate degrees of freedom.** Match specificity to task fragility:
- **High freedom** (text instructions): Multiple approaches valid, decisions depend on context
- **Medium freedom** (pseudocode/parameterized scripts): Preferred pattern exists but variation acceptable
- **Low freedom** (specific scripts): Operations fragile, consistency critical

## Skill Structure

Every skill requires a SKILL.md file with YAML frontmatter:

```
skill-name/
├── SKILL.md (required)
└── Bundled Resources (optional)
    ├── scripts/    - Executable code (executed, not loaded into context)
    ├── references/ - Documentation (loaded when needed)
    └── assets/     - Output files (templates, images, fonts)
```

### YAML Frontmatter Requirements

```yaml
---
name: processing-pdfs
description: Extracts text and tables from PDF files, fills forms, merges documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction.
---
```

**Field requirements:**

| Field | Requirement |
|-------|-------------|
| `name` | Max 64 chars, lowercase letters/numbers/hyphens only, no "anthropic" or "claude" |
| `description` | Max 1024 chars, non-empty, must describe WHAT it does AND WHEN to use it |

**Naming convention:** Use gerund form (verb + -ing) for clarity:
- `processing-pdfs` (preferred)
- `analyzing-spreadsheets` (preferred)
- `pdf-processor` (acceptable but less clear)

**Description best practices:**
- Always write in **third person** ("Processes files..." not "I help you..." or "You can use...")
- Include **"Use when..."** trigger clause with specific scenarios
- Be specific—include key terms users would mention

### SKILL.md Body Guidelines

- Keep under **500 lines** for optimal performance
- Split larger content into separate reference files
- Keep references **one level deep** from SKILL.md (avoid nested file references)
- Use consistent terminology throughout

### Progressive Disclosure

Skills load information in stages:

| Level | When Loaded | Token Cost |
|-------|-------------|------------|
| Metadata (name + description) | Always at startup | ~100 tokens |
| SKILL.md body | When skill triggers | Under 5k tokens |
| Bundled resources | As needed | Effectively unlimited |

## Skill Creation Process

Follow these steps in order, skipping only when clearly inapplicable.

### Step 1: Understand with Concrete Examples

Gather concrete examples of how the skill will be used. Ask focused questions:
- "What would a user say that should trigger this skill?"
- "Can you give examples of how this skill would be used?"

Conclude when the skill's functionality and triggers are clear.

### Step 2: Plan Reusable Contents

Analyze each example to identify reusable resources:

| Example Request | Analysis | Resource to Include |
|-----------------|----------|---------------------|
| "Help me rotate this PDF" | Rotating requires rewriting code each time | `scripts/rotate_pdf.py` |
| "Build me a todo app" | Needs same boilerplate each time | `assets/hello-world/` template |
| "How many users logged in today?" | Requires rediscovering schemas | `references/schema.md` |

### Step 3: Initialize the Skill

Run `init_skill.py` to generate the skill template:

```bash
scripts/init_skill.py <skill-name> --path <output-directory>
```

This creates SKILL.md with proper frontmatter and example resource directories.

### Step 4: Edit the Skill

**Writing style:** Use imperative/infinitive form ("To accomplish X, do Y") not second person. Write for another Claude instance—include only non-obvious procedural knowledge.

**Description format:** Follow this pattern:
```yaml
description: [What it does]. Use when [specific triggers/scenarios].
```

**Complete SKILL.md by answering:**
1. What is the purpose? (1-2 sentences)
2. When should it trigger? (specific scenarios, file types, user phrases)
3. How should Claude use the bundled resources?

### Step 5: Add Workflows and Feedback Loops

For complex tasks, provide step-by-step workflows with checklists:

```markdown
## PDF Form Filling Workflow

Copy this checklist and track progress:

- [ ] Step 1: Analyze form (`python scripts/analyze_form.py input.pdf`)
- [ ] Step 2: Create field mapping (edit `fields.json`)
- [ ] Step 3: Validate (`python scripts/validate_fields.py fields.json`)
- [ ] Step 4: Fill form (`python scripts/fill_form.py input.pdf fields.json output.pdf`)
- [ ] Step 5: Verify output

If validation fails, return to Step 2.
```

The validation loop pattern (run validator → fix errors → repeat) greatly improves output quality.

### Step 6: Package the Skill

```bash
scripts/package_skill.py <path/to/skill-folder>
```

The script validates and packages the skill into a distributable zip file.

### Step 7: Iterate with Evaluations

**Build evaluations before extensive documentation.** Create test scenarios that verify the skill solves real problems:

```json
{
  "skills": ["processing-pdfs"],
  "query": "Extract all text from this PDF and save to output.txt",
  "files": ["test-files/document.pdf"],
  "expected_behavior": [
    "Successfully reads PDF using appropriate library",
    "Extracts text from all pages",
    "Saves to output.txt in readable format"
  ]
}
```

**Iteration workflow:**
1. Use the skill on real tasks
2. Observe struggles or inefficiencies
3. Update SKILL.md or bundled resources
4. Test again with evaluations

## Writing Effective Descriptions

The description field is critical—Claude uses it to select from potentially 100+ available skills.

**Effective examples:**
```yaml
# PDF Processing
description: Extracts text and tables from PDF files, fills forms, merges documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction.

# Excel Analysis
description: Analyzes Excel spreadsheets, creates pivot tables, generates charts. Use when analyzing Excel files, spreadsheets, tabular data, or .xlsx files.

# Git Commit Helper
description: Generates descriptive commit messages by analyzing git diffs. Use when the user asks for help writing commit messages or reviewing staged changes.
```

**Avoid vague descriptions:**
```yaml
description: Helps with documents  # Too vague
description: Processes data        # No triggers
description: Does stuff with files # Useless
```

## Content Patterns

### Template Pattern

Provide output templates. Match strictness to requirements:

**Strict (API responses, data formats):**
```markdown
ALWAYS use this exact structure:
# [Title]
## Executive summary
## Key findings
## Recommendations
```

**Flexible (when adaptation useful):**
```markdown
Sensible default format—adjust sections as needed:
# [Title]
## Summary
## Findings (adapt based on analysis)
```

### Examples Pattern

Provide input/output pairs for quality-dependent tasks:

```markdown
**Example 1:**
Input: Added user authentication with JWT tokens
Output: feat(auth): implement JWT-based authentication
```

### Conditional Workflow Pattern

Guide through decision points:
```markdown
1. Determine modification type:
   - **Creating new content?** → Follow "Creation workflow"
   - **Editing existing?** → Follow "Editing workflow"
```

## Checklist for Effective Skills

Before sharing, verify:

**Core quality:**
- [ ] Description includes WHAT it does AND WHEN to use it
- [ ] Description uses third person, includes key trigger terms
- [ ] SKILL.md body under 500 lines
- [ ] File references one level deep (not nested)
- [ ] No time-sensitive information
- [ ] Consistent terminology throughout

**Workflows and code:**
- [ ] Complex tasks have step-by-step workflows
- [ ] Validation/feedback loops for quality-critical operations
- [ ] Scripts handle errors explicitly (don't punt to Claude)
- [ ] Required packages listed and verified as available

**Testing:**
- [ ] At least three evaluation scenarios created
- [ ] Tested with real usage scenarios
