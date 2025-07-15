import { Geist_Mono, Inter, DM_Sans } from 'next/font/google';
import { cn } from '@/lib/utils';

const fontSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans'
});

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono'
});

const fontInter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
});

const fontDMSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans'
});

export const fontVariables = cn(
  fontDMSans.variable,
  fontSans.variable,
  fontMono.variable,
  fontInter.variable
);
