"use client";

import { useState, useEffect, useCallback } from "react";

interface GeoState {
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  loading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeoState>({
    latitude: null, longitude: null, address: null, loading: true, error: null,
  });

  const reverseGeocode = useCallback(async (lat: number, lng: number): Promise<string> => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
        { headers: { "Accept-Language": "en" } }
      );
      const data = await res.json();
      if (data.address) {
        const a = data.address;
        const street = a.house_number ? `${a.house_number} ${a.road || ""}` : a.road || "";
        const city = a.city || a.town || a.village || a.hamlet || "";
        const stateCode = a.state || "";
        const zip = a.postcode || "";
        const parts = [street.trim(), city, `${stateCode} ${zip}`.trim()].filter(Boolean);
        if (parts.length > 0) return parts.join(", ");
      }
      if (data.display_name) return data.display_name.split(", ").slice(0, 4).join(", ");
    } catch (e) {
      console.warn("Nominatim failed:", e);
    }
    try {
      const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
      const data = await res.json();
      const parts = [data.locality || "", data.city || "", data.principalSubdivision || "", data.postcode || ""].filter(Boolean);
      if (parts.length > 0) return parts.join(", ");
    } catch (e) {
      console.warn("BigDataCloud failed:", e);
    }
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }, []);

  const requestLocation = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    if (typeof window === "undefined" || !navigator.geolocation) {
      setState((s) => ({ ...s, loading: false, error: "Geolocation not supported" }));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const address = await reverseGeocode(latitude, longitude);
        setState({ latitude, longitude, address, loading: false, error: null });
      },
      (err) => {
        setState((s) => ({ ...s, loading: false, error: err.message || "Location access denied" }));
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  }, [reverseGeocode]);

  useEffect(() => { requestLocation(); }, [requestLocation]);

  return { ...state, requestLocation };
}
