import { esc, headline, layout, para, textLayout, type EmailParts } from './layout';

// Confirmation for someone who joined a product's launch list (sendLaunchSignup).
export function buildLaunchSignup(p: { productName: string }): EmailParts {
  const reason = `You got this because you joined the ${p.productName} launch list on nesturex.com. It's a one-time heads-up, no newsletter.`;

  const html = layout({
    title: "You're on the list | Nesture-X",
    preheader: `We'll tell you the moment ${p.productName} goes live.`,
    reason,
    body: [
      headline("You're on the", 'list.'),
      para("You're in."),
      para(`We'll email this address the moment <strong style="color:#3d8ef0;">${esc(p.productName)}</strong> goes live. No spam, just the one heads-up.`),
      para('Until then, we keep building.', { muted: true }),
      para('The Nesture-X team', { last: true }),
    ].join('\n'),
  });

  const text = textLayout([
    "YOU'RE ON THE LIST.",
    '',
    "You're in.",
    '',
    `We'll email this address the moment ${p.productName} goes live. No spam, just the one heads-up.`,
    '',
    'Until then, we keep building.',
    '',
    'The Nesture-X team',
  ], reason);

  return { html, text };
}
