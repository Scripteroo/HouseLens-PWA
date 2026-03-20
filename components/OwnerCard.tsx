"use client";

import { useState, useEffect } from "react";
import { Lock, Loader2, User, Home, DollarSign, FileText, Landmark, MapPin, Building2 } from "lucide-react";
import { lookupProperty, RealieProperty } from "@/lib/realie";

interface Props {
  address: string;
  cachedData?: RealieProperty | null;
  onDataLoaded?: (data: RealieProperty) => void;
  onLookupStarted?: () => void;
  triggerLookup?: boolean;
}

function formatMoney(val?: number | null) {
  if (!val) return "—";
  return "$" + val.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function formatDate(val?: string | null) {
  if (!val) return "—";
  const d = val.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
  try { return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
  catch { return val; }
}

function DataRow({ label, value }: { label: string; value?: string | number | boolean | null }) {
  if (value === undefined || value === null || value === "") return null;
  const display = typeof value === "boolean" ? (value ? "Yes" : "No") : String(value);
  return (
    <div className="flex justify-between items-baseline py-1.5 border-b border-lens-border/50 last:border-0">
      <span className="text-[12px] text-lens-secondary">{label}</span>
      <span className="text-[13px] font-medium text-lens-text text-right ml-4 max-w-[60%]">{display}</span>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-md bg-lens-accent/10 flex items-center justify-center">{icon}</div>
        <h4 className="text-[13px] font-bold text-lens-text uppercase tracking-wider">{title}</h4>
      </div>
      <div className="bg-lens-bg/60 rounded-xl px-4 py-2">{children}</div>
    </div>
  );
}

export default function OwnerCard({ address, cachedData, onDataLoaded, onLookupStarted, triggerLookup }: Props) {
  const [loading, setLoading] = useState(false);
  const [property, setProperty] = useState<RealieProperty | null>(cachedData || null);
  const [error, setError] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(!!cachedData);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    if (cachedData) {
      setProperty(cachedData);
      setUnlocked(true);
      setError(null);
    } else {
      setProperty(null);
      setUnlocked(false);
      setHasTriggered(false);
    }
  }, [cachedData]);

  // Only trigger lookup when explicitly told to (after photo capture)
  useEffect(() => {
    if (triggerLookup && !hasTriggered && !unlocked && address && !address.includes("Detecting")) {
      setHasTriggered(true);
      const doLookup = async () => {
        setLoading(true);
        setError(null);
        onLookupStarted?.();
        try {
          const result = await lookupProperty(address);
          if (result) {
            setProperty(result);
            setUnlocked(true);
            onDataLoaded?.(result);
          } else {
            setError("Property not found. Try editing the address.");
          }
        } catch {
          setError("Lookup failed. Please try again.");
        } finally {
          setLoading(false);
        }
      };
      doLookup();
    }
  }, [triggerLookup, address, hasTriggered, unlocked]);

  // UNLOCKED VIEW
  if (unlocked && property) {
    return (
      <div className="bg-lens-card rounded-2xl shadow-card overflow-hidden">
        <div className="px-5 py-4 bg-gradient-to-r from-lens-accent to-blue-600">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-white/70 mb-1">Owner Information</p>
          <p className="text-[17px] font-bold text-white">{property.ownerName || "Unknown Owner"}</p>
          {property.ownerAddressLine1 && (
            <p className="text-[13px] text-white/80 mt-0.5">
              {property.ownerAddressLine1}, {property.ownerCity} {property.ownerState} {property.ownerZipCode}
            </p>
          )}
        </div>

        <div className="px-5 py-4">
          <Section title="Property" icon={<Home className="w-3.5 h-3.5 text-lens-accent" />}>
            <DataRow label="Address" value={property.addressFull} />
            <DataRow label="Parcel ID" value={property.parcelId} />
            <DataRow label="Year Built" value={property.yearBuilt} />
            <DataRow label="Bedrooms" value={property.totalBedrooms} />
            <DataRow label="Bathrooms" value={property.totalBathrooms} />
            <DataRow label="Sq Ft" value={property.buildingArea?.toLocaleString()} />
            <DataRow label="Stories" value={property.stories} />
            <DataRow label="Pool" value={property.pool} />
            <DataRow label="Garage" value={property.garage} />
            <DataRow label="Garage Spaces" value={property.garageCount} />
            <DataRow label="Fireplaces" value={property.fireplaceCount} />
            <DataRow label="Acres" value={property.acres?.toFixed(2)} />
            <DataRow label="Subdivision" value={property.subdivision} />
            <DataRow label="Zoning" value={property.zoningCode} />
            <DataRow label="Neighborhood" value={property.neighborhood} />
          </Section>

          <Section title="Valuation" icon={<DollarSign className="w-3.5 h-3.5 text-lens-accent" />}>
            <DataRow label="Estimated Value" value={formatMoney(property.modelValue)} />
            <DataRow label="Value Range" value={property.modelValueMin && property.modelValueMax ? `${formatMoney(property.modelValueMin)} – ${formatMoney(property.modelValueMax)}` : undefined} />
            <DataRow label="Market Value" value={formatMoney(property.totalMarketValue)} />
            <DataRow label="Assessed Value" value={formatMoney(property.totalAssessedValue)} />
            <DataRow label="Building Value" value={formatMoney(property.totalBuildingValue)} />
            <DataRow label="Land Value" value={formatMoney(property.totalLandValue)} />
            <DataRow label="Assessed Year" value={property.assessedYear} />
          </Section>

          <Section title="Taxes" icon={<FileText className="w-3.5 h-3.5 text-lens-accent" />}>
            <DataRow label="Annual Tax" value={formatMoney(property.taxValue)} />
            <DataRow label="Tax Year" value={property.taxYear} />
            {property.assessments && property.assessments.length > 0 && (
              <div className="mt-2">
                <p className="text-[11px] font-semibold text-lens-secondary mb-1">History</p>
                {property.assessments.slice(0, 5).map((a, i) => (
                  <div key={i} className="flex justify-between py-1 border-b border-lens-border/30 last:border-0">
                    <span className="text-[11px] text-lens-secondary">{a.assessedYear || a.taxYear}</span>
                    <span className="text-[12px] font-medium text-lens-text">{formatMoney(a.taxValue)} tax · {formatMoney(a.totalAssessedValue)} assessed</span>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {property.transfers && property.transfers.length > 0 && (
            <Section title="Sales History" icon={<Building2 className="w-3.5 h-3.5 text-lens-accent" />}>
              {property.transfers.map((t, i) => (
                <div key={i} className="py-2 border-b border-lens-border/30 last:border-0">
                  <div className="flex justify-between">
                    <span className="text-[12px] text-lens-secondary">{formatDate(t.transferDate)}</span>
                    <span className="text-[13px] font-semibold text-lens-text">{formatMoney(t.transferPrice)}</span>
                  </div>
                  {t.grantee && <p className="text-[11px] text-lens-secondary mt-0.5">To: {t.grantee}</p>}
                  {t.grantor && <p className="text-[11px] text-lens-secondary">From: {t.grantor}</p>}
                </div>
              ))}
            </Section>
          )}

          <Section title="Liens & Mortgages" icon={<Landmark className="w-3.5 h-3.5 text-lens-accent" />}>
            <DataRow label="Total Liens" value={property.totalLienCount} />
            <DataRow label="Lien Balance" value={formatMoney(property.totalLienBalance)} />
            <DataRow label="Lender" value={property.lenderName} />
            <DataRow label="Estimated Equity" value={formatMoney(property.equityCurrentEstBal)} />
            <DataRow label="LTV Ratio" value={property.LTVCurrentEstCombined ? `${property.LTVCurrentEstCombined.toFixed(1)}%` : undefined} />
          </Section>

          <Section title="Owner Details" icon={<User className="w-3.5 h-3.5 text-lens-accent" />}>
            <DataRow label="Owner Name" value={property.ownerName} />
            <DataRow label="Mailing Address" value={property.ownerAddressLine1} />
            <DataRow label="City" value={property.ownerCity} />
            <DataRow label="State" value={property.ownerState} />
            <DataRow label="Zip" value={property.ownerZipCode} />
            <DataRow label="Properties Owned" value={property.ownerParcelCount} />
          </Section>

          <div className="mb-5 p-4 rounded-xl border-2 border-dashed border-lens-accent/20 bg-lens-accent/[0.02]">
            <div className="flex items-center gap-2 mb-1">
              <Lock className="w-4 h-4 text-lens-accent" />
              <p className="text-[13px] font-semibold text-lens-accent">Phone & Email</p>
            </div>
            <p className="text-[12px] text-lens-secondary">Owner contact information available with Pro plan.</p>
          </div>

          {property.legalDesc && (
            <Section title="Legal" icon={<MapPin className="w-3.5 h-3.5 text-lens-accent" />}>
              <p className="text-[11px] text-lens-secondary leading-relaxed">{property.legalDesc}</p>
            </Section>
          )}
        </div>
      </div>
    );
  }

  // LOADING VIEW
  if (loading) {
    return (
      <div className="bg-lens-card rounded-2xl shadow-card px-5 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-lens-secondary mb-1.5">Owner</p>
        <div className="flex items-center gap-2 py-3">
          <Loader2 className="w-4 h-4 animate-spin text-lens-accent" />
          <span className="text-[13px] text-lens-accent font-medium">Looking up property data…</span>
        </div>
      </div>
    );
  }

  // ERROR VIEW
  if (error) {
    return (
      <div className="bg-lens-card rounded-2xl shadow-card px-5 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-lens-secondary mb-1.5">Owner</p>
        <p className="text-[13px] text-red-500 font-medium">{error}</p>
      </div>
    );
  }

  // WAITING VIEW — no photo taken yet
  return (
    <div className="bg-lens-card rounded-2xl shadow-card px-5 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-lens-secondary mb-1.5">Owner</p>
      <p className="text-[13px] text-lens-secondary">Take a photo to look up property information.</p>
    </div>
  );
}