import { NextRequest, NextResponse } from "next/server";

const US_STATES = new Set([
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC","PR","VI","GU","AS","MP",
]);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { address, city, state, zip, firstName, lastName } = body;

  const apiKey = process.env.TRACERFY_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "Skip trace not configured" }, { status: 500 });
  }

  if (!address || !city || !state) {
    return NextResponse.json({ error: "address, city, state required" }, { status: 400 });
  }

  if (!US_STATES.has(state.toUpperCase())) {
    return NextResponse.json({ error: "Skip trace is available for US addresses only" }, { status: 400 });
  }

  try {
    const payload: Record<string, unknown> = {
      address,
      city,
      state,
      find_owner: true,
    };

    if (zip) payload.zip = zip;

    // If we have owner name, do a person lookup instead
    if (firstName && lastName) {
      payload.find_owner = false;
      payload.first_name = firstName;
      payload.last_name = lastName;
    }

    console.log("[Tracerfy] Lookup:", JSON.stringify(payload));

    const res = await fetch("https://tracerfy.com/v1/api/trace/lookup/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[Tracerfy] Error:", res.status, errText);
      return NextResponse.json({ error: "Skip trace failed", detail: errText }, { status: res.status });
    }

    const data = await res.json();
    console.log("[Tracerfy] Result: hit=", data.hit, "persons=", data.persons_count, "credits=", data.credits_deducted);
    return NextResponse.json(data);
  } catch (err) {
    console.error("[Tracerfy] Error:", err);
    return NextResponse.json({ error: "Skip trace request failed" }, { status: 500 });
  }
}