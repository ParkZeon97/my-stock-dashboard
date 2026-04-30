import { NextResponse } from "next/server";

const FINNHUB_KEY = process.env.FINNHUB_KEY!;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = (searchParams.get("symbol") || "TSLA").toUpperCase();

  try {
    // 1. ดึงข้อมูล Quote พื้นฐาน
    const quoteRes = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_KEY}`,
      { cache: "no-store" },
    );
    const data = await quoteRes.json();

    if (!data || !data.c) {
      return NextResponse.json({ error: "Data not found" }, { status: 404 });
    }

    // 2. ดึงชื่อบริษัทเต็ม (เพื่อให้ Dashboard ดูหรูขึ้นตามความต้องการแรก)
    const profileRes = await fetch(
      `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_KEY}`,
    );
    const profile = await profileRes.json();

    // --- LOGIC ราคา AFTER MARKET ---
    // หมายเหตุ: Finnhub แผนฟรีจะไม่ได้ราคา After Market แบบ Real-time รายวินาที
    // แต่เราสามารถคำนวณ 'Indicative After Hours' จาก Last Price ได้
    const currentPrice = data.c;
    const afterHoursPrice = data.c; // ในแผนฟรี ตัวแปร 'c' จะอัปเดตตาม Last Sale เสมอแม้ปิดตลาดแล้ว

    // --- AI ANALYSIS (Pivot Points) ---
    const H = data.h || data.c;
    const L = data.l || data.c;
    const C = data.pc || data.c;
    const PP = (H + L + C) / 3;

    const industry = profile.finnhubIndustry || "";

    return NextResponse.json({
      symbol: symbol,
      name: profile.name || symbol, // ได้ชื่อเต็มบริษัทแล้ว เช่น "Tesla Inc"
      currentPrice: currentPrice,
      afterHoursPrice: afterHoursPrice,
      changePercent: data.dp || 0,
      isPositive: (data.dp || 0) >= 0,
      aiAnalysis: {
        support: [
          Number((2 * PP - H).toFixed(2)),
          Number((PP - (H - L)).toFixed(2)),
        ],
        resistance: [
          Number((2 * PP - L).toFixed(2)),
          Number((PP + (H - L)).toFixed(2)),
        ],
        sentiment: currentPrice > PP ? "Bullish" : "Bearish",
        score: Math.round(Math.random() * (90 - 60) + 60), // Mock AI Score ให้ดูขยับไปมา
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "API Error" }, { status: 500 });
  }
}
