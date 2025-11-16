import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import './globals.css'
import { Analytics } from '@vercel/analytics/next'

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://dailyst.ministud.io'),
  title: {
    default: 'Dailyst - 3 Most Important Things Today',
    template: '%s | Dailyst',
  },
  description:
    'A minimalistic app to track your 3 most important tasks each day. Focus on what matters most. Free, private, and works offline.',
  keywords: [
    'daily tasks',
    'task tracker',
    'productivity',
    'minimalist',
    'todo',
    'daily goals',
    'focus',
    'task management',
  ],
  authors: [{ name: 'Dailyst' }],
  creator: 'Dailyst',
  publisher: 'Dailyst',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://dailyst.ministud.io',
    siteName: 'Dailyst',
    title: 'Dailyst - 3 Most Important Things Today',
    description:
      'A minimalistic app to track your 3 most important tasks each day. Focus on what matters most.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Dailyst - Track your 3 most important tasks',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dailyst - 3 Most Important Things Today',
    description:
      'A minimalistic app to track your 3 most important tasks each day.',
    images: ['/opengraph-image'],
    creator: '@dailyst',
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
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
  alternates: {
    canonical: 'https://dailyst.ministud.io',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Dailyst',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${plusJakartaSans.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
          <Analytics />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'WebApplication',
                name: 'Dailyst',
                description:
                  'A minimalistic app to track your 3 most important tasks each day',
                url: 'https://dailyst.ministud.io',
                applicationCategory: 'ProductivityApplication',
                operatingSystem: 'Web',
                offers: {
                  '@type': 'Offer',
                  price: '0',
                  priceCurrency: 'USD',
                },
                featureList: [
                  'Daily task tracking',
                  '3 tasks limit',
                  'Offline support',
                  'Dark mode',
                  'History tracking',
                ],
              }),
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
