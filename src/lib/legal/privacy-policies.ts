export interface PrivacyPolicySection {
  heading: string;
  body: string;
}

export interface PrivacyPolicy {
  slug: string;
  appName: string;
  platform: string;
  lastUpdated: string;
  sections: PrivacyPolicySection[];
  contactEmail: string;
}

const CONTACT_EMAIL = 'Nesture-x@gmail.com';

const PLACEHOLDER_SECTIONS = (appName: string): PrivacyPolicySection[] => [
  {
    heading: 'Information We Collect',
    body: `[PLACEHOLDER — Peter to finalize] Describe the specific data ${appName} collects (e.g. account details, device identifiers, usage analytics, location data).`,
  },
  {
    heading: 'How We Use Your Information',
    body: `[PLACEHOLDER — Peter to finalize] Describe how ${appName} uses the collected data (e.g. to operate core features, improve the app, personalize content, communicate with users).`,
  },
  {
    heading: 'Third-Party Services',
    body: `[PLACEHOLDER — Peter to finalize] List third-party SDKs and services ${appName} integrates with (e.g. analytics, crash reporting, ad networks, payment processors) and link to their privacy policies.`,
  },
  {
    heading: 'Data Retention & Deletion',
    body: `[PLACEHOLDER — Peter to finalize] Describe how long ${appName} retains user data and how users can request deletion of their data.`,
  },
  {
    heading: "Children's Privacy",
    body: `[PLACEHOLDER — Peter to finalize] State whether ${appName} is directed at children under 13 and how COPPA-related concerns are handled.`,
  },
  {
    heading: 'Changes to This Policy',
    body: `[PLACEHOLDER — Peter to finalize] Explain how users will be notified of changes to this policy for ${appName}.`,
  },
  {
    heading: 'Contact Us',
    body: `[PLACEHOLDER — Peter to finalize] Questions about this policy for ${appName} can be directed to ${CONTACT_EMAIL}.`,
  },
];

export const privacyPolicies: PrivacyPolicy[] = [
  {
    slug: 'betledger',
    appName: 'BetLedger',
    platform: 'Android / React Native',
    lastUpdated: '2026-07-16',
    sections: PLACEHOLDER_SECTIONS('BetLedger'),
    contactEmail: CONTACT_EMAIL,
  },
  {
    slug: 'hikarani',
    appName: 'Hikarani',
    platform: 'Android / React Native',
    lastUpdated: '2026-07-16',
    sections: PLACEHOLDER_SECTIONS('Hikarani'),
    contactEmail: CONTACT_EMAIL,
  },
  {
    slug: 'kikota',
    appName: 'Kikota',
    platform: 'Android / React Native',
    lastUpdated: '2026-07-16',
    sections: PLACEHOLDER_SECTIONS('Kikota'),
    contactEmail: CONTACT_EMAIL,
  },
  {
    slug: 'no-snooze-alarm',
    appName: 'No-Snooze Alarm',
    platform: 'Android / React Native',
    lastUpdated: '2026-07-16',
    sections: PLACEHOLDER_SECTIONS('No-Snooze Alarm'),
    contactEmail: CONTACT_EMAIL,
  },
  {
    slug: 'unnamed-game',
    appName: 'NX Game Project — Working Title',
    platform: 'Android / React Native',
    lastUpdated: '2026-07-16',
    sections: PLACEHOLDER_SECTIONS('NX Game Project'),
    contactEmail: CONTACT_EMAIL,
  },
];
