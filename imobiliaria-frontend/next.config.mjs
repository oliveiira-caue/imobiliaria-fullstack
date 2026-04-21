/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Compressão gzip/brotli automática das respostas HTTP
  compress: true,

  // 2. Otimização de imagens: aceita imagens do backend local e produção
  images: {
    remotePatterns: [
      { protocol: "http",  hostname: "localhost", port: "8000", pathname: "/**" },
      { protocol: "https", hostname: "**",        pathname: "/**" },
    ],
    // Formatos modernos: WebP e AVIF são ~30-50% menores que JPEG
    formats: ["image/avif", "image/webp"],
    // Cache de imagens otimizadas por 30 dias
    minimumCacheTTL: 2592000,
  },

  // 3. Headers de cache para assets estáticos (JS, CSS, fonts, imagens públicas)
  async headers() {
    return [
      {
        source: "/(.*\\.(?:js|css|woff2|woff|ttf|png|jpg|jpeg|svg|ico|webp|avif))",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // API: sem cache no browser, mas permite CDN revalidar
        source: "/api/(.*)",
        headers: [
          { key: "Cache-Control", value: "no-store" },
        ],
      },
    ];
  },

  // 4. Experimental: otimizações de bundle e CSS
  experimental: {
    optimizePackageImports: ["@vis.gl/react-google-maps"],
  },
};

export default nextConfig;
