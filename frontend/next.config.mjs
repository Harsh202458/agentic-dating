/** @type {import('next').NextConfig} */
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV !== undefined;

const nextConfig = {
  output: isVercel ? undefined : 'export',
  basePath: (!isVercel && process.env.NODE_ENV === 'production') ? '/agentic-dating' : '',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
