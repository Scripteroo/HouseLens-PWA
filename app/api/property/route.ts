import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address") || "";
  const state = searchParams.get("state") || "";
  const city = searchParams.get("city") || "";
  const county = searchParams.get("county") || "";

  const apiKey = process.env.REALIE_API_KEY;
  
  if (!apiKey) {
    console.error("REALIE_API_KEY is not set");
    return NextResponse.json({ error: "API key not configured", debug: "missing_key" }, { status: 500 });
  }

  try {
    const params = new URLSearchParams({ address, state });
    if (city) params.set("city", city);
    if (county) params.set("county", county);

    const url = `https://app.realie.ai/api/public/property/address/?${params.toString()}`;
    console.log("Realie request:", url);

    const res = await fetch(url, {
      headers: { Authorization: apiKey },
      cache: "no-store",
    });

    console.log("Realie status:", res.status);

    if (!res.ok) {
      const errText = await res.text();
      console.error("Realie error:", res.status, errText);
      return NextResponse.json({ error: "Property not found", debug: errText, status: res.status }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch property data", debug: String(err) }, { status: 500 });
  }
}