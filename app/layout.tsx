import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./ui/navigation";

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
      <body className="h-screen">
        {/* <Sidebar/>
        <div className="pt-14 h-full"> */}
          {children}
        {/* </div> */}
      </body>
    </html>
  );
}
