import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  Key,
  Lock,
  Plus,
  Trash2,
  Copy,
  Check,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { M3Card } from '../ui/M3Card';
import { M3Button } from '../ui/M3Button';
import { M3Badge } from '../ui/M3Badge';
import { M3Dialog } from '../ui/M3Dialog';
import { SecurityAuditLog } from '@/lib/mock-data';

export interface SecurityAuditViewProps {
  logs?: SecurityAuditLog[];
}

interface ApiKeyItem {
  id: string;
  name: string;
  keyPrefix: string;
  created: string;
  lastUsed: string;
}

export const SecurityAuditView: React.FC<SecurityAuditViewProps> = ({ logs = [] }) => {
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([
    {
      id: 'key-1',
      name: 'Production Cloud Run Proxy Token',
      keyPrefix: 'm3_live_9204...',
      created: '2026-01-10',
      lastUsed: '2 minutes ago',
    },
    {
      id: 'key-2',
      name: 'Staging Webhook Secret',
      keyPrefix: 'm3_test_8812...',
      created: '2026-02-15',
      lastUsed: '1 hour ago',
    },
  ]);

  const [isGenerateKeyOpen, setIsGenerateKeyOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [generatedRawKey, setGeneratedRawKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  const handleGenerateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    const raw = `m3_live_secret_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
    const newKey: ApiKeyItem = {
      id: `key-${Date.now()}`,
      name: newKeyName,
      keyPrefix: `${raw.substring(0, 12)}...`,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
    };

    setApiKeys((prev) => [...prev, newKey]);
    setGeneratedRawKey(raw);
  };

  const handleDeleteKey = (id: string) => {
    setApiKeys((prev) => prev.filter((k) => k.id !== id));
  };

  const copyKey = () => {
    if (generatedRawKey) {
      navigator.clipboard.writeText(generatedRawKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--m3-on-surface)] flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[var(--m3-primary)]" />
            Security Compliance & API Tokens
          </h1>
          <p className="text-xs text-[var(--m3-on-surface-variant)]">
            Audit logging, API credentials management, IP whitelist controls, and SOC2 Type II compliance.
          </p>
        </div>

        <M3Button
          variant="filled"
          icon={<Key className="w-4 h-4" />}
          onClick={() => {
            setGeneratedRawKey(null);
            setNewKeyName('');
            setIsGenerateKeyOpen(true);
          }}
        >
          Generate API Token
        </M3Button>
      </div>

      {/* API Tokens Management */}
      <M3Card variant="filled" className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-[var(--m3-primary)]" />
            <h2 className="text-base font-bold text-[var(--m3-on-surface)]">
              Active Portal API Access Tokens
            </h2>
          </div>
          <M3Badge variant="success" size="sm">SOC2 Type II Verified</M3Badge>
        </div>

        <div className="space-y-2">
          {apiKeys.map((key) => (
            <div
              key={key.id}
              className="p-4 rounded-2xl bg-[var(--m3-surface-container-lowest)] border border-[var(--m3-outline-variant)] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <p className="font-bold text-xs text-[var(--m3-on-surface)]">{key.name}</p>
                <p className="font-mono text-[11px] text-[var(--m3-primary)] mt-0.5">
                  {key.keyPrefix}
                </p>
                <p className="text-[10px] text-[var(--m3-on-surface-variant)] mt-1">
                  Created: {key.created} • Last Used: {key.lastUsed}
                </p>
              </div>

              <M3Button
                variant="text"
                size="sm"
                icon={<Trash2 className="w-4 h-4 text-[var(--m3-error)]" />}
                onClick={() => handleDeleteKey(key.id)}
              >
                Revoke Token
              </M3Button>
            </div>
          ))}
        </div>
      </M3Card>

      {/* Real-time Audit Logs */}
      <M3Card variant="filled" className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-[var(--m3-primary)]" />
            <h2 className="text-base font-bold text-[var(--m3-on-surface)]">
              Real-time Access & Authentication Audit Log
            </h2>
          </div>
          <span className="text-xs text-[var(--m3-on-surface-variant)] font-mono">
            {logs.length} Log Entries
          </span>
        </div>

        <div className="rounded-2xl border border-[var(--m3-outline-variant)] overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-[var(--m3-surface-container-high)] text-[var(--m3-on-surface-variant)] uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="p-3">Action Event</th>
                <th className="p-3">User Principal</th>
                <th className="p-3">IP Address</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--m3-outline-variant)]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-[var(--m3-surface-container-low)] transition-colors">
                  <td className="p-3 font-semibold">{log.action}</td>
                  <td className="p-3 text-[var(--m3-on-surface-variant)]">{log.user}</td>
                  <td className="p-3 font-mono text-[11px] text-[var(--m3-on-surface-variant)]">{log.ipAddress || (log as any).ip}</td>
                  <td className="p-3 text-[var(--m3-on-surface-variant)]">{log.timestamp}</td>
                  <td className="p-3">
                    <M3Badge
                      variant={log.status === 'Success' ? 'success' : 'error'}
                      size="sm"
                    >
                      {log.status}
                    </M3Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </M3Card>

      {/* Generate Key Modal */}
      <M3Dialog
        isOpen={isGenerateKeyOpen}
        onClose={() => setIsGenerateKeyOpen(false)}
        title="Provision API Secret Key"
        icon={<Key className="w-5 h-5" />}
      >
        {!generatedRawKey ? (
          <form onSubmit={handleGenerateKey} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[var(--m3-on-surface)] block mb-1">
                Token Name
              </label>
              <input
                type="text"
                required
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g. CI/CD Deployment Pipeline..."
                className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container)] text-xs text-[var(--m3-on-surface)] focus:outline-hidden"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <M3Button variant="text" type="button" onClick={() => setIsGenerateKeyOpen(false)}>
                Cancel
              </M3Button>
              <M3Button variant="filled" type="submit">
                Generate Token
              </M3Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[var(--m3-warning-container)] text-[var(--m3-on-warning-container)] text-xs">
              <p className="font-bold mb-1">Copy your secret key now!</p>
              <p>For security, this raw key will never be shown again.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--m3-surface-container-lowest)] border font-mono text-xs text-[var(--m3-primary)] break-all flex items-center justify-between gap-2">
              <span>{generatedRawKey}</span>
              <M3Button
                variant="tonal"
                size="sm"
                icon={copiedKey ? <Check className="w-4 h-4 text-[var(--m3-success)]" /> : <Copy className="w-4 h-4" />}
                onClick={copyKey}
              >
                {copiedKey ? 'Copied' : 'Copy'}
              </M3Button>
            </div>

            <div className="pt-2 flex justify-end">
              <M3Button variant="filled" onClick={() => setIsGenerateKeyOpen(false)}>
                Done
              </M3Button>
            </div>
          </div>
        )}
      </M3Dialog>
    </div>
  );
};
