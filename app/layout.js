import "@/app/globals.css";

export const metadata = {
  title: "URL Shortener",
  description: "Shorten your URLs with style!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
