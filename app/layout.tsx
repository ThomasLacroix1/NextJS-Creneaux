import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Créneaux",
  description: "Application de gestion de créneaux",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="flex items-center justify-center p-4 min-h-screen">
        {children}
      </body>
    </html>
  );
}
