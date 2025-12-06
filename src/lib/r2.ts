import { S3Client } from '@aws-sdk/client-s3'

export const r2 = new S3Client({
    region: 'auto',
    endpoint: 'https://da706efc88c11c0f5ec999dde8d3fc37.r2.cloudflarestorage.com',
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
})

export const R2_BUCKET = 'mypage'
export const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || 'https://pub-da706efc88c11c0f5ec999dde8d3fc37.r2.dev'
