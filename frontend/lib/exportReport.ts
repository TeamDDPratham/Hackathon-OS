import { ScanDetail } from '../types/scan';

export function exportScanAsJson(scan: ScanDetail) {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(scan, null, 2)
  )}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', `sentinel_audit_${scan.id}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function exportScanAsMarkdown(scan: ScanDetail) {
  const dateStr = new Date(scan.created_at).toUTCString();
  let md = `# Sentinel API Security Assessment Report\n\n`;
  md += `**Scan ID**: \`${scan.id}\`  \n`;
  md += `**Target URL**: \`${scan.target_url}\`  \n`;
  md += `**Timestamp**: ${dateStr}  \n`;
  md += `**Overall Security Score**: **${scan.score} / 100** (Grade ${scan.grade})  \n`;
  md += `**Scan Duration**: ${scan.duration_seconds}s  \n\n`;

  md += `## Severity Summary\n\n`;
  md += `| Critical | High | Medium | Low | Info | Total Vulnerabilities |\n`;
  md += `| :---: | :---: | :---: | :---: | :---: | :---: |\n`;
  md += `| **${scan.critical_count}** | **${scan.high_count}** | **${scan.medium_count}** | **${scan.low_count}** | **${scan.info_count}** | **${scan.total_findings}** |\n\n`;

  md += `## Discovered Endpoints (${scan.endpoints_count})\n\n`;
  scan.endpoints.forEach((ep) => {
    md += `- \`${ep.method}\` \`${ep.path}\` ${ep.requires_auth ? '*(Auth Required)*' : ''}\n`;
  });
  md += `\n---\n\n`;

  md += `## Detailed Findings & Remediation\n\n`;
  if (scan.findings.length === 0) {
    md += `*No vulnerabilities identified during this scan.*\n`;
  } else {
    scan.findings.forEach((f, idx) => {
      md += `### ${idx + 1}. [${f.severity}] ${f.title}\n\n`;
      md += `- **Endpoint**: \`${f.method} ${f.endpoint}\`\n`;
      md += `- **Category**: ${f.category}\n`;
      md += `- **CWE Identifier**: ${f.cwe_id || 'CWE-API'}\n`;
      md += `- **Description**: ${f.description}\n`;
      md += `- **Security Impact**: ${f.impact}\n`;
      md += `- **Remediation**: ${f.recommendation}\n\n`;
      if (f.remediation_code) {
        md += `**Hardened Implementation:**\n\`\`\`python\n${f.remediation_code}\n\`\`\`\n\n`;
      }
      md += `**Technical Evidence:**\n\`\`\`json\n${JSON.stringify(f.evidence, null, 2)}\n\`\`\`\n\n`;
      md += `---\n\n`;
    });
  }

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', url);
  downloadAnchor.setAttribute('download', `sentinel_report_${scan.id}.md`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  URL.revokeObjectURL(url);
}
