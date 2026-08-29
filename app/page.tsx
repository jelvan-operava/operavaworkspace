'use client';

import React, { useState, useEffect } from 'react';
import { NavRail, ViewId } from '@/components/layout/NavRail';
import { TopAppBar } from '@/components/layout/TopAppBar';
import { MobileNav } from '@/components/layout/MobileNav';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { AIAssistantSheet } from '@/components/layout/AIAssistantSheet';
import { ThemeCustomizerModal } from '@/components/layout/ThemeCustomizerModal';
import { NotificationCenter, NotificationItem } from '@/components/layout/NotificationCenter';

// Views
import { DashboardView } from '@/components/views/DashboardView';
import { ProjectsView } from '@/components/views/ProjectsView';
import { InvoicesView } from '@/components/views/InvoicesView';
import { ContractsView } from '@/components/views/ContractsView';
import { FileManagerView } from '@/components/views/FileManagerView';
import { MessagesView } from '@/components/views/MessagesView';
import { SupportTicketsView } from '@/components/views/SupportTicketsView';
import { CalendarView } from '@/components/views/CalendarView';
import { AnalyticsView } from '@/components/views/AnalyticsView';
import { SecurityAuditView } from '@/components/views/SecurityAuditView';
import { KnowledgeBaseView } from '@/components/views/KnowledgeBaseView';
import { SettingsView } from '@/components/views/SettingsView';
import { CrmView } from '@/components/views/CrmView';
import { EmailBlastingView } from '@/components/views/EmailBlastingView';
import { MonthlyNotificationsView } from '@/components/views/MonthlyNotificationsView';
import { AuditLogsView } from '@/components/views/AuditLogsView';
import { ClientDashboardView } from '@/components/views/ClientDashboardView';

// Error Boundary & Skeletons
import { M3ErrorBoundary } from '@/components/ui/M3ErrorBoundary';

// Offline Storage Utility
import { offlineStorage } from '@/lib/offline-storage';

// Mock Data
import {
  INITIAL_COMPANY_PROFILE,
  INITIAL_KPI_METRICS,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_INVOICES,
  INITIAL_CONTRACTS,
  INITIAL_FILES,
  INITIAL_CHANNELS,
  INITIAL_MESSAGES,
  INITIAL_TICKETS,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_SECURITY_LOGS,
  INITIAL_KNOWLEDGE_ARTICLES,
  INITIAL_CRM_LEADS,
  INITIAL_EMAIL_CAMPAIGNS,
  INITIAL_MONTHLY_RULES,
  INITIAL_MONTHLY_LOGS,
  INITIAL_AGENTS,
  INITIAL_AUDIT_LOGS,
  KPIMetric,
  Project,
  Task,
  Invoice,
  Contract,
  FileItem,
  Channel,
  Message,
  SupportTicket,
  CalendarEvent,
  CompanyProfile,
  CRMLead,
  EmailCampaign,
  MonthlyNotificationRule,
  MonthlyDispatchLog,
  AgentProfile,
  AuditLogItem,
  AUXState,
  CrmAnnotation,
} from '@/lib/mock-data';

import { ColorTheme, THEME_SCHEMES, generateM3CssVariables } from '@/lib/m3-theme';

export default function ClientPortalHome() {
  // Theme State
  const [currentTheme, setCurrentTheme] = useState<ColorTheme>('google-blue');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Shell State
  const [activeView, setActiveView] = useState<ViewId>('dashboard');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAiSheetOpen, setIsAiSheetOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // App Data States with Offline Cache Initialization
  const [company, setCompany] = useState<CompanyProfile>(() => {
    if (typeof window === 'undefined') return INITIAL_COMPANY_PROFILE;
    return offlineStorage.loadData()?.company || INITIAL_COMPANY_PROFILE;
  });
  const [kpis, setKpis] = useState<KPIMetric[]>(INITIAL_KPI_METRICS);
  const [projects, setProjects] = useState<Project[]>(() => {
    if (typeof window === 'undefined') return INITIAL_PROJECTS;
    return offlineStorage.loadData()?.projects || INITIAL_PROJECTS;
  });
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window === 'undefined') return INITIAL_TASKS;
    return offlineStorage.loadData()?.tasks || INITIAL_TASKS;
  });
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    if (typeof window === 'undefined') return INITIAL_INVOICES;
    return offlineStorage.loadData()?.invoices || INITIAL_INVOICES;
  });
  const [contracts, setContracts] = useState<Contract[]>(() => {
    if (typeof window === 'undefined') return INITIAL_CONTRACTS;
    return offlineStorage.loadData()?.contracts || INITIAL_CONTRACTS;
  });
  const [files, setFiles] = useState<FileItem[]>(() => {
    if (typeof window === 'undefined') return INITIAL_FILES;
    return offlineStorage.loadData()?.files || INITIAL_FILES;
  });
  const [channels, setChannels] = useState<Channel[]>(INITIAL_CHANNELS);
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window === 'undefined') return INITIAL_MESSAGES;
    return offlineStorage.loadData()?.messages || INITIAL_MESSAGES;
  });
  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    if (typeof window === 'undefined') return INITIAL_TICKETS;
    return offlineStorage.loadData()?.tickets || INITIAL_TICKETS;
  });
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    if (typeof window === 'undefined') return INITIAL_CALENDAR_EVENTS;
    return offlineStorage.loadData()?.events || INITIAL_CALENDAR_EVENTS;
  });
  const [crmLeads, setCrmLeads] = useState<CRMLead[]>(() => {
    if (typeof window === 'undefined') return INITIAL_CRM_LEADS;
    return offlineStorage.loadData()?.crmLeads || INITIAL_CRM_LEADS;
  });
  const [emailCampaigns, setEmailCampaigns] = useState<EmailCampaign[]>(() => {
    if (typeof window === 'undefined') return INITIAL_EMAIL_CAMPAIGNS;
    return offlineStorage.loadData()?.emailCampaigns || INITIAL_EMAIL_CAMPAIGNS;
  });
  const [monthlyRules, setMonthlyRules] = useState<MonthlyNotificationRule[]>(() => {
    if (typeof window === 'undefined') return INITIAL_MONTHLY_RULES;
    return offlineStorage.loadData()?.monthlyRules || INITIAL_MONTHLY_RULES;
  });
  const [monthlyLogs, setMonthlyLogs] = useState<MonthlyDispatchLog[]>(() => {
    if (typeof window === 'undefined') return INITIAL_MONTHLY_LOGS;
    return offlineStorage.loadData()?.monthlyLogs || INITIAL_MONTHLY_LOGS;
  });
  const [agents, setAgents] = useState<AgentProfile[]>(() => {
    if (typeof window === 'undefined') return INITIAL_AGENTS;
    return offlineStorage.loadData()?.agents || INITIAL_AGENTS;
  });
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    if (typeof window === 'undefined') return INITIAL_AUDIT_LOGS;
    return offlineStorage.loadData()?.auditLogs || INITIAL_AUDIT_LOGS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Invoice #INV-2026-089 Issued',
      description: 'Monthly Cloud Infrastructure & Gemini API billing statement for $24,500 is ready.',
      timestamp: '10 min ago',
      read: false,
      type: 'invoice',
    },
    {
      id: 'notif-2',
      title: 'Project Milestone Achieved',
      description: 'Cloud Run PWA Migration reached 82% completion ahead of schedule.',
      timestamp: '1 hour ago',
      read: false,
      type: 'project',
    },
    {
      id: 'notif-3',
      title: 'Security Compliance Audit Passed',
      description: 'SOC2 Type II annual audit logs verified with zero discrepancies.',
      timestamp: '3 hours ago',
      read: true,
      type: 'security',
    },
  ]);

  // Service Worker Registration for PWA Offline Functionality
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(() => console.log('ServiceWorker registered successfully'))
        .catch((err) => console.log('ServiceWorker registration error:', err));
    }
  }, []);

  // Save changes to Offline Storage whenever data mutates
  useEffect(() => {
    offlineStorage.saveData({
      company,
      projects,
      tasks,
      invoices,
      contracts,
      files,
      messages,
      tickets,
      events,
      crmLeads,
      emailCampaigns,
      monthlyRules,
      monthlyLogs,
      agents,
      auditLogs,
    });
  }, [
    company,
    projects,
    tasks,
    invoices,
    contracts,
    files,
    messages,
    tickets,
    events,
    crmLeads,
    emailCampaigns,
    monthlyRules,
    monthlyLogs,
    agents,
    auditLogs,
  ]);

  // Handle CSS Theme inject
  useEffect(() => {
    const vars = generateM3CssVariables(currentTheme, isDarkMode);
    const root = document.documentElement;

    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [currentTheme, isDarkMode]);

  // Global Keyboard Shortcuts (Ctrl+K / Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers for state updates
  const handleToggleTaskStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const newStatus = t.status === 'Done' ? 'In Progress' : 'Done';
          return { ...t, status: newStatus };
        }
        return t;
      })
    );
  };

  const handleAddTask = (newTask: Omit<Task, 'id'>) => {
    const taskObj: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
    };
    setTasks((prev) => [taskObj, ...prev]);

    // Update project count
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === newTask.projectId) {
          return {
            ...p,
            tasksCount: {
              ...p.tasksCount,
              total: p.tasksCount.total + 1,
            },
          };
        }
        return p;
      })
    );
  };

  const handlePayInvoice = (invoiceId: string) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === invoiceId) {
          return {
            ...inv,
            status: 'Paid',
            paymentMethod: 'Corporate ACH Instant Settlement',
          };
        }
        return inv;
      })
    );

    // Update KPI metrics
    setKpis((prev) =>
      prev.map((k) => {
        if (k.id === 'kpi-invoices') {
          return { ...k, value: '$0.00', subtext: 'All statements settled' };
        }
        return k;
      })
    );
  };

  const handleSignContract = (contractId: string) => {
    setContracts((prev) =>
      prev.map((c) => {
        if (c.id === contractId) {
          return {
            ...c,
            status: 'Active',
            signedByClient: true,
          };
        }
        return c;
      })
    );
  };

  const handleUploadFile = (newFile: Omit<FileItem, 'id'>) => {
    const fileObj: FileItem = {
      ...newFile,
      id: `file-${Date.now()}`,
    };
    setFiles((prev) => [fileObj, ...prev]);
  };

  const handleSendMessage = (channelId: string, text: string) => {
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      channelId,
      sender: {
        name: company.clientName,
        role: 'Client',
        avatar: 'https://picsum.photos/seed/julian/80/80',
      },
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);

    // Simulate response after 1s
    setTimeout(() => {
      const aiReply: Message = {
        id: `msg-reply-${Date.now()}`,
        channelId,
        sender: {
          name: 'Elena Rostova',
          role: 'Account Lead',
          avatar: 'https://picsum.photos/seed/elena/80/80',
        },
        content: `Thanks Julian! Received your update. Our team is actively reviewing: "${text.substring(0, 30)}..."`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiReply]);
    }, 1200);
  };

  const handleCreateTicket = (
    newTicket: any
  ) => {
    const ticketObj: SupportTicket = {
      ...newTicket,
      id: `tkt-${Date.now()}`,
      ticketNo: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: 'Just now',
      lastUpdated: 'Just now',
      repliesCount: 1,
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: company.clientName,
          role: 'Client',
          text: newTicket.initialMessage || `Ticket Opened for ${newTicket.subject}`,
          time: 'Just now',
          channel: newTicket.channel || 'Email',
        },
      ],
    };

    setTickets((prev) => [ticketObj, ...prev]);
  };

  const handleAddReply = (
    ticketId: string,
    reply: { text: string; channel: 'Email' | 'Chat'; emailSubject?: string; cc?: string[] } | string
  ) => {
    const replyText = typeof reply === 'string' ? reply : reply.text;
    const replyChannel = typeof reply === 'string' ? 'Email' : reply.channel;

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            lastUpdated: 'Just now',
            repliesCount: t.repliesCount + 1,
            messages: [
              ...t.messages,
              {
                id: `msg-${Date.now()}`,
                sender: company.clientName,
                role: 'Client',
                text: replyText,
                time: 'Just now',
                channel: replyChannel,
              },
            ],
          };
        }
        return t;
      })
    );
  };

  const handleAddCalendarEvent = (newEvent: Omit<CalendarEvent, 'id'>) => {
    const eventObj: CalendarEvent = {
      ...newEvent,
      id: `evt-${Date.now()}`,
    };
    setEvents((prev) => [eventObj, ...prev]);
  };

  // Invoicing Handlers
  const handleCreateInvoice = (newInvoice: Invoice) => {
    setInvoices((prev) => [newInvoice, ...prev]);
  };

  // CRM Handlers
  const handleAddCrmLead = (newLead: Omit<CRMLead, 'id'>) => {
    const leadObj: CRMLead = {
      ...newLead,
      id: `lead-${Date.now()}`,
    };
    setCrmLeads((prev) => [leadObj, ...prev]);
  };

  const handleUpdateCrmStage = (id: string, stage: CRMLead['stage']) => {
    setCrmLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, stage } : l))
    );
  };

  const handleAddCrmAnnotation = (leadId: string, annotation: { text: string; tag: CrmAnnotation['tag'] }) => {
    const newAnn: CrmAnnotation = {
      id: `ann-${Date.now()}`,
      author: 'Elena Rostova',
      authorRole: 'Admin Lead',
      text: annotation.text,
      tag: annotation.tag,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setCrmLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          return {
            ...l,
            annotations: [newAnn, ...(l.annotations || [])],
          };
        }
        return l;
      })
    );

    // Audit Log Entry
    const targetLead = crmLeads.find((l) => l.id === leadId);
    const newAuditLog: AuditLogItem = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actor: 'Elena Rostova',
      actorRole: 'Admin Lead',
      module: 'CRM',
      action: `Added Sticky Annotation to ${targetLead?.companyName || leadId}`,
      severity: 'Info',
      ipAddress: '192.168.1.140',
      location: 'Mountain View, CA',
      details: `Tag: [${annotation.tag}] Note: "${annotation.text}"`,
    };
    setAuditLogs((prev) => [newAuditLog, ...prev]);
  };

  const handleComposeEmailToLead = (leadEmail: string, contactName: string) => {
    setActiveView('email-blasting');
  };

  // Agent AUX & Ticket Management
  const handleUpdateAgentAUX = (agentId: string, newStatus: AUXState) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === agentId ? { ...a, auxStatus: newStatus } : a))
    );

    const targetAgent = agents.find((a) => a.id === agentId);
    const newAuditLog: AuditLogItem = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actor: targetAgent?.name || 'Agent',
      actorRole: targetAgent?.role || 'Support Agent',
      module: 'Ticketing',
      action: `Agent AUX State Changed to [${newStatus}]`,
      severity: newStatus === 'Offline' || newStatus === 'On Break' ? 'Warning' : 'Info',
      ipAddress: '10.0.4.82',
      location: 'Austin Operations Center',
      details: `AUX state transition recorded in Operava Desk Telemetry.`,
    };
    setAuditLogs((prev) => [newAuditLog, ...prev]);
  };

  const handleAssignAgent = (ticketId: string, agent: AgentProfile) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, assignedAgent: agent } : t))
    );
  };

  const handleUpdateTicketStatus = (ticketId: string, status: SupportTicket['status']) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status } : t))
    );
  };

  // Email Blasting Handlers
  const handleAddEmailCampaign = (newCamp: Omit<EmailCampaign, 'id'>) => {
    const campObj: EmailCampaign = {
      ...newCamp,
      id: `camp-${Date.now()}`,
    };
    setEmailCampaigns((prev) => [campObj, ...prev]);
  };

  // Monthly Notifications Handlers
  const handleToggleMonthlyRule = (id: string) => {
    setMonthlyRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    );
  };

  const handleAddMonthlyRule = (newRule: Omit<MonthlyNotificationRule, 'id'>) => {
    const ruleObj: MonthlyNotificationRule = {
      ...newRule,
      id: `rule-${Date.now()}`,
    };
    setMonthlyRules((prev) => [ruleObj, ...prev]);
  };

  const handleManualTriggerMonthlyRule = (ruleTitle: string) => {
    const newLog: MonthlyDispatchLog = {
      id: `log-${Date.now()}`,
      ruleTitle,
      dispatchedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      recipientsCount: 1420,
      status: 'Delivered',
      summary: `Manual dispatch completed successfully for ${ruleTitle}. Multi-channel broadcast delivered.`,
    };
    setMonthlyLogs((prev) => [newLog, ...prev]);
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-[var(--m3-surface)] text-[var(--m3-on-surface)] flex transition-colors duration-200">
      {/* Navigation Rail (Desktop & Drawer Mobile) */}
      <NavRail
        activeView={activeView}
        onNavigate={(viewId) => setActiveView(viewId)}
        unreadMessagesCount={3}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top App Bar */}
        <TopAppBar
          activeView={activeView}
          unreadNotificationsCount={unreadNotificationsCount}
          onOpenSearch={() => setIsCommandPaletteOpen(true)}
          onOpenAiAssistant={() => setIsAiSheetOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenThemeModal={() => setIsThemeModalOpen(true)}
          clientName={company.clientName}
          companyName={company.name}
          avatarUrl={company.clientAvatar}
        />

        {/* Mobile All-Tabs Bar */}
        <MobileNav
          activeView={activeView}
          onNavigate={setActiveView}
          openAiAssistant={() => setIsAiSheetOpen(true)}
        />

        {/* Viewport Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto custom-scrollbar">
          <M3ErrorBoundary fallbackTitle="Google Workspace View Exception">
            {activeView === 'dashboard' && (

            <DashboardView
              company={company}
              kpiMetrics={kpis}
              projects={projects}
              invoices={invoices}
              calendarEvents={events}
              files={files}
              onNavigate={setActiveView}
              openAiAssistant={() => setIsAiSheetOpen(true)}
            />
          )}

          {activeView === 'client-portal' && (
            <ClientDashboardView
              company={company}
              projects={projects}
              invoices={invoices}
              tickets={tickets}
              onPayInvoice={handlePayInvoice}
              onCreateTicket={handleCreateTicket}
            />
          )}

          {activeView === 'crm' && (
            <CrmView
              leads={crmLeads}
              onAddLead={handleAddCrmLead}
              onUpdateLeadStage={handleUpdateCrmStage}
              onAddAnnotation={handleAddCrmAnnotation}
              onComposeEmailToLead={handleComposeEmailToLead}
              openAiAssistant={() => setIsAiSheetOpen(true)}
            />
          )}

          {activeView === 'projects' && (
            <ProjectsView
              projects={projects}
              tasks={tasks}
              onToggleTaskStatus={handleToggleTaskStatus}
              onAddTask={handleAddTask}
            />
          )}

          {activeView === 'invoices' && (
            <InvoicesView
              invoices={invoices}
              onPayInvoice={handlePayInvoice}
              onCreateInvoice={handleCreateInvoice}
              openAiAssistant={() => setIsAiSheetOpen(true)}
            />
          )}

          {activeView === 'email-blasting' && (
            <EmailBlastingView
              campaigns={emailCampaigns}
              crmLeads={crmLeads}
              onAddCampaign={handleAddEmailCampaign}
              openAiAssistant={() => setIsAiSheetOpen(true)}
            />
          )}

          {activeView === 'monthly-notifications' && (
            <MonthlyNotificationsView
              rules={monthlyRules}
              logs={monthlyLogs}
              onToggleRuleActive={handleToggleMonthlyRule}
              onAddRule={handleAddMonthlyRule}
              onManualTrigger={handleManualTriggerMonthlyRule}
            />
          )}

          {activeView === 'contracts' && (
            <ContractsView
              contracts={contracts}
              onSignContract={handleSignContract}
              openAiAssistant={() => setIsAiSheetOpen(true)}
            />
          )}

          {activeView === 'files' && (
            <FileManagerView files={files} onUploadFile={handleUploadFile} />
          )}

          {activeView === 'messages' && (
            <MessagesView
              channels={channels}
              messages={messages}
              onSendMessage={handleSendMessage}
              openAiAssistant={() => setIsAiSheetOpen(true)}
            />
          )}

          {activeView === 'support' && (
            <SupportTicketsView
              tickets={tickets}
              agents={agents}
              onCreateTicket={handleCreateTicket}
              onAddReply={handleAddReply}
              onUpdateTicketStatus={handleUpdateTicketStatus}
              onAssignAgent={handleAssignAgent}
              onUpdateAgentAUX={handleUpdateAgentAUX}
            />
          )}

          {activeView === 'audit-logs' && (
            <AuditLogsView logs={auditLogs} />
          )}

          {activeView === 'calendar' && (
            <CalendarView events={events} onAddEvent={handleAddCalendarEvent} />
          )}

          {activeView === 'analytics' && (
            <AnalyticsView openAiAssistant={() => setIsAiSheetOpen(true)} />
          )}

          {activeView === 'security' && (
            <SecurityAuditView logs={INITIAL_SECURITY_LOGS} />
          )}

          {activeView === 'knowledge' && (
            <KnowledgeBaseView
              articles={INITIAL_KNOWLEDGE_ARTICLES}
              openAiAssistant={() => setIsAiSheetOpen(true)}
            />
          )}

          {activeView === 'settings' && (
            <SettingsView
              company={company}
              onUpdateCompany={(updated) => setCompany((prev) => ({ ...prev, ...updated }))}
            />
          )}
          </M3ErrorBoundary>
        </main>

      </div>

      {/* Overlays & Modals */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(v) => setActiveView(v)}
        openAiAssistant={() => setIsAiSheetOpen(true)}
      />

      <AIAssistantSheet
        isOpen={isAiSheetOpen}
        onClose={() => setIsAiSheetOpen(false)}
        contextText={`Active View: ${activeView}. Client: ${company.name} (${company.clientName})`}
      />

      <ThemeCustomizerModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentTheme={currentTheme}
        onChangeTheme={setCurrentTheme}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
      />

      <NotificationCenter
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={() =>
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        }
        onClearAll={() => setNotifications([])}
        onSelectNotification={(id) => {
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
          );
          const notif = notifications.find((n) => n.id === id);
          if (notif?.type === 'invoice') setActiveView('invoices');
          else if (notif?.type === 'project') setActiveView('projects');
          else if (notif?.type === 'security') setActiveView('security');
          setIsNotificationsOpen(false);
        }}
      />
    </div>
  );
}
