// Structured data helpers. JSON-LD is rendered as a plain <script> in the
// server HTML; "<" is escaped so a value can never close the script tag.

export const SITE_URL = 'https://nesturex.com';

type JsonLdObject = Record<string, unknown>;

export function JsonLd({ data }: { data: JsonLdObject | JsonLdObject[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}

export interface Crumb {
  name: string;
  /** Root-relative path, e.g. "/tools/qr-generator". */
  path: string;
}

export function breadcrumbList(crumbs: Crumb[]): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.path === '/' ? '' : crumb.path}`,
    })),
  };
}
