import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldAlert,
  Clock,
  User,
  Globe,
  Terminal,
  Activity,
  ChevronRight,
  FileText,
} from 'lucide-react';
import { M3Card } from '../ui/M3Card';
import { M3Button } from '../ui/M3Button';
import { M3Badge } from '../ui/M3Badge';
import { M3Dialog } from '../ui/M3Dialog';
import { AuditLogItem } from '@/lib/mock-data';

export interface AuditLogsViewProps {
  logs: AuditLogItem[];
  onAddLog?: (log: Omit<AuditLogItem, 'id' | 'timestamp'>) => void;
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ logs }) => {
  const [moduleFilter, setModuleFilter] = useState<string>('All');
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);

  const filteredLogs = logs.filter((log) => {
    const matchesModule = moduleFilter === 'All' || log.module === moduleFilter;
    const matchesSeverity = severityFilter === 'All' || log.severity === severityFilter;
    const matchesQuery =
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ipAddress.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesModule && matchesSeverity && matchesQuery;
  });

  const handleExportCSV = () => {
    const headers = 'ID,Timestamp,Actor,Role,Module,Action,Severity,IP Address,Location,Details\n';
    const rows = filteredLogs
      .map(
        (l) =>
          `"${l.id}","${l.timestamp}","${l.actor}","${l.actorRole}","${l.module}","${l.action.replace(
            /"/g,
            '""'
          )}","${l.severity}","${l.ipAddress}","${l.location}","${l.details.replace(/"/g, '""')}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `operava_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getSeverityBadge = (sev: AuditLogItem['severity']) => {
    switch (sev) {
      case 'Info':
        return <M3Badge variant="outline">Info</M3Badge>;
      case 'Warning':
        return <M3Badge variant="warning">Warning</M3Badge>;
      case 'Critical':
        return <M3Badge variant="error">Critical</M3Badge>;
      case 'Security Flag':
        return <M3Badge variant="error">Security Flag</M3Badge>;
      default:
        return <M3Badge variant="outline">{sev}</M3Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[var(--m3-primary-container)] text-[var(--m3-on-primary-container)] text-[11px] font-bold">
              Compliance & Security
            </span>
            <span className="text-xs text-[var(--m3-on-surface-variant)]">
              SOC2 Type II Audit Trail
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--m3-on-surface)] mt-1 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[var(--m3-primary)]" />
            Internal Audit & System Logs
          </h1>
          <p className="text-xs text-[var(--m3-on-surface-variant)] mt-1 max-w-xl">
            Immutable audit record tracking agent status transitions, CRM sticky annotations, email broadcasts, and security tokens.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <M3Button
            variant="filled"
            icon={<Download className="w-4 h-4" />}
            onClick={handleExportCSV}
          >
            Export Audit CSV
          </M3Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-[var(--m3-surface-container)] border border-[var(--m3-outline-variant)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--m3-on-surface-variant)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search audit trail, actor, IP..."
              className="w-full pl-9 pr-3 py-2 rounded-full bg-[var(--m3-surface-container-high)] text-xs text-[var(--m3-on-surface)] border border-[var(--m3-outline-variant)] focus:outline-hidden"
            />
          </div>

          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="px-3 py-2 rounded-full bg-[var(--m3-surface-container-high)] border border-[var(--m3-outline-variant)] text-xs text-[var(--m3-on-surface)] focus:outline-hidden"
          >
            <option value="All">All Modules</option>
            <option value="CRM">CRM</option>
            <option value="Ticketing">Ticketing</option>
            <option value="Emailing">Emailing</option>
            <option value="Billing">Billing</option>
            <option value="Security">Security</option>
          </select>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-2 rounded-full bg-[var(--m3-surface-container-high)] border border-[var(--m3-outline-variant)] text-xs text-[var(--m3-on-surface)] focus:outline-hidden"
          >
            <option value="All">All Severities</option>
            <option value="Info">Info</option>
            <option value="Warning">Warning</option>
            <option value="Critical">Critical</option>
            <option value="Security Flag">Security Flag</option>
          </select>
        </div>

        <div className="text-xs text-[var(--m3-on-surface-variant)] font-mono shrink-0">
          Showing {filteredLogs.length} of {logs.length} Log Entries
        </div>
      </div>

      {/* Audit Log Entries Table */}
      <div className="rounded-3xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[var(--m3-outline-variant)] bg-[var(--m3-surface-container)] text-[var(--m3-on-surface-variant)] uppercase font-semibold text-[10px]">
                <th className="p-4">Timestamp</th>
                <th className="p-4">Actor / Role</th>
                <th className="p-4">Module</th>
                <th className="p-4">Action Event</th>
                <th className="p-4">Severity</th>
                <th className="p-4">IP & Location</th>
                <th className="p-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--m3-outline-variant)] text-[var(--m3-on-surface)]">
              {filteredLogs.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedLog(item)}
                  className="hover:bg-[var(--m3-surface-container)] transition-colors cursor-pointer"
                >
                  <td className="p-4 font-mono text-[11px] text-[var(--m3-primary)] font-bold whitespace-nowrap">
                    {item.timestamp}
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-xs">{item.actor}</div>
                    <div className="text-[10px] text-[var(--m3-on-surface-variant)]">
                      {item.actorRole}
                    </div>
                  </td>
                  <td className="p-4">
                    <M3Badge variant="outline" size="sm">
                      {item.module}
                    </M3Badge>
                  </td>
                  <td className="p-4 font-semibold text-xs text-[var(--m3-on-surface)] max-w-xs truncate">
                    {item.action}
                  </td>
                  <td className="p-4">{getSeverityBadge(item.severity)}</td>
                  <td className="p-4 font-mono text-[11px] text-[var(--m3-on-surface-variant)]">
                    <div>{item.ipAddress}</div>
                    <div className="text-[9px]">{item.location}</div>
                  </td>
                  <td className="p-4 text-right">
                    <ChevronRight className="w-4 h-4 text-[var(--m3-on-surface-variant)] inline-block" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredLogs.length === 0 && (
        <div className="text-center py-12 p-8 rounded-3xl bg-[var(--m3-surface-container)] border border-[var(--m3-outline-variant)] space-y-3">
          <Terminal className="w-10 h-10 text-[var(--m3-on-surface-variant)] mx-auto opacity-40" />
          <h3 className="font-bold text-base text-[var(--m3-on-surface)]">No Audit Logs Match Filter</h3>
          <p className="text-xs text-[var(--m3-on-surface-variant)] max-w-sm mx-auto">
            Try resetting your search query or severity dropdown.
          </p>
        </div>
      )}

      {/* Modal: Log Item Inspector */}
      {selectedLog && (
        <M3Dialog
          isOpen={!!selectedLog}
          onClose={() => setSelectedLog(null)}
          title={`Audit Log Record: ${selectedLog.id}`}
          icon={<Terminal className="w-5 h-5" />}
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)] space-y-2">
              <div className="flex items-center justify-between font-mono text-[11px] text-[var(--m3-primary)] font-bold">
                <span>Timestamp: {selectedLog.timestamp}</span>
                {getSeverityBadge(selectedLog.severity)}
              </div>
              <h3 className="font-bold text-sm text-[var(--m3-on-surface)]">
                {selectedLog.action}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-[var(--m3-surface-container-high)] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[var(--m3-on-surface-variant)]">
                  Actor & Role
                </span>
                <div className="font-bold text-[var(--m3-on-surface)]">{selectedLog.actor}</div>
                <div className="text-[11px] text-[var(--m3-on-surface-variant)]">{selectedLog.actorRole}</div>
              </div>

              <div className="p-3 rounded-2xl bg-[var(--m3-surface-container-high)] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[var(--m3-on-surface-variant)]">
                  Network Telemetry
                </span>
                <div className="font-mono font-bold text-[var(--m3-on-surface)]">{selectedLog.ipAddress}</div>
                <div className="text-[11px] text-[var(--m3-on-surface-variant)]">{selectedLog.location}</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--m3-surface-container)] border border-[var(--m3-outline-variant)] space-y-1">
              <span className="text-[10px] uppercase font-bold text-[var(--m3-on-surface-variant)]">
                Audit Log Details
              </span>
              <p className="text-[var(--m3-on-surface)] leading-relaxed font-mono text-[11px]">
                {selectedLog.details}
              </p>
            </div>

            <div className="flex items-center justify-end pt-2">
              <M3Button variant="filled" onClick={() => setSelectedLog(null)}>
                Close Record
              </M3Button>
            </div>
          </div>
        </M3Dialog>
      )}
    </div>
  );
};
