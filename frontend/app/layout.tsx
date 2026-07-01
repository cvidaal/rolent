import "./globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rolent — Know if you fit before you apply",
  description:
    "Analyze job offers against your profile. Get a match score, skill gaps, and apply with clarity — not guesswork.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
