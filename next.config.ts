/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Terapkan ke semua rute di website
        source: '/(.*)',
        headers: [
          {
            // Mencegah website kamu dimasukkan ke dalam iframe web lain (Anti-Clickjacking)
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            // Memaksa browser mengecek tipe file dengan ketat (Anti MIME-Sniffing)
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            // Mengaktifkan filter XSS bawaan browser
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            // Memastikan koneksi selalu menggunakan HTTPS yang aman
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
};

export default nextConfig;