"use client";

import { useState } from "react";
import { Lock, Share2, Smartphone, CreditCard, X, Eye } from "lucide-react";

const MOCK_OWNER_NAMES = "Joseph Smith  ·  Jane Doe";
const MOCK_PHONE = "(305) 555-0147";

export default function OwnerCard() {
  const [showPaywall, setShowPaywall] = useState(false);

  const handleTap = () => {
    if (navigator.vibrate) navigator.vibrate(10);
    setShowPaywall(true);
  };

  return (
    <>
      <div onClick={handleTap} className="bg-lens-card rounded-2xl shadow-card px-5 py-4 cursor-pointer active:scale-[0.98] active:shadow-sm hover:shadow-elevated transition-all duration-200">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-lens-secondary mb-1.5">Owner</p>
            <div className="relative">
              <div className="blur-[6px] select-none pointer-events-none">
                <p className="text-[15px] leading-snug text-lens-text font-medium">{MOCK_OWNER_NAMES}</p>
                <p className="text-[13px] text-lens-secondary mt-0.5">{MOCK_PHONE}</p>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                  <Eye className="w-3.5 h-3.5 text-lens-accent" />
                  <span className="text-[12px] font-semibold text-lens-accent">Tap for owner info</span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-lens-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Lock className="w-4 h-4 text-lens-accent" />
          </div>
        </div>
      </div>

      {showPaywall && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowPaywall(false)}>
          <div className="w-full max-w-lg bg-white rounded-t-3xl overflow-hidden animate-slide-up" onClick={(e) => e.stopPropagation()} style={{ paddingBottom: "env(safe-area-inset-bottom, 24px)" }}>
            <div className="relative px-6 pt-5 pb-4">
              <button onClick={() => setShowPaywall(false)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-lens-bg flex items-center justify-center" type="button">
                <X className="w-4 h-4 text-lens-secondary" />
              </button>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lens-accent to-blue-600 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-[17px] font-bold text-lens-text">Unlock Owner Info</h3>
                  <p className="text-[12px] text-lens-secondary">Name, phone &amp; mailing address</p>
                </div>
              </div>
            </div>

            <div className="mx-6 mb-5 p-4 rounded-2xl bg-lens-bg/80 border border-lens-border">
              <div className="blur-[5px] select-none pointer-events-none">
                <p className="text-[15px] font-semibold text-lens-text">{MOCK_OWNER_NAMES}</p>
                <p className="text-[13px] text-lens-secondary mt-1">{MOCK_PHONE}</p>
                <p className="text-[13px] text-lens-secondary">1127 Packer St, Key West, FL 33040</p>
              </div>
            </div>

            <div className="px-6 space-y-3 pb-6">
              <button onClick={() => { if (navigator.share) { navigator.share({ title: "HouseLens", text: "Check out HouseLens — instant property intelligence from your phone!", url: window.location.href }).catch(() => {}); } }} className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-lens-accent/20 bg-lens-accent/[0.03] active:scale-[0.98] transition-all" type="button">
                <div className="w-11 h-11 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0"><Share2 className="w-5 h-5 text-green-600" /></div>
                <div className="flex-1 text-left">
                  <p className="text-[14px] font-semibold text-lens-text">Share with a friend</p>
                  <p className="text-[12px] text-lens-secondary mt-0.5">Get <span className="font-bold text-green-600">1 free lookup</span></p>
                </div>
                <span className="text-[12px] font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">FREE</span>
              </button>

              <button onClick={() => { if (navigator.vibrate) navigator.vibrate(10); }} className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-lens-border bg-white active:scale-[0.98] transition-all" type="button">
                <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0"><Smartphone className="w-5 h-5 text-blue-600" /></div>
                <div className="flex-1 text-left">
                  <p className="text-[14px] font-semibold text-lens-text">Download the app</p>
                  <p className="text-[12px] text-lens-secondary mt-0.5">Get <span className="font-bold text-blue-600">3 free lookups</span></p>
                </div>
                <span className="text-[12px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">FREE</span>
              </button>

              <button onClick={() => { if (navigator.vibrate) navigator.vibrate(10); }} className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-amber-300/50 bg-gradient-to-r from-amber-50/80 to-orange-50/80 active:scale-[0.98] transition-all" type="button">
                <div className="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0"><CreditCard className="w-5 h-5 text-amber-600" /></div>
                <div className="flex-1 text-left">
                  <p className="text-[14px] font-semibold text-lens-text">Pro Monthly</p>
                  <p className="text-[12px] text-lens-secondary mt-0.5"><span className="font-bold text-amber-600">50 lookups</span> per month</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-[16px] font-bold text-lens-text">$9.95</span>
                  <p className="text-[10px] text-lens-secondary">/month</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
