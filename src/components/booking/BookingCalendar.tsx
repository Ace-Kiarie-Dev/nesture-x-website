'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { cx } from '@/components/redesign/cx';
import {
  TIME_SLOTS,
  getBookingWindow,
  isSelectableDate,
  parseDateKey,
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

// Styles: components/redesign/booking/booking.css. Taken slots are struck through and
// labelled "Taken", the picked one carries a tick, so state never rests on colour alone.

// ── Component ──────────────────────────────────────────────────────────────────

interface BookingCalendarProps {
  selectedDate: string | null;
  selectedTimeSlot: string | null;
  onSelect: (date: string, timeSlot: string) => void;
}

export default function BookingCalendar({ selectedDate, selectedTimeSlot, onSelect }: BookingCalendarProps) {
  const today = useMemo(() => new Date(), []);
  const { earliest, latest } = useMemo(() => getBookingWindow(today), [today]);

  // Open on the chosen date's month when coming back to the calendar.
  const [viewMonth, setViewMonth]     = useState<Date>(() => {
    const chosen = selectedDate ? parseDateKey(selectedDate) : null;
    return startOfMonth(chosen ?? earliest);
  });
  const [viewingDate, setViewingDate] = useState<string | null>(selectedDate);
  // Availability for the day being viewed. Loading, error and taken slots are derived
  // from it, so a result for another day never shows.
  const [slotsResult, setSlotsResult] = useState<{ date: string; takenSlots: string[]; error: string } | null>(null);
  const current      = slotsResult && slotsResult.date === viewingDate ? slotsResult : null;
  const loadingSlots = !!viewingDate && !current;
  const slotError    = current?.error ?? '';
  const takenSlots   = current?.takenSlots ?? [];

  const cells = useMemo(() => getMonthGrid(viewMonth), [viewMonth]);

  const prevDisabled = viewMonth <= startOfMonth(earliest);
  const nextDisabled = viewMonth >= startOfMonth(latest);

  useEffect(() => {
    if (!viewingDate) return; // nothing renders the slot list without a viewingDate

    let cancelled = false;
    const date = viewingDate;

    fetch(`/api/booking/availability?date=${date}`)
      .then(res => res.json())
      .then((data: { takenSlots?: string[]; error?: string }) => {
        if (cancelled) return;
        if (data.error) {
          setSlotsResult({ date, takenSlots: [], error: data.error });
        } else {
          setSlotsResult({ date, takenSlots: data.takenSlots ?? [], error: '' });
        }
      })
      .catch(() => {
        if (!cancelled) setSlotsResult({ date, takenSlots: [], error: 'Could not load availability. Please try again.' });
      });

    return () => { cancelled = true; };
  }, [viewingDate]);

  function handleDayClick(d: Date) {
    if (!isSelectableDate(d, today)) return;
    const key = toDateKey(d);
    if (key === viewingDate) return; // same day: no refetch, as before
    setSlotsResult(null); // show loading until this day's fetch lands
    setViewingDate(key);
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
    <div className="nxbk-cal">
      <div className="nxbk-cal-month">
        {/* Month nav */}
        <div className="nxbk-cal-nav">
          <button type="button" onClick={goPrev} disabled={prevDisabled} aria-label="Previous month" className="nxbk-cal-arrow">
            <ChevronLeft size={18} aria-hidden />
          </button>
          <p className="nxbk-cal-title" aria-live="polite">
            {viewMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
          </p>
          <button type="button" onClick={goNext} disabled={nextDisabled} aria-label="Next month" className="nxbk-cal-arrow">
            <ChevronRight size={18} aria-hidden />
          </button>
        </div>

        {/* Weekday header (each day button carries its full date for screen readers) */}
        <div className="nxbk-cal-week" aria-hidden="true">
          {WEEKDAY_LABELS.map(w => (
            <span key={w}>{w}</span>
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
            className="nxbk-cal-grid"
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
                  aria-label={formatDateLabel(key)}
                  aria-pressed={selectable ? isViewing : undefined}
                  className={cx('nxbk-day', isViewing && 'is-viewing', isConfirmed && 'is-confirmed')}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slot list for the day being viewed. Fixed min-height so loading → slots doesn't jump. */}
      <div className="nxbk-slots-area">
        {viewingDate ? (
          <>
            <p className="nxbk-slots-date">
              {formatDateLabel(viewingDate)}
            </p>

            {loadingSlots ? (
              <p className="nxbk-slot-status" role="status">
                <span className="nxbk-spinner nxbk-spinner--blue" aria-hidden="true" />
                Checking availability…
              </p>
            ) : slotError ? (
              <p className="nx-form-error" role="alert">
                {slotError}
              </p>
            ) : (
              <div className="nxbk-slots" role="group" aria-label={`Times on ${formatDateLabel(viewingDate)}`}>
                {TIME_SLOTS.map(slot => {
                  const isTaken    = takenSlots.includes(slot);
                  const isSelected = viewingDate === selectedDate && slot === selectedTimeSlot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => handleSlotClick(slot)}
                      disabled={isTaken}
                      aria-pressed={isTaken ? undefined : isSelected}
                      className={cx('nxbk-slot', isTaken && 'is-taken', isSelected && 'is-selected')}
                    >
                      {isSelected && <Check size={14} strokeWidth={3} aria-hidden />}
                      <span className="nxbk-slot-time">{formatSlotLabel(slot)}</span>
                      {isTaken && <span className="nxbk-slot-tag">Taken</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <p className="nxbk-slots-hint">Pick a weekday to see open times.</p>
        )}
      </div>
    </div>
  );
}
