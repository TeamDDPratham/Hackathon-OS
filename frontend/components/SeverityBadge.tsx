import React from 'react';
import { SeverityLevel } from '../types/scan';

interface BadgeProps {
  severity: SeverityLevel;
  className?: string;
}

export const SeverityBadge: React.FC<BadgeProps> = ({ severity, className = '' }) => {
  const styles: Record<SeverityLevel, { bg: string; text: string; border: string }> = {
    CRITICAL: { bg: 'bg-red-950/80', text: 'text-red-400', border: 'border-red-600/50' },
    HIGH: { bg: 'bg-orange-950/80', text: 'text-orange-400', border: 'border-orange-600/50' },
    MEDIUM: { bg: 'bg-amber-950/80', text: 'text-amber-400', border: 'border-amber-600/50' },
    LOW: { bg: 'bg-blue-950/80', text: 'text-blue-400', border: 'border-blue-600/50' },
    INFO: { bg: 'bg-slate-900/80', text: 'text-slate-400', border: 'border-slate-700/50' }
  };

  const style = styles[severity] || styles.INFO;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold uppercase tracking-wider border ${style.bg} ${style.text} ${style.border} ${className}`}>
      {severity}
    </span>
  );
};
