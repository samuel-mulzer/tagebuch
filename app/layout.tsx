import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tagebuch",
  description: "Tagebuch eines Landpfarrers Archiv",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased container mx-auto px-4`}>
        <nav className="py-8 flex gap-8">
          <Link href={'/'} className="text-lg">home</Link>
          <Link href={'/search/'} className="text-lg">search</Link>
        </nav>
        <h1 className="text-4xl font-extrabold pb-12">Tagebuch eines Landpfarrers</h1>
        {children}
      </body>
    </html>
  );
}
