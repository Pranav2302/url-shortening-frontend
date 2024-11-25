import { NextResponse } from "next/server";

export async function POST(req) {
  const { url } = await req.json();
  // Implement your URL shortening logic here
  const shortUrl = `https://your-domain.com/${Math.random()
    .toString(36)
    .substr(2, 6)}`;

  return NextResponse.json({ shortUrl });
}
