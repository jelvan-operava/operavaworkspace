import React from 'react';
import { M3Skeleton } from '../M3Skeleton';
import { M3Card } from '../M3Card';

export interface CrmSkeletonProps {
  viewMode?: 'pipeline' | 'table';
}

export const CrmSkeleton: React.FC<CrmSkeletonProps> = ({ viewMode = 'pipeline' }) => {
  return (
    <div className="space-y-6 w-full animate-in fade-in duration-300">
      {/* Header Bar Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--m3-surface-container-low)] p-6 rounded-3xl border border-[var(--m3-outline-variant)]/40">
        <div className="space-y-2">
          <M3Skeleton width={220} height={28} className="rounded-xl" />
          <M3Skeleton width={320} height={16} className="rounded-lg" />
        </div>
        <div className="flex items-center gap-3">
          <M3Skeleton width={140} height={40} className="rounded-full" />
          <M3Skeleton width={140} height={40} className="rounded-full" />
          <M3Skeleton width={120} height={40} className="rounded-full" />
        </div>
      </div>

      {/* CRM KPI Metrics Skeleton Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <M3Card key={i} variant="filled" className="p-5 border border-[var(--m3-outline-variant)]/30">
            <div className="flex items-center justify-between mb-3">
              <M3Skeleton width={100} height={14} className="rounded-md" />
              <M3Skeleton width={36} height={36} variant="circular" />
            </div>
            <M3Skeleton width={130} height={32} className="rounded-lg mb-2" />
            <M3Skeleton width={90} height={12} className="rounded-md" />
          </M3Card>
        ))}
      </div>

      {/* Search & Filter Bar Skeleton */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[var(--m3-surface-container)] p-3 rounded-2xl">
        <M3Skeleton width="100%" height={40} className="sm:w-80 rounded-full" />
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <M3Skeleton width={100} height={36} className="rounded-full" />
          <M3Skeleton width={100} height={36} className="rounded-full" />
        </div>
      </div>

      {/* Main Pipeline Kanban OR Table View Skeleton */}
      {viewMode === 'pipeline' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4 custom-scrollbar">
          {[
            'Lead',
            'Contacted',
            'Qualified',
            'Proposal',
            'Negotiation',
            'Closed Won',
          ].map((stageName, idx) => (
            <div
              key={idx}
              className="min-w-[260px] bg-[var(--m3-surface-container-low)] p-3.5 rounded-3xl border border-[var(--m3-outline-variant)]/30 flex flex-col gap-3"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-1 py-1 border-b border-[var(--m3-outline-variant)]/40 pb-2">
                <div className="flex items-center gap-2">
                  <M3Skeleton width={80} height={16} className="rounded-md" />
                  <M3Skeleton width={24} height={20} className="rounded-full" />
                </div>
                <M3Skeleton width={50} height={14} className="rounded-md" />
              </div>

              {/* Deal Cards in Stage */}
              {[1, 2, 3].slice(0, (idx % 3) + 1).map((cardIdx) => (
                <M3Card key={cardIdx} variant="outlined" className="p-4 space-y-3 bg-[var(--m3-surface)]">
                  <div className="flex items-center justify-between">
                    <M3Skeleton width={110} height={16} className="rounded-md" />
                    <M3Skeleton width={48} height={18} className="rounded-full" />
                  </div>
                  <M3Skeleton width={130} height={14} className="rounded-md" />
                  
                  <div className="pt-2 border-t border-[var(--m3-outline-variant)]/30 flex items-center justify-between">
                    <M3Skeleton width={70} height={22} className="rounded-md" />
                    <M3Skeleton width={60} height={14} className="rounded-md" />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <M3Skeleton width={80} height={20} className="rounded-full" />
                    <M3Skeleton width={24} height={24} variant="circular" />
                  </div>
                </M3Card>
              ))}
            </div>
          ))}
        </div>
      ) : (
        /* Table Skeleton */
        <M3Card variant="filled" className="overflow-hidden border border-[var(--m3-outline-variant)]/40">
          <div className="p-4 border-b border-[var(--m3-outline-variant)]/40 flex items-center justify-between">
            <M3Skeleton width={150} height={20} className="rounded-md" />
            <M3Skeleton width={100} height={16} className="rounded-md" />
          </div>
          <div className="divide-y divide-[var(--m3-outline-variant)]/30">
            {[1, 2, 3, 4, 5, 6].map((rowIdx) => (
              <div key={rowIdx} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <M3Skeleton width={40} height={40} variant="circular" />
                  <div className="space-y-1.5">
                    <M3Skeleton width={140} height={16} className="rounded-md" />
                    <M3Skeleton width={100} height={12} className="rounded-md" />
                  </div>
                </div>
                <M3Skeleton width={90} height={24} className="rounded-full hidden sm:block" />
                <M3Skeleton width={80} height={18} className="rounded-md" />
                <M3Skeleton width={60} height={16} className="rounded-md hidden md:block" />
                <M3Skeleton width={80} height={32} className="rounded-full" />
              </div>
            ))}
          </div>
        </M3Card>
      )}
    </div>
  );
};
