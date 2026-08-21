from fastapi import FastAPI, BackgroundTasks, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from backend.models.schemas import ScanRequest, ScanDetail, ScanSummary, ScanStatus
from backend.routes.mock_vulnerable import router as mock_router
from backend.services.orchestrator import scan_store, execute_scan

app = FastAPI(
    title="Sentinel API — Security Testing Platform",
    version="1.0.0",
    description="Automated API security testing platform with modular OWASP vulnerability analyzers."
)

# Enable CORS for Next.js Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Embedded Mock Vulnerable Target
app.include_router(mock_router)

@app.get("/api/health", summary="Health Check Endpoint")
def health_check():
    return {
        "status": "healthy",
        "service": "sentinel-api-backend",
        "version": "1.0.0",
        "engine": "active"
    }

@app.post("/api/scans", response_model=ScanDetail, summary="Create and Launch a Security Scan")
async def create_scan(request: ScanRequest, background_tasks: BackgroundTasks):
    if not request.target_url:
        raise HTTPException(status_code=400, detail="Target URL is required.")
    
    scan = scan_store.create_scan(request)
    background_tasks.add_task(execute_scan, scan.id, request)
    return scan

@app.get("/api/scans", response_model=List[ScanSummary], summary="List All Scan Histories")
def list_scans():
    return scan_store.list_scans()

@app.get("/api/scans/{scan_id}", response_model=ScanDetail, summary="Get Full Scan Results and Progress")
def get_scan(scan_id: str):
    scan = scan_store.get_scan(scan_id)
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found.")
    return scan

@app.get("/api/scans/{scan_id}/findings", summary="Get Findings for a Scan")
def get_scan_findings(scan_id: str, severity: Optional[str] = None):
    scan = scan_store.get_scan(scan_id)
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found.")
    if severity:
        return [f for f in scan.findings if f.severity.value.upper() == severity.upper()]
    return scan.findings

@app.get("/api/scans/{scan_id}/endpoints", summary="Get Discovered Endpoints for a Scan")
def get_scan_endpoints(scan_id: str):
    scan = scan_store.get_scan(scan_id)
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found.")
    return scan.endpoints

@app.post("/api/demo/scan", response_model=ScanDetail, summary="1-Click Demo Scan against Local Vulnerable Target")
async def trigger_demo_scan(background_tasks: BackgroundTasks):
    demo_request = ScanRequest(
        target_url="http://127.0.0.1:8000/api/mock-vulnerable",
        auth_token="demo-alice-student-token",
        custom_headers={"X-Demo-Mode": "true"}
    )
    scan = scan_store.create_scan(demo_request)
    background_tasks.add_task(execute_scan, scan.id, demo_request)
    return scan
