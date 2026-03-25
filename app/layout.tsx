import './globals.css';
import Provider from '@/components/Provider';
import CustomCursor from '@/components/CustomCursor';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'Dalu Raziq H. | Portofolio',
  description: 'Professional portfolio showcasing expertise in web development, IoT, and system modding.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50 transition-colors duration-300">
        <Provider>
          <CustomCursor />
          <Navbar />
          <main>{children}</main>
        </Provider>
      </body>
    </html>
  );
}