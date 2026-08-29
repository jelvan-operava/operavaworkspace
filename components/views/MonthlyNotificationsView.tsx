import React, { useState } from 'react';
import { MonthlyNotificationRule, MonthlyDispatchLog } from '@/lib/mock-data';
import { M3Button } from '../ui/M3Button';
import { M3Badge } from '../ui/M3Badge';
import { M3Dialog } from '../ui/M3Dialog';
import {
  BellRing,
  Calendar,
  Clock,
  CheckCircle2,
  Play,
  Plus,
  Send,
  MessageSquare,
  Smartphone,
  Layout,
  FileText,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export interface MonthlyNotificationsViewProps {
  rules: MonthlyNotificationRule[];
  logs: MonthlyDispatchLog[];
  onToggleRuleActive: (id: string) => void;
  onAddRule: (rule: Omit<MonthlyNotificationRule, 'id'>) => void;
  onManualTrigger: (ruleTitle: string) => void;
}

export const MonthlyNotificationsView: React.FC<MonthlyNotificationsViewProps> = ({
  rules,
  logs,
  onToggleRuleActive,
  onAddRule,
  onManualTrigger,
}) => {
  const [activeTab, setActiveTab] = useState<'rules' | 'logs'>('rules');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [triggeredNotice, setTriggeredNotice] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dayOfMonth, setDayOfMonth] = useState<number>(1);
  const [time, setTime] = useState('09:00 AM');
  const [category, setCategory] = useState<MonthlyNotificationRule['category']>('Billing');
  const [recipientGroup, setRecipientGroup] = useState('Billing Contacts & Account Sponsors');
  const [channels, setChannels] = useState({
    portalBanner: true,
    emailBroadcast: true,
    smsAlert: false,
    workspaceChat: true,
  });

  const handleCreateRuleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddRule({
      title,
      description: description || 'Automated monthly workspace client alert and summary digest.',
      dayOfMonth: Number(dayOfMonth) || 1,
      time,
      channels,
      recipientGroup,
      active: true,
      lastDispatched: 'Never',
      nextDispatch: `2026-08-0${dayOfMonth} ${time.split(' ')[0]}`,
      category,
    });

    setIsAddModalOpen(false);
    // Reset
    setTitle('');
    setDescription('');
  };

  const handleTriggerRun = (ruleTitle: string) => {
    onManualTrigger(ruleTitle);
    setTriggeredNotice(`Manual dispatch successfully executed for "${ruleTitle}"!`);
    setTimeout(() => setTriggeredNotice(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[var(--m3-primary-container)] text-[var(--m3-on-primary-container)] text-[11px] font-bold">
              Automated Monthly Schedule
            </span>
            <span className="text-xs text-[var(--m3-on-surface-variant)]">Recurring Billing & SLA Triggers</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--m3-on-surface)] mt-1 flex items-center gap-2">
            <BellRing className="w-6 h-6 text-[var(--m3-primary)]" />
            Monthly Notifications & Alerts Manager
          </h1>
          <p className="text-xs text-[var(--m3-on-surface-variant)] mt-1 max-w-xl">
            Configure automated monthly notification schedules for recurring billing statements, SLA performance reports, project milestone digests, and security compliance reminders.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <M3Button variant="filled" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Monthly Rule
          </M3Button>
        </div>
      </div>

      {triggeredNotice && (
        <div className="p-4 rounded-2xl bg-[var(--m3-success-container)] text-[var(--m3-on-success-container)] text-xs font-bold flex items-center gap-2 shadow-xs animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{triggeredNotice}</span>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[var(--m3-surface-container)] border border-[var(--m3-outline-variant)] flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--m3-on-surface-variant)] font-medium">Active Rules</p>
            <p className="text-2xl font-bold text-[var(--m3-on-surface)] mt-1">
              {rules.filter((r) => r.active).length} Rules
            </p>
            <p className="text-[11px] text-[var(--m3-success)] font-semibold mt-0.5">
              100% On-Schedule
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[var(--m3-primary-container)] text-[var(--m3-on-primary-container)] flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[var(--m3-surface-container)] border border-[var(--m3-outline-variant)] flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--m3-on-surface-variant)] font-medium">Next Scheduled Run</p>
            <p className="text-base font-bold text-[var(--m3-on-surface)] mt-1">August 1, 08:00 AM</p>
            <p className="text-[11px] text-[var(--m3-primary)] font-semibold mt-0.5">
              Monthly Invoicing Statement
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[var(--m3-tertiary-container)] text-[var(--m3-on-tertiary-container)] flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[var(--m3-surface-container)] border border-[var(--m3-outline-variant)] flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--m3-on-surface-variant)] font-medium">Delivery Uptime</p>
            <p className="text-2xl font-bold text-[var(--m3-on-surface)] mt-1">99.98%</p>
            <p className="text-[11px] text-[var(--m3-success)] font-semibold mt-0.5">
              Zero Failed Dispatches
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[var(--m3-success-container)] text-[var(--m3-on-success-container)] flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[var(--m3-surface-container)] border border-[var(--m3-outline-variant)] flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--m3-on-surface-variant)] font-medium">Multi-Channel Sync</p>
            <p className="text-base font-bold text-[var(--m3-on-surface)] mt-1">Email, SMS, Portal</p>
            <p className="text-[11px] text-[var(--m3-on-surface-variant)] mt-0.5">Workspace Chat Enabled</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[var(--m3-surface-container-high)] text-[var(--m3-primary)] flex items-center justify-center">
            <Send className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)] w-fit">
        <button
          onClick={() => setActiveTab('rules')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
            activeTab === 'rules'
              ? 'bg-[var(--m3-primary)] text-[var(--m3-on-primary)] shadow-2xs'
              : 'hover:bg-[var(--m3-surface-container-high)] text-[var(--m3-on-surface-variant)]'
          }`}
        >
          Monthly Schedule Rules
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
            activeTab === 'logs'
              ? 'bg-[var(--m3-primary)] text-[var(--m3-on-primary)] shadow-2xs'
              : 'hover:bg-[var(--m3-surface-container-high)] text-[var(--m3-on-surface-variant)]'
          }`}
        >
          Dispatch History Logs ({logs.length})
        </button>
      </div>

      {/* Tab 1: Rules List */}
      {activeTab === 'rules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="p-5 rounded-3xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)] space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-[var(--m3-primary-container)] text-[var(--m3-on-primary-container)] text-[10px] font-bold">
                    {rule.category}
                  </span>
                  <button
                    onClick={() => onToggleRuleActive(rule.id)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                      rule.active
                        ? 'bg-[var(--m3-success-container)] text-[var(--m3-on-success-container)]'
                        : 'bg-[var(--m3-surface-container-high)] text-[var(--m3-on-surface-variant)]'
                    }`}
                  >
                    {rule.active ? 'ACTIVE' : 'PAUSED'}
                  </button>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-[var(--m3-on-surface)] flex items-center gap-2">
                    {rule.title}
                  </h3>
                  <p className="text-xs text-[var(--m3-on-surface-variant)] mt-1">
                    {rule.description}
                  </p>
                </div>

                {/* Schedule Info */}
                <div className="p-3 rounded-2xl bg-[var(--m3-surface-container)] text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-[var(--m3-on-surface-variant)]">
                    <span>Recurrence Cycle:</span>
                    <span className="font-bold text-[var(--m3-on-surface)]">
                      Day {rule.dayOfMonth} of every month at {rule.time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[var(--m3-on-surface-variant)]">
                    <span>Target Group:</span>
                    <span className="font-semibold text-[var(--m3-on-surface)]">
                      {rule.recipientGroup}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[var(--m3-on-surface-variant)]">
                    <span>Next Dispatch:</span>
                    <span className="font-bold text-[var(--m3-primary)]">
                      {rule.nextDispatch}
                    </span>
                  </div>
                </div>

                {/* Delivery Channels */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--m3-on-surface-variant)] mb-1.5">
                    Active Delivery Channels
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {rule.channels.portalBanner && (
                      <span className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-lg bg-[var(--m3-surface-container-high)] font-semibold">
                        <Layout className="w-3 h-3 text-[var(--m3-primary)]" /> Portal Banner
                      </span>
                    )}
                    {rule.channels.emailBroadcast && (
                      <span className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-lg bg-[var(--m3-surface-container-high)] font-semibold">
                        <Send className="w-3 h-3 text-[var(--m3-primary)]" /> Email
                      </span>
                    )}
                    {rule.channels.smsAlert && (
                      <span className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-lg bg-[var(--m3-surface-container-high)] font-semibold">
                        <Smartphone className="w-3 h-3 text-[var(--m3-primary)]" /> SMS
                      </span>
                    )}
                    {rule.channels.workspaceChat && (
                      <span className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-lg bg-[var(--m3-surface-container-high)] font-semibold">
                        <MessageSquare className="w-3 h-3 text-[var(--m3-primary)]" /> Chat
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--m3-outline-variant)] flex items-center justify-between">
                <span className="text-[11px] text-[var(--m3-on-surface-variant)]">
                  Last Run: {rule.lastDispatched}
                </span>
                <M3Button
                  variant="tonal"
                  size="sm"
                  onClick={() => handleTriggerRun(rule.title)}
                >
                  <Play className="w-3.5 h-3.5 mr-1" />
                  Trigger Manual Run
                </M3Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Dispatch History Logs */}
      {activeTab === 'logs' && (
        <div className="rounded-3xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)] overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[var(--m3-outline-variant)] bg-[var(--m3-surface-container)] text-[var(--m3-on-surface-variant)] uppercase font-semibold text-[10px]">
                <th className="p-4">Notification Rule</th>
                <th className="p-4">Dispatched At</th>
                <th className="p-4">Recipients Count</th>
                <th className="p-4">Delivery Status</th>
                <th className="p-4">Summary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--m3-outline-variant)] text-[var(--m3-on-surface)]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-[var(--m3-surface-container)]">
                  <td className="p-4 font-bold text-xs">{log.ruleTitle}</td>
                  <td className="p-4 text-[var(--m3-on-surface-variant)]">{log.dispatchedAt}</td>
                  <td className="p-4 font-bold">{log.recipientsCount} Contacts</td>
                  <td className="p-4">
                    <M3Badge variant={log.status === 'Delivered' ? 'success' : 'warning'}>
                      {log.status}
                    </M3Badge>
                  </td>
                  <td className="p-4 text-[var(--m3-on-surface-variant)]">{log.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: Create Monthly Rule */}
      <M3Dialog
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create Automated Monthly Notification Rule"
      >
        <form onSubmit={handleCreateRuleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold block mb-1">Rule Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Monthly Infrastructure SLA & Billing Alert"
              className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container-low)] text-[var(--m3-on-surface)] border border-[var(--m3-outline-variant)] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Category</label>
            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as MonthlyNotificationRule['category'])
              }
              className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container-low)] text-[var(--m3-on-surface)] border border-[var(--m3-outline-variant)] focus:outline-hidden"
            >
              <option value="Billing">Billing Statement</option>
              <option value="SLA & Support">SLA & Support Digest</option>
              <option value="Project Digest">Project Milestones</option>
              <option value="Security Audit">Security Audit Compliance</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">Day of Month (1-28)</label>
              <input
                type="number"
                min="1"
                max="28"
                required
                value={dayOfMonth}
                onChange={(e) => setDayOfMonth(Number(e.target.value))}
                className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container-low)] text-[var(--m3-on-surface)] border border-[var(--m3-outline-variant)] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Dispatch Time</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="09:00 AM"
                className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container-low)] text-[var(--m3-on-surface)] border border-[var(--m3-outline-variant)] focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1">Target Recipient Group</label>
            <input
              type="text"
              value={recipientGroup}
              onChange={(e) => setRecipientGroup(e.target.value)}
              className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container-low)] text-[var(--m3-on-surface)] border border-[var(--m3-outline-variant)] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="font-semibold block mb-2">Delivery Channels</label>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={channels.portalBanner}
                  onChange={(e) =>
                    setChannels({ ...channels, portalBanner: e.target.checked })
                  }
                  className="rounded text-[var(--m3-primary)]"
                />
                <span>Portal Banner</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={channels.emailBroadcast}
                  onChange={(e) =>
                    setChannels({ ...channels, emailBroadcast: e.target.checked })
                  }
                  className="rounded text-[var(--m3-primary)]"
                />
                <span>Email Broadcast</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={channels.smsAlert}
                  onChange={(e) =>
                    setChannels({ ...channels, smsAlert: e.target.checked })
                  }
                  className="rounded text-[var(--m3-primary)]"
                />
                <span>SMS Alert</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={channels.workspaceChat}
                  onChange={(e) =>
                    setChannels({ ...channels, workspaceChat: e.target.checked })
                  }
                  className="rounded text-[var(--m3-primary)]"
                />
                <span>Workspace Chat</span>
              </label>
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1">Rule Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Summary of what this monthly rule triggers..."
              className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container-low)] text-[var(--m3-on-surface)] border border-[var(--m3-outline-variant)] focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <M3Button variant="text" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </M3Button>
            <M3Button variant="filled" type="submit">
              Save Monthly Rule
            </M3Button>
          </div>
        </form>
      </M3Dialog>
    </div>
  );
};
