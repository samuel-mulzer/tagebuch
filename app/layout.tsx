import type { Metadata } from "next"
import "./globals.css"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Tagebuch eines Landpfarrers",
  description: "Archiv aller Tagebucheinträge aus Tagebuch eines Landpfarrers - Ulrich Fentzloff"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <head>
        <link rel="icon" href="/icon" type="image/png" sizes="32x32" />
      </head>
      <body className={"antialiased container mx-auto px-4 mb-20"}>
        <nav className="py-8 flex gap-8">
          <Link href={'/'}>Start</Link>
          <Link href={'/search/'}>Suche</Link>
          <Link href={'/timeline/'}>Zeitreise</Link>
        </nav>
        <h1 className="text-4xl font-extrabold pb-12">Tagebuch eines Landpfarrers</h1>
        {children}
      </body>
    </html>
  );
}
