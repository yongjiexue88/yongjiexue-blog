import '@/styles/globals.css';

// react
import React from 'react';

// next
import dynamic from 'next/dynamic';
import { Metadata } from 'next';

// analytics
import { Analytics } from '@vercel/analytics/react';

// next-intl
import { NextIntlClientProvider } from 'next-intl';
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ja' }];
}

// providers
import Providers from '@/providers/Providers';

// font
import { Raleway, Merriweather } from 'next/font/google';
const raleway = Raleway({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--raleway',
});
const merriweather = Merriweather({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--merriweather',
});

// components
const Header = dynamic(() => import('@/components/Header/Header'));
const Footer = dynamic(() => import('@/components/Footer/Footer'));
// const Logo = dynamic(() => import('@/components/Common/Logo'));
import ScrollToTop from '@/components/Layout/ScrollToTop';

// metadata
export const metadata: Metadata = {
  title: 'Yongjie Xue | Portfolio & Blog',
  description: "Yongjie Xue's personal portfolio and blog — software engineer, full-stack developer",
  keywords:
    'Yongjie Xue, Portfolio, Software Engineer, Full-Stack Developer, Python, React, Blog, Projects',
  viewport: 'width=device-width, initial-scale=1.0',
  icons: {
    icon: '/images/favicon.webp',
  },
  metadataBase: new URL('https://yongjiexue.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Yongjie Xue | Portfolio & Blog',
    siteName: 'Yongjie Xue | Portfolio & Blog',
    description:
      "Yongjie Xue's portfolio, blog, projects, and contact information",
    images: {
      url: '/images/screenshots/home.webp',
      alt: "Yongjie Xue's Portfolio",
      width: 800,
      height: 440,
      type: 'image/webp',
      secureUrl: '/images/screenshots/home.webp',
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yongjie Xue | Portfolio & Blog',
    description:
      "Yongjie Xue's portfolio, blog, projects, and contact information",
    images: '/images/screenshots/home.webp',
  },
};

// types
interface rootLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function RootLayout({
  children,
  params: { locale },
}: rootLayoutProps) {
  let messages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    // notFound();
  }

  return (
    <html
      lang={locale}
      className="snap-y snap-proximity scroll-smooth"
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              email: 'yongjiexue@gmail.com',
              image: 'https://yongjiexue.com/images/profile.webp',
              jobTitle: 'Software Engineer',
              name: 'Yongjie Xue',
              url: 'https://yongjiexue.com',
              sameAs: [
                'https://www.linkedin.com/in/yongjiexue/',
                'https://github.com/yongjiexue88/',
              ],
            }),
          }}
        ></script>
      </head>
      <body className={`${raleway.variable} ${merriweather.variable}`}>
        {/* <Logo /> */}
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <ScrollToTop />
            <Header />
            <main className={`min-h-screen font-raleway`}>{children}</main>
            <Footer />
          </Providers>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
