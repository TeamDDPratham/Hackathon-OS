from typing import List, Tuple
from backend.models.schemas import Finding, SeverityLevel, SecurityCategory

CATEGORY_WEIGHTS = {
    SecurityCategory.AUTH: 25,
    SecurityCategory.AUTHZ: 20,
    SecurityCategory.INPUT_VALIDATION: 15,
    SecurityCategory.RATE_LIMITING: 10,
    SecurityCategory.SECURITY_HEADERS: 15,
    SecurityCategory.INFO_DISCLOSURE: 15,
}

SEVERITY_DEDUCTION_RATIO = {
    SeverityLevel.CRITICAL: 1.0,
    SeverityLevel.HIGH: 0.8,
    SeverityLevel.MEDIUM: 0.5,
    SeverityLevel.LOW: 0.2,
    SeverityLevel.INFO: 0.0,
}

def calculate_security_score(findings: List[Finding]) -> Tuple[int, str]:
    """
    Calculates a deterministic security score from 0 to 100 based on the worst
    severity finding per security category, weighted by category importance.
    Returns (score, grade).
    """
    # Group findings by category and find worst severity ratio per category
    worst_ratio_per_category = {}
    for finding in findings:
        category = finding.category
        ratio = SEVERITY_DEDUCTION_RATIO.get(finding.severity, 0.0)
        
        if category not in worst_ratio_per_category:
            worst_ratio_per_category[category] = ratio
        else:
            worst_ratio_per_category[category] = max(worst_ratio_per_category[category], ratio)
            
    total_deduction = 0.0
    for category, worst_ratio in worst_ratio_per_category.items():
        weight = CATEGORY_WEIGHTS.get(category, 0)
        total_deduction += weight * worst_ratio
        
    score = max(0, min(100, round(100 - total_deduction)))
    
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
