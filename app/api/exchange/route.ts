import { NextResponse } from "next/server";
export const runtime = "nodejs";

export async function GET() {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD");

    if (!res.ok) {
      throw new Error(`Status: ${res.status}`);
    }

    const data = await res.json();

    if (!data?.rates?.THB) {
      throw new Error("Invalid response format");
    }

    return NextResponse.json({
      rate: data?.rates?.THB,
    });
  } catch (error) {
    console.error("Exchange route error", error);

    return NextResponse.json({ error: "Exchange API failed" }, { status: 500 });
  }
}
