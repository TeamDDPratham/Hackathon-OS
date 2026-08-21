---
name: git-safety
description: Enforce safe Git checkpointing, non-destructive branching, logical commits, and rollback strategies during rapid hackathon sprints.
---

# Git Safety & Checkpoint Skill

## Purpose
This skill ensures code changes are preserved systematically without the risk of accidental work loss, history corruption, or unrecoverable regressions.

## Checkpoint Protocol
1. **Pre-Change Inspection**:
   ```powershell
   git status
   git diff --stat
   ```
2. **Pre-Risk Checkpoint**:
   Before initiating a risky architectural change or complex refactor:
   ```powershell
   git add -A
   git commit -m "checkpoint(pre-refactor): save stable state before [component] changes"
   ```
3. **Post-Milestone Logical Commits**:
   Standardized prefixes:
   - `feat(...)`: Verified new user-facing or core capability.
   - `fix(...)`: Bug fix or edge-case patch.
   - `arch(...)`: Structural, schema, or configuration update.
   - `docs(...)`: Documentation or ADR updates.
   - `test(...)`: Test suite additions.

## Non-Destructive Rollback Strategy
If an ongoing implementation causes cascading regressions:
1. Stop adding more blind fixes.
2. Check `git log -n 5 --oneline` to identify the last known good commit.
3. Use safe non-destructive checkout or revert:
   ```powershell
   # Restore specific broken files from last commit without wiping untracked work
   git checkout HEAD -- path/to/broken_file.ext
   ```
4. **Strictly Prohibited**:
   - Never `git push --force` to shared or main branches.
   - Never `git reset --hard` without verifying uncommitted files are backed up.
   - Never delete unmerged branches without explicit user confirmation.
