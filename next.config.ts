import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PWA sera géré via le service worker manuel
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
