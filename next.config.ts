import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['next-intl', 'use-intl'],
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
