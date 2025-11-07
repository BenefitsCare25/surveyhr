import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HR Survey System - Broker Service Level Assessment",
  description: "Quarterly broker service evaluation form for HR",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
