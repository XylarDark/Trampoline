import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trampoline",
  description: "Readiness passport: health and work readiness on one record.",
};

const NAV = [
  { href: "/", label: "Overview" },
  { href: "/intake", label: "Intake" },
  { href: "/track", label: "Track" },
  { href: "/attestor", label: "Attestor" },
  { href: "/share/demo", label: "Share view" },
  { href: "/accommodation", label: "Accommodation" },
  { href: "/access-log", label: "Access log" },
] as const;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* WCAG 2.0 AA, 2.4.1: a way to skip the repeated nav. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:z-10 focus:m-2 focus:rounded focus:border focus:bg-background focus:px-3 focus:py-2 focus:text-sm"
        >
          Skip to main content
        </a>
        <header className="border-b">
          <nav className="mx-auto flex max-w-3xl flex-wrap items-center gap-4 px-6 py-4 text-sm">
            <Link href="/" className="font-semibold">
              Trampoline
            </Link>
            {NAV.slice(1).map((item) => (
              <Link key={item.href} href={item.href} className="text-muted-foreground hover:underline">
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main id="main" className="mx-auto w-full max-w-3xl flex-1 px-6 py-8">
          {children}
        </main>
        <footer className="border-t">
          <div className="mx-auto max-w-3xl px-6 py-4 text-sm text-muted-foreground">
            Targets WCAG 2.0 Level AA, the standard AODA requires.{" "}
            <Link href="/accommodation" className="underline">
              Request this information another way
            </Link>
            .
          </div>
        </footer>
      </body>
    </html>
  );
}
