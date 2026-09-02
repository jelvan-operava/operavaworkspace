import { defineCloudflareConfig } from '@opennextjs/cloudflare';

const config = defineCloudflareConfig();

// OpenNext build configuration for deploying this Next.js app to Cloudflare Workers.
// Force the app build through npm so the build works in standard Node environments,
// even when a bun lockfile is present in the repo.
export default {
  ...config,
  buildCommand: 'npm run build',
  default: {
    ...config.default,
    buildCommand: 'npm run build',
  },
};
