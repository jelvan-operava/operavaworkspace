import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  CheckCircle2,
  Clock,
  AlertCircle,
  CreditCard,
  DollarSign,
  FileText,
  HelpCircle,
  ShieldCheck,
  TrendingUp,
  Download,
  Plus,
  ArrowRight,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Sliders,
  HardDrive,
  Users,
  Zap,
  Lock,
  MessageSquare,
  Send,
  Calendar,
  Building,
} from 'lucide-react';
import { M3Card } from '../ui/M3Card';
import { M3Button } from '../ui/M3Button';
import { M3Badge } from '../ui/M3Badge';
import { M3Dialog } from '../ui/M3Dialog';
import { M3ConfirmDialog } from '../ui/M3ConfirmDialog';
import { CompanyProfile, Project, Invoice, SupportTicket } from '@/lib/mock-data';

export interface ClientDashboardViewProps {
  company: CompanyProfile;
  projects: Project[];
  invoices: Invoice[];
  tickets: SupportTicket[];
  onPayInvoice: (invoiceId: string) => void;
  onCreateTicket: (ticket: any) => void;
}

export const ClientDashboardView: React.FC<ClientDashboardViewProps> = ({
  company,
  projects,
  invoices,
  tickets,
  onPayInvoice,
  onCreateTicket,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'payments' | 'tickets' | 'limitations'>('overview');
  
  // Payment Modal State
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<Invoice | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'ach' | 'apple_pay'>('card');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState<string | null>(null);

  // New Ticket Modal
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState<SupportTicket['category']>('Technical');
  const [ticketPriority, setTicketPriority] = useState<SupportTicket['priority']>('High');
  const [ticketMessage, setTicketMessage] = useState('');

  // Limit Increase Request Modal
  const [isLimitIncreaseOpen, setIsLimitIncreaseOpen] = useState(false);
  const [limitType, setLimitType] = useState('Monthly API Requests');
  const [requestedValue, setRequestedValue] = useState('1,000,000 Requests/mo');
  const [limitReason, setLimitReason] = useState('Scaling Q3 marketing campaign and automated Gemini API processing.');
  const [limitRequestSubmitted, setLimitRequestSubmitted] = useState(false);

  // Confirmation Modals
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Calculate Metrics
  const pendingInvoices = invoices.filter((i) => i.status === 'Pending' || i.status === 'Overdue');
  const totalPendingAmount = pendingInvoices.reduce((sum, i) => sum + i.amount, 0);
  const totalPaidAmount = invoices.filter((i) => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0);
  const openTickets = tickets.filter((t) => t.status !== 'Resolved' && t.status !== 'Closed');

  const handlePayInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoiceForPayment) return;

    setConfirmDialog({
      isOpen: true,
      title: 'Confirm Payment Authorization',
      message: `Do you want to authorize immediate payment of $${selectedInvoiceForPayment.amount.toLocaleString()} for Invoice ${selectedInvoiceForPayment.invoiceNumber} using your ${paymentMethod.toUpperCase()} card on file?`,
      onConfirm: () => {
        onPayInvoice(selectedInvoiceForPayment.id);
        setPaymentSuccessMessage(`Payment of $${selectedInvoiceForPayment.amount.toLocaleString()} for ${selectedInvoiceForPayment.invoiceNumber} confirmed! Receipt emailed to ${company.clientEmail}.`);
        setSelectedInvoiceForPayment(null);
        setTimeout(() => setPaymentSuccessMessage(null), 5000);
      },
    });
  };

  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) return;

    onCreateTicket({
      subject: ticketSubject,
      category: ticketCategory,
      priority: ticketPriority,
      initialMessage: ticketMessage,
      channel: 'Email',
    });

    setIsNewTicketOpen(false);
    setTicketSubject('');
    setTicketMessage('');
  };

  const handleLimitIncreaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLimitRequestSubmitted(true);
    setTimeout(() => {
      setLimitRequestSubmitted(false);
      setIsLimitIncreaseOpen(false);
    }, 2500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-[var(--m3-primary-container)] text-[var(--m3-on-primary-container)] text-[11px] font-bold flex items-center gap-1">
              <Building className="w-3.5 h-3.5" />
              {company.name}
            </span>
            <M3Badge variant="success" size="sm">
              Enterprise SLA Tier 1
            </M3Badge>
            <span className="text-xs text-[var(--m3-on-surface-variant)]">
              Primary Executive: <strong className="text-[var(--m3-on-surface)]">{company.clientName}</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--m3-on-surface)] mt-2 flex items-center gap-2">
            Client Self-Service Dashboard & Portal
          </h1>
          <p className="text-xs text-[var(--m3-on-surface-variant)] mt-1 max-w-2xl">
            Real-time transparency hub providing project progress trackers, instant milestone invoice payments, support ticket status, and service SLA quota limitations.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <M3Button variant="tonal" onClick={() => setIsLimitIncreaseOpen(true)}>
            <Sliders className="w-4 h-4 mr-1.5" />
            Request SLA Limit Upgrade
          </M3Button>
          <M3Button variant="filled" onClick={() => setIsNewTicketOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            Open Support Ticket
          </M3Button>
        </div>
      </div>

      {paymentSuccessMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-[var(--m3-success-container)] text-[var(--m3-on-success-container)] flex items-center justify-between text-xs font-bold"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{paymentSuccessMessage}</span>
          </div>
          <button
            onClick={() => setPaymentSuccessMessage(null)}
            className="text-[11px] underline cursor-pointer"
          >
            Dismiss
          </button>
        </motion.div>
      )}

      {/* KPI Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[var(--m3-surface-container)] border border-[var(--m3-outline-variant)] flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--m3-on-surface-variant)] font-medium">Active Projects</p>
            <p className="text-2xl font-bold text-[var(--m3-on-surface)] mt-1">{projects.length} Portfolios</p>
            <p className="text-[11px] text-[var(--m3-success)] font-semibold mt-0.5">
              Avg 78% Completion
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[var(--m3-primary-container)] text-[var(--m3-on-primary-container)] flex items-center justify-center">
            <LayoutDashboard className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[var(--m3-surface-container)] border border-[var(--m3-outline-variant)] flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--m3-on-surface-variant)] font-medium">Pending Balance</p>
            <p className="text-2xl font-bold text-[var(--m3-on-surface)] mt-1">
              ${totalPendingAmount.toLocaleString()}
            </p>
            <p className="text-[11px] text-[var(--m3-tertiary)] font-semibold mt-0.5">
              {pendingInvoices.length} Pending Invoices
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[var(--m3-tertiary-container)] text-[var(--m3-on-tertiary-container)] flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[var(--m3-surface-container)] border border-[var(--m3-outline-variant)] flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--m3-on-surface-variant)] font-medium">Open Support Tickets</p>
            <p className="text-2xl font-bold text-[var(--m3-on-surface)] mt-1">{openTickets.length} Cases</p>
            <p className="text-[11px] text-[var(--m3-primary)] font-semibold mt-0.5">
              SLA: &lt; 2hr Avg Response
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[var(--m3-surface-container-high)] text-[var(--m3-primary)] flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[var(--m3-surface-container)] border border-[var(--m3-outline-variant)] flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--m3-on-surface-variant)] font-medium">SLA Quota & Limits</p>
            <p className="text-2xl font-bold text-[var(--m3-on-surface)] mt-1">68.4% Used</p>
            <p className="text-[11px] text-[var(--m3-success)] font-semibold mt-0.5">
              500k Monthly API Limit
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[var(--m3-success-container)] text-[var(--m3-on-success-container)] flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)] overflow-x-auto custom-scrollbar">
        {[
          { id: 'overview', label: 'Dashboard Overview' },
          { id: 'projects', label: `Project Progress (${projects.length})` },
          { id: 'payments', label: `Payments & Invoices (${invoices.length})` },
          { id: 'tickets', label: `Support Cases (${tickets.length})` },
          { id: 'limitations', label: 'Service Limits & Tier SLA' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold shrink-0 cursor-pointer transition-all ${
              activeTab === tab.id
                ? 'bg-[var(--m3-primary)] text-[var(--m3-on-primary)] shadow-2xs'
                : 'hover:bg-[var(--m3-surface-container-high)] text-[var(--m3-on-surface-variant)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Main Project Progress Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-base text-[var(--m3-on-surface)] flex items-center gap-2">
                  <LayoutDashboard className="w-5 h-5 text-[var(--m3-primary)]" />
                  Active Project Milestone Progress
                </h2>
                <M3Button variant="text" size="sm" onClick={() => setActiveTab('projects')}>
                  View All Projects <ChevronRight className="w-4 h-4 ml-1" />
                </M3Button>
              </div>

              {projects.map((proj) => (
                <M3Card key={proj.id} variant="filled" className="p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[var(--m3-on-surface)]">
                          {proj.title}
                        </span>
                        <M3Badge variant="outline" size="sm">
                          {proj.status}
                        </M3Badge>
                      </div>
                      <p className="text-xs text-[var(--m3-on-surface-variant)] mt-0.5">
                        {proj.description}
                      </p>
                    </div>
                    <div className="text-right shrink-0 font-mono text-xs">
                      <div className="font-bold text-[var(--m3-primary)]">
                        {proj.spent} / {proj.budget}
                      </div>
                      <span className="text-[10px] text-[var(--m3-on-surface-variant)]">Spent / Budget</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Overall Milestone Completion</span>
                      <span className="text-[var(--m3-primary)] font-bold">{proj.progress}%</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-[var(--m3-surface-container-high)] overflow-hidden">
                      <div
                        className="h-full bg-[var(--m3-primary)] rounded-full transition-all duration-500"
                        style={{ width: `${proj.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Tasks Count Summary */}
                  <div className="pt-2 border-t border-[var(--m3-outline-variant)] flex items-center justify-between text-xs">
                    <span className="text-[var(--m3-on-surface-variant)]">Milestone Tasks</span>
                    <span className="font-mono font-semibold">{proj.tasksCount.completed} / {proj.tasksCount.total} Completed</span>
                  </div>
                </M3Card>
              ))}
            </div>

            {/* Sidebar: Pending Invoices & Account Quota */}
            <div className="space-y-6">
              {/* Outstanding Invoices Card */}
              <M3Card variant="filled" className="p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--m3-outline-variant)] pb-3">
                  <h3 className="font-bold text-sm text-[var(--m3-on-surface)] flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[var(--m3-tertiary)]" />
                    Pending Statements
                  </h3>
                  <span className="font-bold text-xs text-[var(--m3-tertiary)] font-mono">
                    ${totalPendingAmount.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-3">
                  {pendingInvoices.length > 0 ? (
                    pendingInvoices.map((inv) => (
                      <div
                        key={inv.id}
                        className="p-3.5 rounded-2xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)] space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold">{inv.invoiceNumber}</span>
                          <span className="font-bold text-[var(--m3-primary)] font-mono">
                            ${inv.amount.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-[var(--m3-on-surface-variant)]">
                          <span>Due: {inv.dueDate}</span>
                          <M3Badge variant="warning" size="sm">{inv.status}</M3Badge>
                        </div>
                        <M3Button
                          variant="filled"
                          size="sm"
                          className="w-full mt-1"
                          onClick={() => setSelectedInvoiceForPayment(inv)}
                        >
                          Pay Now (${inv.amount.toLocaleString()})
                        </M3Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-[var(--m3-on-surface-variant)] italic text-center py-4">
                      All milestone statements are fully settled. Thank you!
                    </p>
                  )}
                </div>
              </M3Card>

              {/* Service Limits Quick View */}
              <M3Card variant="filled" className="p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--m3-outline-variant)] pb-3">
                  <h3 className="font-bold text-sm text-[var(--m3-on-surface)] flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[var(--m3-primary)]" />
                    Enterprise SLA Limitations
                  </h3>
                  <M3Badge variant="success" size="sm">Active</M3Badge>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Monthly Gemini API Requests</span>
                      <span className="font-mono font-bold">342k / 500k</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[var(--m3-surface-container-high)]">
                      <div className="h-full bg-[var(--m3-primary)] rounded-full w-[68%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Cloud Storage Quota</span>
                      <span className="font-mono font-bold">7.8 TB / 10 TB</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[var(--m3-surface-container-high)]">
                      <div className="h-full bg-[var(--m3-tertiary)] rounded-full w-[78%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Team Workspace Seats</span>
                      <span className="font-mono font-bold">42 / 50 Seats</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[var(--m3-surface-container-high)]">
                      <div className="h-full bg-[var(--m3-success)] rounded-full w-[84%]" />
                    </div>
                  </div>
                </div>

                <M3Button
                  variant="tonal"
                  size="sm"
                  className="w-full"
                  onClick={() => setIsLimitIncreaseOpen(true)}
                >
                  Request Limit Extension
                </M3Button>
              </M3Card>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Projects & Milestones */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((proj) => (
              <M3Card key={proj.id} variant="filled" className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <M3Badge variant="outline" size="sm">{proj.category || 'Core Systems'}</M3Badge>
                    <h3 className="font-bold text-lg text-[var(--m3-on-surface)] mt-1">{proj.title}</h3>
                    <p className="text-xs text-[var(--m3-on-surface-variant)] mt-1">{proj.description}</p>
                  </div>
                  <div className="text-right font-mono shrink-0">
                    <span className="text-xs text-[var(--m3-on-surface-variant)] block">Allocated Budget</span>
                    <span className="font-bold text-base text-[var(--m3-primary)]">
                      {proj.budget}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Project Milestone Progress</span>
                    <span>{proj.progress}%</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-[var(--m3-surface-container-high)] overflow-hidden">
                    <div
                      className="h-full bg-[var(--m3-primary)] rounded-full"
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)] space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[var(--m3-on-surface)]">Lead Architect</span>
                    <span className="text-[var(--m3-on-surface-variant)]">{proj.lead}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--m3-on-surface-variant)]">Milestone Tasks</span>
                    <span className="font-mono font-semibold text-[var(--m3-primary)]">
                      {proj.tasksCount.completed} / {proj.tasksCount.total} Completed
                    </span>
                  </div>
                </div>
              </M3Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Client Payments Portal */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)]">
            <div>
              <h2 className="font-bold text-base text-[var(--m3-on-surface)] flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[var(--m3-primary)]" />
                Payment Options & Statement Ledger
              </h2>
              <p className="text-xs text-[var(--m3-on-surface-variant)]">
                Manage stored cards, direct ACH bank transfers, and settle pending milestone statements.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-[var(--m3-success)]">
                Total Paid: ${totalPaidAmount.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="rounded-3xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[var(--m3-outline-variant)] bg-[var(--m3-surface-container)] text-[var(--m3-on-surface-variant)] uppercase font-semibold text-[10px]">
                    <th className="p-4">Invoice #</th>
                    <th className="p-4">Issue Date</th>
                    <th className="p-4">Due Date</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--m3-outline-variant)] text-[var(--m3-on-surface)]">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-[var(--m3-surface-container)] transition-colors">
                      <td className="p-4 font-bold text-xs font-mono">{inv.invoiceNumber}</td>
                      <td className="p-4 font-medium text-[var(--m3-on-surface-variant)]">{inv.date}</td>
                      <td className="p-4 font-medium text-[var(--m3-on-surface-variant)]">{inv.dueDate}</td>
                      <td className="p-4 font-bold font-mono text-[var(--m3-primary)]">
                        ${inv.amount.toLocaleString()}
                      </td>
                      <td className="p-4">
                        <M3Badge
                          variant={inv.status === 'Paid' ? 'success' : inv.status === 'Overdue' ? 'error' : 'warning'}
                        >
                          {inv.status}
                        </M3Badge>
                      </td>
                      <td className="p-4 text-right">
                        {inv.status === 'Paid' ? (
                          <M3Button
                            variant="tonal"
                            size="sm"
                            onClick={() => {
                              alert(`Downloading official PDF statement receipt for ${inv.invoiceNumber}`);
                            }}
                            icon={<Download className="w-3.5 h-3.5" />}
                          >
                            Receipt PDF
                          </M3Button>
                        ) : (
                          <M3Button
                            variant="filled"
                            size="sm"
                            onClick={() => setSelectedInvoiceForPayment(inv)}
                          >
                            Pay Now
                          </M3Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Support Tickets & Cases */}
      {activeTab === 'tickets' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)]">
            <div>
              <h2 className="font-bold text-base text-[var(--m3-on-surface)] flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[var(--m3-primary)]" />
                Dedicated Executive Support Cases
              </h2>
              <p className="text-xs text-[var(--m3-on-surface-variant)]">
                Submit and track engineering tickets with guaranteed Tier 1 SLA response times.
              </p>
            </div>
            <M3Button variant="filled" onClick={() => setIsNewTicketOpen(true)}>
              <Plus className="w-4 h-4 mr-1.5" />
              Submit Ticket
            </M3Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tickets.map((t) => (
              <M3Card key={t.id} variant="filled" className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[var(--m3-primary)]">{t.ticketNo}</span>
                  <div className="flex items-center gap-1.5">
                    <M3Badge variant={t.priority === 'Urgent' ? 'error' : 'warning'} size="sm">
                      {t.priority}
                    </M3Badge>
                    <M3Badge variant={t.status === 'Resolved' ? 'success' : 'outline'} size="sm">
                      {t.status}
                    </M3Badge>
                  </div>
                </div>

                <h3 className="font-bold text-sm text-[var(--m3-on-surface)]">{t.subject}</h3>
                <p className="text-xs text-[var(--m3-on-surface-variant)] line-clamp-2">
                  {t.messages[t.messages.length - 1]?.text || 'No message contents.'}
                </p>

                <div className="pt-2 border-t border-[var(--m3-outline-variant)] flex items-center justify-between text-[11px] text-[var(--m3-on-surface-variant)]">
                  <span>Category: {t.category}</span>
                  <span>Assigned: {t.assignedAgent?.name || 'Tier 1 Escalation'}</span>
                </div>
              </M3Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Service Limitations & Tier SLA */}
      {activeTab === 'limitations' && (
        <div className="space-y-6 max-w-4xl mx-auto">
          <M3Card variant="filled" className="p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--m3-outline-variant)] pb-4">
              <div>
                <h2 className="font-bold text-lg text-[var(--m3-on-surface)] flex items-center gap-2">
                  <Lock className="w-5 h-5 text-[var(--m3-primary)]" />
                  Account Service Quotas & Feature Limitations
                </h2>
                <p className="text-xs text-[var(--m3-on-surface-variant)] mt-0.5">
                  Your current account is provisioned under the <strong>Enterprise SLA Tier 1</strong> plan.
                </p>
              </div>
              <M3Badge variant="success">Active Plan</M3Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)] space-y-2">
                <span className="font-bold text-xs block text-[var(--m3-on-surface)]">
                  Monthly Gemini API Rate Limits
                </span>
                <p className="text-[var(--m3-on-surface-variant)]">
                  Limit: 500,000 API calls / month (342,100 used this period).
                </p>
                <div className="w-full h-2 rounded-full bg-[var(--m3-surface-container-high)]">
                  <div className="h-full bg-[var(--m3-primary)] rounded-full w-[68%]" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)] space-y-2">
                <span className="font-bold text-xs block text-[var(--m3-on-surface)]">
                  Cloud Object Storage Quota
                </span>
                <p className="text-[var(--m3-on-surface-variant)]">
                  Limit: 10.0 TB dedicated R2 storage (7.8 TB used).
                </p>
                <div className="w-full h-2 rounded-full bg-[var(--m3-surface-container-high)]">
                  <div className="h-full bg-[var(--m3-tertiary)] rounded-full w-[78%]" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)] space-y-2">
                <span className="font-bold text-xs block text-[var(--m3-on-surface)]">
                  Team Member Workspace Seats
                </span>
                <p className="text-[var(--m3-on-surface-variant)]">
                  Limit: 50 active user seats (42 seats assigned).
                </p>
                <div className="w-full h-2 rounded-full bg-[var(--m3-surface-container-high)]">
                  <div className="h-full bg-[var(--m3-success)] rounded-full w-[84%]" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)] space-y-2">
                <span className="font-bold text-xs block text-[var(--m3-on-surface)]">
                  Support Response Time SLA
                </span>
                <p className="text-[var(--m3-on-surface-variant)]">
                  Guranteed SLA: &lt; 2 Hours for High/Urgent Priority tickets.
                </p>
                <span className="text-[10px] font-bold text-[var(--m3-success)] block">
                  Current Avg Resolution Time: 18 Minutes
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--m3-surface-container-high)] border border-[var(--m3-outline-variant)] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-sm text-[var(--m3-on-surface)]">Need custom rate limits or extra seats?</h4>
                <p className="text-xs text-[var(--m3-on-surface-variant)]">
                  Request elevated limits or dedicated infrastructure from your assigned account engineer.
                </p>
              </div>
              <M3Button variant="filled" onClick={() => setIsLimitIncreaseOpen(true)}>
                Request Limit Extension
              </M3Button>
            </div>
          </M3Card>
        </div>
      )}

      {/* Modal: Pay Pending Invoice */}
      {selectedInvoiceForPayment && (
        <M3Dialog
          isOpen={!!selectedInvoiceForPayment}
          onClose={() => setSelectedInvoiceForPayment(null)}
          title={`Settle Statement: ${selectedInvoiceForPayment.invoiceNumber}`}
          icon={<CreditCard className="w-5 h-5" />}
        >
          <form onSubmit={handlePayInvoiceSubmit} className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)] flex items-center justify-between">
              <div>
                <span className="text-[var(--m3-on-surface-variant)] block">Total Due</span>
                <span className="font-bold text-xl text-[var(--m3-primary)] font-mono">
                  ${selectedInvoiceForPayment.amount.toLocaleString()}
                </span>
              </div>
              <M3Badge variant="warning">{selectedInvoiceForPayment.status}</M3Badge>
            </div>

            <div>
              <label className="font-semibold block mb-1">Select Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-2xl border text-center font-bold transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'bg-[var(--m3-primary-container)] border-[var(--m3-primary)] text-[var(--m3-on-primary-container)]'
                      : 'bg-[var(--m3-surface-container-low)] border-[var(--m3-outline-variant)]'
                  }`}
                >
                  Credit Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('ach')}
                  className={`p-3 rounded-2xl border text-center font-bold transition-all cursor-pointer ${
                    paymentMethod === 'ach'
                      ? 'bg-[var(--m3-primary-container)] border-[var(--m3-primary)] text-[var(--m3-on-primary-container)]'
                      : 'bg-[var(--m3-surface-container-low)] border-[var(--m3-outline-variant)]'
                  }`}
                >
                  ACH Direct
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`p-3 rounded-2xl border text-center font-bold transition-all cursor-pointer ${
                    paymentMethod === 'apple_pay'
                      ? 'bg-[var(--m3-primary-container)] border-[var(--m3-primary)] text-[var(--m3-on-primary-container)]'
                      : 'bg-[var(--m3-surface-container-low)] border-[var(--m3-outline-variant)]'
                  }`}
                >
                  Apple Pay
                </button>
              </div>
            </div>

            {paymentMethod === 'card' && (
              <div className="space-y-3">
                <div>
                  <label className="font-semibold block mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container-low)] text-[var(--m3-on-surface)] border border-[var(--m3-outline-variant)] font-mono focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Expiry Date</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container-low)] text-[var(--m3-on-surface)] border border-[var(--m3-outline-variant)] font-mono focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">CVC / CWW</label>
                    <input
                      type="password"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      placeholder="•••"
                      className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container-low)] text-[var(--m3-on-surface)] border border-[var(--m3-outline-variant)] font-mono focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <M3Button variant="text" onClick={() => setSelectedInvoiceForPayment(null)}>
                Cancel
              </M3Button>
              <M3Button variant="filled" type="submit">
                Authorize ${selectedInvoiceForPayment.amount.toLocaleString()} Payment
              </M3Button>
            </div>
          </form>
        </M3Dialog>
      )}

      {/* Modal: New Support Ticket */}
      <M3Dialog
        isOpen={isNewTicketOpen}
        onClose={() => setIsNewTicketOpen(false)}
        title="Open Support Ticket"
        icon={<MessageSquare className="w-5 h-5" />}
      >
        <form onSubmit={handleCreateTicketSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold block mb-1">Subject Title *</label>
            <input
              type="text"
              required
              value={ticketSubject}
              onChange={(e) => setTicketSubject(e.target.value)}
              placeholder="e.g. Gemini 3.5 API Rate Limiting Advisory"
              className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container-low)] text-[var(--m3-on-surface)] border border-[var(--m3-outline-variant)] focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">Category</label>
              <select
                value={ticketCategory}
                onChange={(e) => setTicketCategory(e.target.value as any)}
                className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container-low)] text-[var(--m3-on-surface)] border border-[var(--m3-outline-variant)] focus:outline-hidden"
              >
                <option value="Technical">Technical</option>
                <option value="Billing">Billing</option>
                <option value="Account">Account</option>
                <option value="Security">Security</option>
              </select>
            </div>

            <div>
              <label className="font-semibold block mb-1">Priority SLA</label>
              <select
                value={ticketPriority}
                onChange={(e) => setTicketPriority(e.target.value as any)}
                className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container-low)] text-[var(--m3-on-surface)] border border-[var(--m3-outline-variant)] focus:outline-hidden font-bold"
              >
                <option value="Medium">Medium</option>
                <option value="High">High (&lt; 2hr SLA)</option>
                <option value="Urgent">Urgent (&lt; 30m SLA)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1">Ticket Message Body *</label>
            <textarea
              rows={4}
              required
              value={ticketMessage}
              onChange={(e) => setTicketMessage(e.target.value)}
              placeholder="Describe the issue, step-by-step observations, or billing request..."
              className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container-low)] text-[var(--m3-on-surface)] border border-[var(--m3-outline-variant)] focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <M3Button variant="text" onClick={() => setIsNewTicketOpen(false)}>
              Cancel
            </M3Button>
            <M3Button variant="filled" type="submit">
              Submit Ticket
            </M3Button>
          </div>
        </form>
      </M3Dialog>

      {/* Modal: Limit Extension Request */}
      <M3Dialog
        isOpen={isLimitIncreaseOpen}
        onClose={() => setIsLimitIncreaseOpen(false)}
        title="Request Service Limit / SLA Upgrade"
        icon={<Sliders className="w-5 h-5" />}
      >
        <form onSubmit={handleLimitIncreaseSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold block mb-1">Quota Resource Type</label>
            <select
              value={limitType}
              onChange={(e) => setLimitType(e.target.value)}
              className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container-low)] text-[var(--m3-on-surface)] border border-[var(--m3-outline-variant)] focus:outline-hidden"
            >
              <option value="Monthly API Requests">Monthly API Requests</option>
              <option value="Cloud Storage Quota">Cloud Storage Quota</option>
              <option value="Team Workspace Seats">Team Workspace Seats</option>
              <option value="24/7 Dedicated Phone Support">24/7 Dedicated Phone Support</option>
            </select>
          </div>

          <div>
            <label className="font-semibold block mb-1">Requested Capacity Target</label>
            <input
              type="text"
              required
              value={requestedValue}
              onChange={(e) => setRequestedValue(e.target.value)}
              className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container-low)] text-[var(--m3-on-surface)] border border-[var(--m3-outline-variant)] focus:outline-hidden font-bold"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Business Justification</label>
            <textarea
              rows={3}
              value={limitReason}
              onChange={(e) => setLimitReason(e.target.value)}
              className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container-low)] text-[var(--m3-on-surface)] border border-[var(--m3-outline-variant)] focus:outline-hidden"
            />
          </div>

          {limitRequestSubmitted && (
            <div className="p-3 rounded-xl bg-[var(--m3-success-container)] text-[var(--m3-on-success-container)] text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Limit upgrade ticket submitted! Assigned to Elena Rostova.</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <M3Button variant="text" onClick={() => setIsLimitIncreaseOpen(false)}>
              Cancel
            </M3Button>
            <M3Button variant="filled" type="submit">
              Submit Extension Request
            </M3Button>
          </div>
        </form>
      </M3Dialog>

      {/* Confirmation Dialog */}
      <M3ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
      />
    </div>
  );
};
