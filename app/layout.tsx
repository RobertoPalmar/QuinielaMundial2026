import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quiniela Mundial 2026",
  description: "Tablero de la quiniela del Mundial FIFA 2026",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${geist.variable} antialiased`}>
      <body className="min-h-dvh flex flex-col">
        <Navbar />
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="border-t border-[var(--color-border)] py-6 text-center text-sm text-[var(--color-muted)]">
          Quiniela Mundial FIFA 2026 ⚽
        </footer>
      </body>
    </html>
  );
}
