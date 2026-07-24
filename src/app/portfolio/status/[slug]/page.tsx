import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NX_ORIGINALS } from '@/data/nxOriginals';
import { DEV_PROJECTS } from '@/data/devProjects';
import { slugify } from '@/lib/slugify';
import StatusPageClient, { type StatusProject } from './StatusPageClient';

// Primary source is nxOriginals.ts. A handful of WebDevGrid client-site
// projects (e.g. Vicking Ventures) don't have a live URL yet either, and
// aren't NX Originals — so every card can still have a destination (Part C),
// they fall back to a generic status page derived from their WebDevGrid entry.
function findProject(slug: string): StatusProject | null {
  const original = NX_ORIGINALS.find(item => item.slug === slug);
  if (original) {
    return {
      slug:        original.slug,
      title:       original.title,
      description: original.description,
      category:    original.category,
      status:      original.status,
    };
  }

  const clientSite = DEV_PROJECTS.find(p => !p.url && slugify(p.name) === slug);
  if (clientSite) {
    return {
      slug,
      title:       clientSite.name,
      description: clientSite.industry,
      category:    'web',
      status:      'In Development',
    };
  }

  return null;
}

export async function generateStaticParams() {
  return [
    ...NX_ORIGINALS.map(item => ({ slug: item.slug })),
    ...DEV_PROJECTS.filter(p => !p.url).map(p => ({ slug: slugify(p.name) })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) return {};
  return { title: `${project.title} | Nesture-X` };
}

export default async function StatusPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) notFound();

  return <StatusPageClient project={project} />;
}
