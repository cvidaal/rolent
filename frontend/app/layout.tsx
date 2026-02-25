import "./globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rolent",
  description: "Analyze job offers strategically",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
