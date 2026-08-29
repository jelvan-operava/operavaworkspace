import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  Video,
  User,
  Check,
} from 'lucide-react';
import { M3Card } from '../ui/M3Card';
import { M3Button } from '../ui/M3Button';
import { M3Badge } from '../ui/M3Badge';
import { M3Dialog } from '../ui/M3Dialog';
import { CalendarEvent } from '@/lib/mock-data';

export interface CalendarViewProps {
  events: CalendarEvent[];
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  onAddEvent,
}) => {
  const [isNewEventOpen, setIsNewEventOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2026-08-03');
  const [time, setTime] = useState('10:00 AM - 10:30 AM');
  const [type, setType] = useState<'Strategy Call' | 'Sprint Review' | 'Billing Sync'>('Strategy Call');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddEvent({
      title,
      date,
      time,
      duration: '30 min',
      type,
      attendees: [
        { name: 'Elena Rostova', avatar: 'https://picsum.photos/seed/elena/80/80' },
        { name: 'Julian Vance', avatar: 'https://picsum.photos/seed/julian/80/80' },
      ],
      meetUrl: `https://meet.google.com/call-${Date.now().toString().slice(-6)}`,
    });

    setTitle('');
    setIsNewEventOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--m3-on-surface)] flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-[var(--m3-primary)]" />
            Calendar & Strategy Call Sync
          </h1>
          <p className="text-xs text-[var(--m3-on-surface-variant)]">
            Schedule 1-on-1 strategy syncs, sprint handovers, and billing reviews via Google Meet.
          </p>
        </div>

        <M3Button
          variant="filled"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsNewEventOpen(true)}
        >
          Schedule Sync Call
        </M3Button>
      </div>

      {/* Events Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.map((evt) => (
          <M3Card
            key={evt.id}
            variant="filled"
            elevation={1}
            className="p-6 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <M3Badge variant="primary" size="sm">{evt.type}</M3Badge>
                <span className="text-xs text-[var(--m3-on-surface-variant)] font-semibold">
                  {evt.duration}
                </span>
              </div>

              <h3 className="font-bold text-sm text-[var(--m3-on-surface)]">{evt.title}</h3>

              <div className="p-3 rounded-2xl bg-[var(--m3-surface-container-lowest)] space-y-1 text-xs text-[var(--m3-on-surface-variant)]">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[var(--m3-primary)]" />
                  <span>{evt.date} • {evt.time}</span>
                </div>
              </div>

              {/* Attendees */}
              <div className="flex items-center gap-2 pt-1">
                {evt.attendees.map((a, i) => (
                  <img
                    key={i}
                    src={a.avatar}
                    alt={a.name}
                    title={a.name}
                    className="w-7 h-7 rounded-full object-cover border border-[var(--m3-outline-variant)]"
                    referrerPolicy="no-referrer"
                  />
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--m3-outline-variant)]">
              <a
                href={evt.meetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-full bg-[var(--m3-primary-container)] text-[var(--m3-on-primary-container)] text-xs font-bold hover:shadow-md transition-all"
              >
                <Video className="w-4 h-4 text-[var(--m3-primary)]" />
                <span>Launch Google Meet</span>
              </a>
            </div>
          </M3Card>
        ))}
      </div>

      {/* Schedule Sync Modal */}
      <M3Dialog
        isOpen={isNewEventOpen}
        onClose={() => setIsNewEventOpen(false)}
        title="Schedule Google Meet Strategy Call"
        icon={<Video className="w-5 h-5" />}
      >
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[var(--m3-on-surface)] block mb-1">
              Call Topic
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Q3 AI Infrastructure Expansion Review..."
              className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container)] text-xs text-[var(--m3-on-surface)] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--m3-on-surface)] block mb-1">
              Sync Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container)] text-xs text-[var(--m3-on-surface)] focus:outline-hidden"
            >
              <option value="Strategy Call">Strategy Call</option>
              <option value="Sprint Review">Sprint Review</option>
              <option value="Billing Sync">Billing Sync</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[var(--m3-on-surface)] block mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container)] text-xs text-[var(--m3-on-surface)] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--m3-on-surface)] block mb-1">Time Slot</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container)] text-xs text-[var(--m3-on-surface)] focus:outline-hidden"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <M3Button variant="text" type="button" onClick={() => setIsNewEventOpen(false)}>
              Cancel
            </M3Button>
            <M3Button variant="filled" type="submit">
              Confirm Schedule
            </M3Button>
          </div>
        </form>
      </M3Dialog>
    </div>
  );
};
