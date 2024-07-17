// Configuration options for Next.js
const path = require('path');
const { withSentryConfig } = require('@sentry/nextjs');


const nextConfig = {
  reactStrictMode: true, // Enable React strict mode for improved error handling
  swcMinify: true,      // Enable SWC minification for improved performance
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV !== "development", // Remove console.log in production
  },
};

// Configuração do Sentry
const sentryOptions = {
  silent: true,
  org: 'tecnofam',
  project: 'pwa',
  url: 'https://bug.embrapa.io/',
};

const sentryConfig = {
  widenClientFileUpload: true,
  transpileClientSDK: true,
  tunnelRoute: '/monitoring',
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
};

const nextConfigWithSentry = withSentryConfig(nextConfig, sentryOptions, sentryConfig);


// Configuration object tells the next-pwa plugin 
const withPWA = require("next-pwa")({
  dest: "public", // Destination directory for the PWA files
  disable: process.env.NODE_ENV === "development", // Disable PWA in development mode
  register: true, // Register the PWA service worker
  skipWaiting: true, // Skip waiting for service worker activation
});

const nextConfigWithPWA = withPWA(nextConfigWithSentry);

// Export the combined configuration for Next.js with PWA support
module.exports = nextConfigWithPWA;
