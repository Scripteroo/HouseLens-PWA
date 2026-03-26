export interface FloodData {
  zone: string;
  zoneDescription: string;
  sfha: boolean;
}

export interface GrowingZoneData {
  zone: string;
  trange: string;
}

export interface ElevationData {
  meters: number;
  feet: number;
}

export interface SunData {
  sunrise: string;
  sunset: string;
  dayLength: string;
  solarNoon: string;
}

export interface EnrichmentData {
  flood: FloodData | null;
  growingZone: GrowingZoneData | null;
  elevation: ElevationData | null;
  sun: SunData | null;
}

function timeoutFetch(url: string, ms = 5000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timer));
}

function describeFloodZone(zone: string): string {
  const z = zone.toUpperCase();
  if (z === "X" || z === "AREA OF MINIMAL FLOOD HAZARD") return "Low Risk — Outside 100-year floodplain";
  if (z === "AE" || z === "A") return "High Risk — In 100-year floodplain (flood insurance required)";
  if (z === "VE" || z === "V") return "High Risk — Coastal flooding area";
  if (z === "AH") return "High Risk — Shallow flooding area";
  if (z === "AO") return "High Risk — Sheet flow flooding area";
  if (z === "D") return "Undetermined Risk — Possible but not mapped";
  return `Zone ${zone}`;
}

async function fetchFloodZone(lat: number, lng: number): Promise<FloodData | null> {
  try {
    const params = new URLSearchParams({
      geometry: `${lng},${lat}`,
      geometryType: "esriGeometryPoint",
      spatialRel: "esriSpatialRelWithin",
      outFields: "FLD_ZONE,ZONE_SUBTY,SFHA_TF",
      f: "json",
    });
    const res = await timeoutFetch(
      `https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer/28/query?${params}`
    );
    const data = await res.json();
    const attrs = data?.features?.[0]?.attributes;
    if (!attrs?.FLD_ZONE) return null;
    return {
      zone: attrs.FLD_ZONE,
      zoneDescription: describeFloodZone(attrs.FLD_ZONE),
      sfha: attrs.SFHA_TF === "T",
    };
  } catch {
    return null;
  }
}

async function fetchGrowingZone(zip: string): Promise<GrowingZoneData | null> {
  if (!zip || zip.length < 5) return null;
  try {
    const res = await timeoutFetch(`https://phzmapi.org/${zip}.json`);
    const data = await res.json();
    if (!data?.zone) return null;
    return { zone: data.zone, trange: data.trange || "" };
  } catch {
    return null;
  }
}

async function fetchElevation(lat: number, lng: number): Promise<ElevationData | null> {
  try {
    const res = await timeoutFetch(
      `https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lng}`
    );
    const data = await res.json();
    const meters = data?.results?.[0]?.elevation;
    if (meters == null) return null;
    return { meters, feet: Math.round(meters * 3.28084) };
  } catch {
    return null;
  }
}

async function fetchSunData(lat: number, lng: number): Promise<SunData | null> {
  try {
    const res = await timeoutFetch(
      `https://api.sunrisesunset.io/json?lat=${lat}&lng=${lng}&date=today`
    );
    const data = await res.json();
    const r = data?.results;
    if (!r?.sunrise) return null;
    return {
      sunrise: r.sunrise,
      sunset: r.sunset,
      dayLength: r.day_length,
      solarNoon: r.solar_noon,
    };
  } catch {
    return null;
  }
}

export async function enrichProperty(
  lat: number,
  lng: number,
  zip: string
): Promise<EnrichmentData> {
  const results = await Promise.allSettled([
    fetchFloodZone(lat, lng),
    fetchGrowingZone(zip),
    fetchElevation(lat, lng),
    fetchSunData(lat, lng),
  ]);

  return {
    flood: results[0].status === "fulfilled" ? results[0].value : null,
    growingZone: results[1].status === "fulfilled" ? results[1].value : null,
    elevation: results[2].status === "fulfilled" ? results[2].value : null,
    sun: results[3].status === "fulfilled" ? results[3].value : null,
  };
}
