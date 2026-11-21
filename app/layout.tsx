import './globals.css';
import Provider from '@/components/Provider';
import Navbar from '@/components/Navbar';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Dalu Raziq Hidayatullah | POCO X3 Pro Kernel Developer',
  description:
    'Portofolio resmi Dalu Raziq Hidayatullah — Android Custom Kernel Developer spesialis POCO X3 Pro (vayu/bhima, Qualcomm Snapdragon 860), ReSukiSU + SuSFS, eBPF subsystem, dan AnyKernel3 packaging.',
  keywords: [
    'Dalu Raziq Hidayatullah',
    'POCO X3 Pro',
    'vayu',
    'bhima',
    'Android Kernel Developer',
    'Custom Kernel',
    'KernelSU',
    'ReSukiSU',
    'SuSFS',
    'Snapdragon 860',
    'sm8150',
    'AnyKernel3'
  ],
  authors: [{ name: 'Dalu Raziq Hidayatullah' }],
  robots: 'index, follow',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Dalu Raziq Hidayatullah | POCO X3 Pro Kernel Developer',
    description:
      'Portofolio resmi Dalu Raziq Hidayatullah — Android Custom Kernel Developer spesialis POCO X3 Pro (vayu/bhima, Snapdragon 860).',
    type: 'website',
    locale: 'id_ID',
    siteName: 'Dalu Raziq Portfolio',
  },
};

export const viewport: Viewport = {
  themeColor: '#020617',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark scroll-smooth" suppressHydrationWarning>
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen selection:bg-emerald-500 selection:text-black">
        <Provider>
          <Navbar />
          <main>{children}</main>
        </Provider>
      </body>
    </html>
  );
}
