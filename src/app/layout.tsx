import type { Metadata } from "next";
import { Bebas_Neue, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ClientShell from "@/components/layout/ClientShell";

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-grotesk',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Nesture-X | Creative Technology Agency',
  description: 'Nairobi-based creative technology agency building world-class digital experiences. Web development, graphic design, and digital marketing.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${bebasNeue.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function() {
  // Theme toggle is temporarily hidden (see Navbar.tsx) pending light-mode
  // token completion. Forcing 'dark' here overrides any 'light' preference
  // a user saved before the toggle was hidden. Restore the commented-out
  // line below when the toggle is re-enabled.
  // const theme = localStorage.getItem('nx-theme') || 'dark';
  const theme = 'dark';
  document.documentElement.setAttribute('data-theme', theme);
})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ClientShell>
          {children}
        </ClientShell>
      </body>
    </html>
  );
}
