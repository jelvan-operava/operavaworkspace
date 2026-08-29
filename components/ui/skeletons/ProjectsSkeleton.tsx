import React from 'react';
import { M3Skeleton } from '../M3Skeleton';
import { M3Card } from '../M3Card';

export interface ProjectsSkeletonProps {
  viewMode?: 'grid' | 'list' | 'kanban';
}

export const ProjectsSkeleton: React.FC<ProjectsSkeletonProps> = ({ viewMode = 'grid' }) => {
  return (
    <div className="space-y-6 w-full animate-in fade-in duration-300">
      {/* Projects Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--m3-surface-container-low)] p-6 rounded-3xl border border-[var(--m3-outline-variant)]/40">
        <div className="space-y-2">
          <M3Skeleton width={200} height={28} className="rounded-xl" />
          <M3Skeleton width={300} height={16} className="rounded-lg" />
        </div>
        <div className="flex items-center gap-3">
          <M3Skeleton width={120} height={40} className="rounded-full" />
          <M3Skeleton width={130} height={40} className="rounded-full" />
        </div>
      </div>

      {/* Filter & View Mode Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[var(--m3-surface-container)] p-3.5 rounded-2xl">
        <M3Skeleton width="100%" height={40} className="sm:w-72 rounded-full" />

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1.5">
            <M3Skeleton width={60} height={32} className="rounded-full" />
            <M3Skeleton width={75} height={32} className="rounded-full" />
            <M3Skeleton width={110} height={32} className="rounded-full" />
          </div>

          <div className="flex items-center gap-1 bg-[var(--m3-surface-container-high)] p-1 rounded-xl">
            <M3Skeleton width={32} height={32} className="rounded-lg" />
            <M3Skeleton width={32} height={32} className="rounded-lg" />
            <M3Skeleton width={32} height={32} className="rounded-lg" />
          </div>
        </div>
      </div>

      {/* Grid Mode Skeleton */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <M3Card key={idx} variant="outlined" className="p-5 space-y-4 bg-[var(--m3-surface)] border-[var(--m3-outline-variant)]/50">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2 flex-1">
                  <M3Skeleton width="75%" height={22} className="rounded-lg" />
                  <M3Skeleton width="45%" height={14} className="rounded-md" />
                </div>
                <M3Skeleton width={70} height={24} className="rounded-full shrink-0" />
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center text-xs">
                  <M3Skeleton width={80} height={14} className="rounded-md" />
                  <M3Skeleton width={40} height={14} className="rounded-md" />
                </div>
                <M3Skeleton width="100%" height={8} className="rounded-full" />
              </div>

              <div className="pt-3 border-t border-[var(--m3-outline-variant)]/30 flex items-center justify-between">
                <div className="flex -space-x-2">
                  <M3Skeleton width={28} height={28} variant="circular" />
                  <M3Skeleton width={28} height={28} variant="circular" />
                  <M3Skeleton width={28} height={28} variant="circular" />
                </div>
                <M3Skeleton width={90} height={14} className="rounded-md" />
              </div>
            </M3Card>
          ))}
        </div>
      )}

      {/* List Mode Skeleton */}
      {viewMode === 'list' && (
        <M3Card variant="filled" className="overflow-hidden border border-[var(--m3-outline-variant)]/40 divide-y divide-[var(--m3-outline-variant)]/30">
          {[1, 2, 3, 4, 5].map((rowIdx) => (
            <div key={rowIdx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <M3Skeleton width={180} height={18} className="rounded-md" />
                  <M3Skeleton width={70} height={20} className="rounded-full" />
                </div>
                <M3Skeleton width={120} height={14} className="rounded-md" />
              </div>

              <div className="w-full sm:w-48 space-y-1">
                <M3Skeleton width="100%" height={6} className="rounded-full" />
                <div className="flex justify-between">
                  <M3Skeleton width={50} height={10} className="rounded-sm" />
                  <M3Skeleton width={30} height={10} className="rounded-sm" />
                </div>
              </div>

              <div className="flex items-center gap-3 justify-between sm:justify-end">
                <M3Skeleton width={80} height={14} className="rounded-md" />
                <M3Skeleton width={32} height={32} variant="circular" />
              </div>
            </div>
          ))}
        </M3Card>
      )}

      {/* Kanban Mode Skeleton */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-4 custom-scrollbar">
          {['To Do', 'In Progress', 'In Review', 'Completed'].map((kanbanStage, kIdx) => (
            <div key={kIdx} className="bg-[var(--m3-surface-container-low)] p-4 rounded-3xl border border-[var(--m3-outline-variant)]/30 space-y-3 min-w-[260px]">
              <div className="flex items-center justify-between border-b border-[var(--m3-outline-variant)]/40 pb-2">
                <M3Skeleton width={100} height={18} className="rounded-md" />
                <M3Skeleton width={24} height={20} className="rounded-full" />
              </div>

              {[1, 2, 3].slice(0, (kIdx % 3) + 1).map((itemIdx) => (
                <M3Card key={itemIdx} variant="outlined" className="p-4 space-y-2.5 bg-[var(--m3-surface)]">
                  <M3Skeleton width="85%" height={16} className="rounded-md" />
                  <M3Skeleton width="60%" height={12} className="rounded-md" />
                  <div className="pt-2 border-t border-[var(--m3-outline-variant)]/30 flex items-center justify-between">
                    <M3Skeleton width={60} height={18} className="rounded-full" />
                    <M3Skeleton width={24} height={24} variant="circular" />
                  </div>
                </M3Card>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
