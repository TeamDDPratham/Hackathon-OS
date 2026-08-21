from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum
from datetime import datetime

class SeverityLevel(str, Enum):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"
    INFO = "INFO"

class FindingStatus(str, Enum):
    PASS = "PASS"
    WARN = "WARN"
    FAIL = "FAIL"
    NOT_TESTED = "NOT_TESTED"

class ScanStatus(str, Enum):
    PENDING = "PENDING"
    RUNNING = "RUNNING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"

class SecurityCategory(str, Enum):
    AUTH = "Authentication"
    AUTHZ = "Authorization / Access Control"
    INPUT_VALIDATION = "Input Validation"
    SECURITY_HEADERS = "Security Headers"
    RATE_LIMITING = "Rate Limiting"
    INFO_DISCLOSURE = "Information Disclosure"

class Finding(BaseModel):
    id: str
    title: str
    category: SecurityCategory
    severity: SeverityLevel
    endpoint: str
    method: str
    description: str
    evidence: Dict[str, Any] = Field(default_factory=dict)
    impact: str
    recommendation: str
    remediation_code: Optional[str] = None
    status: FindingStatus = FindingStatus.FAIL
    cwe_id: Optional[str] = None

class DiscoveredEndpoint(BaseModel):
    path: str
    method: str
    summary: Optional[str] = None
    parameters: List[Dict[str, Any]] = Field(default_factory=list)
    requires_auth: bool = False

class ScanRequest(BaseModel):
    target_url: str
    openapi_spec: Optional[Dict[str, Any]] = None
    auth_token: Optional[str] = None
    auth_header_name: str = "Authorization"
    custom_headers: Dict[str, str] = Field(default_factory=dict)
    test_categories: Optional[List[SecurityCategory]] = None

class ScanSummary(BaseModel):
    id: str
    target_url: str
    status: ScanStatus
    score: int
    grade: str
    created_at: datetime
    completed_at: Optional[datetime] = None
    duration_seconds: float = 0.0
    endpoints_count: int = 0
    tests_completed: int = 0
    critical_count: int = 0
    high_count: int = 0
    medium_count: int = 0
    low_count: int = 0
    info_count: int = 0
    total_findings: int = 0

class ScanDetail(ScanSummary):
    endpoints: List[DiscoveredEndpoint] = Field(default_factory=list)
    findings: List[Finding] = Field(default_factory=list)
    categories_tested: Dict[str, str] = Field(default_factory=dict)
    error_message: Optional[str] = None
