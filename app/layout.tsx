import type { Metadata } from 'next';
import './globals.css';
import '@xterm/xterm/css/xterm.css';

export const metadata: Metadata = {
  title: 'Homestead - Build from Anywhere',
  description: 'Build and tend your digital homestead',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: '#F76218',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Homestead',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
