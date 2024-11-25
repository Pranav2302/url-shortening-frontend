/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/url/:path*",
        destination: "https://url-shortening-frontend-five.vercel.app/url/:path*", // Adjust the port to match your Express server
      },
      {
        source: "/:shortid",
        destination: "https://url-shortening-frontend-five.vercel.app/:shortid", // Adjust the port to match your Express server
      },
    ];
  },
};

export default nextConfig;
