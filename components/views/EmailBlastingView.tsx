import React, { useState } from 'react';
import { EmailCampaign, CRMLead } from '@/lib/mock-data';
import { M3Button } from '../ui/M3Button';
import { M3Badge } from '../ui/M3Badge';
import { M3Dialog } from '../ui/M3Dialog';
import {
  Send,
  Plus,
  Mail,
  Users,
  MousePointer,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
  Eye,
  ChevronRight,
  FileText,
  AlertCircle,
  Calendar,
  CheckSquare,
  Square,
  Zap,
} from 'lucide-react';

export interface EmailBlastingViewProps {
  campaigns: EmailCampaign[];
  crmLeads?: CRMLead[];
  onAddCampaign: (campaign: Omit<EmailCampaign, 'id'>) => void;
  openAiAssistant?: () => void;
  initialSelectedLeadEmail?: string;
}

export const EmailBlastingView: React.FC<EmailBlastingViewProps> = ({
  campaigns,
  crmLeads = [],
  onAddCampaign,
  openAiAssistant,
  initialSelectedLeadEmail,
}) => {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'scheduled' | 'templates'>('campaigns');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState<EmailCampaign | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [testEmailSentSuccess, setTestEmailSentSuccess] = useState(false);

  // Scheduling Mode
  const [executionMode, setExecutionMode] = useState<'immediate' | 'scheduled'>('immediate');
  const [scheduledDateTime, setScheduledDateTime] = useState('2026-08-01T09:00');

  // CRM Recipient Selection State
  const [selectedRecipientEmails, setSelectedRecipientEmails] = useState<string[]>(
    initialSelectedLeadEmail ? [initialSelectedLeadEmail] : []
  );

  // Form state
  const [campaignName, setCampaignName] = useState('');
  const [subject, setSubject] = useState('');
  const [audienceSegment, setAudienceSegment] =
    useState<EmailCampaign['audienceSegment']>('All Enterprise Clients');
  const [templateType, setTemplateType] =
    useState<EmailCampaign['templateType']>('Monthly Newsletter');
  const [content, setContent] = useState(
    'Dear Enterprise Partner,\n\nHere is our official Operava Desk broadcast update regarding monthly billing statements, upcoming project milestones, and Gemini 3.5 AI capabilities...'
  );

  const filteredCampaigns = campaigns.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.audienceSegment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleRecipient = (email: string) => {
    if (selectedRecipientEmails.includes(email)) {
      setSelectedRecipientEmails(selectedRecipientEmails.filter((e) => e !== email));
    } else {
      setSelectedRecipientEmails([...selectedRecipientEmails, email]);
    }
  };

  const handleSelectAllCrmLeads = () => {
    const allEmails = crmLeads.map((l) => l.email).filter(Boolean);
    setSelectedRecipientEmails(allEmails);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignName.trim() || !subject.trim()) return;

    const isScheduled = executionMode === 'scheduled';

    onAddCampaign({
      name: campaignName,
      subject,
      audienceSegment,
      status: isScheduled ? 'Scheduled' : 'Sent',
      sentCount: isScheduled ? 0 : selectedRecipientEmails.length || 1420,
      openRate: isScheduled ? 0 : 72.5,
      clickRate: isScheduled ? 0 : 38.1,
      scheduledDate: isScheduled
        ? scheduledDateTime.replace('T', ' ')
        : new Date().toISOString().replace('T', ' ').slice(0, 16),
      templateType,
      contentPreview: content,
    });

    setIsCreateModalOpen(false);
    // Reset
    setCampaignName('');
    setSubject('');
  };

  const handleSendTestEmail = () => {
    setTestEmailSentSuccess(true);
    setTimeout(() => setTestEmailSentSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[var(--m3-primary-container)] text-[var(--m3-on-primary-container)] text-[11px] font-bold">
              Broadcast Engine
            </span>
            <span className="text-xs text-[var(--m3-on-surface-variant)]">Bulk Email & CRM Dispatcher</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--m3-on-surface)] mt-1 flex items-center gap-2">
            <Send className="w-6 h-6 text-[var(--m3-primary)]" />
            Email Blasting & Scheduled Composition
          </h1>
          <p className="text-xs text-[var(--m3-on-surface-variant)] mt-1 max-w-xl">
            Design, schedule, and execute targeted email dispatches to CRM contacts with scheduled queue automation and open rate tracking.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <M3Button variant="filled" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Compose Email / Campaign
          </M3Button>
        </div>
      </div>

      {/* Campaign Analytics Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[var(--m3-surface-container)] border border-[var(--m3-outline-variant)] flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--m3-on-surface-variant)] font-medium">CRM Contact Subscribers</p>
            <p className="text-2xl font-bold text-[var(--m3-on-surface)] mt-1">
              {crmLeads.length + 1420} Contacts
            </p>
            <p className="text-[11px] text-[var(--m3-success)] font-semibold mt-0.5">
              Synced with Operava CRM
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[var(--m3-primary-container)] text-[var(--m3-on-primary-container)] flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[var(--m3-surface-container)] border border-[var(--m3-outline-variant)] flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--m3-on-surface-variant)] font-medium">Avg Open Rate</p>
            <p className="text-2xl font-bold text-[var(--m3-on-surface)] mt-1">68.4%</p>
            <p className="text-[11px] text-[var(--m3-primary)] font-semibold mt-0.5">
              +14.2% Industry Benchmark
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[var(--m3-tertiary-container)] text-[var(--m3-on-tertiary-container)] flex items-center justify-center">
            <Eye className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[var(--m3-surface-container)] border border-[var(--m3-outline-variant)] flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--m3-on-surface-variant)] font-medium">Avg Click-Through</p>
            <p className="text-2xl font-bold text-[var(--m3-on-surface)] mt-1">34.2%</p>
            <p className="text-[11px] text-[var(--m3-success)] font-semibold mt-0.5">
              High Portal Engagement
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[var(--m3-success-container)] text-[var(--m3-on-success-container)] flex items-center justify-center">
            <MousePointer className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[var(--m3-surface-container)] border border-[var(--m3-outline-variant)] flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--m3-on-surface-variant)] font-medium">Broadcast Engine Status</p>
            <p className="text-base font-bold text-[var(--m3-on-surface)] mt-1">Google Workspace SMTP</p>
            <p className="text-[11px] text-[var(--m3-success)] font-semibold mt-0.5">
              DKIM & SPF Authenticated
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[var(--m3-surface-container-high)] text-[var(--m3-primary)] flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)] w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
              activeTab === 'campaigns'
                ? 'bg-[var(--m3-primary)] text-[var(--m3-on-primary)] shadow-2xs'
                : 'hover:bg-[var(--m3-surface-container-high)] text-[var(--m3-on-surface-variant)]'
            }`}
          >
            Dispatched Campaigns ({campaigns.filter((c) => c.status === 'Sent').length})
          </button>
          <button
            onClick={() => setActiveTab('scheduled')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === 'scheduled'
                ? 'bg-[var(--m3-primary)] text-[var(--m3-on-primary)] shadow-2xs'
                : 'hover:bg-[var(--m3-surface-container-high)] text-[var(--m3-on-surface-variant)]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Scheduled Queue ({campaigns.filter((c) => c.status === 'Scheduled').length})
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
              activeTab === 'templates'
                ? 'bg-[var(--m3-primary)] text-[var(--m3-on-primary)] shadow-2xs'
                : 'hover:bg-[var(--m3-surface-container-high)] text-[var(--m3-on-surface-variant)]'
            }`}
          >
            Template Library
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--m3-on-surface-variant)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search campaign or subject..."
            className="w-full pl-9 pr-4 py-2 rounded-2xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)] text-xs text-[var(--m3-on-surface)] focus:outline-hidden"
          />
        </div>
      </div>

      {/* Tab 1: Sent / Dispatched Campaigns */}
      {activeTab === 'campaigns' && (
        <div className="space-y-4">
          <div className="rounded-3xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[var(--m3-outline-variant)] bg-[var(--m3-surface-container)] text-[var(--m3-on-surface-variant)] uppercase font-semibold text-[10px]">
                    <th className="p-4">Campaign Name</th>
                    <th className="p-4">Audience Segment</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Recipients</th>
                    <th className="p-4">Open Rate</th>
                    <th className="p-4">Click Rate</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--m3-outline-variant)] text-[var(--m3-on-surface)]">
                  {filteredCampaigns
                    .filter((c) => c.status === 'Sent')
                    .map((camp) => (
                      <tr
                        key={camp.id}
                        className="hover:bg-[var(--m3-surface-container)] transition-colors"
                      >
                        <td className="p-4 font-bold text-xs">
                          <div>{camp.name}</div>
                          <div className="text-[10px] text-[var(--m3-on-surface-variant)] font-normal line-clamp-1">
                            Subject: {camp.subject}
                          </div>
                        </td>
                        <td className="p-4 font-medium text-[var(--m3-on-surface-variant)]">
                          {camp.audienceSegment}
                        </td>
                        <td className="p-4 font-medium text-[var(--m3-on-surface-variant)]">
                          {camp.templateType}
                        </td>
                        <td className="p-4">
                          <M3Badge variant="success">{camp.status}</M3Badge>
                        </td>
                        <td className="p-4 font-bold">
                          {camp.sentCount ? camp.sentCount.toLocaleString() : '-'}
                        </td>
                        <td className="p-4 font-bold text-[var(--m3-primary)]">
                          {camp.openRate ? `${camp.openRate}%` : '-'}
                        </td>
                        <td className="p-4 font-bold text-[var(--m3-tertiary)]">
                          {camp.clickRate ? `${camp.clickRate}%` : '-'}
                        </td>
                        <td className="p-4 text-right">
                          <M3Button
                            variant="tonal"
                            size="sm"
                            onClick={() => setSelectedCampaign(camp)}
                          >
                            Preview
                          </M3Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Scheduled Campaigns Queue */}
      {activeTab === 'scheduled' && (
        <div className="space-y-4">
          <div className="rounded-3xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[var(--m3-outline-variant)] bg-[var(--m3-surface-container)] text-[var(--m3-on-surface-variant)] uppercase font-semibold text-[10px]">
                    <th className="p-4">Campaign Name</th>
                    <th className="p-4">Scheduled Release</th>
                    <th className="p-4">Audience Segment</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--m3-outline-variant)] text-[var(--m3-on-surface)]">
                  {filteredCampaigns
                    .filter((c) => c.status === 'Scheduled' || c.status === 'Draft')
                    .map((camp) => (
                      <tr
                        key={camp.id}
                        className="hover:bg-[var(--m3-surface-container)] transition-colors"
                      >
                        <td className="p-4 font-bold text-xs">
                          <div>{camp.name}</div>
                          <div className="text-[10px] text-[var(--m3-on-surface-variant)] font-normal line-clamp-1">
                            Subject: {camp.subject}
                          </div>
                        </td>
                        <td className="p-4 font-mono font-bold text-[var(--m3-primary)]">
                          {camp.scheduledDate}
                        </td>
                        <td className="p-4 font-medium text-[var(--m3-on-surface-variant)]">
                          {camp.audienceSegment}
                        </td>
                        <td className="p-4 font-medium text-[var(--m3-on-surface-variant)]">
                          {camp.templateType}
                        </td>
                        <td className="p-4">
                          <M3Badge variant="warning">{camp.status}</M3Badge>
                        </td>
                        <td className="p-4 text-right">
                          <M3Button
                            variant="tonal"
                            size="sm"
                            onClick={() => setSelectedCampaign(camp)}
                          >
                            Inspect & Release
                          </M3Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Email Templates Library */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'Monthly Newsletter',
              description: 'Executive summary, milestone updates, billing highlights, and Gemini feature news.',
              category: 'General Update',
            },
            {
              title: 'Billing Alert & Statement',
              description: 'Monthly invoice issuance notification, ACH direct link, and Net-20 terms reminder.',
              category: 'Finance & Billing',
            },
            {
              title: 'Product Announcement',
              description: 'New feature releases, Google Workspace API upgrades, and platform enhancements.',
              category: 'Product & Tech',
            },
            {
              title: 'Security & Token Advisory',
              description: 'SOC2 Type II security audit reminders, OAuth token rotation, and access control alerts.',
              category: 'SecOps',
            },
          ].map((tpl, i) => (
            <div
              key={i}
              className="p-5 rounded-3xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)] space-y-3 flex flex-col justify-between"
            >
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-[var(--m3-primary-container)] text-[var(--m3-on-primary-container)] text-[10px] font-bold">
                  {tpl.category}
                </span>
                <h3 className="font-bold text-sm text-[var(--m3-on-surface)] mt-2">{tpl.title}</h3>
                <p className="text-xs text-[var(--m3-on-surface-variant)] mt-1">{tpl.description}</p>
              </div>

              <M3Button
                variant="tonal"
                size="sm"
                onClick={() => {
                  setTemplateType(tpl.title as EmailCampaign['templateType']);
                  setIsCreateModalOpen(true);
                }}
              >
                Use Template
              </M3Button>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Compose / Schedule Broadcast Campaign */}
      <M3Dialog
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Compose & Schedule Broadcast Email"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold block mb-1">Campaign Title *</label>
            <input
              type="text"
              required
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              placeholder="e.g. August 2026 Monthly Invoicing & SLA Digest"
              className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container-low)] text-[var(--m3-on-surface)] border border-[var(--m3-outline-variant)] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Email Subject Line *</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. 🚀 Monthly Workspace Portal Update & Statement Ready"
              className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container-low)] text-[var(--m3-on-surface)] border border-[var(--m3-outline-variant)] focus:outline-hidden"
            />
          </div>

          {/* CRM Recipient Selector */}
          <div className="p-3.5 rounded-2xl bg-[var(--m3-surface-container-high)] border border-[var(--m3-outline-variant)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[11px] text-[var(--m3-on-surface)] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[var(--m3-primary)]" />
                Select CRM Recipients ({selectedRecipientEmails.length} selected)
              </span>
              <button
                type="button"
                onClick={handleSelectAllCrmLeads}
                className="text-[11px] font-semibold text-[var(--m3-primary)] hover:underline"
              >
                Select All CRM Contacts ({crmLeads.length})
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1 custom-scrollbar">
              {crmLeads.map((lead) => {
                const isSelected = selectedRecipientEmails.includes(lead.email);
                return (
                  <button
                    key={lead.id}
                    type="button"
                    onClick={() => handleToggleRecipient(lead.email)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-medium flex items-center gap-1.5 transition-all border ${
                      isSelected
                        ? 'bg-[var(--m3-primary-container)] border-[var(--m3-primary)] text-[var(--m3-on-primary-container)] font-bold'
                        : 'bg-[var(--m3-surface-container-low)] border-[var(--m3-outline-variant)] text-[var(--m3-on-surface-variant)]'
                    }`}
                  >
                    {isSelected ? (
                      <CheckSquare className="w-3 h-3 text-[var(--m3-primary)]" />
                    ) : (
                      <Square className="w-3 h-3" />
                    )}
                    <span>{lead.companyName} ({lead.contactName})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Execution Mode & Date Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">Execution Mode</label>
              <select
                value={executionMode}
                onChange={(e) => setExecutionMode(e.target.value as 'immediate' | 'scheduled')}
                className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container-low)] text-[var(--m3-on-surface)] border border-[var(--m3-outline-variant)] focus:outline-hidden font-bold"
              >
                <option value="immediate">Dispatch Immediately</option>
                <option value="scheduled">Schedule for Future Release</option>
              </select>
            </div>

            {executionMode === 'scheduled' && (
              <div>
                <label className="font-semibold block mb-1">Scheduled Release Date & Time</label>
                <input
                  type="datetime-local"
                  value={scheduledDateTime}
                  onChange={(e) => setScheduledDateTime(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container-low)] text-[var(--m3-on-surface)] border border-[var(--m3-outline-variant)] focus:outline-hidden font-mono"
                />
              </div>
            )}
          </div>

          <div>
            <label className="font-semibold block mb-1">Message Content Body</label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container-low)] text-[var(--m3-on-surface)] border border-[var(--m3-outline-variant)] focus:outline-hidden"
            />
          </div>

          {testEmailSentSuccess && (
            <div className="p-3 rounded-xl bg-[var(--m3-success-container)] text-[var(--m3-on-success-container)] text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Test Broadcast Email dispatched!</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <M3Button type="button" variant="tonal" onClick={handleSendTestEmail}>
              Send Test Email
            </M3Button>

            <div className="flex items-center gap-2">
              <M3Button variant="text" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </M3Button>
              <M3Button variant="filled" type="submit">
                {executionMode === 'scheduled' ? 'Schedule Campaign' : 'Send Broadcast Now'}
              </M3Button>
            </div>
          </div>
        </form>
      </M3Dialog>

      {/* Modal: Preview Broadcast */}
      {selectedCampaign && (
        <M3Dialog
          isOpen={!!selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
          title={`Broadcast Campaign Details: ${selectedCampaign.name}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)] space-y-1">
              <p className="font-bold text-sm text-[var(--m3-on-surface)]">
                Subject: {selectedCampaign.subject}
              </p>
              <p className="text-[var(--m3-on-surface-variant)]">
                Segment: <span className="font-semibold text-[var(--m3-on-surface)]">{selectedCampaign.audienceSegment}</span>
              </p>
              <p className="text-[var(--m3-on-surface-variant)] font-mono">
                Release Date: {selectedCampaign.scheduledDate}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--m3-surface-container)] border border-[var(--m3-outline-variant)]">
              <p className="font-semibold mb-2">Message Content Body:</p>
              <p className="text-[var(--m3-on-surface-variant)] leading-relaxed whitespace-pre-wrap">
                {selectedCampaign.contentPreview}
              </p>
            </div>

            <div className="flex items-center justify-end pt-2">
              <M3Button variant="filled" onClick={() => setSelectedCampaign(null)}>
                Close Preview
              </M3Button>
            </div>
          </div>
        </M3Dialog>
      )}
    </div>
  );
};
