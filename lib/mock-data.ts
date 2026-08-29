export interface CompanyProfile {
  name: string;
  plan: string;
  accountManager: {
    name: string;
    email: string;
    role: string;
    avatar: string;
  };
  clientName: string;
  clientEmail: string;
  clientAvatar: string;
  industry: string;
  taxId: string;
  billingAddress: string;
}

export interface KPIMetric {
  id: string;
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  subtext: string;
  iconName: string;
  sparkline: number[];
}

export interface Project {
  id: string;
  title: string;
  category: string;
  progress: number;
  status: 'In Progress' | 'In Review' | 'Completed' | 'On Hold';
  health: 'Healthy' | 'At Risk' | 'Needs Attention';
  budget: string;
  spent: string;
  dueDate: string;
  lead: string;
  team: string[];
  tasksCount: { completed: number; total: number };
  description: string;
}

export interface Task {
  id: string;
  title: string;
  projectId: string;
  projectTitle: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Todo' | 'In Progress' | 'Under Review' | 'Done';
  assignee: { name: string; avatar: string };
  dueDate: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  amount: number;
  tax: number;
  total: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  items: InvoiceItem[];
  notes?: string;
  paymentMethod?: string;
}

export interface Contract {
  id: string;
  title: string;
  type: string;
  value: string;
  status: 'Active' | 'Pending Signature' | 'Renewed' | 'Expired';
  startDate: string;
  endDate: string;
  signedByClient: boolean;
  signedByProvider: boolean;
  fileSize: string;
}

export interface FileItem {
  id: string;
  name: string;
  folder: 'Contracts' | 'Deliverables' | 'Invoices' | 'Brand Assets' | 'Reports';
  size: string;
  updatedAt: string;
  type: 'pdf' | 'png' | 'doc' | 'csv' | 'zip' | 'figma';
  version: string;
  author: string;
}

export interface Message {
  id: string;
  channelId: string;
  sender: { name: string; avatar: string; role: 'Client' | 'Account Lead' | 'Support' | 'AI Assistant' };
  content: string;
  timestamp: string;
  attachments?: string[];
  isAiResponse?: boolean;
}

export interface Channel {
  id: string;
  name: string;
  topic: string;
  unreadCount: number;
  iconName: string;
}

export type AUXState = 'Available' | 'On Case' | 'In Meeting' | 'On Break' | 'Training' | 'Offline';

export interface AgentProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'Admin Lead' | 'Senior Support Specialist' | 'Tier-1 Resolution Agent' | 'Billing Advocate' | 'IT Escalation Specialist';
  department: 'Helpdesk' | 'Technical Operations' | 'Billing & Accounts' | 'Escalations';
  status: AUXState;
  statusSince: string;
  activeCaseId?: string;
  resolvedToday: number;
  rating: number;
}

export interface SupportTicketMessage {
  id: string;
  sender: string;
  role: 'Client' | 'Agent' | 'System';
  text: string;
  time: string;
  channel: 'Email' | 'Chat';
  emailSubject?: string;
  cc?: string[];
  attachments?: string[];
}

export interface SupportTicket {
  id: string;
  ticketNo: string;
  subject: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low' | 'Urgent';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Waiting for Client' | 'Escalated' | 'Closed';
  channel: 'Email' | 'Chat';
  createdAt: string;
  lastUpdated: string;
  clientName: string;
  clientEmail: string;
  clientAvatar?: string;
  assignedAgent?: AgentProfile;
  slaDue: string;
  slaBreached: boolean;
  repliesCount: number;
  messages: SupportTicketMessage[];
}

export interface CrmAnnotation {
  id: string;
  author: string;
  authorRole: string;
  avatar?: string;
  text: string;
  tag: 'VIP Account' | 'Follow-up Required' | 'Billing Concern' | 'Technical Spec' | 'Contract Review';
  createdAt: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  module: 'Ticketing' | 'CRM' | 'Emailing' | 'Billing' | 'Security' | 'System';
  action: string;
  severity: 'Info' | 'Warning' | 'Critical' | 'Security Flag';
  details: string;
  ipAddress: string;
  location: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  duration: string;
  type: 'Milestone' | 'Strategy Call' | 'Sprint Review' | 'Billing Sync';
  attendees: { name: string; avatar: string }[];
  meetUrl: string;
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  ipAddress: string;
  location: string;
  device: string;
  status: 'Success' | 'Flagged' | 'Failed';
}

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  createdDate: string;
  lastUsed: string;
  status: 'Active' | 'Revoked';
  environment: 'Production' | 'Staging';
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: 'Billing & Payments' | 'Project Milestones' | 'Security & Access' | 'Support Guidelines';
  readTime: string;
  helpfulCount: number;
  summary: string;
  content: string;
}

export const INITIAL_COMPANY_PROFILE: CompanyProfile = {
  name: 'Apex Digital Systems',
  plan: 'Enterprise Workspace Tier',
  accountManager: {
    name: 'Elena Rostova',
    email: 'elena.rostova@workspace.google.app',
    role: 'Principal Solutions Architect',
    avatar: 'https://picsum.photos/seed/elena/120/120',
  },
  clientName: 'Julian Vance',
  clientEmail: 'julian.vance@apexdigital.com',
  clientAvatar: 'https://picsum.photos/seed/julian/120/120',
  industry: 'Enterprise Software & Cloud AI',
  taxId: 'US-948201948',
  billingAddress: '550 Howard Street, Suite 800, San Francisco, CA 94105',
};

export const INITIAL_KPI_METRICS: KPIMetric[] = [
  {
    id: 'kpi-revenue',
    label: 'YTD Total Billing',
    value: '$148,250.00',
    change: '+18.4% vs Q2',
    isPositive: true,
    subtext: 'Next invoice due in 6 days',
    iconName: 'DollarSign',
    sparkline: [85, 92, 105, 118, 128, 148],
  },
  {
    id: 'kpi-projects',
    label: 'Active Workspace Projects',
    value: '8 / 12',
    change: '2 On Schedule',
    isPositive: true,
    subtext: 'Next milestone: Aug 04',
    iconName: 'Briefcase',
    sparkline: [4, 5, 7, 6, 8, 8],
  },
  {
    id: 'kpi-invoices',
    label: 'Pending Invoices',
    value: '$14,500.00',
    change: '1 Due Soon',
    isPositive: false,
    subtext: 'Invoice #INV-2026-089',
    iconName: 'Receipt',
    sparkline: [3, 2, 4, 1, 3, 2],
  },
  {
    id: 'kpi-tickets',
    label: 'Support SLA Status',
    value: '99.8%',
    change: '< 12m avg response',
    isPositive: true,
    subtext: '1 Open Support Ticket',
    iconName: 'ShieldCheck',
    sparkline: [98, 99, 99.5, 99.2, 99.8, 99.8],
  },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Cloud Core AI Pipeline Integration',
    category: 'Infrastructure & AI',
    progress: 78,
    status: 'In Progress',
    health: 'Healthy',
    budget: '$65,000',
    spent: '$48,200',
    dueDate: '2026-08-15',
    lead: 'Marcus Vance',
    team: ['Elena R.', 'Marcus V.', 'David K.'],
    tasksCount: { completed: 28, total: 36 },
    description: 'Enterprise Gemini 3 AI API integration with automated telemetry and multi-region Cloud Run fallback.',
  },
  {
    id: 'proj-2',
    title: 'Design System Material You Migration',
    category: 'UI/UX & Frontend',
    progress: 92,
    status: 'In Review',
    health: 'Healthy',
    budget: '$32,000',
    spent: '$29,400',
    dueDate: '2026-08-01',
    lead: 'Sophia Chen',
    team: ['Sophia C.', 'Liam P.'],
    tasksCount: { completed: 23, total: 25 },
    description: 'Full adoption of Google Material Design 3 tokens, dynamic color schemes, and 60fps Material Motion animations.',
  },
  {
    id: 'proj-3',
    title: 'SecOps Audit & SOC2 Type II Compliance',
    category: 'Security',
    progress: 45,
    status: 'In Progress',
    health: 'Needs Attention',
    budget: '$45,000',
    spent: '$21,000',
    dueDate: '2026-09-10',
    lead: 'David Kim',
    team: ['David K.', 'Elena R.'],
    tasksCount: { completed: 9, total: 20 },
    description: 'Implementation of continuous security audit logging, RBAC key management, and Cloud SQL backup automation.',
  },
  {
    id: 'proj-4',
    title: 'Client Portal Mobile App PWA',
    category: 'Mobile Engineering',
    progress: 100,
    status: 'Completed',
    health: 'Healthy',
    budget: '$28,000',
    spent: '$28,000',
    dueDate: '2026-07-15',
    lead: 'Elena Rostova',
    team: ['Elena R.', 'Liam P.'],
    tasksCount: { completed: 18, total: 18 },
    description: 'Progressive Web App launch with offline document caching, instant biometric auth, and push notifications.',
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-101',
    title: 'Verify Gemini 3.6 API Server Route Latency',
    projectId: 'proj-1',
    projectTitle: 'Cloud Core AI Pipeline Integration',
    priority: 'High',
    status: 'In Progress',
    assignee: { name: 'Marcus Vance', avatar: 'https://picsum.photos/seed/marcus/80/80' },
    dueDate: '2026-07-30',
  },
  {
    id: 'task-102',
    title: 'Review Material You Dark Palette Contrast Ratio (WCAG AA+)',
    projectId: 'proj-2',
    projectTitle: 'Design System Material You Migration',
    priority: 'Medium',
    status: 'Under Review',
    assignee: { name: 'Sophia Chen', avatar: 'https://picsum.photos/seed/sophia/80/80' },
    dueDate: '2026-07-29',
  },
  {
    id: 'task-103',
    title: 'Generate SOC2 Key Rotation Audit Report',
    projectId: 'proj-3',
    projectTitle: 'SecOps Audit & SOC2 Type II Compliance',
    priority: 'High',
    status: 'Todo',
    assignee: { name: 'David Kim', avatar: 'https://picsum.photos/seed/david/80/80' },
    dueDate: '2026-08-05',
  },
  {
    id: 'task-104',
    title: 'Finalize Q3 Statement of Work Signatures',
    projectId: 'proj-1',
    projectTitle: 'Cloud Core AI Pipeline Integration',
    priority: 'High',
    status: 'Done',
    assignee: { name: 'Elena Rostova', avatar: 'https://picsum.photos/seed/elena/80/80' },
    dueDate: '2026-07-26',
  },
  {
    id: 'task-105',
    title: 'Optimize Recharts Rendering with React 19 memo',
    projectId: 'proj-2',
    projectTitle: 'Design System Material You Migration',
    priority: 'Low',
    status: 'In Progress',
    assignee: { name: 'Liam Patel', avatar: 'https://picsum.photos/seed/liam/80/80' },
    dueDate: '2026-08-02',
  },
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-089',
    invoiceNumber: 'INV-2026-089',
    date: '2026-07-15',
    dueDate: '2026-08-04',
    amount: 14500,
    tax: 1160,
    total: 15660,
    status: 'Pending',
    items: [
      { description: 'Cloud AI Pipeline Sprint 4 Deliverables', quantity: 1, rate: 9500, amount: 9500 },
      { description: 'Material 3 UI Component Library Refactoring', quantity: 1, rate: 5000, amount: 5000 },
    ],
    notes: 'Payment terms: Net 20. Automated ACH or Corporate Card enabled.',
  },
  {
    id: 'inv-088',
    invoiceNumber: 'INV-2026-088',
    date: '2026-06-30',
    dueDate: '2026-07-15',
    amount: 28000,
    tax: 2240,
    total: 30240,
    status: 'Paid',
    paymentMethod: 'Corporate ACH Direct Pay',
    items: [
      { description: 'PWA Mobile Web Architecture Milestone 2', quantity: 1, rate: 28000, amount: 28000 },
    ],
    notes: 'Paid in full on July 14, 2026.',
  },
  {
    id: 'inv-087',
    invoiceNumber: 'INV-2026-087',
    date: '2026-06-01',
    dueDate: '2026-06-20',
    amount: 32500,
    tax: 2600,
    total: 35100,
    status: 'Paid',
    paymentMethod: 'Wire Transfer',
    items: [
      { description: 'Enterprise Google AI Studio Applet Architecture & Consulting', quantity: 1, rate: 32500, amount: 32500 },
    ],
    notes: 'Paid in full on June 18, 2026.',
  },
];

export const INITIAL_CONTRACTS: Contract[] = [
  {
    id: 'contract-01',
    title: 'Master Services Agreement (MSA) - Apex Tech',
    type: 'MSA',
    value: '$250,000 / Year',
    status: 'Active',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    signedByClient: true,
    signedByProvider: true,
    fileSize: '2.4 MB',
  },
  {
    id: 'contract-02',
    title: 'Statement of Work (SOW-04) - Cloud AI Pipeline',
    type: 'SOW',
    value: '$65,000',
    status: 'Active',
    startDate: '2026-05-01',
    endDate: '2026-08-30',
    signedByClient: true,
    signedByProvider: true,
    fileSize: '1.8 MB',
  },
  {
    id: 'contract-03',
    title: 'SOW-05 Extension - SOC2 Security Infrastructure',
    type: 'SOW',
    value: '$45,000',
    status: 'Pending Signature',
    startDate: '2026-08-01',
    endDate: '2026-11-30',
    signedByClient: false,
    signedByProvider: true,
    fileSize: '1.2 MB',
  },
];

export const INITIAL_FILES: FileItem[] = [
  {
    id: 'file-1',
    name: 'MSA_Signed_ApexDigital_2026.pdf',
    folder: 'Contracts',
    size: '2.4 MB',
    updatedAt: '2026-01-05',
    type: 'pdf',
    version: 'v1.2',
    author: 'Elena Rostova',
  },
  {
    id: 'file-2',
    name: 'SOW_Cloud_AI_Pipeline_v2.pdf',
    folder: 'Contracts',
    size: '1.8 MB',
    updatedAt: '2026-04-28',
    type: 'pdf',
    version: 'v2.0',
    author: 'Elena Rostova',
  },
  {
    id: 'file-3',
    name: 'MaterialYou_DesignSystem_FigmaTokens.zip',
    folder: 'Brand Assets',
    size: '48.5 MB',
    updatedAt: '2026-07-20',
    type: 'zip',
    version: 'v3.1',
    author: 'Sophia Chen',
  },
  {
    id: 'file-4',
    name: 'Q2_Financial_Billing_Summary.csv',
    folder: 'Invoices',
    size: '340 KB',
    updatedAt: '2026-07-15',
    type: 'csv',
    version: 'v1.0',
    author: 'Billing Automation',
  },
  {
    id: 'file-5',
    name: 'Security_Architecture_SOC2_Diagram.png',
    folder: 'Deliverables',
    size: '4.2 MB',
    updatedAt: '2026-07-22',
    type: 'png',
    version: 'v1.1',
    author: 'David Kim',
  },
];

export const INITIAL_CHANNELS: Channel[] = [
  { id: 'chan-general', name: 'general-updates', topic: 'General client announcements and broad milestone updates', unreadCount: 2, iconName: 'MessageSquare' },
  { id: 'chan-project-alpha', name: 'cloud-ai-pipeline', topic: 'Technical discussion regarding Gemini 3 API & Cloud Run deployment', unreadCount: 0, iconName: 'Briefcase' },
  { id: 'chan-billing', name: 'billing-and-invoices', topic: 'Inquiries about invoices, ACH payments, and rate schedules', unreadCount: 1, iconName: 'DollarSign' },
  { id: 'chan-support', name: 'priority-support', topic: '24/7 SLA escalation for urgent infrastructure incidents', unreadCount: 0, iconName: 'HelpCircle' },
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    channelId: 'chan-general',
    sender: { name: 'Elena Rostova', avatar: 'https://picsum.photos/seed/elena/80/80', role: 'Account Lead' },
    content: 'Welcome to your upgraded Material Design 3 Client Portal! You can track projects, download invoices, review contracts, and invoke Gemini AI directly from the header.',
    timestamp: 'Today at 08:30 AM',
  },
  {
    id: 'msg-2',
    channelId: 'chan-general',
    sender: { name: 'Julian Vance', avatar: 'https://picsum.photos/seed/julian/80/80', role: 'Client' },
    content: 'Thanks Elena! The new Material You dynamic colors and responsive layout look incredible. We just reviewed Invoice #INV-2026-089.',
    timestamp: 'Today at 08:45 AM',
  },
  {
    id: 'msg-3',
    channelId: 'chan-billing',
    sender: { name: 'Elena Rostova', avatar: 'https://picsum.photos/seed/elena/80/80', role: 'Account Lead' },
    content: 'Hi Julian! Invoice #INV-2026-089 for $15,660.00 is ready. You can test instant payment processing right in the Invoices tab.',
    timestamp: 'Yesterday at 04:15 PM',
  },
];

export const INITIAL_AGENTS: AgentProfile[] = [
  {
    id: 'agent-1',
    name: 'Elena Rostova',
    email: 'elena.rostova@operavadesk.com',
    avatar: 'https://picsum.photos/seed/elena/120/120',
    role: 'Admin Lead',
    department: 'Helpdesk',
    status: 'Available',
    statusSince: '08:00 AM (02h 35m)',
    resolvedToday: 6,
    rating: 4.95,
  },
  {
    id: 'agent-2',
    name: 'David Kim',
    email: 'david.kim@operavadesk.com',
    avatar: 'https://picsum.photos/seed/david/120/120',
    role: 'IT Escalation Specialist',
    department: 'Escalations',
    status: 'On Case',
    statusSince: '09:45 AM (00h 50m)',
    activeCaseId: 'SUP-9482',
    resolvedToday: 4,
    rating: 4.88,
  },
  {
    id: 'agent-3',
    name: 'Marcus Vance',
    email: 'marcus.vance@operavadesk.com',
    avatar: 'https://picsum.photos/seed/marcus/120/120',
    role: 'Senior Support Specialist',
    department: 'Technical Operations',
    status: 'On Case',
    statusSince: '10:15 AM (00h 20m)',
    activeCaseId: 'SUP-9501',
    resolvedToday: 8,
    rating: 4.92,
  },
  {
    id: 'agent-4',
    name: 'Sophia Chen',
    email: 'sophia.chen@operavadesk.com',
    avatar: 'https://picsum.photos/seed/sophia/120/120',
    role: 'Tier-1 Resolution Agent',
    department: 'Helpdesk',
    status: 'In Meeting',
    statusSince: '10:00 AM (00h 35m)',
    resolvedToday: 3,
    rating: 4.79,
  },
  {
    id: 'agent-5',
    name: 'Liam Patel',
    email: 'liam.patel@operavadesk.com',
    avatar: 'https://picsum.photos/seed/liam/120/120',
    role: 'Billing Advocate',
    department: 'Billing & Accounts',
    status: 'On Break',
    statusSince: '10:25 AM (00h 10m)',
    resolvedToday: 5,
    rating: 4.86,
  },
];

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'ticket-1',
    ticketNo: 'SUP-9482',
    subject: 'Cloud Run SSL Certificate Auto-Renewal Verification',
    category: 'Infrastructure & Security',
    priority: 'High',
    status: 'In Progress',
    channel: 'Email',
    createdAt: '2026-07-27 14:20',
    lastUpdated: '10 mins ago',
    clientName: 'Julian Vance',
    clientEmail: 'julian.vance@apexdigital.com',
    clientAvatar: 'https://picsum.photos/seed/julian/120/120',
    assignedAgent: {
      id: 'agent-2',
      name: 'David Kim',
      email: 'david.kim@operavadesk.com',
      avatar: 'https://picsum.photos/seed/david/120/120',
      role: 'IT Escalation Specialist',
      department: 'Escalations',
      status: 'On Case',
      statusSince: '09:45 AM',
      resolvedToday: 4,
      rating: 4.88,
    },
    slaDue: 'In 24 mins (SLA Target: 2h)',
    slaBreached: false,
    repliesCount: 3,
    messages: [
      {
        id: 'msg-tk-1',
        sender: 'Julian Vance',
        role: 'Client',
        text: 'Hello Operava Desk Team,\n\nPlease verify if the custom domain TLS cert for our staging environment (api-stg.apexdigital.com) was auto-renewed by Let\'s Encrypt before our Friday release.',
        time: '2026-07-27 14:20',
        channel: 'Email',
        emailSubject: 'Re: Cloud Run SSL Certificate Auto-Renewal Verification',
      },
      {
        id: 'msg-tk-2',
        sender: 'David Kim',
        role: 'Agent',
        text: 'Hi Julian,\n\nI am inspecting the Cloud Run managed certificate status in GCP SecOps console. The SSL certificate is active, green, and valid until October 2026 with automated RSA 2048 key rotation enabled.',
        time: '2026-07-27 14:35',
        channel: 'Email',
        emailSubject: 'RE: Cloud Run SSL Certificate Auto-Renewal Verification',
      },
      {
        id: 'msg-tk-3',
        sender: 'Julian Vance',
        role: 'Client',
        text: 'Awesome, thanks David! Quick question: is HTTP/2 fallback active on port 443?',
        time: '10 mins ago',
        channel: 'Chat',
      },
    ],
  },
  {
    id: 'ticket-2',
    ticketNo: 'SUP-9501',
    subject: 'Gemini 3.5 API Rate Limit Scaling for High Volume Batch',
    category: 'AI Pipeline',
    priority: 'Urgent',
    status: 'Open',
    channel: 'Chat',
    createdAt: '2026-07-28 09:10',
    lastUpdated: '5 mins ago',
    clientName: 'Dr. Sarah Lin',
    clientEmail: 'sarah.lin@vertexbio.com',
    clientAvatar: 'https://picsum.photos/seed/sarah/120/120',
    assignedAgent: {
      id: 'agent-3',
      name: 'Marcus Vance',
      email: 'marcus.vance@operavadesk.com',
      avatar: 'https://picsum.photos/seed/marcus/120/120',
      role: 'Senior Support Specialist',
      department: 'Technical Operations',
      status: 'On Case',
      statusSince: '10:15 AM',
      resolvedToday: 8,
      rating: 4.92,
    },
    slaDue: 'In 12 mins (SLA Target: 15m Urgent)',
    slaBreached: false,
    repliesCount: 2,
    messages: [
      {
        id: 'msg-tk-4',
        sender: 'Dr. Sarah Lin',
        role: 'Client',
        text: 'Hi Operava Desk Live Chat, we are running a 50,000 document embedding sequence today. Need temporary quota expansion to 1,000 TPM on Gemini 3.5 Flash.',
        time: '2026-07-28 09:10',
        channel: 'Chat',
      },
      {
        id: 'msg-tk-5',
        sender: 'Marcus Vance',
        role: 'Agent',
        text: 'Hello Dr. Sarah! Processing temporary quota burst right now via Google Cloud AI Quota Manager. Stand by for confirmation in 2 mins.',
        time: '5 mins ago',
        channel: 'Chat',
      },
    ],
  },
  {
    id: 'ticket-3',
    ticketNo: 'SUP-9410',
    subject: 'Request for Additional Developer Tokens on Security Portal',
    category: 'Access & Tokens',
    priority: 'Low',
    status: 'Resolved',
    channel: 'Email',
    createdAt: '2026-07-20 09:15',
    lastUpdated: '5 days ago',
    clientName: 'Julian Vance',
    clientEmail: 'julian.vance@apexdigital.com',
    clientAvatar: 'https://picsum.photos/seed/julian/120/120',
    assignedAgent: {
      id: 'agent-1',
      name: 'Elena Rostova',
      email: 'elena.rostova@operavadesk.com',
      avatar: 'https://picsum.photos/seed/elena/120/120',
      role: 'Admin Lead',
      department: 'Helpdesk',
      status: 'Available',
      statusSince: '08:00 AM',
      resolvedToday: 6,
      rating: 4.95,
    },
    slaDue: 'SLA Met',
    slaBreached: false,
    repliesCount: 2,
    messages: [
      {
        id: 'msg-tk-6',
        sender: 'Julian Vance',
        role: 'Client',
        text: 'We need 3 new developer API tokens for our mobile team.',
        time: '2026-07-20 09:15',
        channel: 'Email',
      },
      {
        id: 'msg-tk-7',
        sender: 'Elena Rostova',
        role: 'Agent',
        text: 'Tokens provisioned and available in your Operava Desk Security tab.',
        time: '2026-07-20 10:00',
        channel: 'Email',
      },
    ],
  },
];

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'event-1',
    title: 'Q3 Executive Strategy & AI Roadmap Sync',
    date: '2026-07-29',
    time: '10:00 AM - 11:00 AM',
    duration: '60 min',
    type: 'Strategy Call',
    attendees: [
      { name: 'Elena Rostova', avatar: 'https://picsum.photos/seed/elena/80/80' },
      { name: 'Julian Vance', avatar: 'https://picsum.photos/seed/julian/80/80' },
      { name: 'Marcus Vance', avatar: 'https://picsum.photos/seed/marcus/80/80' },
    ],
    meetUrl: 'https://meet.google.com/abc-defg-hij',
  },
  {
    id: 'event-2',
    title: 'Material 3 Design Tokens Handative Review',
    date: '2026-08-01',
    time: '02:00 PM - 02:45 PM',
    duration: '45 min',
    type: 'Sprint Review',
    attendees: [
      { name: 'Sophia Chen', avatar: 'https://picsum.photos/seed/sophia/80/80' },
      { name: 'Julian Vance', avatar: 'https://picsum.photos/seed/julian/80/80' },
    ],
    meetUrl: 'https://meet.google.com/xyz-uvwx-rst',
  },
  {
    id: 'event-3',
    title: 'Bi-weekly Invoicing & Budget Alignment',
    date: '2026-08-05',
    time: '11:30 AM - 12:00 PM',
    duration: '30 min',
    type: 'Billing Sync',
    attendees: [
      { name: 'Elena Rostova', avatar: 'https://picsum.photos/seed/elena/80/80' },
      { name: 'Julian Vance', avatar: 'https://picsum.photos/seed/julian/80/80' },
    ],
    meetUrl: 'https://meet.google.com/mno-pqrs-tuv',
  },
];

export const INITIAL_SECURITY_LOGS: SecurityAuditLog[] = [
  {
    id: 'log-101',
    timestamp: '2026-07-28 09:05:12',
    user: 'julian.vance@apexdigital.com',
    action: 'Client Portal Login via Google OAuth 2.0',
    ipAddress: '192.0.2.45',
    location: 'San Francisco, CA, USA',
    device: 'Chrome 127 on macOS Sequoia',
    status: 'Success',
  },
  {
    id: 'log-102',
    timestamp: '2026-07-27 16:42:00',
    user: 'julian.vance@apexdigital.com',
    action: 'Generated New API Token: Prod-Gemini-Pipeline-01',
    ipAddress: '192.0.2.45',
    location: 'San Francisco, CA, USA',
    device: 'Chrome 127 on macOS Sequoia',
    status: 'Success',
  },
  {
    id: 'log-103',
    timestamp: '2026-07-26 11:18:22',
    user: 'unknown.attempt@cloud.external',
    action: 'Unrecognized API Token Authorization Header',
    ipAddress: '198.51.100.89',
    location: 'Frankfurt, DE',
    device: 'Python-requests/2.31',
    status: 'Flagged',
  },
];

export const INITIAL_API_KEYS: ApiKey[] = [
  {
    id: 'key-1',
    name: 'Production Gemini AI Pipeline Key',
    prefix: 'ai_live_pk_9842...',
    createdDate: '2026-05-12',
    lastUsed: '2 minutes ago',
    status: 'Active',
    environment: 'Production',
  },
  {
    id: 'key-2',
    name: 'Staging Webhook Notification Token',
    prefix: 'ai_stg_pk_1094...',
    createdDate: '2026-06-01',
    lastUsed: 'Yesterday',
    status: 'Active',
    environment: 'Staging',
  },
];

export const INITIAL_KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'kb-1',
    title: 'Understanding net-20 billing and ACH transfer processing times',
    category: 'Billing & Payments',
    readTime: '3 min read',
    helpfulCount: 42,
    summary: 'Everything you need to know about corporate ACH settlement, invoice payment receipts, and tax calculations.',
    content: `All invoices generated within the Google Workspace Client Portal carry net-20 default terms unless specified in your Master Services Agreement (MSA).\n\nWhen paying via ACH Direct Transfer, funds clear within 1-2 business days. An automated electronic receipt with full breakdown will be archived in your Files Manager under /Invoices.`,
  },
  {
    id: 'kb-2',
    title: 'How to invoke Gemini AI Assistant for instant project summaries',
    category: 'Project Milestones',
    readTime: '2 min read',
    helpfulCount: 89,
    summary: 'Use the top app bar AI button or press Ctrl+K to ask Gemini about sprint progress, invoice details, or support SLAs.',
    content: `The built-in Gemini AI Assistant uses server-side Google GenAI with gemini-3.6-flash. You can click the Gemini icon on the top right or open the Command Palette (Ctrl+K) to type natural language commands such as:\n- "Give me a summary of invoice INV-2026-089"\n- "What are our upcoming project milestones?"\n- "Draft a support response for ticket SUP-9482"`,
  },
  {
    id: 'kb-3',
    title: 'Security, API Token Rotation, and SOC2 Audit Compliance',
    category: 'Security & Access',
    readTime: '4 min read',
    helpfulCount: 61,
    summary: 'Guidelines on creating production API keys, configuring IP allowlists, and downloading monthly security audit logs.',
    content: `API Keys generated in the Security & Audit tab are encrypted using AES-256 at rest. We recommend rotating production keys every 90 days. All authentication attempts and key generation actions are recorded in the Audit Log.`,
  },
];

// --- CRM & Client Relationship Types & Data ---
export interface CRMLead {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  stage: 'Lead' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
  dealValue: number;
  probability: number;
  leadScore: number;
  owner: string;
  lastContactDate: string;
  nextFollowUp: string;
  industry: string;
  notes: string;
  annotations?: CrmAnnotation[];
}

export const INITIAL_CRM_LEADS: CRMLead[] = [
  {
    id: 'crm-101',
    companyName: 'Vertex BioTech Dynamics',
    contactName: 'Dr. Sarah Lin',
    email: 'sarah.lin@vertexbio.com',
    phone: '+1 (415) 890-1234',
    stage: 'Negotiation',
    dealValue: 120000,
    probability: 85,
    leadScore: 92,
    owner: 'Elena Rostova',
    lastContactDate: '2026-07-27',
    nextFollowUp: '2026-07-30',
    industry: 'Healthcare & Biotech',
    notes: 'Master Services Agreement undergoing final legal redlines. Expecting contract signature before end of week.',
    annotations: [
      {
        id: 'ann-1',
        author: 'Elena Rostova',
        authorRole: 'Admin Lead',
        text: 'Client confirmed budget approval for $120k ARR. Legal requested custom indemnity clause for AI pipeline outputs.',
        tag: 'VIP Account',
        createdAt: '2026-07-27 15:30',
      },
      {
        id: 'ann-2',
        author: 'Marcus Vance',
        authorRole: 'Senior Support Specialist',
        text: 'Pre-onboarding security questionnaire completed. Sandbox API tokens issued.',
        tag: 'Technical Spec',
        createdAt: '2026-07-26 11:00',
      },
    ],
  },
  {
    id: 'crm-102',
    companyName: 'FinNova Global Capital',
    contactName: 'Marcus Sterling',
    email: 'm.sterling@finnova.io',
    phone: '+1 (212) 555-8910',
    stage: 'Proposal',
    dealValue: 85000,
    probability: 60,
    leadScore: 78,
    owner: 'Elena Rostova',
    lastContactDate: '2026-07-25',
    nextFollowUp: '2026-08-01',
    industry: 'Financial Technology',
    notes: 'Submitted proposal for Cloud Migration and Gemini Financial Intelligence Pipeline. Client requested security review.',
    annotations: [
      {
        id: 'ann-3',
        author: 'Liam Patel',
        authorRole: 'Billing Advocate',
        text: 'Requested custom billing terms (net-45) for corporate treasury review.',
        tag: 'Billing Concern',
        createdAt: '2026-07-25 10:15',
      },
    ],
  },
  {
    id: 'crm-103',
    companyName: 'AeroCloud Systems',
    contactName: 'David Vance',
    email: 'd.vance@aerocloud.net',
    phone: '+1 (310) 442-9988',
    stage: 'Qualified',
    dealValue: 45000,
    probability: 40,
    leadScore: 65,
    owner: 'Julian Vance',
    lastContactDate: '2026-07-22',
    nextFollowUp: '2026-08-02',
    industry: 'Aerospace & Defense',
    notes: 'Initial discovery call completed. High interest in Google Workspace migration & customized SLA support desk.',
    annotations: [
      {
        id: 'ann-4',
        author: 'David Kim',
        authorRole: 'IT Escalation Specialist',
        text: 'Requires FedRAMP compliance review before technical trial.',
        tag: 'Follow-up Required',
        createdAt: '2026-07-22 16:45',
      },
    ],
  },
  {
    id: 'crm-104',
    companyName: 'Apex Digital Systems',
    contactName: 'Julian Vance',
    email: 'julian.vance@apexdigital.com',
    phone: '+1 (415) 892-3091',
    stage: 'Closed Won',
    dealValue: 240000,
    probability: 100,
    leadScore: 98,
    owner: 'Elena Rostova',
    lastContactDate: '2026-07-28',
    nextFollowUp: '2026-08-15',
    industry: 'Enterprise Software & Cloud AI',
    notes: 'Active Enterprise Account. Annual SLA and Gemini Infrastructure contract renewed.',
    annotations: [
      {
        id: 'ann-5',
        author: 'Elena Rostova',
        authorRole: 'Admin Lead',
        text: 'Key account partner. Quarterly executive review scheduled for Aug 15.',
        tag: 'VIP Account',
        createdAt: '2026-07-28 09:00',
      },
    ],
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'audit-101',
    timestamp: '2026-07-28 10:24:18',
    actor: 'Elena Rostova',
    actorRole: 'Admin Lead',
    module: 'CRM',
    action: 'Added Sticky Annotation on Lead: Vertex BioTech',
    severity: 'Info',
    details: 'Annotated lead with VIP tag regarding legal MSA redlines and Q3 billing terms.',
    ipAddress: '192.0.2.14',
    location: 'San Francisco, CA',
  },
  {
    id: 'audit-102',
    timestamp: '2026-07-28 10:15:00',
    actor: 'Marcus Vance',
    actorRole: 'Senior Support Specialist',
    module: 'Ticketing',
    action: 'Agent AUX State Changed -> On Case (#SUP-9501)',
    severity: 'Info',
    details: 'Switched status to On Case for urgent Gemini rate limit scaling request from Dr. Sarah Lin.',
    ipAddress: '192.0.2.88',
    location: 'San Francisco, CA',
  },
  {
    id: 'audit-103',
    timestamp: '2026-07-28 09:30:12',
    actor: 'System Automation',
    actorRole: 'Operava Dispatcher',
    module: 'Emailing',
    action: 'Scheduled Email Campaign Queued',
    severity: 'Info',
    details: 'Queued "Q3 Infrastructure Maintenance & Billing Notice" for dispatch on 2026-08-01 08:00.',
    ipAddress: '10.0.4.12',
    location: 'Cloud Run us-central1',
  },
  {
    id: 'audit-104',
    timestamp: '2026-07-27 16:42:00',
    actor: 'Julian Vance',
    actorRole: 'Client Lead',
    module: 'Security',
    action: 'API Key Generated: Prod-Gemini-Pipeline-01',
    severity: 'Warning',
    details: 'Issued new production API token with permissions for Gemini generateContent and Cloud Run proxy.',
    ipAddress: '192.0.2.45',
    location: 'San Francisco, CA',
  },
  {
    id: 'audit-105',
    timestamp: '2026-07-26 11:18:22',
    actor: 'External Agent (Unrecognized)',
    actorRole: 'Guest',
    module: 'Security',
    action: 'Unrecognized Bearer Token Attempt Blocked',
    severity: 'Security Flag',
    details: 'HTTP 401 Unauthorized blocked at Cloud Run nginx reverse proxy layer.',
    ipAddress: '198.51.100.89',
    location: 'Frankfurt, DE',
  },
  {
    id: 'audit-106',
    timestamp: '2026-07-25 14:10:05',
    actor: 'Liam Patel',
    actorRole: 'Billing Advocate',
    module: 'Billing',
    action: 'Invoice Settlement Receipt Generated #INV-2026-089',
    severity: 'Info',
    details: 'Verified ACH settlement receipt for $15,660.00 from Apex Digital Systems.',
    ipAddress: '192.0.2.33',
    location: 'New York, NY',
  },
];

// --- Email Blasting & Broadcast Types & Data ---
export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  audienceSegment: 'All Enterprise Clients' | 'Key Decision Makers' | 'Billing Contacts' | 'Active Project Stakeholders';
  status: 'Draft' | 'Scheduled' | 'Sending' | 'Sent';
  sentCount: number;
  openRate: number;
  clickRate: number;
  scheduledDate: string;
  templateType: 'Monthly Newsletter' | 'Product Announcement' | 'Billing Alert' | 'Security Advisory';
  contentPreview: string;
}

export const INITIAL_EMAIL_CAMPAIGNS: EmailCampaign[] = [
  {
    id: 'camp-101',
    name: 'July 2026 Executive Newsletter & Gemini AI Upgrades',
    subject: '🚀 Google Workspace Client Portal: Gemini 3.5 Models & Security Upgrades',
    audienceSegment: 'All Enterprise Clients',
    status: 'Sent',
    sentCount: 1420,
    openRate: 68.4,
    clickRate: 34.2,
    scheduledDate: '2026-07-01 09:00',
    templateType: 'Monthly Newsletter',
    contentPreview: 'Dear Client Partner, Welcome to our July portal update featuring full Gemini AI integration, real-time invoice settlement, and enhanced SOC2 compliance tools...',
  },
  {
    id: 'camp-102',
    name: 'Q3 2026 Infrastructure Maintenance & Billing Cycle Notice',
    subject: '⚡ Scheduled Cloud Maintenance Notice & Auto-Billing Reminders',
    audienceSegment: 'Billing Contacts',
    status: 'Scheduled',
    sentCount: 0,
    openRate: 0,
    clickRate: 0,
    scheduledDate: '2026-08-01 08:00',
    templateType: 'Billing Alert',
    contentPreview: 'Important notice regarding automated monthly invoicing, ACH direct clearing schedules, and zero-downtime maintenance window for Cloud Run services...',
  },
  {
    id: 'camp-103',
    name: 'Critical Security Advisory: OAuth Token Rotation Best Practices',
    subject: '🛡️ Security Action Required: Review Active API Tokens & SAML SSO',
    audienceSegment: 'Key Decision Makers',
    status: 'Draft',
    sentCount: 0,
    openRate: 0,
    clickRate: 0,
    scheduledDate: '2026-08-10 10:00',
    templateType: 'Security Advisory',
    contentPreview: 'In accordance with SOC2 Type II standards, please review your active workspace API keys and team member access permissions in the portal...',
  },
];

// --- Monthly Notifications Schedule Types & Data ---
export interface MonthlyNotificationRule {
  id: string;
  title: string;
  description: string;
  dayOfMonth: number;
  time: string;
  channels: {
    portalBanner: boolean;
    emailBroadcast: boolean;
    smsAlert: boolean;
    workspaceChat: boolean;
  };
  recipientGroup: string;
  active: boolean;
  lastDispatched: string;
  nextDispatch: string;
  category: 'Billing' | 'SLA & Support' | 'Project Digest' | 'Security Audit';
}

export interface MonthlyDispatchLog {
  id: string;
  ruleTitle: string;
  dispatchedAt: string;
  recipientsCount: number;
  status: 'Delivered' | 'Pending' | 'Failed';
  summary: string;
}

export const INITIAL_MONTHLY_RULES: MonthlyNotificationRule[] = [
  {
    id: 'mrule-1',
    title: 'Monthly Statement & Auto-Billing Statement Alert',
    description: 'Automatically dispatches monthly invoice statement, itemized breakdown, and ACH payment instructions to client finance contacts.',
    dayOfMonth: 1,
    time: '08:00 AM',
    channels: {
      portalBanner: true,
      emailBroadcast: true,
      smsAlert: false,
      workspaceChat: true,
    },
    recipientGroup: 'Billing Contacts & Executive Sponsors',
    active: true,
    lastDispatched: '2026-07-01 08:00',
    nextDispatch: '2026-08-01 08:00',
    category: 'Billing',
  },
  {
    id: 'mrule-2',
    title: 'Monthly SLA Performance & Support Ticket Digest',
    description: 'Generates a monthly compliance report summarizing ticket resolution times, uptime metrics, and escalation response rates.',
    dayOfMonth: 15,
    time: '09:00 AM',
    channels: {
      portalBanner: true,
      emailBroadcast: true,
      smsAlert: false,
      workspaceChat: false,
    },
    recipientGroup: 'IT Leaders & Account Managers',
    active: true,
    lastDispatched: '2026-07-15 09:00',
    nextDispatch: '2026-08-15 09:00',
    category: 'SLA & Support',
  },
  {
    id: 'mrule-3',
    title: 'Monthly Project Milestones & Financial Burn Rate',
    description: 'Summarizes active milestone progress, budget expenditures, upcoming deliverable deadlines, and team task completion stats.',
    dayOfMonth: 28,
    time: '05:00 PM',
    channels: {
      portalBanner: true,
      emailBroadcast: true,
      smsAlert: true,
      workspaceChat: true,
    },
    recipientGroup: 'Project Managers & Stakeholders',
    active: true,
    lastDispatched: '2026-06-28 17:00',
    nextDispatch: '2026-07-28 17:00',
    category: 'Project Digest',
  },
  {
    id: 'mrule-4',
    title: 'Monthly Security Audit & API Key Review Reminder',
    description: 'Triggers automated security audit log summary, active token inventory, and flagged IP authorization alerts.',
    dayOfMonth: 5,
    time: '10:00 AM',
    channels: {
      portalBanner: true,
      emailBroadcast: true,
      smsAlert: false,
      workspaceChat: false,
    },
    recipientGroup: 'SecOps & Compliance Leads',
    active: true,
    lastDispatched: '2026-07-05 10:00',
    nextDispatch: '2026-08-05 10:00',
    category: 'Security Audit',
  },
];

export const INITIAL_MONTHLY_LOGS: MonthlyDispatchLog[] = [
  {
    id: 'disp-101',
    ruleTitle: 'Monthly Statement & Auto-Billing Statement Alert',
    dispatchedAt: '2026-07-01 08:00',
    recipientsCount: 24,
    status: 'Delivered',
    summary: 'Sent monthly invoice statement INV-2026-089 ($24,500.00) via Email & Portal notification.',
  },
  {
    id: 'disp-102',
    ruleTitle: 'Monthly SLA Performance & Support Ticket Digest',
    dispatchedAt: '2026-07-15 09:00',
    recipientsCount: 18,
    status: 'Delivered',
    summary: 'Dispatched SLA Compliance Digest (99.98% uptime, 14min average ticket first response time).',
  },
];

