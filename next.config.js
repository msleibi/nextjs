/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
	// Bildgrößen, hier ist es überlegenswert, den größten Wert
	// aus der Standard Konfiguration (3840) zu verkleinern.
	deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2560],
	formats: ['image/avif', 'image/webp'],
	domains: ['react.webworker.berlin'],
  },
};

module.exports = nextConfig;

