import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NFL Draft Board – Forstner Scouting",
  description: "NFL Draft Buzz Style Dashboard powered by Forstner Scouting",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
