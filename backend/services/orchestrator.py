import httpx
import uuid
import time
from datetime import datetime
from typing import Dict, List, Optional
from backend.models.schemas import (
    ScanRequest, ScanDetail, ScanSummary, ScanStatus,
    Finding, DiscoveredEndpoint, SeverityLevel, SecurityCategory
)
from backend.services.discovery import discover_endpoints
from backend.services.scoring import calculate_security_score
from backend.services.security_modules.auth_tests import test_authentication
from backend.services.security_modules.authorization_tests import test_authorization_bola
from backend.services.security_modules.validation_tests import test_input_validation
from backend.services.security_modules.header_tests import test_security_headers
from backend.services.security_modules.rate_limit_tests import test_rate_limiting
from backend.services.security_modules.disclosure_tests import test_information_disclosure

class ScanStore:
    def __init__(self):
        self.scans: Dict[str, ScanDetail] = {}

    def create_scan(self, request: ScanRequest) -> ScanDetail:
        scan_id = f"scan_{uuid.uuid4().hex[:8]}"
        detail = ScanDetail(
            id=scan_id,
            target_url=request.target_url,
            status=ScanStatus.PENDING,
            score=100,
            grade="A",
            created_at=datetime.utcnow(),
            endpoints_count=0,
            tests_completed=0,
            critical_count=0,
            high_count=0,
            medium_count=0,
            low_count=0,
            info_count=0,
            total_findings=0
        )
        self.scans[scan_id] = detail
        return detail

    def get_scan(self, scan_id: str) -> Optional[ScanDetail]:
        return self.scans.get(scan_id)

    def list_scans(self) -> List[ScanSummary]:
        return [
            ScanSummary(
                id=s.id,
                target_url=s.target_url,
                status=s.status,
                score=s.score,
                grade=s.grade,
                created_at=s.created_at,
                completed_at=s.completed_at,
                duration_seconds=s.duration_seconds,
                endpoints_count=s.endpoints_count,
                tests_completed=s.tests_completed,
                critical_count=s.critical_count,
                high_count=s.high_count,
                medium_count=s.medium_count,
                low_count=s.low_count,
                info_count=s.info_count,
                total_findings=s.total_findings
            )
            for s in sorted(self.scans.values(), key=lambda x: x.created_at, reverse=True)
        ]

scan_store = ScanStore()

async def execute_scan(scan_id: str, request: ScanRequest):
    scan = scan_store.get_scan(scan_id)
    if not scan:
        return

    start_time = time.time()
    scan.status = ScanStatus.RUNNING

    async with httpx.AsyncClient(verify=False, follow_redirects=True) as client:
        try:
            # 1. Endpoint Discovery
            endpoints = await discover_endpoints(client, request.target_url, request.openapi_spec)
            scan.endpoints = endpoints
            scan.endpoints_count = len(endpoints)

            all_findings: List[Finding] = []

            # 2. Execute Modular Security Checks
            # Module 1: Auth Tests
            auth_findings = await test_authentication(client, request.target_url, endpoints, request.auth_token, request.auth_header_name)
            all_findings.extend(auth_findings)
            scan.tests_completed += len(endpoints)

            # Module 2: BOLA / AuthZ Tests
            bola_findings = await test_authorization_bola(client, request.target_url, endpoints, request.auth_token)
            all_findings.extend(bola_findings)
            scan.tests_completed += len(endpoints)

            # Module 3: Input Validation Tests
            val_findings = await test_input_validation(client, request.target_url, endpoints, request.auth_token)
            all_findings.extend(val_findings)
            scan.tests_completed += len(endpoints)

            # Module 4: Security Headers Tests
            hdr_findings = await test_security_headers(client, request.target_url, endpoints)
            all_findings.extend(hdr_findings)
            scan.tests_completed += 4

            # Module 5: Rate Limiting Tests
            rate_findings = await test_rate_limiting(client, request.target_url, endpoints)
            all_findings.extend(rate_findings)
            scan.tests_completed += 6

            # Module 6: Information Disclosure Tests
            disc_findings = await test_information_disclosure(client, request.target_url, endpoints)
            all_findings.extend(disc_findings)
            scan.tests_completed += len(endpoints)

            # 3. Categorize & Score Findings
            scan.findings = all_findings
            scan.total_findings = len(all_findings)
            scan.critical_count = sum(1 for f in all_findings if f.severity == SeverityLevel.CRITICAL)
            scan.high_count = sum(1 for f in all_findings if f.severity == SeverityLevel.HIGH)
            scan.medium_count = sum(1 for f in all_findings if f.severity == SeverityLevel.MEDIUM)
            scan.low_count = sum(1 for f in all_findings if f.severity == SeverityLevel.LOW)
            scan.info_count = sum(1 for f in all_findings if f.severity == SeverityLevel.INFO)

            score, grade = calculate_security_score(all_findings)
            scan.score = score
            scan.grade = grade

            scan.status = ScanStatus.COMPLETED
        except Exception as e:
            scan.status = ScanStatus.FAILED
            scan.error_message = f"Scan error: {str(e)}"
        finally:
            scan.completed_at = datetime.utcnow()
            scan.duration_seconds = round(time.time() - start_time, 2)
