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

export interface CensusData {
  population: number | null;
  medianIncome: number | null;
  medianHomeValue: number | null;
  medianAge: number | null;
  medianRent: number | null;
  unemploymentRate: number | null;
  collegeRate: number | null;
  ownerOccupiedRate: number | null;
}

export interface EnrichmentData {
  flood: FloodData | null;
  growingZone: GrowingZoneData | null;
  elevation: ElevationData | null;
  sun: SunData | null;
  census: CensusData | null;
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

async function fetchCensusData(lat: number, lng: number): Promise<CensusData | null> {
  try {
    // Step 1: Get FIPS codes from coordinates
    const geoRes = await timeoutFetch(
      `https://geocoding.geo.census.gov/geocoder/geographies/coordinates?x=${lng}&y=${lat}&benchmark=Public_AR_Current&vintage=Current_Current&format=json`
    );
    const geoData = await geoRes.json();
    const tract = geoData?.result?.geographies?.["Census Tracts"]?.[0];
    if (!tract?.STATE || !tract?.COUNTY || !tract?.TRACT) return null;

    const stFips = tract.STATE;
    const coFips = tract.COUNTY;
    const trFips = tract.TRACT;

    // Step 2: Fetch ACS demographics
    const variables = [
      "B01003_001E", "B19013_001E", "B25077_001E", "B01002_001E", "B25064_001E",
      "B23025_003E", "B23025_005E", "B15003_022E", "B15003_001E",
      "B25003_001E", "B25003_002E", "B25003_003E",
    ].join(",");
    const acsRes = await timeoutFetch(
      `https://api.census.gov/data/2022/acs/acs5?get=${variables}&for=tract:${trFips}&in=state:${stFips}%20county:${coFips}`
    );
    const acsData = await acsRes.json();
    if (!acsData || acsData.length < 2) return null;

    const headers: string[] = acsData[0];
    const values: string[] = acsData[1];
    const get = (name: string): number | null => {
      const idx = headers.indexOf(name);
      if (idx === -1) return null;
      const v = Number(values[idx]);
      if (isNaN(v) || v === -666666666) return null;
      return v;
    };

    const employed = get("B23025_003E");
    const unemployed = get("B23025_005E");
    const bachelors = get("B15003_022E");
    const totalEdu = get("B15003_001E");
    const totalOccupied = get("B25003_001E");
    const ownerOccupied = get("B25003_002E");

    return {
      population: get("B01003_001E"),
      medianIncome: get("B19013_001E"),
      medianHomeValue: get("B25077_001E"),
      medianAge: get("B01002_001E"),
      medianRent: get("B25064_001E"),
      unemploymentRate: employed != null && unemployed != null && (employed + unemployed) > 0
        ? Math.round((unemployed / (employed + unemployed)) * 1000) / 10
        : null,
      collegeRate: bachelors != null && totalEdu != null && totalEdu > 0
        ? Math.round((bachelors / totalEdu) * 1000) / 10
        : null,
      ownerOccupiedRate: ownerOccupied != null && totalOccupied != null && totalOccupied > 0
        ? Math.round((ownerOccupied / totalOccupied) * 1000) / 10
        : null,
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
    fetchCensusData(lat, lng),
  ]);

  return {
    flood: results[0].status === "fulfilled" ? results[0].value : null,
    growingZone: results[1].status === "fulfilled" ? results[1].value : null,
    elevation: results[2].status === "fulfilled" ? results[2].value : null,
    sun: results[3].status === "fulfilled" ? results[3].value : null,
    census: results[4].status === "fulfilled" ? results[4].value : null,
  };
}
