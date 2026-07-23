'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  TIME_SLOTS,
  getBookingWindow,
  isSelectableDate,
  toDateKey,
  formatSlotLabel,
  formatDateLabel,
} from '@/lib/bookingSlots';

const WEEKDAY_LABELS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function getMonthGrid(viewMonth: Date): (Date | null)[] {
  const year  = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const daysInMonth  = new Date(year, month + 1, 0).getDate();
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0

  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

// ── Cell / button styles ──────────────────────────────────────────────────────

function navBtnStyle(disabled: boolean): React.CSSProperties {
  return {
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    border: '1px solid rgba(26,111,212,0.2)',
    color: disabled ? 'rgba(245,245,245,0.15)' : 'var(--color-primary)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'border-color 0.2s, color 0.2s',
  };
}

function dayCellStyle(opts: { selectable: boolean; isViewing: boolean; isConfirmed: boolean }): React.CSSProperties {
  const { selectable, isViewing, isConfirmed } = opts;
  return {
    aspectRatio: '1 / 1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-body)',
    fontSize: '0.8rem',
    background: isConfirmed
      ? 'var(--color-primary)'
      : isViewing
      ? 'rgba(26,111,212,0.16)'
      : 'transparent',
    color: !selectable
      ? 'rgba(245,245,245,0.15)'
      : isConfirmed
      ? 'var(--color-text)'
      : 'rgba(245,245,245,0.75)',
    border: isViewing && !isConfirmed ? '1px solid var(--color-primary)' : '1px solid transparent',
    cursor: selectable ? 'pointer' : 'not-allowed',
    transition: 'background 0.2s ease, border-color 0.2s ease, color 0.2s ease',
  };
}

function slotButtonStyle(opts: { isTaken: boolean; isSelected: boolean }): React.CSSProperties {
  const { isTaken, isSelected } = opts;
  return {
    padding: '0.6rem 0.5rem',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.72rem',
    letterSpacing: '0.03em',
    textAlign: 'center',
    background: isSelected ? 'var(--color-primary)' : 'rgba(26,111,212,0.04)',
    color: isTaken ? 'rgba(245,245,245,0.2)' : isSelected ? 'var(--color-text)' : 'rgba(245,245,245,0.75)',
    border: isSelected ? '1px solid var(--color-primary)' : '1px solid rgba(26,111,212,0.2)',
    textDecoration: isTaken ? 'line-through' : 'none',
    cursor: isTaken ? 'not-allowed' : 'pointer',
    transition: 'background 0.2s ease, border-color 0.2s ease, color 0.2s ease',
  };
}

// ── Component ──────────────────────────────────────────────────────────────────

interface BookingCalendarProps {
  selectedDate: string | null;
  selectedTimeSlot: string | null;
  onSelect: (date: string, timeSlot: string) => void;
}

export default function BookingCalendar({ selectedDate, selectedTimeSlot, onSelect }: BookingCalendarProps) {
  const today = useMemo(() => new Date(), []);
  const { earliest, latest } = useMemo(() => getBookingWindow(today), [today]);

  const [viewMonth, setViewMonth]     = useState<Date>(() => startOfMonth(earliest));
  const [viewingDate, setViewingDate] = useState<string | null>(selectedDate);
  const [takenSlots, setTakenSlots]   = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotError, setSlotError]     = useState('');

  const cells = useMemo(() => getMonthGrid(viewMonth), [viewMonth]);

  const prevDisabled = viewMonth <= startOfMonth(earliest);
  const nextDisabled = viewMonth >= startOfMonth(latest);

  useEffect(() => {
    if (!viewingDate) return; // nothing renders the slot list without a viewingDate

    let cancelled = false;
    setLoadingSlots(true);
    setSlotError('');

    fetch(`/api/booking/availability?date=${viewingDate}`)
      .then(res => res.json())
      .then((data: { takenSlots?: string[]; error?: string }) => {
        if (cancelled) return;
        if (data.error) {
          setSlotError(data.error);
          setTakenSlots([]);
        } else {
          setTakenSlots(data.takenSlots ?? []);
        }
      })
      .catch(() => { if (!cancelled) setSlotError('Could not load availability. Please try again.'); })
      .finally(() => { if (!cancelled) setLoadingSlots(false); });

    return () => { cancelled = true; };
  }, [viewingDate]);

  function handleDayClick(d: Date) {
    if (!isSelectableDate(d, today)) return;
    setViewingDate(toDateKey(d));
  }

  function handleSlotClick(slot: string) {
    if (!viewingDate) return;
    onSelect(viewingDate, slot);
  }

  function goPrev() {
    if (prevDisabled) return;
    setViewMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  }
  function goNext() {
    if (nextDisabled) return;
    setViewMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1));
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
      {/* Month nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={goPrev} disabled={prevDisabled} aria-label="Previous month" data-hover={!prevDisabled || undefined} style={navBtnStyle(prevDisabled)}>
          <ChevronLeft size={15} aria-hidden />
        </button>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'rgba(245,245,245,0.6)',
        }}>
          {viewMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
        </span>
        <button onClick={goNext} disabled={nextDisabled} aria-label="Next month" data-hover={!nextDisabled || undefined} style={navBtnStyle(nextDisabled)}>
          <ChevronRight size={15} aria-hidden />
        </button>
      </div>

      {/* Weekday header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
        {WEEKDAY_LABELS.map(w => (
          <div key={w} style={{
            textAlign: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55rem',
            letterSpacing: '0.1em',
            color: 'rgba(245,245,245,0.3)',
          }}>
            {w}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${viewMonth.getFullYear()}-${viewMonth.getMonth()}`}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}
        >
          {cells.map((d, i) => {
            if (!d) return <div key={i} />;
            const key = toDateKey(d);
            const selectable  = isSelectableDate(d, today);
            const isViewing   = key === viewingDate;
            const isConfirmed = key === selectedDate && !!selectedTimeSlot;
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleDayClick(d)}
                disabled={!selectable}
                data-hover={selectable || undefined}
                style={dayCellStyle({ selectable, isViewing, isConfirmed })}
              >
                {d.getDate()}
              </button>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Slot list for the day being viewed */}
      {viewingDate && (
        <div style={{ marginTop: '0.25rem' }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(245,245,245,0.35)',
            marginBottom: '0.75rem',
          }}>
            {formatDateLabel(viewingDate)}
          </p>

          {loadingSlots ? (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'rgba(245,245,245,0.4)' }}>
              Checking availability…
            </p>
          ) : slotError ? (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#ff4444' }}>
              {slotError}
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))', gap: '0.5rem' }}>
              {TIME_SLOTS.map(slot => {
                const isTaken    = takenSlots.includes(slot);
                const isSelected = viewingDate === selectedDate && slot === selectedTimeSlot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => handleSlotClick(slot)}
                    disabled={isTaken}
                    data-hover={!isTaken || undefined}
                    style={slotButtonStyle({ isTaken, isSelected })}
                  >
                    {formatSlotLabel(slot)}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
