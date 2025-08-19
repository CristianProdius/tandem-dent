import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import NavigationHeader from "@/components/layout/NavigationHeader";
import "./globals.css";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tandem Dent - Clinică Stomatologică Premium în Chișinău",
  description:
    "Clinica Stomatologică Tandem Dent oferă servicii stomatologice complete în Chișinău. Implantologie, ortodonție, estetică dentară cu echipamente moderne.",
  keywords:
    "stomatologie Chișinău, dentist Chișinău, implant dentar, ortodonție, Tandem Dent",
  authors: [{ name: "Tandem Dent" }],
  openGraph: {
    title: "Tandem Dent - Zâmbete Sănătoase în Chișinău",
    description:
      "Pentru noi eficacitatea tratamentului și siguranța pacienților este prioritară!",
    url: "https://tandemdent.md",
    siteName: "Tandem Dent",
    locale: "ro_MD",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tandem Dent - Clinică Stomatologică Premium",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tandem Dent - Clinică Stomatologică Premium",
    description: "Servicii stomatologice complete în Chișinău",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" className="scroll-smooth">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        {/* Skip to main content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-gold-600 text-white px-4 py-2 rounded-lg z-50"
        >
          Sari la conținutul principal
        </a>

        {/* Navigation Header */}
        <NavigationHeader />

        {/* Main Content */}
        <main id="main-content" className="min-h-screen">
          {children}
        </main>

        <footer>
          <Footer />
        </footer>
      </body>
    </html>
  );
}
