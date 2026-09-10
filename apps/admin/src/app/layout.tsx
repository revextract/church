import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Church Platform Admin",
  description: "Visual editor for white-labeled church websites",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
