import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const adminKey = process.env.ADMIN_KEY;
  const provided = req.headers.get("x-admin-key");

  if (!adminKey || provided !== adminKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

    // All events
    const { data: allEvents } = await supabase
      .from("analytics")
      .select("event, address, cost, ip, created_at");

    if (!allEvents) {
      return NextResponse.json({ error: "No data" }, { status: 500 });
    }

    const todayEvents = allEvents.filter((e) => e.created_at >= todayStart);
    const weekEvents = allEvents.filter((e) => e.created_at >= weekStart);

    const countByEvent = (events: typeof allEvents, evt: string) =>
      events.filter((e) => e.event === evt).length;

    const uniqueIPs = (events: typeof allEvents) =>
      new Set(events.map((e) => e.ip).filter(Boolean)).size;

    const sumCost = (events: typeof allEvents) =>
      events.reduce((sum, e) => sum + (Number(e.cost) || 0), 0);

    const sumCostByEvent = (events: typeof allEvents, evt: string) =>
      events.filter((e) => e.event === evt).reduce((sum, e) => sum + (Number(e.cost) || 0), 0);

    // Top 10 addresses
    const addressCounts: Record<string, number> = {};
    allEvents.forEach((e) => {
      if (e.address) {
        addressCounts[e.address] = (addressCounts[e.address] || 0) + 1;
      }
    });
    const topAddresses = Object.entries(addressCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([address, count]) => ({ address, count }));

    return NextResponse.json({
      pageViews: {
        today: countByEvent(todayEvents, "page_view"),
        week: countByEvent(weekEvents, "page_view"),
        allTime: countByEvent(allEvents, "page_view"),
      },
      uniqueUsers: {
        today: uniqueIPs(todayEvents),
        week: uniqueIPs(weekEvents),
        allTime: uniqueIPs(allEvents),
      },
      propertyLookups: {
        total: countByEvent(allEvents, "property_lookup"),
        today: countByEvent(todayEvents, "property_lookup"),
        cost: sumCostByEvent(allEvents, "property_lookup"),
      },
      skipTraces: {
        total: countByEvent(allEvents, "skip_trace"),
        today: countByEvent(todayEvents, "skip_trace"),
        cost: sumCostByEvent(allEvents, "skip_trace"),
      },
      spend: {
        today: sumCost(todayEvents),
        week: sumCost(weekEvents),
        allTime: sumCost(allEvents),
      },
      topAddresses,
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
