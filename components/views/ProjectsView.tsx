import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Briefcase,
  CheckSquare,
  Plus,
  Search,
  Grid,
  List as ListIcon,
  Columns,
  Filter,
  Check,
  Clock,
  AlertTriangle,
  User,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import { M3Card } from '../ui/M3Card';
import { M3Button } from '../ui/M3Button';
import { M3Badge } from '../ui/M3Badge';
import { M3Dialog } from '../ui/M3Dialog';
import { ProjectsSkeleton } from '../ui/skeletons/ProjectsSkeleton';
import { M3ErrorState } from '../ui/M3ErrorState';
import { Project, Task } from '@/lib/mock-data';

export interface ProjectsViewProps {
  projects: Project[];
  tasks: Task[];
  onToggleTaskStatus: (taskId: string) => void;
  onAddTask: (task: Omit<Task, 'id'>) => void;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}


export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  tasks,
  onToggleTaskStatus,
  onAddTask,
  isLoading = false,
  isError = false,
  onRetry,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'kanban'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [healthFilter, setHealthFilter] = useState<'All' | 'Healthy' | 'Needs Attention'>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);

  // Simulated internal fetch states for testing
  const [isSimulatingLoading, setIsSimulatingLoading] = useState(false);
  const [isSimulatingError, setIsSimulatingError] = useState(false);

  // New task state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskProjectId, setNewTaskProjectId] = useState(projects[0]?.id || '');
  const [newTaskPriority, setNewTaskPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');

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
            Loading Workspace Project Deliverables...
          </span>
        </div>
        <ProjectsSkeleton viewMode={viewMode} />
      </div>
    );
  }

  if (showError) {
    return (
      <M3ErrorState
        title="Unable to Sync Workspace Projects"
        description="The Google Workspace Project Engine experienced a synchronization timeout. Milestones and task boards could not be loaded."
        errorCode="ERR_PROJECT_SYNC_FAILED"
        errorDetails="HTTP 504 Gateway Timeout: /api/projects/deliverables\nService: google-workspace-project-service\nTrace ID: 0x93e1104f"
        onRetry={handleRetryFetch}
        onSecondaryAction={() => setIsSimulatingError(false)}
        secondaryActionText="Dismiss & View Local State"
      />
    );
  }

  const filteredProjects = projects.filter((p) => {
    const matchesQuery =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesHealth = healthFilter === 'All' ? true : p.health === healthFilter;
    return matchesQuery && matchesHealth;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const proj = projects.find((p) => p.id === newTaskProjectId) || projects[0];

    onAddTask({
      title: newTaskTitle,
      projectId: proj.id,
      projectTitle: proj.title,
      priority: newTaskPriority,
      status: 'Todo',
      assignee: { name: 'Julian Vance', avatar: 'https://picsum.photos/seed/julian/80/80' },
      dueDate: '2026-08-10',
    });

    setNewTaskTitle('');
    setIsNewTaskOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--m3-on-surface)] flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-[var(--m3-primary)]" />
            Projects & Task Execution
          </h1>
          <p className="text-xs text-[var(--m3-on-surface-variant)]">
            Monitor real-time project milestones, lead contacts, budgets, and deliverable tasks.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
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

          {/* View Switcher */}

          <div className="p-1 rounded-full bg-[var(--m3-surface-container-high)] border border-[var(--m3-outline-variant)] flex items-center gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                viewMode === 'grid'
                  ? 'bg-[var(--m3-primary-container)] text-[var(--m3-on-primary-container)]'
                  : 'text-[var(--m3-on-surface-variant)]'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                viewMode === 'list'
                  ? 'bg-[var(--m3-primary-container)] text-[var(--m3-on-primary-container)]'
                  : 'text-[var(--m3-on-surface-variant)]'
              }`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-[var(--m3-primary-container)] text-[var(--m3-on-primary-container)]'
                  : 'text-[var(--m3-on-surface-variant)]'
              }`}
            >
              <Columns className="w-4 h-4" />
            </button>
          </div>

          <M3Button
            variant="filled"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsNewTaskOpen(true)}
          >
            New Task Request
          </M3Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[var(--m3-on-surface-variant)] absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by name or category..."
            className="w-full pl-9 pr-4 py-2 bg-[var(--m3-surface-container)] text-xs rounded-full focus:outline-hidden text-[var(--m3-on-surface)] placeholder-[var(--m3-on-surface-variant)]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-[var(--m3-on-surface-variant)]" />
          <span className="text-xs text-[var(--m3-on-surface-variant)] font-medium">Health:</span>
          {(['All', 'Healthy', 'Needs Attention'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setHealthFilter(filter)}
              className={`text-xs px-3 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                healthFilter === filter
                  ? 'bg-[var(--m3-primary-container)] text-[var(--m3-on-primary-container)]'
                  : 'bg-[var(--m3-surface-container)] text-[var(--m3-on-surface-variant)]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Mode */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((proj) => (
            <M3Card
              key={proj.id}
              variant="filled"
              elevation={1}
              interactive
              onClick={() => setSelectedProject(proj)}
              className="p-6 space-y-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <M3Badge variant="outline" size="sm" className="mb-2">
                    {proj.category}
                  </M3Badge>
                  <h3 className="text-base font-bold text-[var(--m3-on-surface)]">
                    {proj.title}
                  </h3>
                </div>
                <M3Badge
                  variant={proj.health === 'Healthy' ? 'success' : 'warning'}
                  size="sm"
                >
                  {proj.health}
                </M3Badge>
              </div>

              <p className="text-xs text-[var(--m3-on-surface-variant)] line-clamp-2">
                {proj.description}
              </p>

              {/* Progress */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--m3-on-surface-variant)] font-medium">Progress</span>
                  <span className="font-bold text-[var(--m3-on-surface)]">{proj.progress}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[var(--m3-surface-container-highest)] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[var(--m3-primary)] transition-all duration-500"
                    style={{ width: `${proj.progress}%` }}
                  />
                </div>
              </div>

              {/* Stats Footer */}
              <div className="pt-3 border-t border-[var(--m3-outline-variant)] flex items-center justify-between text-xs text-[var(--m3-on-surface-variant)]">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5" />
                  <span>{proj.lead}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Due {proj.dueDate}</span>
                </div>
                <span className="font-semibold text-[var(--m3-on-surface)]">
                  {proj.spent} / {proj.budget}
                </span>
              </div>
            </M3Card>
          ))}
        </div>
      )}

      {/* List Mode */}
      {viewMode === 'list' && (
        <M3Card variant="filled" className="p-4 space-y-2">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => setSelectedProject(proj)}
              className="p-4 rounded-2xl bg-[var(--m3-surface-container-lowest)] border border-[var(--m3-outline-variant)] hover:border-[var(--m3-primary)] transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-[var(--m3-on-surface)]">{proj.title}</h3>
                  <M3Badge variant="outline" size="sm">{proj.category}</M3Badge>
                </div>
                <p className="text-xs text-[var(--m3-on-surface-variant)]">
                  Lead: {proj.lead} • Tasks: {proj.tasksCount.completed}/{proj.tasksCount.total} completed
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="w-36 space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold">
                    <span>{proj.progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[var(--m3-surface-container-highest)] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[var(--m3-primary)]"
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>
                </div>

                <M3Badge
                  variant={proj.health === 'Healthy' ? 'success' : 'warning'}
                  size="sm"
                >
                  {proj.health}
                </M3Badge>
              </div>
            </div>
          ))}
        </M3Card>
      )}

      {/* Kanban Mode */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['In Progress', 'In Review', 'Completed'] as const).map((colStatus) => {
            const colProjects = projects.filter((p) => p.status === colStatus);

            return (
              <div key={colStatus} className="space-y-3">
                <div className="p-3 rounded-2xl bg-[var(--m3-surface-container-high)] flex items-center justify-between">
                  <h3 className="font-bold text-xs text-[var(--m3-on-surface)]">
                    {colStatus} ({colProjects.length})
                  </h3>
                </div>

                <div className="space-y-3">
                  {colProjects.map((p) => (
                    <M3Card
                      key={p.id}
                      variant="filled"
                      interactive
                      onClick={() => setSelectedProject(p)}
                      className="p-4 space-y-3"
                    >
                      <h4 className="font-bold text-xs text-[var(--m3-on-surface)]">{p.title}</h4>
                      <p className="text-[11px] text-[var(--m3-on-surface-variant)] line-clamp-2">
                        {p.description}
                      </p>
                      <div className="w-full h-1.5 rounded-full bg-[var(--m3-surface-container-highest)] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[var(--m3-primary)]"
                          style={{ width: `${p.progress}%` }}
                        />
                      </div>
                    </M3Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tasks Execution List */}
      <M3Card variant="filled" className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-[var(--m3-primary)]" />
            <h2 className="text-base font-bold text-[var(--m3-on-surface)]">
              Task Checklist & Action Items
            </h2>
          </div>
          <span className="text-xs text-[var(--m3-on-surface-variant)]">
            {tasks.filter((t) => t.status === 'Done').length} of {tasks.length} Done
          </span>
        </div>

        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onToggleTaskStatus(task.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                task.status === 'Done'
                  ? 'bg-[var(--m3-surface-container-low)] border-transparent opacity-60'
                  : 'bg-[var(--m3-surface-container-lowest)] border-[var(--m3-outline-variant)] hover:border-[var(--m3-primary)]'
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <button
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                    task.status === 'Done'
                      ? 'bg-[var(--m3-primary)] border-[var(--m3-primary)] text-[var(--m3-on-primary)]'
                      : 'border-[var(--m3-outline)] bg-transparent'
                  }`}
                >
                  {task.status === 'Done' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                <div className="overflow-hidden">
                  <p
                    className={`text-xs font-semibold ${
                      task.status === 'Done'
                        ? 'line-through text-[var(--m3-on-surface-variant)]'
                        : 'text-[var(--m3-on-surface)]'
                    }`}
                  >
                    {task.title}
                  </p>
                  <p className="text-[11px] text-[var(--m3-on-surface-variant)] truncate">
                    {task.projectTitle} • Assigned: {task.assignee.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <M3Badge
                  variant={
                    task.priority === 'High'
                      ? 'error'
                      : task.priority === 'Medium'
                      ? 'warning'
                      : 'secondary'
                  }
                  size="sm"
                >
                  {task.priority} Priority
                </M3Badge>
              </div>
            </div>
          ))}
        </div>
      </M3Card>

      {/* Project Details Modal */}
      {selectedProject && (
        <M3Dialog
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          title={selectedProject.title}
          icon={<Briefcase className="w-5 h-5" />}
          actions={
            <M3Button variant="filled" onClick={() => setSelectedProject(null)}>
              Close Details
            </M3Button>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <M3Badge variant="primary" size="sm">{selectedProject.category}</M3Badge>
              <M3Badge variant={selectedProject.health === 'Healthy' ? 'success' : 'warning'} size="sm">
                {selectedProject.health}
              </M3Badge>
            </div>

            <p className="text-xs text-[var(--m3-on-surface-variant)]">{selectedProject.description}</p>

            <div className="p-4 rounded-2xl bg-[var(--m3-surface-container-lowest)] space-y-2">
              <div className="flex justify-between text-xs">
                <span>Total Budget:</span>
                <span className="font-bold">{selectedProject.budget}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Spent to Date:</span>
                <span className="font-bold">{selectedProject.spent}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Lead Lead:</span>
                <span className="font-bold">{selectedProject.lead}</span>
              </div>
            </div>
          </div>
        </M3Dialog>
      )}

      {/* New Task Request Modal */}
      <M3Dialog
        isOpen={isNewTaskOpen}
        onClose={() => setIsNewTaskOpen(false)}
        title="Submit New Task Request"
        icon={<Plus className="w-5 h-5" />}
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[var(--m3-on-surface)] block mb-1">
              Task Description
            </label>
            <input
              type="text"
              required
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="e.g. Request Gemini API rate limit increase..."
              className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container)] text-xs text-[var(--m3-on-surface)] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--m3-on-surface)] block mb-1">
              Associated Project
            </label>
            <select
              value={newTaskProjectId}
              onChange={(e) => setNewTaskProjectId(e.target.value)}
              className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container)] text-xs text-[var(--m3-on-surface)] focus:outline-hidden"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--m3-on-surface)] block mb-1">
              Priority
            </label>
            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value as any)}
              className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container)] text-xs text-[var(--m3-on-surface)] focus:outline-hidden"
            >
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <M3Button variant="text" type="button" onClick={() => setIsNewTaskOpen(false)}>
              Cancel
            </M3Button>
            <M3Button variant="filled" type="submit">
              Submit Task
            </M3Button>
          </div>
        </form>
      </M3Dialog>
    </div>
  );
};
