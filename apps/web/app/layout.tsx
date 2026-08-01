import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mikio AI",
  description: "An AI assistant built for developers — coding, debugging, and building software faster.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
