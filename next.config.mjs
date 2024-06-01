/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [{
      source: '/api/:path*',
      destination: 'https://mock.apifox.cn/m1/2398938-0-default/api/:path*'
      // destination: 'http://localhost:3000/api/:path*'
    }]
  },
  transpilePackages: [
    'rc-util',
    '@ant-design',
    'kitchen-flow-editor',
    '@ant-design/pro-editor',
    'zustand', 'leva', 'antd',
    'rc-pagination',
    'rc-picker'
  ],
};

export default nextConfig;
