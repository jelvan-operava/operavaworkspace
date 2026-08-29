import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Google Workspace Client Portal | Material Design 3',
  description: 'Enterprise Client Portal following Google Material Design 3 specifications with Gemini AI assistance.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="font-[family-name:var(--font-sans)] antialiased">
        {children}
      </body>
    </html>
  );
}

