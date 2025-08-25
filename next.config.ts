import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React Strict Mode for better development experience
  reactStrictMode: true,

  // Image optimization configuration
  images: {
    // Add unoptimized option for better Edge compatibility
    unoptimized: process.env.NODE_ENV === "development", // Disable optimization in dev

    // Allow local images
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tandemdent.md",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      // Add localhost for development
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],

    // Add domains for legacy support
    domains: ["tandemdent.md", "images.unsplash.com", "res.cloudinary.com"],

    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Add minimumCacheTTL for better caching control
    minimumCacheTTL: 60,

    // Allow SVG if you plan to use SVG logos
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
          // Add CORS headers for better compatibility
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
      // Specific headers for logo images
      {
        source: "/images/logo/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, must-revalidate", // Less aggressive caching
          },
          {
            key: "Content-Type",
            value: "image/png",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
      {
        source: "/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          // Add CORS for images
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Add webpack configuration for better asset handling
  webpack: (config, { isServer }) => {
    // Handle images better
    config.module.rules.push({
      test: /\.(png|jpg|jpeg|gif|svg|webp|avif|ico)$/i,
      type: "asset/resource",
    });

    return config;
  },

  // Experimental features for better compatibility
  experimental: {
    // Optimize CSS for better cross-browser support
    optimizeCss: true,
  },

  // Rest of your config remains the same...
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
      {
        source: "/contact-us",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/services/dental-implants",
        destination: "/servicii/implanturi-dentare",
        permanent: true,
      },
      {
        source: "/services/orthodontics",
        destination: "/servicii/ortodontie",
        permanent: true,
      },
      {
        source: "/about-us",
        destination: "/despre-noi",
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: "/api/analytics/:path*",
        destination: "https://analytics.tandemdent.md/:path*",
      },
      {
        source: "/api/booking/:path*",
        destination: "https://booking.tandemdent.md/api/:path*",
      },
    ];
  },

  env: {
    NEXT_PUBLIC_SITE_URL:
      process.env.NEXT_PUBLIC_SITE_URL || "https://tandemdent.md",
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID || "",
    NEXT_PUBLIC_GTM_ID: process.env.NEXT_PUBLIC_GTM_ID || "",
    NEXT_PUBLIC_FACEBOOK_PIXEL_ID:
      process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || "",
    NEXT_PUBLIC_CALENDLY_URL: process.env.NEXT_PUBLIC_CALENDLY_URL || "",
    NEXT_PUBLIC_WHATSAPP_NUMBER:
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+37361234555",
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY:
      process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "",
  },

  poweredByHeader: false,
  compress: true,
  generateEtags: true,
  pageExtensions: ["tsx", "ts", "jsx", "js"],
  trailingSlash: false,

  typescript: {
    ignoreBuildErrors: false,
  },

  eslint: {
    ignoreDuringBuilds: false,
    dirs: ["src", "app", "components", "lib", "utils"],
  },

  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },
};

export default nextConfig;
