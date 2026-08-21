# Workflow: Initialize Environment (init-env)

## Purpose
Inspect the selected stack, detect runtimes and package managers, establish isolated virtual environments, install dependencies, verify lockfiles, validate port availability, and establish `.env` configuration.

## Lifecycle Position
```text
DESIGN-ARCHITECTURE ──▶ [INIT-ENV] ──▶ CREATE-MVP ──▶ BUILD-FEATURE
```

## Prerequisites
- Completed [`docs/architecture.md`](../../docs/architecture.md) detailing stack selection.
- Completed [`docs/decisions.md`](../../docs/decisions.md).

## Relevant Skills
- [`.agents/skills/runtime-management`](../skills/runtime-management/SKILL.md)
- [`.agents/skills/security`](../skills/security/SKILL.md)
- [`.agents/skills/git-safety`](../skills/git-safety/SKILL.md)

## Step-by-Step Procedure
1. **Detect Installed Runtimes & Versions**:
   - For Node: `node -v`, `npm -v`, `pnpm -v`, `yarn -v`
   - For Python: `python --version`, `uv --version`, `pip --version`
   - For Rust/Go/Java (if chosen): check respective toolchain binaries.
2. **Establish Environment Isolation**:
   - Python: Initialize virtual environment (`python -m venv .venv` or `uv venv`).
   - Node: Confirm root or monorepo package manager structure.
3. **Install Core Dependencies**:
   - Execute package install command (`npm install`, `pnpm install`, or `pip install -r requirements.txt`).
   - Verify that lockfiles (`package-lock.json`, `pnpm-lock.yaml`, `poetry.lock`) are updated.
4. **Hydrate Local Configuration (`.env`)**:
   - Check if `.env` exists; if not, create it by copying `.env.example`.
   - Request real developer API keys from the user if required for critical external services. Never invent fake keys.
5. **Verify Ports & Connectivity**:
   - Check preferred ports (e.g. 3000, 8000) using `Get-NetTCPConnection` / platform command.
   - Test database connection if a local or remote DB is configured.
6. **Execute Minimal Health Check**:
   - Run a basic sanity command (e.g. `--version`, schema validate, dry-run compile).
7. **Record State**:
   - Update [`docs/current-state.md`](../../docs/current-state.md) with active runtime versions and environment parameters.

## Expected Outputs
- Isolated, verified runtime environment with all base packages installed.
- Configured `.env` matching `.env.example`.
- Updated `docs/current-state.md`.

## Verification Criteria
- [ ] Runtime commands execute with exit code 0.
- [ ] No missing dependency warnings or unresolved imports.
- [ ] Ports verified and unblocked.

## Failure Handling
- If a package manager or runtime is missing, suggest the easiest compatible alternative or prompt user with the exact installation command.
