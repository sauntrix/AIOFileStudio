import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'All-In-One File Studio - Image Editor & File Converter',
  description: 'Professional online tools for image editing and file conversion. Resize, compress, convert - all in one place. Free, fast, and secure.',
  keywords: ['image editor', 'file converter', 'online tools', 'image resize', 'compress images'],
  authors: [{ name: 'All-In-One File Studio' }],
  creator: 'All-In-One File Studio',
  publisher: 'All-In-One File Studio',
  metadataBase: new URL('https://file-studio.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'All-In-One File Studio - Professional Online File Tools',
    description: 'Edit images and convert files with our free professional tools. No registration required.',
    url: 'https://file-studio.app',
    siteName: 'All-In-One File Studio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'All-In-One File Studio - Professional File Tools',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All-In-One File Studio - Professional Online File Tools',
    description: 'Edit images and convert files with our free professional tools.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#8b5cf6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}