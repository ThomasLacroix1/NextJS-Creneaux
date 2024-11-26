import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./ui/sidebar";

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
      <body>
        <Sidebar/>
        {children}
      </body>
    </html>
  );
}
