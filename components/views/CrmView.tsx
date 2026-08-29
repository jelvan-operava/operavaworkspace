import React, { useState } from 'react';
import { CRMLead, CrmAnnotation } from '@/lib/mock-data';
import { M3Button } from '../ui/M3Button';
import { M3Badge } from '../ui/M3Badge';
import { M3Dialog } from '../ui/M3Dialog';
import { CrmSkeleton } from '../ui/skeletons/CrmSkeleton';
import { M3ErrorState } from '../ui/M3ErrorState';
import {
  Users,
  Plus,
  DollarSign,
  TrendingUp,
  Award,
  Phone,
  Mail,
  Building2,
  Calendar,
  ChevronRight,
  Filter,
  Search,
  CheckCircle2,
  ArrowRight,
  UserCheck,
  RefreshCw,
  AlertTriangle,
  StickyNote,
  Tag,
  Send,
} from 'lucide-react';

export interface CrmViewProps {
  leads: CRMLead[];
  onAddLead: (lead: Omit<CRMLead, 'id'>) => void;
  onUpdateLeadStage: (id: string, stage: CRMLead['stage']) => void;
  onAddAnnotation?: (leadId: string, annotation: { text: string; tag: CrmAnnotation['tag'] }) => void;
  onComposeEmailToLead?: (email: string, contactName: string) => void;
  openAiAssistant?: () => void;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

const STAGES: CRMLead['stage'][] = [
  'Lead',
  'Contacted',
  'Qualified',
  'Proposal',
  'Negotiation',
  'Closed Won',
];

export const CrmView: React.FC<CrmViewProps> = ({
  leads,
  onAddLead,
  onUpdateLeadStage,
  onAddAnnotation,
  onComposeEmailToLead,
  openAiAssistant,
  isLoading = false,
  isError = false,
  onRetry,
}) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'table'>('pipeline');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<CRMLead | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Simulated internal fetch states for user testing
  const [isSimulatingLoading, setIsSimulatingLoading] = useState(false);
  const [isSimulatingError, setIsSimulatingError] = useState(false);

  // Sticky Annotation Form State
  const [newAnnotationText, setNewAnnotationText] = useState('');
  const [newAnnotationTag, setNewAnnotationTag] =
    useState<CrmAnnotation['tag']>('VIP Account');

  // Form states for new lead
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [stage, setStage] = useState<CRMLead['stage']>('Lead');
  const [dealValue, setDealValue] = useState<number>(50000);
  const [leadScore, setLeadScore] = useState<number>(75);
  const [industry, setIndustry] = useState('Enterprise Tech');
  const [notes, setNotes] = useState('');

  const handleAddAnnotationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnotationText.trim() || !selectedLead) return;

    if (onAddAnnotation) {
      onAddAnnotation(selectedLead.id, {
        text: newAnnotationText,
        tag: newAnnotationTag,
      });
    }

    const newAnn: CrmAnnotation = {
      id: `ann-${Date.now()}`,
      author: 'Elena Rostova',
      authorRole: 'Admin Lead',
      text: newAnnotationText,
      tag: newAnnotationTag,
      createdAt: 'Just now',
    };

    setSelectedLead({
      ...selectedLead,
      annotations: [newAnn, ...(selectedLead.annotations || [])],
    });

    setNewAnnotationText('');
  };

  const showSkeleton = isLoading || isSimulatingLoading;
  const showError = isError || isSimulatingError;

  const handleRefreshData = () => {
    setIsSimulatingError(false);
    setIsSimulatingLoading(true);
    setTimeout(() => {
      setIsSimulatingLoading(false);
    }, 1200);
  };

  const handleTriggerError = () => {
    setIsSimulatingLoading(true);
    setTimeout(() => {
      setIsSimulatingLoading(false);
      setIsSimulatingError(true);
    }, 800);
  };

  const handleRetryFetch = () => {
    if (onRetry) {
      onRetry();
    }
    handleRefreshData();
  };

  if (showSkeleton) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-[var(--m3-on-surface-variant)] px-2">
          <span className="font-medium animate-pulse flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[var(--m3-primary)]" />
            Fetching CRM Pipeline Records...
          </span>
        </div>
        <CrmSkeleton viewMode={activeTab} />
      </div>
    );
  }

  if (showError) {
    return (
      <M3ErrorState
        title="Failed to Load CRM Pipeline"
        description="The Google Workspace Cloud CRM endpoint failed to return client lead records. Please check network telemetry or retry."
        errorCode="ERR_CRM_SYNC_FAILURE"
        errorDetails="GraphQL Query Exception: CRMLead_Pipeline_Fetch timeout after 5000ms.\nHost: crm.workspace.google.internal\nTrace ID: 0x8f2a991b4c"
        onRetry={handleRetryFetch}
        onSecondaryAction={() => setIsSimulatingError(false)}
        secondaryActionText="Dismiss & View Cached Data"
      />
    );
  }

  const filteredLeads = leads.filter(
    (l) =>
      l.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPipelineValue = leads.reduce((sum, l) => sum + l.dealValue, 0);
  const totalWonValue = leads
    .filter((l) => l.stage === 'Closed Won')
    .reduce((sum, l) => sum + l.dealValue, 0);
  const avgLeadScore = Math.round(
    leads.reduce((sum, l) => sum + l.leadScore, 0) / (leads.length || 1)
  );

  const handleCreateLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !contactName.trim()) return;

    onAddLead({
      companyName,
      contactName,
      email: email || 'contact@company.com',
      phone: phone || '+1 (555) 000-1122',
      stage,
      dealValue: Number(dealValue) || 25000,
      probability: stage === 'Closed Won' ? 100 : 50,
      leadScore: Number(leadScore) || 70,
      owner: 'Elena Rostova',
      lastContactDate: new Date().toISOString().split('T')[0],
      nextFollowUp: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      industry: industry || 'Technology',
      notes: notes || 'New lead generated in Google Workspace Client Portal CRM.',
    });

    setIsAddModalOpen(false);
    // Reset form
    setCompanyName('');
    setContactName('');
    setEmail('');
    setNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[var(--m3-primary-container)] text-[var(--m3-on-primary-container)] text-[11px] font-bold">
              Google Enterprise CRM
            </span>
            <span className="text-xs text-[var(--m3-on-surface-variant)]">Client Relationships & Deals</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-1 text-[var(--m3-on-surface)]">
            CRM & Deal Pipeline
          </h1>
          <p className="text-xs text-[var(--m3-on-surface-variant)] mt-1 max-w-xl">
            Track client opportunities, deal stages, lead scores, and engagement history in real time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <M3Button
            variant="outlined"
            size="sm"
            onClick={handleRefreshData}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </M3Button>
          <M3Button
            variant="outlined"
            size="sm"
            onClick={handleTriggerError}
            icon={<AlertTriangle className="w-3.5 h-3.5 text-[var(--m3-warning)]" />}
          >
            Test Error
          </M3Button>
          <M3Button variant="filled" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Lead / Deal
          </M3Button>
        </div>
      </div>


      {/* CRM Key Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[var(--m3-surface-container)] border border-[var(--m3-outline-variant)] flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--m3-on-surface-variant)] font-medium">Total Pipeline Value</p>
            <p className="text-2xl font-bold text-[var(--m3-on-surface)] mt-1">
              ${totalPipelineValue.toLocaleString()}
            </p>
            <p className="text-[11px] text-[var(--m3-success)] font-semibold mt-0.5">
              Across {leads.length} Active Accounts
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[var(--m3-primary-container)] text-[var(--m3-on-primary-container)] flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[var(--m3-surface-container)] border border-[var(--m3-outline-variant)] flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--m3-on-surface-variant)] font-medium">Closed Won Revenue</p>
            <p className="text-2xl font-bold text-[var(--m3-on-surface)] mt-1">
              ${totalWonValue.toLocaleString()}
            </p>
            <p className="text-[11px] text-[var(--m3-success)] font-semibold mt-0.5">
              100% Contract Secured
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[var(--m3-success-container)] text-[var(--m3-on-success-container)] flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[var(--m3-surface-container)] border border-[var(--m3-outline-variant)] flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--m3-on-surface-variant)] font-medium">Avg Lead Quality Score</p>
            <p className="text-2xl font-bold text-[var(--m3-on-surface)] mt-1">
              {avgLeadScore} / 100
            </p>
            <p className="text-[11px] text-[var(--m3-primary)] font-semibold mt-0.5">
              High Conversion Potential
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[var(--m3-tertiary-container)] text-[var(--m3-on-tertiary-container)] flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[var(--m3-surface-container)] border border-[var(--m3-outline-variant)] flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--m3-on-surface-variant)] font-medium">Primary Account Lead</p>
            <p className="text-base font-bold text-[var(--m3-on-surface)] mt-1">Elena Rostova</p>
            <p className="text-[11px] text-[var(--m3-on-surface-variant)] mt-0.5">Senior Partner Success</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[var(--m3-surface-container-high)] text-[var(--m3-primary)] flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Navigation Controls & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)] w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
              activeTab === 'pipeline'
                ? 'bg-[var(--m3-primary)] text-[var(--m3-on-primary)] shadow-2xs'
                : 'hover:bg-[var(--m3-surface-container-high)] text-[var(--m3-on-surface-variant)]'
            }`}
          >
            Stage Kanban Board
          </button>
          <button
            onClick={() => setActiveTab('table')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
              activeTab === 'table'
                ? 'bg-[var(--m3-primary)] text-[var(--m3-on-primary)] shadow-2xs'
                : 'hover:bg-[var(--m3-surface-container-high)] text-[var(--m3-on-surface-variant)]'
            }`}
          >
            Accounts List View
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--m3-on-surface-variant)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search deals, contacts, industries..."
            className="w-full pl-9 pr-4 py-2 rounded-2xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)] text-xs text-[var(--m3-on-surface)] focus:outline-hidden"
          />
        </div>
      </div>

      {/* Tab 1: Stage Kanban Board */}
      {activeTab === 'pipeline' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {STAGES.map((stg) => {
            const stageLeads = filteredLeads.filter((l) => l.stage === stg);
            const stageTotal = stageLeads.reduce((s, l) => s + l.dealValue, 0);

            return (
              <div
                key={stg}
                className="flex flex-col rounded-3xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)] p-3 min-w-[220px]"
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--m3-outline-variant)]">
                  <div>
                    <h3 className="font-bold text-xs text-[var(--m3-on-surface)]">{stg}</h3>
                    <p className="text-[10px] text-[var(--m3-on-surface-variant)]">
                      ${stageTotal.toLocaleString()}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--m3-surface-container-high)] text-[var(--m3-on-surface)]">
                    {stageLeads.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px]">
                  {stageLeads.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedLead(item)}
                      className="p-3 rounded-2xl bg-[var(--m3-surface-container)] hover:bg-[var(--m3-surface-container-high)] border border-[var(--m3-outline-variant)] transition-all cursor-pointer shadow-2xs group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[var(--m3-primary-container)] text-[var(--m3-on-primary-container)]">
                          Score: {item.leadScore}
                        </span>
                        <span className="text-[10px] font-bold text-[var(--m3-primary)]">
                          ${item.dealValue.toLocaleString()}
                        </span>
                      </div>

                      <h4 className="font-bold text-xs text-[var(--m3-on-surface)] mt-2 line-clamp-1">
                        {item.companyName}
                      </h4>
                      <p className="text-[11px] text-[var(--m3-on-surface-variant)] mt-0.5">
                        {item.contactName}
                      </p>

                      <div className="mt-3 pt-2 border-t border-[var(--m3-outline-variant)] flex items-center justify-between text-[10px] text-[var(--m3-on-surface-variant)]">
                        <span>Follow-up: {item.nextFollowUp}</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  ))}

                  {stageLeads.length === 0 && (
                    <div className="text-center py-8 text-[11px] text-[var(--m3-on-surface-variant)] border border-dashed border-[var(--m3-outline-variant)] rounded-2xl">
                      No deals in {stg}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Accounts List Table */}
      {activeTab === 'table' && (
        <div className="rounded-3xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[var(--m3-outline-variant)] bg-[var(--m3-surface-container)] text-[var(--m3-on-surface-variant)] uppercase font-semibold text-[10px]">
                  <th className="p-4">Account / Company</th>
                  <th className="p-4">Primary Contact</th>
                  <th className="p-4">Industry</th>
                  <th className="p-4">Deal Stage</th>
                  <th className="p-4">Deal Value</th>
                  <th className="p-4">Lead Quality</th>
                  <th className="p-4">Next Action</th>
                  <th className="p-4 text-right">Advance Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--m3-outline-variant)] text-[var(--m3-on-surface)]">
                {filteredLeads.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[var(--m3-surface-container)] transition-colors"
                  >
                    <td className="p-4 font-bold text-xs">{item.companyName}</td>
                    <td className="p-4">
                      <div>{item.contactName}</div>
                      <div className="text-[10px] text-[var(--m3-on-surface-variant)]">
                        {item.email}
                      </div>
                    </td>
                    <td className="p-4 text-[var(--m3-on-surface-variant)]">{item.industry}</td>
                    <td className="p-4">
                      <M3Badge
                        variant={
                          item.stage === 'Closed Won'
                            ? 'success'
                            : item.stage === 'Negotiation'
                            ? 'warning'
                            : 'primary'
                        }
                      >
                        {item.stage}
                      </M3Badge>
                    </td>
                    <td className="p-4 font-bold text-[var(--m3-primary)]">
                      ${item.dealValue.toLocaleString()}
                    </td>
                    <td className="p-4 font-bold">{item.leadScore} / 100</td>
                    <td className="p-4 text-[var(--m3-on-surface-variant)]">{item.nextFollowUp}</td>
                    <td className="p-4 text-right">
                      <select
                        value={item.stage}
                        onChange={(e) =>
                          onUpdateLeadStage(item.id, e.target.value as CRMLead['stage'])
                        }
                        className="p-1.5 rounded-xl bg-[var(--m3-surface-container-high)] text-[var(--m3-on-surface)] text-xs font-semibold cursor-pointer border border-[var(--m3-outline-variant)]"
                      >
                        {STAGES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Create New Lead / Deal */}
      <M3Dialog
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New CRM Lead / Opportunity"
      >
        <form onSubmit={handleCreateLeadSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold block mb-1">Company / Client Name *</label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. NextGen BioLabs"
              className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container-low)] text-[var(--m3-on-surface)] border border-[var(--m3-outline-variant)] focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">Contact Person *</label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Dr. Amanda Cross"
                className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container-low)] text-[var(--m3-on-surface)] border border-[var(--m3-outline-variant)] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Contact Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="amanda@nextgenbio.com"
                className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container-low)] text-[var(--m3-on-surface)] border border-[var(--m3-outline-variant)] focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-semibold block mb-1">Pipeline Stage</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as CRMLead['stage'])}
                className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container-low)] text-[var(--m3-on-surface)] border border-[var(--m3-outline-variant)] focus:outline-hidden"
              >
                {STAGES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-semibold block mb-1">Est. Deal Value ($)</label>
              <input
                type="number"
                value={dealValue}
                onChange={(e) => setDealValue(Number(e.target.value))}
                className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container-low)] text-[var(--m3-on-surface)] border border-[var(--m3-outline-variant)] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Lead Score (1-100)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={leadScore}
                onChange={(e) => setLeadScore(Number(e.target.value))}
                className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container-low)] text-[var(--m3-on-surface)] border border-[var(--m3-outline-variant)] focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1">Industry Sector</label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g. Healthcare AI / SaaS"
              className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container-low)] text-[var(--m3-on-surface)] border border-[var(--m3-outline-variant)] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Opportunity Notes & History</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add key deal details, requirements, or next steps..."
              className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container-low)] text-[var(--m3-on-surface)] border border-[var(--m3-outline-variant)] focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <M3Button variant="text" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </M3Button>
            <M3Button variant="filled" type="submit">
              Save Opportunity
            </M3Button>
          </div>
        </form>
      </M3Dialog>

      {/* Modal: Lead Detail Drawer */}
      {selectedLead && (
        <M3Dialog
          isOpen={!!selectedLead}
          onClose={() => setSelectedLead(null)}
          title={`Lead Details: ${selectedLead.companyName}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-[var(--m3-surface-container-low)] space-y-2 border border-[var(--m3-outline-variant)]">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[var(--m3-on-surface)]">
                  {selectedLead.contactName}
                </span>
                <M3Badge variant="primary">{selectedLead.stage}</M3Badge>
              </div>
              <div className="flex items-center gap-4 text-[var(--m3-on-surface-variant)]">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-[var(--m3-primary)]" />
                  {selectedLead.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[var(--m3-primary)]" />
                  {selectedLead.phone}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)]">
                <p className="text-[10px] text-[var(--m3-on-surface-variant)] uppercase font-semibold">
                  Deal Value
                </p>
                <p className="text-lg font-bold text-[var(--m3-primary)] mt-1">
                  ${selectedLead.dealValue.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)]">
                <p className="text-[10px] text-[var(--m3-on-surface-variant)] uppercase font-semibold">
                  Lead Score Quality
                </p>
                <p className="text-lg font-bold text-[var(--m3-on-surface)] mt-1">
                  {selectedLead.leadScore} / 100
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)]">
              <p className="font-semibold mb-1">Deal Notes & Activity</p>
              <p className="text-[var(--m3-on-surface-variant)] leading-relaxed">
                {selectedLead.notes}
              </p>
            </div>

            {/* Client Sticky Annotations Section */}
            <div className="p-4 rounded-2xl bg-[var(--m3-surface-container-high)] border border-[var(--m3-outline-variant)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[var(--m3-on-surface)] flex items-center gap-1.5">
                  <StickyNote className="w-4 h-4 text-[var(--m3-primary)]" />
                  CRM Sticky Annotations ({selectedLead.annotations?.length || 0})
                </span>
                {onComposeEmailToLead && (
                  <M3Button
                    variant="tonal"
                    size="sm"
                    onClick={() => {
                      onComposeEmailToLead(selectedLead.email, selectedLead.contactName);
                      setSelectedLead(null);
                    }}
                    icon={<Mail className="w-3.5 h-3.5" />}
                  >
                    Email Lead
                  </M3Button>
                )}
              </div>

              {/* Add Annotation Form */}
              <form onSubmit={handleAddAnnotationSubmit} className="space-y-2 pt-1">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newAnnotationText}
                    onChange={(e) => setNewAnnotationText(e.target.value)}
                    placeholder="Leave sticky annotation for team..."
                    className="flex-1 p-2.5 rounded-xl bg-[var(--m3-surface-container-low)] text-xs text-[var(--m3-on-surface)] border border-[var(--m3-outline-variant)] focus:outline-hidden"
                  />
                  <select
                    value={newAnnotationTag}
                    onChange={(e) => setNewAnnotationTag(e.target.value as any)}
                    className="p-2.5 rounded-xl bg-[var(--m3-surface-container-low)] text-xs text-[var(--m3-on-surface)] border border-[var(--m3-outline-variant)] focus:outline-hidden"
                  >
                    <option value="VIP Account">VIP Account</option>
                    <option value="Follow-up Required">Follow-up Required</option>
                    <option value="Billing Concern">Billing Concern</option>
                    <option value="Technical Spec">Technical Spec</option>
                  </select>
                  <M3Button variant="filled" size="sm" type="submit">
                    Post
                  </M3Button>
                </div>
              </form>

              {/* Annotation List */}
              <div className="space-y-2 max-h-40 overflow-y-auto pt-1 custom-scrollbar">
                {selectedLead.annotations && selectedLead.annotations.length > 0 ? (
                  selectedLead.annotations.map((ann) => (
                    <div
                      key={ann.id}
                      className="p-3 rounded-xl bg-[var(--m3-surface-container-lowest)] border border-[var(--m3-outline-variant)] space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[11px] text-[var(--m3-on-surface)]">
                          {ann.author} ({ann.authorRole})
                        </span>
                        <M3Badge variant="outline" size="sm">
                          {ann.tag}
                        </M3Badge>
                      </div>
                      <p className="text-[11px] text-[var(--m3-on-surface-variant)]">{ann.text}</p>
                      <span className="text-[9px] text-[var(--m3-on-surface-variant)] font-mono block">
                        {ann.createdAt}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-[11px] text-[var(--m3-on-surface-variant)] italic">
                    No sticky annotations added yet. Leave a note above.
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-[var(--m3-on-surface-variant)]">
                Owner: {selectedLead.owner}
              </span>
              <M3Button variant="filled" onClick={() => setSelectedLead(null)}>
                Done
              </M3Button>
            </div>
          </div>
        </M3Dialog>
      )}
    </div>
  );
};
