import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ma Routine — Safiatou",
  description: "Ton app de discipline quotidienne",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, title: "Ma Routine", statusBarStyle: "black-translucent" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap"/>
        <link rel="apple-touch-icon" href="/icon-192.png"/>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="mobile-web-app-capable" content="yes"/>
        <meta name="theme-color" content="#6B3FA0"/>
      </head>
      <body style={{
        fontFamily: "'DM Sans', system-ui, sans-serif",
        background: '#FAF8FF', margin: 0, padding: 0,
      }}>
        {children}
      </body>
    </html>
  );
}
