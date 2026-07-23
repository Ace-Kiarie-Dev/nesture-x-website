// Shared booking-calendar rules — read by the calendar UI (client) and the
// booking API route (server) so the constraints can't drift or be bypassed
// by a client that skips the UI and posts directly to the route.

export const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00'] as const;
export type TimeSlot = typeof TIME_SLOTS[number];

export const BOOKING_WINDOW_DAYS = 30;

export function isTimeSlot(value: string): value is TimeSlot {
  return (TIME_SLOTS as readonly string[]).includes(value);
}

export function isWeekday(date: Date): boolean {
  const day = date.getDay();
  return day !== 0 && day !== 6;
}

export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Earliest selectable day is tomorrow (no same-day booking); latest is
// BOOKING_WINDOW_DAYS out from today.
export function getBookingWindow(today: Date = new Date()): { earliest: Date; latest: Date } {
  const earliest = startOfDay(today);
  earliest.setDate(earliest.getDate() + 1);

  const latest = startOfDay(today);
  latest.setDate(latest.getDate() + BOOKING_WINDOW_DAYS);

  return { earliest, latest };
}

export function isSelectableDate(date: Date, today: Date = new Date()): boolean {
  if (!isWeekday(date)) return false;
  const { earliest, latest } = getBookingWindow(today);
  const d = startOfDay(date);
  return d >= earliest && d <= latest;
}

// 'YYYY-MM-DD' parsed as local-time midnight — avoids the UTC-parsing footgun
// of `new Date('YYYY-MM-DD')`, which would shift the date in negative-UTC-offset zones.
export function parseDateKey(dateKey: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey);
  if (!match) return null;
  const [, y, m, d] = match;
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

export function isValidBookingSlot(dateKey: string, timeSlot: string, today: Date = new Date()): boolean {
  if (!isTimeSlot(timeSlot)) return false;
  const date = parseDateKey(dateKey);
  if (!date) return false;
  return isSelectableDate(date, today);
}

export function formatSlotLabel(timeSlot: string): string {
  const [hStr, mStr] = timeSlot.split(':');
  const h = parseInt(hStr, 10);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${mStr} ${period}`;
}

export function formatDateLabel(dateKey: string): string {
  const date = parseDateKey(dateKey);
  if (!date) return dateKey;
  return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}
