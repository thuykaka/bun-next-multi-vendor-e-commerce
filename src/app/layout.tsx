import type { Metadata } from 'next';
import NextTopLoader from 'nextjs-toploader';
import { fontVariables } from '@/lib/font';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Multi-Vendor E-Commerce Marketplace',
  description: 'Multi-Vendor E-Commerce Marketplace'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={cn(
          'bg-background overflow-hidden overscroll-none font-sans antialiased',
          fontVariables
        )}
      >
        <NextTopLoader showSpinner={false} color='var(--primary)' />
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <Toaster richColors />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
