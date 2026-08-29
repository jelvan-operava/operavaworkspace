import React from 'react';
import { M3Skeleton } from '../M3Skeleton';
import { M3Card } from '../M3Card';

export const InvoicesSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 w-full animate-in fade-in duration-300">
      {/* Header Bar Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--m3-surface-container-low)] p-6 rounded-3xl border border-[var(--m3-outline-variant)]/40">
        <div className="space-y-2">
          <M3Skeleton width={210} height={28} className="rounded-xl" />
          <M3Skeleton width={310} height={16} className="rounded-lg" />
        </div>
        <div className="flex items-center gap-3">
          <M3Skeleton width={130} height={40} className="rounded-full" />
          <M3Skeleton width={140} height={40} className="rounded-full" />
        </div>
      </div>

      {/* Auto-Recurring Banner Skeleton */}
      <M3Card variant="outlined" className="p-4 sm:p-5 bg-[var(--m3-surface-container)] border-[var(--m3-outline-variant)]/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <M3Skeleton width={44} height={44} variant="circular" />
            <div className="space-y-1.5">
              <M3Skeleton width={220} height={18} className="rounded-md" />
              <M3Skeleton width={320} height={12} className="rounded-md" />
            </div>
          </div>
          <M3Skeleton width={110} height={36} className="rounded-full" />
        </div>
      </M3Card>

      {/* Financial KPI Summary Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((idx) => (
          <M3Card key={idx} variant="filled" className="p-5 border border-[var(--m3-outline-variant)]/30">
            <div className="flex items-center justify-between mb-3">
              <M3Skeleton width={110} height={14} className="rounded-md" />
              <M3Skeleton width={32} height={32} variant="circular" />
            </div>
            <M3Skeleton width={120} height={30} className="rounded-lg mb-2" />
            <M3Skeleton width={80} height={12} className="rounded-md" />
          </M3Card>
        ))}
      </div>

      {/* Search & Status Tabs Bar Skeleton */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[var(--m3-surface-container)] p-3 rounded-2xl">
        <M3Skeleton width="100%" height={40} className="sm:w-72 rounded-full" />
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <M3Skeleton width={60} height={32} className="rounded-full" />
          <M3Skeleton width={70} height={32} className="rounded-full" />
          <M3Skeleton width={80} height={32} className="rounded-full" />
          <M3Skeleton width={80} height={32} className="rounded-full" />
        </div>
      </div>

      {/* Invoices List Skeleton */}
      <M3Card variant="filled" className="overflow-hidden border border-[var(--m3-outline-variant)]/40 divide-y divide-[var(--m3-outline-variant)]/30">
        {[1, 2, 3, 4, 5].map((rowIdx) => (
          <div key={rowIdx} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <M3Skeleton width={44} height={44} className="rounded-2xl" />
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <M3Skeleton width={110} height={18} className="rounded-md" />
                  <M3Skeleton width={70} height={20} className="rounded-full" />
                </div>
                <M3Skeleton width={180} height={14} className="rounded-md" />
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-6">
              <div className="space-y-1 text-right">
                <M3Skeleton width={90} height={20} className="rounded-md" />
                <M3Skeleton width={110} height={12} className="rounded-md" />
              </div>
              <div className="flex items-center gap-2">
                <M3Skeleton width={80} height={36} className="rounded-full" />
                <M3Skeleton width={36} height={36} variant="circular" />
              </div>
            </div>
          </div>
        ))}
      </M3Card>
    </div>
  );
};
