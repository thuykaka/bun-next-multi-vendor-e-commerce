import type { NextConfig } from 'next';
import { withPayload } from '@payloadcms/next/withPayload';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  logging: {
    fetches: {
      fullUrl: true
    }
  }
};

export default withPayload(withPayload(nextConfig));
