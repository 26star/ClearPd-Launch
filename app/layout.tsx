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
  metadataBase: new URL("https://clearpd.com"),
  title: {
    default: "ClearPD — Is your skincare safe for perioral dermatitis?",
    template: "%s · ClearPD",
  },
  description:
    "Scan, photograph, or paste any product to check if it's safe for perioral dermatitis. Tiered ingredient verdicts (Safe / Caution / Avoid) based on community evidence from thousands of PD sufferers.",
  keywords: [
    "perioral dermatitis",
    "PD safe skincare",
    "perioral dermatitis ingredient checker",
    "fluoride toothpaste perioral dermatitis",
    "SLS perioral dermatitis",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "ClearPD — Is your skincare safe for perioral dermatitis?",
    description:
      "Tiered ingredient verdicts for perioral dermatitis, based on real community evidence.",
    url: "/",
    siteName: "ClearPD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClearPD — Is your skincare safe for perioral dermatitis?",
    description:
      "Tiered ingredient verdicts for perioral dermatitis, based on real community evidence.",
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
