/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // 파일 업로드 중복 호출 문제 해결을 위해 임시 비활성화
  swcMinify: true,
  images: {
    loader: 'custom',
    loaderFile: './src/lib/imageLoader.js',
  },
};

export default nextConfig;
