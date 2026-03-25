'use client';

// @ts-ignore: Mengabaikan error tipe TypeScript untuk Lenis
import { ReactLenis } from '@studio-freight/react-lenis';
import { ThemeProvider } from 'next-themes';
import { useEffect, useState } from 'react';

export default function Provider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    // @ts-ignore: Bypass strict type checking di React 19 untuk ThemeProvider
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ReactLenis root options={{ lerp: 0.05, smoothWheel: true }}>
        {children}
      </ReactLenis>
    </ThemeProvider>
  );
}