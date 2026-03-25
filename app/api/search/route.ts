import { NextResponse } from "next/server";

const FINNHUB_KEY = process.env.FINNHUB_KEY;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json([]);
    }

    if (!FINNHUB_KEY) {
      return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
    }

    const res = await fetch(
      `https://finnhub.io/api/v1/search?q=${query}&token=${FINNHUB_KEY}`,
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Finnhub failed" }, { status: 500 });
    }

    const data = await res.json();

    return NextResponse.json(data?.result?.slice(0, 5) ?? []);
  } catch (error) {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
