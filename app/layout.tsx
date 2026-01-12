import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HR Survey System - Broker Service Level Assessment",
  description: "Quarterly broker service evaluation form for HR",
};

// Inline script to set theme before hydration to prevent flash of wrong theme
const themeScript = `
  (function() {
    try {
      var theme = localStorage.getItem('theme');
      if (theme === 'light' || theme === 'dark' || theme === 'system') {
        document.documentElement.setAttribute('data-theme', theme);
      } else {
        document.documentElement.setAttribute('data-theme', 'system');
      }
    } catch (e) {
      document.documentElement.setAttribute('data-theme', 'system');
    }
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
