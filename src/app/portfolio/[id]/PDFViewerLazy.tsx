'use client';

import dynamic from 'next/dynamic';

// react-pdf touches window, so the viewer loads on the client only. `ssr: false` is
// only allowed inside a client component, hence this thin wrapper for the server page.
const PDFViewerClient = dynamic(() => import('./PDFViewerClient'), {
  ssr: false,
  loading: () => <div className="nxpf-pdf nxpf-pdf-skeleton" aria-hidden="true" />,
});

export default function PDFViewerLazy(props: { src: string; title: string }) {
  return <PDFViewerClient {...props} />;
}
