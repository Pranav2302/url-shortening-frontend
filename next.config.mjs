/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/url/:path*",
        destination: "http://localhost:8000/url/:path*", // Adjust the port to match your Express server
      },
      {
        source: "/:shortid",
        destination: "http://localhost:8000/:shortid", // Adjust the port to match your Express server
      },
    ];
  },
};

export default nextConfig;
