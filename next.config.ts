/** @type {import('next').NextConfig} */
const nextConfig = {
  // Menyembunyikan "X-Powered-By: Next.js" dari response headers
  poweredByHeader: false,
  
  // Mengaktifkan security headers lapis pertama
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' }, // Mencegah Clickjacking
          { key: 'X-Content-Type-Options', value: 'nosniff' }, // Mencegah MIME-Sniffing
          { key: 'X-XSS-Protection', value: '1; mode=block' }, // Anti-XSS dasar
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }, // Wajib HTTPS
        ],
      },
    ];
  },
};

export default nextConfig;