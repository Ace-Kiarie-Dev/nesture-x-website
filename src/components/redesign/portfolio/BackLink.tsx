import Link from 'next/link';

// "← Portfolio" style link at the top of each portfolio sub-screen.
export default function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="nxpf-back">
      <span aria-hidden="true">←</span> {label}
    </Link>
  );
}
