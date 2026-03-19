import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address") || "";
  const state = searchParams.get("state") || "";

  const apiKey = process.env.REALIE_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  try {
    // Only send address and state — Realie requires county if city is included
    const params = new URLSearchParams({ address, state });

    const url = `https://app.realie.ai/api/public/property/address/?${params.toString()}`;
    console.log("Realie request:", url);

    const res = await fetch(url, {
      headers: { Authorization: apiKey },
      cache: "no-store",
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Realie error:", res.status, errText);
      return NextResponse.json({ error: "Property not found" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch property data" }, { status: 500 });
  }
}