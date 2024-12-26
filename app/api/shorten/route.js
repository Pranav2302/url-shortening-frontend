import { NextResponse } from "next/server";

export async function POST(req) {
  const { url } = await req.json();
  
  const shortUrl = `https://url-shortening-backend-delta.vercel.app/${Math.random()
    .toString(36)
    .substr(2, 6)}`;

  return NextResponse.json({ shortUrl });
}
