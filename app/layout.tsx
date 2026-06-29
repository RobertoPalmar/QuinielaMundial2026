import "./globals.css";
import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Quiniela Mundial 2026",
  description: "Quiniela del Mundial FIFA 2026 — pronósticos, ranking y admin.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let username: string | null = null;
  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("username, role")
      .eq("id", user.id)
      .single();
    username = profile?.username ?? null;
    isAdmin = profile?.role === "admin";
  }

  return (
    <html lang="es" className={spaceGrotesk.variable}>
      <body className="min-h-screen flex flex-col">
        <Navbar user={username} isAdmin={isAdmin} />
        <main className="flex-1 w-full mx-auto max-w-[1024px] px-4 md:px-6 py-6 md:py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
