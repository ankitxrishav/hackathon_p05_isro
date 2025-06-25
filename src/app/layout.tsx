
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Sidebar } from '@/components/layout/sidebar';
import { cn } from '@/lib/utils';
import { Footer } from '@/components/layout/footer';
import { PT_Sans } from 'next/font/google';

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-pt-sans',
});

export const metadata: Metadata = {
  title: 'bxcd project',
  description: 'An intuitive air quality and weather visualizer.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={ptSans.variable}>
      <head />
      <body className={cn("font-body antialiased", "bg-background text-foreground")}>
        <div className="flex min-h-screen w-full">
          <Sidebar />
          <div className="flex flex-col flex-1">
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
