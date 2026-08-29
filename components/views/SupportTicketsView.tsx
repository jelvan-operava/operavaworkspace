import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  HelpCircle,
  Plus,
  MessageSquare,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Send,
  User,
  Users,
  Search,
  Filter,
  RefreshCw,
  Zap,
  Tag,
  ChevronRight,
  ArrowRight,
  Sparkles,
  PhoneCall,
  Activity,
  Layers,
  UserCheck,
  AlertTriangle,
  FileText,
  CornerDownRight,
} from 'lucide-react';
import { M3Card } from '../ui/M3Card';
import { M3Button } from '../ui/M3Button';
import { M3Badge } from '../ui/M3Badge';
import { M3Dialog } from '../ui/M3Dialog';
import {
  SupportTicket,
  SupportTicketMessage,
  AgentProfile,
  AUXState,
  INITIAL_AGENTS,
} from '@/lib/mock-data';

export interface SupportTicketsViewProps {
  tickets: SupportTicket[];
  agents?: AgentProfile[];
  onCreateTicket: (
    ticket: Omit<
      SupportTicket,
      | 'id'
      | 'ticketNo'
      | 'createdAt'
      | 'lastUpdated'
      | 'repliesCount'
      | 'messages'
      | 'slaDue'
      | 'slaBreached'
    > & { initialMessage: string }
  ) => void;
  onAddReply: (
    ticketId: string,
    reply: { text: string; channel: 'Email' | 'Chat'; emailSubject?: string; cc?: string[] }
  ) => void;
  onUpdateTicketStatus?: (ticketId: string, status: SupportTicket['status']) => void;
  onAssignAgent?: (ticketId: string, agent: AgentProfile) => void;
  onUpdateAgentAUX?: (agentId: string, newStatus: AUXState) => void;
  openAiAssistant?: () => void;
}

export const SupportTicketsView: React.FC<SupportTicketsViewProps> = ({
  tickets,
  agents = INITIAL_AGENTS,
  onCreateTicket,
  onAddReply,
  onUpdateTicketStatus,
  onAssignAgent,
  onUpdateAgentAUX,
  openAiAssistant,
}) => {
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'email' | 'chat'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Active Logged-in Agent & AUX timer
  const [currentAgentId, setCurrentAgentId] = useState<string>('agent-1');
  const [auxTimerSeconds, setAuxTimerSeconds] = useState<number>(9318); // ~02h 35m
  const [isAgentRosterOpen, setIsAgentRosterOpen] = useState(false);

  // New Ticket Form State
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [clientName, setClientName] = useState('Julian Vance');
  const [clientEmail, setClientEmail] = useState('julian.vance@apexdigital.com');
  const [channel, setChannel] = useState<'Email' | 'Chat'>('Email');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Infrastructure & Security');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low' | 'Urgent'>('High');
  const [initialMessage, setInitialMessage] = useState('');

  // Agent Reply Mode in Ticket Detail
  const [replyMode, setReplyMode] = useState<'Email' | 'Chat'>('Email');
  const [replyText, setReplyText] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [ccList, setCcList] = useState('');

  // Timer effect for AUX duration
  useEffect(() => {
    const timer = setInterval(() => {
      setAuxTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const activeAgent = agents.find((a) => a.id === currentAgentId) || agents[0];

  const handleAUXStatusChange = (newStatus: AUXState) => {
    if (onUpdateAgentAUX && activeAgent) {
      onUpdateAgentAUX(activeAgent.id, newStatus);
    }
    setAuxTimerSeconds(0);
  };

  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !initialMessage.trim()) return;

    onCreateTicket({
      subject,
      category,
      priority,
      status: 'Open',
      channel,
      clientName,
      clientEmail,
      initialMessage,
    });

    setSubject('');
    setInitialMessage('');
    setIsNewTicketOpen(false);
  };

  const handleSendAgentReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    const parsedCC = ccList
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    onAddReply(selectedTicket.id, {
      text: replyText,
      channel: replyMode,
      emailSubject: replyMode === 'Email' ? emailSubject || `RE: ${selectedTicket.subject}` : undefined,
      cc: parsedCC.length > 0 ? parsedCC : undefined,
    });

    // Update internal view selected ticket state
    const newMsg: SupportTicketMessage = {
      id: `msg-${Date.now()}`,
      sender: activeAgent.name,
      role: 'Agent',
      text: replyText,
      time: 'Just now',
      channel: replyMode,
      emailSubject: replyMode === 'Email' ? emailSubject || `RE: ${selectedTicket.subject}` : undefined,
      cc: parsedCC,
    };

    setSelectedTicket({
      ...selectedTicket,
      repliesCount: selectedTicket.repliesCount + 1,
      lastUpdated: 'Just now',
      messages: [...selectedTicket.messages, newMsg],
    });

    setReplyText('');
    setCcList('');
  };

  const filteredTickets = tickets.filter((tk) => {
    const matchesChannel =
      activeTab === 'all' ||
      (activeTab === 'email' && tk.channel === 'Email') ||
      (activeTab === 'chat' && tk.channel === 'Chat');

    const matchesStatus = statusFilter === 'All' || tk.status === statusFilter;

    const matchesQuery =
      tk.ticketNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tk.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tk.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tk.clientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tk.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesChannel && matchesStatus && matchesQuery;
  });

  const getAuxStatusColor = (st: AUXState) => {
    switch (st) {
      case 'Available':
        return 'bg-emerald-500 text-white';
      case 'On Case':
        return 'bg-blue-500 text-white';
      case 'In Meeting':
        return 'bg-amber-500 text-white';
      case 'On Break':
        return 'bg-purple-500 text-white';
      case 'Training':
        return 'bg-cyan-500 text-white';
      case 'Offline':
        return 'bg-slate-400 text-white';
      default:
        return 'bg-slate-500 text-white';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Brand Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-3xl bg-[var(--m3-surface-container)] border border-[var(--m3-outline-variant)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-[var(--m3-primary-container)] text-[var(--m3-on-primary-container)]">
              <Zap className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[var(--m3-on-surface)] flex items-center gap-2">
                Operava Desk Helpdesk
                <M3Badge variant="primary" size="sm">
                  Zoho Desk Engine
                </M3Badge>
              </h1>
              <p className="text-xs text-[var(--m3-on-surface-variant)]">
                Omnichannel customer support, live agent AUX statuses, SLA tracking, and CRM case synchronization.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <M3Button
            variant="outlined"
            size="sm"
            onClick={() => setIsAgentRosterOpen(true)}
            icon={<Users className="w-4 h-4" />}
          >
            Agent Roster ({agents.length})
          </M3Button>

          <M3Button
            variant="filled"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsNewTicketOpen(true)}
          >
            New Client Ticket
          </M3Button>
        </div>
      </div>

      {/* Agent AUX Status Toolbar */}
      <div className="p-4 rounded-3xl bg-[var(--m3-surface-container-high)] border border-[var(--m3-outline-variant)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={activeAgent.avatar}
              alt={activeAgent.name}
              className="w-10 h-10 rounded-full object-cover border border-[var(--m3-outline-variant)]"
            />
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[var(--m3-surface-container-high)] ${
                activeAgent.status === 'Available'
                  ? 'bg-emerald-500'
                  : activeAgent.status === 'On Case'
                  ? 'bg-blue-500'
                  : 'bg-amber-500'
              }`}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[var(--m3-on-surface)]">
                {activeAgent.name}
              </span>
              <M3Badge variant="outline" size="sm">
                {activeAgent.role}
              </M3Badge>
            </div>
            <p className="text-xs text-[var(--m3-on-surface-variant)] flex items-center gap-1.5 mt-0.5">
              <span>Department: {activeAgent.department}</span> •
              <span className="font-mono text-[var(--m3-primary)] font-medium">
                AUX Timer: {formatTimer(auxTimerSeconds)}
              </span>
            </p>
          </div>
        </div>

        {/* AUX State Switcher Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 custom-scrollbar">
          <span className="text-xs font-semibold text-[var(--m3-on-surface-variant)] mr-1 hidden sm:inline">
            Status:
          </span>
          {(['Available', 'On Case', 'In Meeting', 'On Break', 'Training', 'Offline'] as AUXState[]).map(
            (st) => {
              const isActive = activeAgent.status === st;
              return (
                <button
                  key={st}
                  onClick={() => handleAUXStatusChange(st)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? `${getAuxStatusColor(st)} shadow-xs font-bold`
                      : 'bg-[var(--m3-surface-container)] text-[var(--m3-on-surface-variant)] hover:bg-[var(--m3-surface-container-highest)]'
                  }`}
                >
                  {st}
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Case Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-3xl bg-[var(--m3-surface-container)] border border-[var(--m3-outline-variant)] space-y-1">
          <div className="flex items-center justify-between text-xs text-[var(--m3-on-surface-variant)]">
            <span>Total Support Cases</span>
            <HelpCircle className="w-4 h-4 text-[var(--m3-primary)]" />
          </div>
          <div className="text-2xl font-bold text-[var(--m3-on-surface)]">{tickets.length}</div>
          <div className="text-[11px] text-[var(--m3-on-surface-variant)]">
            Across Email & Live Chat
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-[var(--m3-surface-container)] border border-[var(--m3-outline-variant)] space-y-1">
          <div className="flex items-center justify-between text-xs text-[var(--m3-on-surface-variant)]">
            <span>Active Queue</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600">
            {tickets.filter((t) => t.status === 'Open' || t.status === 'In Progress').length}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium">Avg Response: &lt; 11m</div>
        </div>

        <div className="p-4 rounded-3xl bg-[var(--m3-surface-container)] border border-[var(--m3-outline-variant)] space-y-1">
          <div className="flex items-center justify-between text-xs text-[var(--m3-on-surface-variant)]">
            <span>SLA Compliance Rate</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">99.8%</div>
          <div className="text-[11px] text-[var(--m3-on-surface-variant)]">Target: 99.5% SLA</div>
        </div>

        <div className="p-4 rounded-3xl bg-[var(--m3-surface-container)] border border-[var(--m3-outline-variant)] space-y-1">
          <div className="flex items-center justify-between text-xs text-[var(--m3-on-surface-variant)]">
            <span>Channel Split</span>
            <Activity className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-[var(--m3-on-surface)] flex items-center gap-2">
            <span className="text-sm font-semibold text-blue-600 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" />
              {tickets.filter((t) => t.channel === 'Email').length}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-sm font-semibold text-purple-600 flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" />
              {tickets.filter((t) => t.channel === 'Chat').length}
            </span>
          </div>
          <div className="text-[11px] text-[var(--m3-on-surface-variant)]">
            Omnichannel Zoho Desk Engine
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Channel Switcher */}
        <div className="p-1 rounded-full bg-[var(--m3-surface-container-high)] border border-[var(--m3-outline-variant)] flex items-center gap-1 self-start">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-[var(--m3-primary-container)] text-[var(--m3-on-primary-container)]'
                : 'text-[var(--m3-on-surface-variant)] hover:text-[var(--m3-on-surface)]'
            }`}
          >
            All Cases ({tickets.length})
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'email'
                ? 'bg-[var(--m3-primary-container)] text-[var(--m3-on-primary-container)]'
                : 'text-[var(--m3-on-surface-variant)] hover:text-[var(--m3-on-surface)]'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            Email ({tickets.filter((t) => t.channel === 'Email').length})
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'chat'
                ? 'bg-[var(--m3-primary-container)] text-[var(--m3-on-primary-container)]'
                : 'text-[var(--m3-on-surface-variant)] hover:text-[var(--m3-on-surface)]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Live Chat ({tickets.filter((t) => t.channel === 'Chat').length})
          </button>
        </div>

        {/* Search & Status Filter */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--m3-on-surface-variant)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cases, client, ID..."
              className="w-full pl-9 pr-3 py-2 rounded-full bg-[var(--m3-surface-container)] border border-[var(--m3-outline-variant)] text-xs text-[var(--m3-on-surface)] focus:outline-hidden"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-full bg-[var(--m3-surface-container)] border border-[var(--m3-outline-variant)] text-xs text-[var(--m3-on-surface)] focus:outline-hidden"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Waiting for Client">Waiting for Client</option>
            <option value="Escalated">Escalated</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTickets.map((ticket) => (
          <M3Card
            key={ticket.id}
            variant="filled"
            elevation={1}
            interactive
            onClick={() => {
              setSelectedTicket(ticket);
              setEmailSubject(`RE: ${ticket.subject}`);
              setReplyMode(ticket.channel);
            }}
            className="p-5 space-y-4 flex flex-col justify-between hover:border-[var(--m3-primary)] transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[var(--m3-primary)] font-bold flex items-center gap-1.5">
                  {ticket.channel === 'Email' ? (
                    <Mail className="w-3.5 h-3.5 text-blue-500" />
                  ) : (
                    <MessageSquare className="w-3.5 h-3.5 text-purple-500" />
                  )}
                  {ticket.ticketNo}
                </span>

                <M3Badge
                  variant={
                    ticket.status === 'Resolved'
                      ? 'success'
                      : ticket.status === 'Escalated'
                      ? 'error'
                      : ticket.status === 'Open'
                      ? 'warning'
                      : 'primary'
                  }
                  size="sm"
                >
                  {ticket.status}
                </M3Badge>
              </div>

              <h3 className="font-bold text-sm text-[var(--m3-on-surface)] line-clamp-2">
                {ticket.subject}
              </h3>

              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <M3Badge variant="outline" size="sm">
                  {ticket.category}
                </M3Badge>
                <M3Badge
                  variant={
                    ticket.priority === 'Urgent' || ticket.priority === 'High'
                      ? 'error'
                      : 'secondary'
                  }
                  size="sm"
                >
                  {ticket.priority}
                </M3Badge>
              </div>

              <div className="pt-2 border-t border-[var(--m3-outline-variant)] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[var(--m3-primary-container)] text-[var(--m3-on-primary-container)] font-bold text-[10px] flex items-center justify-center">
                    {ticket.clientName.charAt(0)}
                  </div>
                  <span className="text-[var(--m3-on-surface)] font-medium truncate max-w-[120px]">
                    {ticket.clientName}
                  </span>
                </div>

                <span className="text-[11px] text-[var(--m3-on-surface-variant)] font-mono">
                  {ticket.slaDue}
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-[var(--m3-on-surface-variant)]">
              <span>Agent: {ticket.assignedAgent?.name || 'Unassigned'}</span>
              <span className="font-semibold text-[var(--m3-primary)] flex items-center gap-1">
                Thread ({ticket.repliesCount}) <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </M3Card>
        ))}
      </div>

      {filteredTickets.length === 0 && (
        <div className="text-center py-12 p-8 rounded-3xl bg-[var(--m3-surface-container)] border border-[var(--m3-outline-variant)] space-y-3">
          <HelpCircle className="w-10 h-10 text-[var(--m3-on-surface-variant)] mx-auto opacity-40" />
          <h3 className="font-bold text-base text-[var(--m3-on-surface)]">No Support Cases Found</h3>
          <p className="text-xs text-[var(--m3-on-surface-variant)] max-w-sm mx-auto">
            No tickets match your filter criteria or search query. Try clearing filters or create a new case.
          </p>
        </div>
      )}

      {/* Zoho Desk Omnichannel Ticket Workspace Modal */}
      {selectedTicket && (
        <M3Dialog
          isOpen={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
          title={`Case ${selectedTicket.ticketNo}: ${selectedTicket.subject}`}
          icon={<Zap className="w-5 h-5" />}
          maxWidth="4xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left/Middle: Communication Feed (Email / Chat) */}
            <div className="lg:col-span-2 space-y-4">
              {/* Channel Mode Toggle Bar */}
              <div className="flex items-center justify-between p-2 rounded-2xl bg-[var(--m3-surface-container-high)] border border-[var(--m3-outline-variant)]">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setReplyMode('Email')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      replyMode === 'Email'
                        ? 'bg-[var(--m3-primary)] text-[var(--m3-on-primary)]'
                        : 'text-[var(--m3-on-surface-variant)] hover:text-[var(--m3-on-surface)]'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Email Dispatch
                  </button>
                  <button
                    onClick={() => setReplyMode('Chat')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      replyMode === 'Chat'
                        ? 'bg-[var(--m3-primary)] text-[var(--m3-on-primary)]'
                        : 'text-[var(--m3-on-surface-variant)] hover:text-[var(--m3-on-surface)]'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Live Chat Stream
                  </button>
                </div>

                <M3Badge
                  variant={selectedTicket.slaBreached ? 'error' : 'success'}
                  size="sm"
                >
                  SLA: {selectedTicket.slaDue}
                </M3Badge>
              </div>

              {/* Message Feed Stream */}
              <div className="space-y-3 max-h-80 overflow-y-auto p-3 rounded-2xl bg-[var(--m3-surface-container-lowest)] border border-[var(--m3-outline-variant)] custom-scrollbar">
                {selectedTicket.messages.map((m) => {
                  const isAgent = m.role === 'Agent';
                  return (
                    <div
                      key={m.id || m.time}
                      className={`p-4 rounded-2xl space-y-1.5 text-xs ${
                        isAgent
                          ? 'bg-[var(--m3-primary-container)]/30 border border-[var(--m3-primary-container)] ml-4'
                          : 'bg-[var(--m3-surface-container)] border border-[var(--m3-outline-variant)] mr-4'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="flex items-center gap-1.5 text-[var(--m3-on-surface)]">
                          {m.channel === 'Email' ? (
                            <Mail className="w-3.5 h-3.5 text-blue-500" />
                          ) : (
                            <MessageSquare className="w-3.5 h-3.5 text-purple-500" />
                          )}
                          {m.sender} ({m.role})
                        </span>
                        <span className="text-[10px] text-[var(--m3-on-surface-variant)] font-normal">
                          {m.time}
                        </span>
                      </div>

                      {m.emailSubject && (
                        <div className="text-[11px] font-semibold text-[var(--m3-primary)]">
                          Subject: {m.emailSubject}
                        </div>
                      )}

                      <p className="text-[var(--m3-on-surface)] whitespace-pre-wrap">{m.text}</p>
                    </div>
                  );
                })}
              </div>

              {/* Response Composer */}
              <form onSubmit={handleSendAgentReply} className="space-y-3 pt-2">
                {replyMode === 'Email' ? (
                  <div className="p-4 rounded-2xl bg-[var(--m3-surface-container)] border border-[var(--m3-outline-variant)] space-y-3">
                    <div className="text-xs font-bold text-[var(--m3-on-surface)] flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-[var(--m3-primary)]" />
                      Compose Email Response to {selectedTicket.clientEmail}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        placeholder="Subject line..."
                        className="p-2.5 rounded-xl bg-[var(--m3-surface-container-high)] text-xs text-[var(--m3-on-surface)] border border-[var(--m3-outline-variant)] focus:outline-hidden"
                      />
                      <input
                        type="text"
                        value={ccList}
                        onChange={(e) => setCcList(e.target.value)}
                        placeholder="CC (comma separated emails)..."
                        className="p-2.5 rounded-xl bg-[var(--m3-surface-container-high)] text-xs text-[var(--m3-on-surface)] border border-[var(--m3-outline-variant)] focus:outline-hidden"
                      />
                    </div>

                    <textarea
                      rows={3}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type formal email response with resolution details..."
                      className="w-full p-3 rounded-xl bg-[var(--m3-surface-container-high)] text-xs text-[var(--m3-on-surface)] border border-[var(--m3-outline-variant)] focus:outline-hidden"
                    />

                    <div className="flex items-center justify-between text-[11px] text-[var(--m3-on-surface-variant)]">
                      <span>Signature: -- Best regards, {activeAgent.name} ({activeAgent.role})</span>
                      <M3Button variant="filled" size="sm" type="submit" icon={<Send className="w-4 h-4" />}>
                        Send Email
                      </M3Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type live chat message to client..."
                      className="flex-1 bg-[var(--m3-surface-container)] border border-[var(--m3-outline-variant)] text-xs rounded-full px-4 py-2.5 focus:outline-hidden text-[var(--m3-on-surface)]"
                    />
                    <M3Button variant="filled" size="sm" type="submit" icon={<Send className="w-4 h-4" />}>
                      Send Chat
                    </M3Button>
                  </div>
                )}
              </form>
            </div>

            {/* Right: Case Controls & Client Inspector */}
            <div className="space-y-4 p-4 rounded-2xl bg-[var(--m3-surface-container)] border border-[var(--m3-outline-variant)] text-xs">
              <h4 className="font-bold text-sm text-[var(--m3-on-surface)] pb-2 border-b border-[var(--m3-outline-variant)] flex items-center justify-between">
                <span>Case Inspector</span>
                <Tag className="w-4 h-4 text-[var(--m3-primary)]" />
              </h4>

              {/* Status Selector */}
              <div className="space-y-1">
                <label className="font-semibold text-[var(--m3-on-surface-variant)] block">
                  Case Status
                </label>
                <select
                  value={selectedTicket.status}
                  onChange={(e) => {
                    const newSt = e.target.value as SupportTicket['status'];
                    if (onUpdateTicketStatus) {
                      onUpdateTicketStatus(selectedTicket.id, newSt);
                    }
                    setSelectedTicket({ ...selectedTicket, status: newSt });
                  }}
                  className="w-full p-2.5 rounded-xl bg-[var(--m3-surface-container-high)] text-xs text-[var(--m3-on-surface)] border border-[var(--m3-outline-variant)] focus:outline-hidden font-bold"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Waiting for Client">Waiting for Client</option>
                  <option value="Escalated">Escalated</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {/* Assign Agent Selector */}
              <div className="space-y-1">
                <label className="font-semibold text-[var(--m3-on-surface-variant)] block">
                  Assigned Agent
                </label>
                <select
                  value={selectedTicket.assignedAgent?.id || ''}
                  onChange={(e) => {
                    const foundAgent = agents.find((a) => a.id === e.target.value);
                    if (foundAgent) {
                      if (onAssignAgent) {
                        onAssignAgent(selectedTicket.id, foundAgent);
                      }
                      setSelectedTicket({ ...selectedTicket, assignedAgent: foundAgent });
                    }
                  }}
                  className="w-full p-2.5 rounded-xl bg-[var(--m3-surface-container-high)] text-xs text-[var(--m3-on-surface)] border border-[var(--m3-outline-variant)] focus:outline-hidden"
                >
                  {agents.map((ag) => (
                    <option key={ag.id} value={ag.id}>
                      {ag.name} ({ag.role})
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority & Category */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--m3-outline-variant)]">
                <div>
                  <span className="text-[11px] text-[var(--m3-on-surface-variant)] block">Category</span>
                  <span className="font-semibold text-[var(--m3-on-surface)]">{selectedTicket.category}</span>
                </div>
                <div>
                  <span className="text-[11px] text-[var(--m3-on-surface-variant)] block">Priority</span>
                  <M3Badge variant={selectedTicket.priority === 'Urgent' ? 'error' : 'secondary'} size="sm">
                    {selectedTicket.priority}
                  </M3Badge>
                </div>
              </div>

              {/* Client Info Card */}
              <div className="p-3 rounded-xl bg-[var(--m3-surface-container-high)] space-y-1.5 pt-3 border-t border-[var(--m3-outline-variant)]">
                <span className="text-[11px] font-bold text-[var(--m3-primary)] uppercase tracking-wider block">
                  Client Profile
                </span>
                <div className="font-bold text-[var(--m3-on-surface)]">{selectedTicket.clientName}</div>
                <div className="text-[11px] text-[var(--m3-on-surface-variant)] font-mono">{selectedTicket.clientEmail}</div>
              </div>

              {openAiAssistant && (
                <M3Button
                  variant="outlined"
                  size="sm"
                  onClick={openAiAssistant}
                  icon={<Sparkles className="w-3.5 h-3.5 text-[var(--m3-primary)]" />}
                  className="w-full justify-center mt-2"
                >
                  Draft Gemini Resolution
                </M3Button>
              )}
            </div>
          </div>
        </M3Dialog>
      )}

      {/* Agent Roster & Positioning Modal */}
      <M3Dialog
        isOpen={isAgentRosterOpen}
        onClose={() => setIsAgentRosterOpen(false)}
        title="Operava Desk Agent Roster & AUX Statuses"
        icon={<Users className="w-5 h-5" />}
        maxWidth="xl"
      >
        <div className="space-y-4">
          <p className="text-xs text-[var(--m3-on-surface-variant)]">
            Active support agents, assigned positioning roles, and real-time AUX availability queue.
          </p>

          <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="p-4 rounded-2xl bg-[var(--m3-surface-container)] border border-[var(--m3-outline-variant)] flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={agent.avatar}
                    alt={agent.name}
                    className="w-10 h-10 rounded-full object-cover border border-[var(--m3-outline-variant)]"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[var(--m3-on-surface)]">{agent.name}</span>
                      <M3Badge variant="outline" size="sm">{agent.role}</M3Badge>
                    </div>
                    <p className="text-xs text-[var(--m3-on-surface-variant)]">
                      {agent.department} • Resolved today: {agent.resolvedToday} • Rating: ⭐ {agent.rating}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${getAuxStatusColor(
                      agent.status
                    )}`}
                  >
                    {agent.status}
                  </span>
                  <div className="text-[10px] text-[var(--m3-on-surface-variant)] mt-1 font-mono">
                    {agent.statusSince}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </M3Dialog>

      {/* New Client Ticket Creation Modal */}
      <M3Dialog
        isOpen={isNewTicketOpen}
        onClose={() => setIsNewTicketOpen(false)}
        title="Submit New Operava Desk Client Case"
        icon={<Plus className="w-5 h-5" />}
      >
        <form onSubmit={handleCreateTicketSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-[var(--m3-on-surface)] block mb-1">
                Client Name
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container)] border border-[var(--m3-outline-variant)] text-xs text-[var(--m3-on-surface)] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-semibold text-[var(--m3-on-surface)] block mb-1">
                Client Email
              </label>
              <input
                type="email"
                required
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container)] border border-[var(--m3-outline-variant)] text-xs text-[var(--m3-on-surface)] focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-[var(--m3-on-surface)] block mb-1">
                Channel
              </label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as 'Email' | 'Chat')}
                className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container)] border border-[var(--m3-outline-variant)] text-xs text-[var(--m3-on-surface)] focus:outline-hidden"
              >
                <option value="Email">Email Dispatch</option>
                <option value="Chat">Live Chat</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-[var(--m3-on-surface)] block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container)] border border-[var(--m3-outline-variant)] text-xs text-[var(--m3-on-surface)] focus:outline-hidden"
              >
                <option value="Infrastructure & Security">Infrastructure & Security</option>
                <option value="AI Pipeline">AI Pipeline & Gemini</option>
                <option value="Billing & Licensing">Billing & Licensing</option>
                <option value="Access & Tokens">Access & Tokens</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-[var(--m3-on-surface)] block mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container)] border border-[var(--m3-outline-variant)] text-xs text-[var(--m3-on-surface)] focus:outline-hidden"
              >
                <option value="Urgent">Urgent (&lt; 15 min SLA)</option>
                <option value="High">High (&lt; 1 hour SLA)</option>
                <option value="Medium">Medium (&lt; 4 hour SLA)</option>
                <option value="Low">Low (&lt; 24 hour SLA)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-[var(--m3-on-surface)] block mb-1">
              Case Subject
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Rate limit escalation or SSL verification..."
              className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container)] border border-[var(--m3-outline-variant)] text-xs text-[var(--m3-on-surface)] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="font-semibold text-[var(--m3-on-surface)] block mb-1">
              Initial Issue Description / Message
            </label>
            <textarea
              rows={4}
              required
              value={initialMessage}
              onChange={(e) => setInitialMessage(e.target.value)}
              placeholder="Provide complete technical details or query context..."
              className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container)] border border-[var(--m3-outline-variant)] text-xs text-[var(--m3-on-surface)] focus:outline-hidden"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <M3Button variant="text" type="button" onClick={() => setIsNewTicketOpen(false)}>
              Cancel
            </M3Button>
            <M3Button variant="filled" type="submit">
              Raise Ticket
            </M3Button>
          </div>
        </form>
      </M3Dialog>
    </div>
  );
};
