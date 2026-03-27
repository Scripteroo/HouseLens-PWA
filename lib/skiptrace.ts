export interface SkipTraceResult {
  phones: Array<{ number: string; type?: string; dnc?: boolean; carrier?: string; rank?: number }>;
  emails: Array<{ email: string; rank?: number }>;
  ownerName?: string;
  age?: string;
  dob?: string;
  deceased?: boolean;
  litigator?: boolean;
  mailingAddress?: { street: string; city: string; state: string; zip: string };
  raw?: unknown;
}

export async function skipTrace(
  ownerName: string,
  address: string,
  city: string,
  state: string,
  zip?: string
): Promise<SkipTraceResult | null> {
  const primaryOwner = ownerName.split(";")[0].trim();
  let firstName = "";
  let lastName = "";

  if (primaryOwner.includes(",")) {
    const parts = primaryOwner.split(",").map((s) => s.trim());
    lastName = parts[0] || "";
    firstName = (parts[1] || "").split(" ")[0] || "";
  } else {
    const parts = primaryOwner.split(" ").filter(Boolean);
    firstName = parts[0] || "";
    lastName = parts[parts.length - 1] || "";
  }

  const streetOnly = address.split(",")[0]?.trim() || address;

  try {
    const payload: Record<string, string> = { address: streetOnly, city, state };
    if (zip) payload.zip = zip;

    const { BASE_URL } = await import("./api-config");
    const res = await fetch(`${BASE_URL}/api/skiptrace`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) return null;
    const data = await res.json();

    if (!data.hit || !data.persons || data.persons.length === 0) return null;

    const person = data.persons[0];

    const phones: SkipTraceResult["phones"] = (person.phones || []).map((p: any) => ({
      number: String(p.number || ""),
      type: p.type || "",
      dnc: p.dnc || false,
      carrier: p.carrier || "",
      rank: p.rank || 0,
    })).filter((p: any) => p.number.replace(/\D/g, "").length >= 7);

    const emails: SkipTraceResult["emails"] = (person.emails || []).map((e: any) => ({
      email: String(e.email || ""),
      rank: e.rank || 0,
    })).filter((e: any) => e.email.includes("@"));

    if (phones.length === 0 && emails.length === 0) return null;

    return {
      phones,
      emails,
      ownerName: person.full_name || `${person.first_name || ""} ${person.last_name || ""}`.trim(),
      age: person.age,
      dob: person.dob,
      deceased: person.deceased,
      litigator: person.litigator,
      mailingAddress: person.mailing_address || undefined,
      raw: data,
    };
  } catch (err) {
    console.error("Skip trace error:", err);
    return null;
  }
}
