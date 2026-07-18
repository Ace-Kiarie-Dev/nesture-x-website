export interface PrivacyPolicySection {
  heading: string;
  body: string;
}

export interface PrivacyPolicy {
  slug: string;
  appName: string;
  platform: string;
  lastUpdated: string;
  intro?: string;
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
    appName: 'Bet Ledger',
    platform: 'Android / React Native',
    lastUpdated: '2026-07-18',
    contactEmail: 'nesturex@gmail.com',
    intro:
      'Bet Ledger is a personal betting-record app. It helps you keep an honest record of the bets you place elsewhere, so you can see what your betting is actually costing you.\n\nBet Ledger does not accept bets, hold money, provide odds, offer tips or predictions, or connect to any betting platform. It is a record-keeping tool and nothing else.\n\nThis policy explains what personal data Bet Ledger collects, why, where it is stored, and what rights you have over it.',
    sections: [
      {
        heading: 'Who is responsible for your data',
        body: 'Data controller: Peter Kiarie (trading as Nesture-X), Nairobi, Kenya\n\nContact: nesturex@gmail.com\n\nThis policy is published at https://nesturex.com/legal/betledger/privacy',
      },
      {
        heading: 'Who can use Bet Ledger',
        body: 'Bet Ledger is intended only for people aged 18 years or older. It is not directed at children, and we do not knowingly collect personal data from anyone under 18. If you believe someone under 18 has created an account, contact nesturex@gmail.com and we will delete it.',
      },
      {
        heading: 'What data we collect',
        body: 'Bet Ledger collects only what it needs to work. There is no advertising, no analytics, no tracking, and no profiling.\n\nAccount information: When you sign in with Google, Firebase Authentication provides us with your email address, display name, and profile photo. We do not receive your Google password or have any access to your Google account beyond this.\n\nInformation you enter: Bet records (stake, odds, market, selection, sport, betting platform, outcome, and match time), a username you choose within the app, and a weekly budget you set for yourself.\n\nInformation the app derives: Bet Ledger calculates statistics from the bets you record, including profit and loss, win rate, and streaks. These are derived from your own entries; we do not obtain them from anywhere else.\n\nWhat we do not collect: We do not collect your phone number, location, contacts, financial account details, payment information, or your activity on betting platforms. Bet Ledger has no connection to Betika, SportPesa, Odibets, M-Cheza, or any other operator. It only knows what you type into it.',
      },
      {
        heading: 'Why we process your data',
        body: 'We use your account information to create and secure your account (legal basis: Performance of a contract with you). We use your bet records, username, and weekly budget to store and display your betting records (legal basis: Performance of a contract with you). We use your bet records to calculate your statistics and insights (legal basis: Performance of a contract with you). We do not use your data for advertising, and we never sell it.',
      },
      {
        heading: 'Where your data is stored',
        body: 'Your data is stored using Google Firebase (Firebase Authentication and Cloud Firestore).\n\nYour Bet Ledger data is stored on servers located in Belgium (Google Cloud region europe-west1), not in Kenya.\n\nThis means your personal data is transferred outside Kenya. Under sections 48 and 49 of the Data Protection Act, 2019, we rely on the following safeguards for this transfer: Google is contractually bound, through the Firebase Data Processing and Security Terms, to protect the data it processes on our behalf; Belgium is within the European Union, where data protection standards are broadly comparable to those required under Kenyan law; and data is encrypted in transit and at rest. By using Bet Ledger, you acknowledge that your data is stored outside Kenya on this basis.',
      },
      {
        heading: 'Who we share your data with',
        body: "We do not sell your data. We do not share it with advertisers. We do not share it with betting operators.\n\nThe only third party involved is Google (Firebase), which stores and processes data on our behalf as our data processor. Google does not use your Bet Ledger data for its own purposes. Firebase's own privacy information is available at https://firebase.google.com/support/privacy.\n\nWe may disclose your data if we are legally required to do so — for example, in response to a valid court order or a lawful demand from a Kenyan authority.",
      },
      {
        heading: 'How long we keep your data',
        body: 'We keep your data for as long as your account exists. We do not automatically delete inactive accounts, because your betting history is the point of the app — a record that disappears is not a record.\n\nIf you want your data gone, you can delete it at any time (see the Deleting Your Account section below). When you delete your account, your data is removed immediately and permanently. It is not recoverable, by you or by us.',
      },
      {
        heading: 'Your rights',
        body: 'Under the Data Protection Act, 2019, you have the right to: be informed about how your data is used (this policy), access the personal data we hold about you, correct data that is inaccurate or incomplete, delete your data (right to erasure), object to how we process your data, and lodge a complaint with the Office of the Data Protection Commissioner (ODPC) at https://www.odpc.go.ke.\n\nTo exercise any of these rights, email nesturex@gmail.com. We will respond within a reasonable period and in any case within 30 days.',
      },
      {
        heading: 'Deleting your account and data',
        body: 'In the app (immediate): Open Bet Ledger, go to Settings, tap Delete Account, confirm. Your bet history, statistics, username, budget, and sign-in record are permanently deleted straight away. This cannot be undone.\n\nBy email (if you no longer have the app): Email nesturex@gmail.com from the Google account address you signed up with, asking for your account to be deleted. We will delete it within 30 days of receiving your request.\n\nWhat deletion removes: Your Firebase Authentication record (your sign-in), your entire bet history, and your statistics, username, and weekly budget. Nothing is retained afterwards. Deleting your Bet Ledger account does not affect your Google account, which stays exactly as it was.',
      },
      {
        heading: 'How we protect your data',
        body: 'All data is encrypted in transit (HTTPS/TLS) and at rest. Access is controlled by Firebase Security Rules, which restrict every record so that only the signed-in owner can read or write it. We use Google Sign-In rather than storing passwords, so there are no Bet Ledger passwords to leak. No Bet Ledger user data is accessible to other users of the app. No system is perfectly secure, but the app is built so that your betting records are visible to you and no one else.',
      },
      {
        heading: 'Changes to this policy',
        body: 'If we change this policy, we will update the date at the top and post the new version at this URL. If a change materially affects your rights, we will make a reasonable effort to tell you in the app before it takes effect.',
      },
      {
        heading: 'Contact',
        body: 'Questions, requests, or complaints: nesturex@gmail.com. Controller: Peter Kiarie (Nesture-X), Nairobi, Kenya. If you are not satisfied with our response, you may complain to the Office of the Data Protection Commissioner of Kenya at https://www.odpc.go.ke.',
      },
    ],
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
