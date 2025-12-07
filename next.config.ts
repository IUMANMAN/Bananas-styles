import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: '*.public.blob.vercel-storage.com',
            },
            {
                protocol: 'https',
                hostname: 'imgv3.fotor.com',
            },
            {
                protocol: 'https',
                hostname: '*.r2.cloudflarestorage.com',
            },
            {
                protocol: 'https',
                hostname: '*.r2.dev',
            },
            {
                protocol: 'https',
                hostname: 'pumpbanana.com',
            },
            {
                protocol: 'https',
                hostname: '*.r2.cloudflarestorage.com',
            },
        ],
    },
};

export default nextConfig;
