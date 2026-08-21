export type SeverityLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";
export type FindingStatus = "PASS" | "WARN" | "FAIL" | "NOT_TESTED";
export type ScanStatus = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED" | "CANCELLED";

export interface Finding {
  id: string;
  title: string;
  category: string;
  severity: SeverityLevel;
  endpoint: string;
  method: string;
  description: string;
  evidence: Record<string, any>;
  impact: string;
  recommendation: string;
  remediation_code?: string;
  status: FindingStatus;
  cwe_id?: string;
}

export interface DiscoveredEndpoint {
  path: string;
  method: string;
  summary?: string;
  parameters?: any[];
  requires_auth?: boolean;
}

export interface ScanDetail {
  id: string;
  target_url: string;
  status: ScanStatus;
  score: number;
  grade: string;
  created_at: string;
  completed_at?: string;
  duration_seconds: number;
  endpoints_count: number;
  tests_completed: number;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
  info_count: number;
  total_findings: number;
  endpoints: DiscoveredEndpoint[];
  findings: Finding[];
  error_message?: string;
}

export interface ScanSummary {
  id: string;
  target_url: string;
  status: ScanStatus;
  score: number;
  grade: string;
  created_at: string;
  completed_at?: string;
  duration_seconds: number;
  endpoints_count: number;
  tests_completed: number;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
  info_count: number;
  total_findings: number;
}
