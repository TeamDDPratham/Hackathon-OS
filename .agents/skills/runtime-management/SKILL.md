---
name: runtime-management
description: Safe management of dev servers, background processes, occupied ports, stale tasks, and port conflict resolution on Windows and cross-platform environments.
---

# Runtime & Process Management Skill

## Purpose
This skill ensures reliable lifecycle management of background servers, test processes, and port allocations, preventing zombie processes and port collisions during rapid iteration.

## Port & Process Inspection Rules (Windows / PowerShell Focus)

### 1. Port Collision Detection
Before binding or starting a service on a preferred port (e.g. 3000, 8000, 5000):
```powershell
# Check if port is in use
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object LocalAddress, LocalPort, OwningProcess, State
```

### 2. Identify the Owning Process
```powershell
# Get process info from OwningProcess PID
Get-Process -Id <PID> -ErrorAction SilentlyContinue | Select-Object Id, ProcessName, Path, StartTime
```

### 3. Graceful Termination & Cleanup
If the process is a stale instance of our current project:
```powershell
# Attempt graceful stop first
Stop-Process -Id <PID> -ErrorAction SilentlyContinue

# Force stop only if hung after 3 seconds
Stop-Process -Id <PID> -Force -ErrorAction SilentlyContinue
```
*Never kill unrelated system or user processes (e.g. explorer, code, docker, chrome).*

### 4. Dynamic Port Fallback
If the preferred port is occupied by an external/system process that cannot be stopped:
1. Increment port (e.g., `3000` $\to$ `3001` or `8000` $\to$ `8001`).
2. Update local `.env` or application config with the active port.
3. Record the active port in `docs/current-state.md`.

## Stale Process Hygiene Protocol
Before concluding a test run or test-project workflow:
- Stop temporary headless servers.
- Release locked database file handles.
- Confirm only approved persistent background services remain active.
