// M-Pesa Daraja STK Push service

const BASE =
  process.env.MPESA_ENVIRONMENT === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke';

// ── Helpers ──────────────────────────────────────────────────────────────────

async function getToken(): Promise<string> {
  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString('base64');

  const res = await fetch(
    `${BASE}/oauth/v1/generate?grant_type=client_credentials`,
    { headers: { Authorization: `Basic ${auth}` }, cache: 'no-store' }
  );

  if (!res.ok) throw new Error(`M-Pesa token request failed: ${res.status}`);
  const data = await res.json();
  return data.access_token as string;
}

function timestamp(): string {
  return new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14);
}

function password(ts: string): string {
  return Buffer.from(
    `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${ts}`
  ).toString('base64');
}

/**
 * Normalise any Kenyan phone format to 254XXXXXXXXX.
 * Handles: 07XX, 01XX, +254XX, 254XX
 */
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('0'))   return `254${digits.slice(1)}`;
  if (digits.startsWith('254')) return digits;
  return `254${digits}`;
}

// ── STK Push ─────────────────────────────────────────────────────────────────

export interface StkPushResult {
  MerchantRequestID:   string;
  CheckoutRequestID:   string;
  ResponseCode:        string;
  ResponseDescription: string;
  CustomerMessage:     string;
}

export async function stkPush(
  phone: string,
  amount: number,
  ref: string
): Promise<StkPushResult> {
  const token = await getToken();
  const ts    = timestamp();

  const body = {
    BusinessShortCode: process.env.MPESA_SHORTCODE,
    Password:          password(ts),
    Timestamp:         ts,
    TransactionType:   'CustomerPayBillOnline',
    Amount:            amount,
    PartyA:            normalizePhone(phone),
    PartyB:            process.env.MPESA_SHORTCODE,
    PhoneNumber:       normalizePhone(phone),
    CallBackURL:       process.env.MPESA_CALLBACK_URL,
    AccountReference:  `NX-${ref.slice(-6).toUpperCase()}`,
    TransactionDesc:   'Nesture-X Consultation Fee',
  };

  const res = await fetch(`${BASE}/mpesa/stkpush/v1/processrequest`, {
    method:  'POST',
    headers: {
      Authorization:  `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body:  JSON.stringify(body),
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`STK Push failed: ${res.status}`);
  return res.json();
}
