import "./globals.css";

import { LanguageProvider } from "@/lib/i18n";
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{document.documentElement.dataset.theme=localStorage.getItem("rolent-theme")||"dark"}catch(e){}`,
          }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
