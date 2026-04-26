import type { Metadata } from "next";
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
  metadataBase: new URL("https://www.clearpd.com"),
  title: {
    default: "ClearPD — Perioral Dermatitis Ingredient Checker",
    template: "%s · ClearPD",
  },
  description:
    "Check if your skincare, toothpaste, or makeup is safe for perioral dermatitis (PD). Free position-weighted ingredient analysis of 40+ known triggers. No signup.",
  keywords: [
    "perioral dermatitis",
    "perioral dermatitis ingredient checker",
    "PD ingredient checker",
    "fluoride toothpaste perioral dermatitis",
    "SLS perioral dermatitis",
    "periorificial dermatitis",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "ClearPD — Perioral Dermatitis Ingredient Checker",
    description:
      "Free ingredient analysis for perioral dermatitis. Scan, photograph, or paste any product. No signup.",
    url: "/",
    siteName: "ClearPD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClearPD — Perioral Dermatitis Ingredient Checker",
    description:
      "Free ingredient analysis for perioral dermatitis. No signup.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
