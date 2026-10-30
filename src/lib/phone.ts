// Phone format check shared by the booking form and /api/booking. Spaces and dashes
// are ignored, an optional leading + is allowed, and 9 to 13 digits must remain.
// Covers Kenyan numbers (07xx, 01xx, 2547xx, +2547xx) without blocking callers abroad.
export function isValidPhone(phone: string): boolean {
  return /^\+?\d{9,13}$/.test(phone.trim().replace(/[\s-]/g, ''));
}
