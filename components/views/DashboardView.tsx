import React from 'react';
import { motion } from 'motion/react';
import {
  DollarSign,
  Briefcase,
  Receipt,
  ShieldCheck,
  ArrowUpRight,
  Plus,
  FileText,
  Calendar,
  Sparkles,
  Download,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import { M3Card } from '../ui/M3Card';
import { M3Button } from '../ui/M3Button';
import { M3Badge } from '../ui/M3Badge';
import {
  CompanyProfile,
  KPIMetric,
  Project,
  Invoice,
  CalendarEvent,
  FileItem,
} from '@/lib/mock-data';
import { ViewId } from '../layout/NavRail';

export interface DashboardViewProps {
  company: CompanyProfile;
  kpiMetrics: KPIMetric[];
  projects: Project[];
  invoices: Invoice[];
  calendarEvents: CalendarEvent[];
  files: FileItem[];
  onNavigate: (view: ViewId) => void;
  openAiAssistant: () => void;
}

const REVENUE_DATA = [
  { month: 'Jan', revenue: 18200, expenses: 12000 },
  { month: 'Feb', revenue: 22400, expenses: 14200 },
  { month: 'Mar', revenue: 25100, expenses: 15000 },
  { month: 'Apr', revenue: 21800, expenses: 13800 },
  { month: 'May', revenue: 28500, expenses: 16200 },
  { month: 'Jun', revenue: 32500, expenses: 18100 },
  { month: 'Jul', revenue: 35100, expenses: 19500 },
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  company,
  kpiMetrics,
  projects,
  invoices,
  calendarEvents,
  files,
  onNavigate,
  openAiAssistant,
}) => {
  const pendingInvoices = invoices.filter((i) => i.status === 'Pending');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Hero Greeting Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[var(--m3-primary-container)] via-[var(--m3-surface-container-high)] to-[var(--m3-tertiary-container)] border border-[var(--m3-outline-variant)] text-[var(--m3-on-surface)] shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--m3-surface)]/80 text-[var(--m3-primary)] text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Google Workspace Client Intelligence Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--m3-on-surface)]">
            Welcome back, {company.clientName}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--m3-on-surface-variant)] leading-relaxed">
            Your enterprise workspace <span className="font-semibold">{company.name}</span> is performing optimally with 99.8% SLA uptime. You have {pendingInvoices.length} pending invoice awaiting approval.
          </p>

          {/* Quick Action Chips */}
          <div className="pt-2 flex flex-wrap gap-2">
            <M3Button
              variant="filled"
              size="sm"
              icon={<Sparkles className="w-4 h-4" />}
              onClick={openAiAssistant}
            >
              Ask Gemini AI
            </M3Button>
            <M3Button
              variant="tonal"
              size="sm"
              icon={<Receipt className="w-4 h-4" />}
              onClick={() => onNavigate('invoices')}
            >
              Pay Invoices (${pendingInvoices.reduce((acc, i) => acc + i.total, 0).toLocaleString()})
            </M3Button>
            <M3Button
              variant="outlined"
              size="sm"
              icon={<Briefcase className="w-4 h-4" />}
              onClick={() => onNavigate('projects')}
            >
              View Active Projects ({projects.length})
            </M3Button>
          </div>
        </div>

        {/* Account Lead Info Pill */}
        <div className="relative z-10 p-4 rounded-2xl bg-[var(--m3-surface)]/90 border border-[var(--m3-outline-variant)] backdrop-blur-md flex items-center gap-3 shrink-0">
          <img
            src={company.accountManager.avatar}
            alt={company.accountManager.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-[var(--m3-primary)]"
            referrerPolicy="no-referrer"
          />
          <div>
            <p className="text-[10px] text-[var(--m3-on-surface-variant)] uppercase font-bold tracking-wider">
              Dedicated Account Lead
            </p>
            <p className="font-semibold text-xs text-[var(--m3-on-surface)]">
              {company.accountManager.name}
            </p>
            <p className="text-[11px] text-[var(--m3-primary)] font-medium">
              {company.accountManager.role}
            </p>
          </div>
        </div>
      </motion.div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiMetrics.map((kpi, idx) => (
          <M3Card
            key={kpi.id}
            variant="filled"
            elevation={1}
            interactive
            onClick={() => {
              if (kpi.id === 'kpi-revenue' || kpi.id === 'kpi-invoices') onNavigate('invoices');
              else if (kpi.id === 'kpi-projects') onNavigate('projects');
              else onNavigate('support');
            }}
            className="p-5 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-[var(--m3-on-surface-variant)] uppercase tracking-wider">
                  {kpi.label}
                </p>
                <h3 className="text-xl font-bold text-[var(--m3-on-surface)] mt-1">
                  {kpi.value}
                </h3>
              </div>
              <div className="p-2.5 rounded-2xl bg-[var(--m3-primary-container)] text-[var(--m3-on-primary-container)]">
                {kpi.iconName === 'DollarSign' && <DollarSign className="w-5 h-5 text-[var(--m3-primary)]" />}
                {kpi.iconName === 'Briefcase' && <Briefcase className="w-5 h-5 text-[var(--m3-primary)]" />}
                {kpi.iconName === 'Receipt' && <Receipt className="w-5 h-5 text-[var(--m3-primary)]" />}
                {kpi.iconName === 'ShieldCheck' && <ShieldCheck className="w-5 h-5 text-[var(--m3-primary)]" />}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[var(--m3-outline-variant)] flex items-center justify-between">
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                  kpi.isPositive
                    ? 'bg-[var(--m3-success-container)] text-[var(--m3-on-success-container)]'
                    : 'bg-[var(--m3-warning-container)] text-[var(--m3-on-warning-container)]'
                }`}
              >
                {kpi.change}
              </span>
              <span className="text-[11px] text-[var(--m3-on-surface-variant)] truncate max-w-[120px]">
                {kpi.subtext}
              </span>
            </div>
          </M3Card>
        ))}
      </div>

      {/* Main Charts & Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recharts Financial Flow (2 Cols) */}
        <M3Card variant="filled" className="p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-[var(--m3-on-surface)]">
                YTD Financial Billing Flow & Burn Rate
              </h2>
              <p className="text-xs text-[var(--m3-on-surface-variant)]">
                Monthly revenue milestones vs allocated infrastructure expenses
              </p>
            </div>
            <M3Button
              variant="text"
              size="sm"
              icon={<ArrowUpRight className="w-4 h-4" />}
              onClick={() => onNavigate('analytics')}
            >
              Detailed Analytics
            </M3Button>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--m3-primary)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--m3-primary)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--m3-tertiary)" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="var(--m3-tertiary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--m3-outline-variant)" opacity={0.5} />
                <XAxis dataKey="month" stroke="var(--m3-on-surface-variant)" fontSize={11} />
                <YAxis stroke="var(--m3-on-surface-variant)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--m3-surface-container-high)',
                    borderColor: 'var(--m3-outline-variant)',
                    borderRadius: '16px',
                    color: 'var(--m3-on-surface)',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--m3-primary)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                  name="Billed ($)"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="var(--m3-tertiary)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorExp)"
                  name="Operating ($)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </M3Card>

        {/* Quick Calendar & Upcoming Meetings (1 Col) */}
        <M3Card variant="filled" className="p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[var(--m3-primary)]" />
                <h2 className="text-base font-semibold text-[var(--m3-on-surface)]">
                  Upcoming Meetings
                </h2>
              </div>
              <button
                onClick={() => onNavigate('calendar')}
                className="text-xs font-semibold text-[var(--m3-primary)] hover:underline cursor-pointer"
              >
                Calendar View
              </button>
            </div>

            <div className="space-y-3">
              {calendarEvents.slice(0, 3).map((event) => (
                <div
                  key={event.id}
                  className="p-3 rounded-2xl bg-[var(--m3-surface-container-lowest)] border border-[var(--m3-outline-variant)] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[var(--m3-on-surface)] truncate">
                      {event.title}
                    </span>
                    <M3Badge variant="primary" size="sm">
                      {event.type}
                    </M3Badge>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[var(--m3-on-surface-variant)]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {event.date} • {event.time}
                    </span>
                    <a
                      href={event.meetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-semibold text-[var(--m3-primary)] hover:underline"
                    >
                      Google Meet ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <M3Button
            variant="tonal"
            size="sm"
            className="w-full"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => onNavigate('calendar')}
          >
            Schedule Strategy Sync
          </M3Button>
        </M3Card>
      </div>

      {/* Projects Velocity & Recent Deliverable Files */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Projects Status */}
        <M3Card variant="filled" className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[var(--m3-on-surface)]">
              Active Project Milestones
            </h2>
            <button
              onClick={() => onNavigate('projects')}
              className="text-xs font-semibold text-[var(--m3-primary)] hover:underline cursor-pointer"
            >
              All Projects ({projects.length})
            </button>
          </div>

          <div className="space-y-3">
            {projects.slice(0, 3).map((proj) => (
              <div
                key={proj.id}
                className="p-4 rounded-2xl bg-[var(--m3-surface-container-lowest)] border border-[var(--m3-outline-variant)] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-xs text-[var(--m3-on-surface)]">
                      {proj.title}
                    </h3>
                    <p className="text-[11px] text-[var(--m3-on-surface-variant)]">
                      Lead: {proj.lead} • Due {proj.dueDate}
                    </p>
                  </div>
                  <M3Badge
                    variant={proj.health === 'Healthy' ? 'success' : 'warning'}
                    size="sm"
                  >
                    {proj.health}
                  </M3Badge>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[var(--m3-on-surface-variant)]">Completion Progress</span>
                    <span className="font-semibold text-[var(--m3-on-surface)]">{proj.progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[var(--m3-surface-container-highest)] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[var(--m3-primary)] transition-all duration-500"
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </M3Card>

        {/* Recent File Deliverables */}
        <M3Card variant="filled" className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[var(--m3-on-surface)]">
              Recent Files & Contract Assets
            </h2>
            <button
              onClick={() => onNavigate('files')}
              className="text-xs font-semibold text-[var(--m3-primary)] hover:underline cursor-pointer"
            >
              Open File Manager
            </button>
          </div>

          <div className="space-y-2">
            {files.slice(0, 4).map((file) => (
              <div
                key={file.id}
                className="p-3 rounded-2xl bg-[var(--m3-surface-container-lowest)] border border-[var(--m3-outline-variant)] flex items-center justify-between hover:bg-[var(--m3-surface-container-low)] transition-colors"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2.5 rounded-xl bg-[var(--m3-primary-container)] text-[var(--m3-on-primary-container)]">
                    <FileText className="w-4 h-4 text-[var(--m3-primary)]" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-semibold text-xs text-[var(--m3-on-surface)] truncate">
                      {file.name}
                    </p>
                    <p className="text-[11px] text-[var(--m3-on-surface-variant)]">
                      {file.folder} • {file.size} • {file.updatedAt}
                    </p>
                  </div>
                </div>

                <M3Button
                  variant="text"
                  size="sm"
                  icon={<Download className="w-4 h-4" />}
                  onClick={() => alert(`Downloading ${file.name}`)}
                />
              </div>
            ))}
          </div>
        </M3Card>
      </div>
    </div>
  );
};
