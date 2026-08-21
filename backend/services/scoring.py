from typing import List, Tuple
from backend.models.schemas import Finding, SeverityLevel

SEVERITY_PENALTIES = {
    SeverityLevel.CRITICAL: 25,
    SeverityLevel.HIGH: 15,
    SeverityLevel.MEDIUM: 8,
    SeverityLevel.LOW: 3,
    SeverityLevel.INFO: 0
}

def calculate_security_score(findings: List[Finding]) -> Tuple[int, str]:
    """
    Calculates a deterministic security score from 0 to 100 based on finding severities.
    Returns (score, grade).
    """
    total_penalty = 0
    for finding in findings:
        total_penalty += SEVERITY_PENALTIES.get(finding.severity, 0)
    
    score = max(0, min(100, 100 - total_penalty))
    
    if score >= 90:
        grade = "A"
    elif score >= 75:
        grade = "B"
    elif score >= 60:
        grade = "C"
    elif score >= 40:
        grade = "D"
    else:
        grade = "F"
        
    return score, grade
