import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  BarChart3,
  Download,
  Calendar,
  PieChart as PieIcon,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { M3Card } from '../ui/M3Card';
import { M3Button } from '../ui/M3Button';
import { M3Badge } from '../ui/M3Badge';

export interface AnalyticsViewProps {
  openAiAssistant: () => void;
}

const CATEGORY_EXPENSE_DATA = [
  { name: 'Cloud AI Compute', value: 48500, color: 'var(--m3-primary)' },
  { name: 'Design Tokens', value: 24000, color: 'var(--m3-tertiary)' },
  { name: 'SecOps Compliance', value: 32000, color: 'var(--m3-secondary)' },
  { name: 'Mobile PWA Engine', value: 28000, color: 'var(--m3-warning)' },
];

const MONTHLY_VELOCITY_DATA = [
  { sprint: 'Sprint 1', planned: 25, delivered: 24 },
  { sprint: 'Sprint 2', planned: 30, delivered: 28 },
  { sprint: 'Sprint 3', planned: 28, delivered: 31 },
  { sprint: 'Sprint 4', planned: 35, delivered: 35 },
  { sprint: 'Sprint 5', planned: 40, delivered: 38 },
];

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ openAiAssistant }) => {
  const [timeframe, setTimeframe] = useState<'Q1' | 'Q2' | 'Q3' | 'YTD'>('YTD');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--m3-on-surface)] flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[var(--m3-primary)]" />
            Financial & Engineering Analytics
          </h1>
          <p className="text-xs text-[var(--m3-on-surface-variant)]">
            Budget breakdown by category, sprint delivery velocity, and ROI metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <M3Button
            variant="filled"
            icon={<Sparkles className="w-4 h-4" />}
            onClick={openAiAssistant}
          >
            Gemini ROI Analysis
          </M3Button>
        </div>
      </div>

      {/* Timeframe Filter */}
      <div className="p-3 rounded-2xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)] flex items-center gap-2">
        <span className="text-xs font-semibold text-[var(--m3-on-surface-variant)] pl-2">Period:</span>
        {(['Q1', 'Q2', 'Q3', 'YTD'] as const).map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`text-xs px-3 py-1 rounded-full font-medium transition-colors cursor-pointer ${
              timeframe === tf
                ? 'bg-[var(--m3-primary-container)] text-[var(--m3-on-primary-container)]'
                : 'bg-[var(--m3-surface-container)] text-[var(--m3-on-surface-variant)]'
            }`}
          >
            {tf}
          </button>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Expense Distribution (Pie Chart) */}
        <M3Card variant="filled" className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[var(--m3-on-surface)]">
                Budget Allocation by Domain
              </h3>
              <p className="text-xs text-[var(--m3-on-surface-variant)]">
                Cloud AI, Design Systems, SecOps, Mobile
              </p>
            </div>
            <PieIcon className="w-5 h-5 text-[var(--m3-primary)]" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_EXPENSE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {CATEGORY_EXPENSE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--m3-surface-container-high)',
                    borderColor: 'var(--m3-outline-variant)',
                    borderRadius: '16px',
                    color: 'var(--m3-on-surface)',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
            {CATEGORY_EXPENSE_DATA.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-[var(--m3-on-surface-variant)] truncate">{item.name}:</span>
                <span className="font-bold text-[var(--m3-on-surface)]">${item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </M3Card>

        {/* Sprint Delivery Velocity (Bar Chart) */}
        <M3Card variant="filled" className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[var(--m3-on-surface)]">
                Sprint Task Delivery Velocity
              </h3>
              <p className="text-xs text-[var(--m3-on-surface-variant)]">
                Planned story points vs delivered tasks
              </p>
            </div>
            <TrendingUp className="w-5 h-5 text-[var(--m3-primary)]" />
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_VELOCITY_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--m3-outline-variant)" opacity={0.5} />
                <XAxis dataKey="sprint" stroke="var(--m3-on-surface-variant)" fontSize={11} />
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
                <Bar dataKey="planned" fill="var(--m3-secondary-container)" name="Planned Points" radius={[8, 8, 0, 0]} />
                <Bar dataKey="delivered" fill="var(--m3-primary)" name="Delivered Points" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-2xl bg-[var(--m3-surface-container-lowest)] text-xs text-[var(--m3-on-surface-variant)] flex items-center justify-between">
            <span>Overall Sprint Completion Rate:</span>
            <span className="font-bold text-[var(--m3-primary)]">98.2% Velocity Efficiency</span>
          </div>
        </M3Card>
      </div>
    </div>
  );
};
