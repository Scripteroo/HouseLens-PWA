/*
  Supabase table setup — run this SQL in your Supabase dashboard:

  CREATE TABLE analytics (
    id bigserial primary key,
    event text not null,
    address text,
    cost decimal(10,4) default 0,
    ip text,
    user_agent text,
    metadata jsonb,
    created_at timestamptz default now()
  );

  CREATE INDEX idx_analytics_event ON analytics(event);
  CREATE INDEX idx_analytics_created ON analytics(created_at);

  Environment variables:
  - NEXT_PUBLIC_SUPABASE_URL (already configured)
  - NEXT_PUBLIC_SUPABASE_ANON_KEY (already configured)
  - ADMIN_KEY (secret key for /api/analytics access)
*/

import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ ok: true });
  }

  try {
    const body = await req.json();
    const { event, address, cost, ...rest } = body;

    if (!event) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    await supabase.from("analytics").insert({
      event,
      address: address || null,
      cost: cost || 0,
      ip,
      user_agent: userAgent,
      metadata: Object.keys(rest).length > 0 ? rest : null,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
